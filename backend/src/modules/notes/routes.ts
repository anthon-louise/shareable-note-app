import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createNote, getNotes } from "./controllers";

const router = express.Router();

router.post("/", authenticate, createNote);
router.get("/", authenticate, getNotes);

export default router;