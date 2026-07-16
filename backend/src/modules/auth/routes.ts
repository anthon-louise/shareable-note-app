import Router from "express";
import { loginUser, logout, me, registerUser } from "./controllers";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

// register or create a user
router.post("/register", registerUser);

// login a user
router.post("/login", loginUser);

// logs out a user
router.post("/logout", logout);

// for protected routes used in frontend
router.get("/me", authenticate, me);

export default router;