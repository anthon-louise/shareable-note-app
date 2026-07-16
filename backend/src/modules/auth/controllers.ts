import { Request, Response, NextFunction } from "express";
import { loginUserSchema, registerUserSchema } from "./schema";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import { QueryResult } from "pg";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// defines the shape of the user
interface User {
    id: number,
    username: string,
    email: string,
    created_at: Date
}

// user without password
interface UserWithPassword extends User {
    password_hash: string
}

// Function for registering or creating a user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the email, username and password from req.body and validate with zod
        const validatedUser = registerUserSchema.parse(req.body);

        // check if the email already exists
        const existingUser: QueryResult<{id: number}> = await pool.query(`
            SELECT id
            FROM users
            WHERE email=$1
            `, [validatedUser.email]);

        // if email already exists throw error
        if (existingUser.rows.length > 0) {
            const error: any = new Error("Email already registered");
            error.status = 409;
            return next(error);
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(validatedUser.password, 10);

        // create the user with the hashed password
        const result: QueryResult<User> = await pool.query(`
            INSERT INTO 
            users (username, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at
            `, [validatedUser.username, validatedUser.email, hashedPassword]);

        // response object after creating a user
        res.status(201).json({
            success: true,
            user: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
};

// Function to log in the user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the email and password from req.body
        const validatedCredentials = loginUserSchema.parse(req.body);

        // check is email exists
        const result: QueryResult<UserWithPassword> = await pool.query(`
            SELECT id, username, email, password_hash, created_at
            FROM users
            WHERE email = $1
            `, [validatedCredentials.email]);

        // if email doesn't exist then show invalid credentials error
        if (result.rows.length === 0) {
            const error: any = new Error("Invalid credentials");
            error.status = 401;
            return next(error);
        }

        // getting the user object from the query
        const user = result.rows[0];

        // check if password matched
        const isPasswordValid = await bcrypt.compare(validatedCredentials.password, user.password_hash);

        // if password didn't match show invalid credentials error
        if (!isPasswordValid) {
            const error: any = new Error("Invalid credentials");
            error.status = 401;
            return next(error);
        }

        // generate token with the user identity
        const token = jwt.sign(
            {id: user.id, email: user.email, username: user.username},
            process.env.SECRET as string,
            {expiresIn: "7d"}
        )

        // store token in cookies
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        
        // response object for login
        const {password_hash, ...userWithoutPassword} = user;
        res.json({
            success: true,
            user: userWithoutPassword
        })
    } catch (err) {
        next(err)
    }
};

// Function for protected routes check if the user is really valid and authenticated
export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // this fetches the id decoded by jwt
        const userId = (req as any).user.id;

        // checks if the decoded can be found in database
        const result: QueryResult<User> = await pool.query(`
            SELECT id, username, email, created_at
            FROM users
            WHERE id=$1
            `, [userId]);

        // if decoded id can't be found in database show error
        if (result.rows.length === 0) {
            const error: any = new Error("User not found");
            error.status = 404;
            return next(error);
        }

        // response object if id is found in database
        res.json({
            success: true,
            user: result.rows[0]
        })
    } catch (err) {
        next(err);
    }
};

// Function for log out this clears the stored in the cookie
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // clears the cookie named token
        res.clearCookie("token");

        // response object for log out
        res.json({
            success: true,
            message: "Logged out"
        })
    } catch (err) {
        next(err);
    }
}