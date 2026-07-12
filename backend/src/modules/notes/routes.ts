import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { createNote } from "./controllers";

const router = express.Router();

router.post("/", authenticate, createNote);

export default router;