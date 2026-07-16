import { Request, Response, NextFunction } from "express";
import { noteSchema, shareNoteSchema } from "./schema";
import { pool } from "../../config/db";
import { QueryResult } from "pg";

// defines the shape of note
interface Note {
    id: number,
    user_id: number,
    title: string,
    content: string,
    created_at: Date,
    updated_at: Date
}

// Function to create note
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get the title and content body from req.user then validate with zod
        const validatedNote = noteSchema.parse(req.body);

        // get the decoded id of the current user
        const userId = (req as any).user.id;

        // store the note in database
        const result: QueryResult<Note> = await pool.query(`
            INSERT INTO
            notes (user_id, title, content)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, title, content, created_at, updated_at
            `, [userId, validatedNote.title, validatedNote.content]);

        // send response object
        res.status(201).json({
            success: true,
            note: result.rows[0]
        })
    } catch (err) {
        next(err);
    }
};

// Function to fetch notes from database
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the decoded id of the current user
        const userId = (req as any).user.id;

        // get the notes of current user from database
        const result: QueryResult<Note> = await pool.query(`
            SELECT id, user_id, title, content, created_at, updated_at
            FROM notes
            WHERE user_id=$1
            ORDER BY updated_at DESC
            `, [userId]);

        // send response object
        res.json({
            success: true,
            notes: result.rows
        })
    } catch (err) {
        next(err);
    }
}

// Function to fetch one note owned by the current user
export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the decoded if of the current user
        const userId = (req as any).user.id;

        // get the specific id of note from req.params 
        const noteId = req.params.id;

        // fetch the specific note from databse
        const result: QueryResult<Note> = await pool.query(`
            SELECT id, user_id, title, content, created_at, updated_at
            FROM notes
            WHERE user_id=$1 AND id=$2
            `, [userId, noteId]);

        // if no note found throw error
        if (result.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error)
        }

        // send response object
        res.json({
            success: true,
            note: result.rows[0]
        });
    } catch (err) {
        next(err)
    }
};

// Function to update a note
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the decoded if of current user
        const userId = (req as any).user.id;

        // get the specific note to update deom req.params
        const noteId = req.params.id;

        // get the title and content to be updated and validate with zod
        const validatedNote = noteSchema.parse(req.body);

        // update the note in database
        const result: QueryResult<Note> = await pool.query(`
            UPDATE notes
            SET title=$1, content=$2
            WHERE user_id=$3 AND id=$4
            RETURNING id, user_id, title, content, created_at, updated_at
            `, [validatedNote.title, validatedNote.content, userId, noteId]);

        // if no note found throw error
        if (result.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        }

        // send success response object
        res.json({
            success: true,
            note: result.rows[0]
        });
    } catch (err) {
        next(err)
    }
};

// Function to delete a note
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the decoded id of the current user
        const userId = (req as any).user.id;

        // get the if of the specific note to be deleted
        const noteId = req.params.id;

        // delete note in database
        const result: QueryResult<{ id: number }> = await pool.query(`
            DELETE FROM notes
            WHERE user_id=$1 AND id=$2
            RETURNING id
            `, [userId, noteId]);

        // if no note found throw error
        if (result.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        };

        // send success reponse object
        res.json({
            success: true
        });
    } catch (err) {
        next(err);
    }
}

// Function to share own notes to other users
export const shareNote = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the validated email of the user to be shared from req.body
        const { email } = shareNoteSchema.parse(req.body);

        // get the id of the note to be shared
        const noteId = req.params.id;

        // get the id of note owner
        const ownerId = (req as any).user.id;

        // check if the note exists
        const noteCheck = await pool.query(`
            SELECT id
            FROM notes
            WHERE id=$1 AND user_id=$2
            `, [noteId, ownerId]);

        // if the note does not exist then throw error
        if (noteCheck.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        }

        // check if email exists
        const result = await pool.query(`
            SELECT id
            FROM users
            WHERE email=$1
            `, [email]);

        // if email does not exist throw error
        if (result.rows.length === 0) {
            const error: any = new Error("No user found!");
            error.status = 404;
            return next(error);
        }

        // id email exist then get the user details
        const userId = result.rows[0].id;

        // if the owner id and the user to be shared wuth id is the same then throw error
        if (userId === ownerId) {
            const error: any = new Error("Cannot share with yourself");
            error.status = 400;
            return next(error);
        }

        // check if note already shared
        const existingShare = await pool.query(`
                SELECT id
                FROM note_shares
                WHERE note_id=$1 AND shared_with_user_id=$2
                `, [noteId, userId]);

        // if the note is already shared them throw error
        if (existingShare.rows.length > 0) {
            const error: any = new Error("Already shared with this user");
            error.status = 400;
            return next(error);
        }

        // sharing note to the owner
        await pool.query(`
                INSERT INTO
                note_shares (note_id, shared_with_user_id)
                VALUES ($1, $2)
                RETURNING id, note_id, shared_with_user_id, created_at
                `, [noteId, userId]);

        // send success response object
        res.json({
            success: true,
            message: "Note successsfully shared"
        });
    } catch (err) {
        next(err);
    }
}

// Function to remove share of a note
export const removeNoteShare = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the id of spicific note in req.params
        const noteId = req.params.id;

        // get the if user to be remove the share with
        const userId = req.params.userId;

        // get the decoded user id of the owner
        const ownerId = (req as any).user.id;

        // check if note exists
        const noteCheck = await pool.query(`
            SELECT id
            FROM notes
            WHERE id=$1 AND user_id=$2
            `, [noteId, ownerId]);

        // if note doesn't exist then throw error
        if (noteCheck.rows.length === 0) {
            const error: any = new Error("Note not found");
            error.status = 404;
            return next(error);
        }

        // check if note already shared with the other user
        const shareCheck = await pool.query(`
            SELECT id
            FROM note_shares
            WHERE note_id=$1 AND shared_with_user_id=$2
            `, [noteId, userId]);

        // if share can't be found then throw error
        if (shareCheck.rows.length === 0) {
            const error: any = new Error("Share not found");
            error.status = 404;
            return next(error);
        }

        // remove the share in database
        await pool.query(`
            DELETE FROM note_shares
            WHERE note_id=$1 AND shared_with_user_id=$2
            `, [noteId, userId]);

        // send success response object
        res.json({
            success: true,
            message: "Removed share success"
        })

    } catch (err) {
        next(err)
    }
}

// Function to get the email I shared to other users
export const getSharedWithNote = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get the specific id of the note
        const noteId = req.params.id;

        // get the id of current user
        const userId = (req as any).user.id;

        // find the email that the current user is sharing with others
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

        // send success response object
        res.json({
            success: true,
            shared_with: result.rows
        })
    } catch (err) {
        next(err);
    }
}


// Function to get the notes people shared
export const getSharedWithMeNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // get id of the current user
        const userId = (req as any).user.id;

        // get notes that are shared by other users
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

        // send success response object
        res.json({
            success: true,
            notes: result.rows
        })
    } catch (err) {
        next(err);
    }
}