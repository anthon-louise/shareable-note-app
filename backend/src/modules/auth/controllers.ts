import { Request, Response, NextFunction } from "express";
import { loginUserSchema, registerUserSchema } from "./schema";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import { QueryResult } from "pg";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface User {
    id: number,
    username: string,
    email: string,
    created_at: Date
}

interface UserWithPassword extends User {
    password_hash: string
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedUser = registerUserSchema.parse(req.body);

        const existingUser: QueryResult<{id: number}> = await pool.query(`
            SELECT id
            FROM users
            WHERE email=$1
            `, [validatedUser.email]);

        if (existingUser.rows.length > 0) {
            const error: any = new Error("Email already registered");
            error.status = 409;
            return next(error);
        }

        const hashedPassword = await bcrypt.hash(validatedUser.password, 10);

        const result: QueryResult<User> = await pool.query(`
            INSERT INTO 
            users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at
            `, [validatedUser.username, validatedUser.email, hashedPassword]);

        res.status(201).json({
            success: true,
            user: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedCredentials = loginUserSchema.parse(req.body);

        const result: QueryResult<UserWithPassword> = await pool.query(`
            SELECT id, username, email, password_hash, created_at
            FROM users
            WHERE email = $1
            `, [validatedCredentials.email]);

        if (result.rows.length === 0) {
            const error: any = new Error("Invalid credentials");
            error.status = 401;
            return next(error);
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(validatedCredentials.password, user.password_hash);

        if (!isPasswordValid) {
            const error: any = new Error("Invalid credentials");
            error.status = 401;
            return next(error);
        }

        const token = jwt.sign(
            {id: user.id, email: user.email, username: user.username},
            process.env.SECRET as string,
            {expiresIn: "7d"}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const {password_hash, ...userWithoutPassword} = user;

        res.json({
            success: true,
            user: userWithoutPassword
        })
    } catch (err) {
        next(err)
    }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const result: QueryResult<User> = await pool.query(`
            SELECT id, username, email, created_at
            FROM users
            WHERE id=$1
            `, [userId]);

        if (result.rows.length === 0) {
            const error: any = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        res.json({
            success: true,
            user: result.rows[0]
        })
    } catch (err) {
        next(err);
    }
};