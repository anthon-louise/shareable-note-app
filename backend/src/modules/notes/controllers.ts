import { Request, Response, NextFunction } from "express";
import { noteSchema } from "./schema";
import { pool } from "../../config/db";
import { QueryResult } from "pg";

interface Note {
    id: number,
    user_id: number,
    title: string,
    content: string,
    created_at: Date,
    updated_at: Date
}

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedNote = noteSchema.parse(req.body);
        const userId = (req as any).user.id;

        const result: QueryResult = await pool.query(`
            INSERT INTO
            notes (user_id, title, content)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, title, content, created_at, updated_at
            `, [userId, validatedNote.title, validatedNote.content]);

        res.status(201).json({
            success: true,
            note: result.rows[0]
        })
    } catch (err) {
        next(err);
    }
};