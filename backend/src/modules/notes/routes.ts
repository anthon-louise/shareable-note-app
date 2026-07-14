import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createNote, getNotes, updateNote, getNoteById, deleteNote, shareNote, removeNoteShare, getSharedWithNote, getSharedWithMeNotes } from "./controllers";

const router = express.Router();

router.post("/:id/share", authenticate, shareNote);
router.delete("/:id/share/:userId", authenticate, removeNoteShare);
router.get("/sharedwithme", authenticate, getSharedWithMeNotes);
router.get("/:id/shares", authenticate, getSharedWithNote);


router.post("/", authenticate, createNote);
router.get("/", authenticate, getNotes);
router.get("/:id", authenticate, getNoteById);
router.put("/:id", authenticate, updateNote);
router.delete("/:id", authenticate, deleteNote);



export default router;