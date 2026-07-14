import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createNote, getNotes, updateNote, getNoteById, deleteNote, shareNote, removeNoteShare, getSharedWithNote } from "./controllers";

const router = express.Router();

router.post("/", authenticate, createNote);
router.get("/", authenticate, getNotes);
router.get("/:id", authenticate, getNoteById);
router.put("/:id", authenticate, updateNote);
router.delete("/:id", authenticate, deleteNote);

router.post("/:id/share", authenticate, shareNote);
router.delete("/:id/share/:userId", authenticate, removeNoteShare);
router.get("/:id/shares", authenticate, getSharedWithNote);

export default router;