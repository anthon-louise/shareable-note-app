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

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const result: QueryResult<Note> = await pool.query(`
            SELECT id, user_id, title, content, created_at, updated_at
            FROM notes
            WHERE user_id=$1
            ORDER BY updated_at DESC
            `, [userId]);


        res.json({
            success: true,
            notes: result.rows
        })
    } catch (err) {
        next(err);
    }
}

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const noteId = req.params.id;

        const result: QueryResult<Note> = await pool.query(`
            SELECT *
            FROM notes
            WHERE user_id=$1 AND id=$2
            `, [userId, noteId]);

        if (result.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error)
        }

        res.json({
            success: true,
            note: result.rows[0]
        });
    } catch (err) {
        next(err)
    }
}
