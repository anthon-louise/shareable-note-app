import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createNote, getNotes, updateNote, getNoteById } from "./controllers";

const router = express.Router();

router.post("/", authenticate, createNote);
router.get("/", authenticate, getNotes);
router.get("/:id", authenticate, getNoteById);
router.put("/:id", authenticate, updateNote);

export default router;