import Router from "express";
import { loginUser, logout, me, registerUser } from "./controllers";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;