import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createNote, getNotes, updateNote, getNoteById, deleteNote, shareNote, removeNoteShare, getSharedWithNote, getSharedWithMeNotes } from "./controllers";

const router = express.Router();

// share note to other user
router.post("/:id/share", authenticate, shareNote);

// remove the shared note to other user
router.delete("/:id/share/:userId", authenticate, removeNoteShare);

// get the shared notes by other users
router.get("/sharedwithme", authenticate, getSharedWithMeNotes);

// get the users who shared note with
router.get("/:id/shares", authenticate, getSharedWithNote);


// create note
router.post("/", authenticate, createNote);

// get all notes
router.get("/", authenticate, getNotes);

// get note by id
router.get("/:id", authenticate, getNoteById);

// update note
router.put("/:id", authenticate, updateNote);

// delete note
router.delete("/:id", authenticate, deleteNote);

export default router;