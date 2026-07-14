import { Request, Response, NextFunction } from "express";
import { noteSchema, shareNoteSchema } from "./schema";
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

        const result: QueryResult<Note> = await pool.query(`
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
            SELECT id, user_id, title, content, created_at, updated_at
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
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const noteId = req.params.id;
        const validatedNote = noteSchema.parse(req.body);

        const result: QueryResult<Note> = await pool.query(`
            UPDATE notes
            SET title=$1, content=$2
            WHERE user_id=$3 AND id=$4
            RETURNING id, user_id, title, content, created_at, updated_at
            `, [validatedNote.title, validatedNote.content, userId, noteId]);

        if (result.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        }

        res.json({
            success: true,
            note: result.rows[0]
        });
    } catch (err) {
        next(err)
    }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const noteId = req.params.id;

        const result: QueryResult<{id: number}> = await pool.query(`
            DELETE FROM notes
            WHERE user_id=$1 AND id=$2
            RETURNING id
            `, [userId, noteId]);

        if (result.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        };

        res.json({
            success: true
        });
    } catch (err) {
        next(err);
    }
}

export const shareNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email} = shareNoteSchema.parse(req.body);
        const noteId = req.params.id;
        const ownerId = (req as any).user.id;

        const noteCheck = await pool.query(`
            SELECT id
            FROM notes
            WHERE id=$1 AND user_id=$2
            `, [noteId, ownerId]);

        if (noteCheck.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        }

        const result = await pool.query(`
            SELECT id
            FROM users
            WHERE email=$1
            `, [email]);

            if (result.rows.length === 0) {
                const error: any = new Error("No user found!");
                error.status = 404;
                return next(error);
            }
            
            const userId = result.rows[0].id;

            if (userId === ownerId) {
                const error: any = new Error("Cannot share with yourself");
                error.status = 400;
                return next(error);
            }

            const existingShare = await pool.query(`
                SELECT id
                FROM note_shares
                WHERE note_id=$1 AND shared_with_user_id=$2
                `, [noteId, userId]);

            if (existingShare.rows.length > 0) {
                const error: any = new Error("Already shared with this user");
                error.status = 400;
                return next(error);
            }

            await pool.query(`
                INSERT INTO
                note_shares (note_id, shared_with_user_id)
                VALUES ($1, $2)
                RETURNING id, note_id, shared_with_user_id, created_at
                `, [noteId, userId]);


        res.json({
            success: true,
            message: "Note successsfully shared"
        });
    } catch (err) {
        next(err);
    }
}

export const removeNoteShare = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const noteId = req.params.id;
        const userId = req.params.userId;
        const ownerId = (req as any).user.id;
        
        const noteCheck = await pool.query(`
            SELECT id
            FROM notes
            WHERE id=$1 AND user_id=$2
            `, [noteId, ownerId]);

        if (noteCheck.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        }

        const shareCheck = await pool.query(`
            SELECT id
            FROM note_shares
            WHERE note_id=$1 AND shared_with_user_id=$2
            `, [noteId, userId]);

        if (shareCheck.rows.length === 0) {
            const error: any = new Error("Share not found");
            error.status = 404;
            return next(error);
        }

        await pool.query(`
            DELETE FROM note_shares
            WHERE note_id=$1 AND shared_with_user_id=$2
            `, [noteId, userId]);

        res.json({
            success: true,
            message: "Removed share success"
        })

    } catch (err) {
        next(err)
    }
}

export const getSharedWithNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const noteId = req.params.id;
        const userId = (req as any).user.id;

        const result = await pool.query(`
            SELECT
                note_shares.note_id,
                note_shares.shared_with_user_id,
                users.username,
                users.email,
                notes.title,
                notes.content,
                users.id
            FROM notes
            JOIN note_shares
            ON notes.id = note_shares.note_id
            JOIN users
            ON note_shares.shared_with_user_id = users.id
            WHERE notes.id=$1 AND notes.user_id=$2
            `, [noteId, userId]);

            res.json({
                success: true,
                shared_with: result.rows
            })
    } catch (err) {
        next(err);
    }
}

export const getSharedWithMeNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const result = await pool.query(`
            SELECT
                users.id,
                users.username,
                users.email,
                notes.title,
                notes.content
            FROM notes 
            JOIN users ON notes.user_id=users.id
            JOIN note_shares ON notes.id=note_shares.note_id
            WHERE note_shares.shared_with_user_id=$1
            `, [userId]);

        res.json({
            success: true,
            notes: result.rows
        })
    } catch (err) {
        next(err);
    }
}