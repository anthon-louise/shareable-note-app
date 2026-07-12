import Router from "express";
import { loginUser, me, registerUser } from "./controllers";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, me);

export default router;