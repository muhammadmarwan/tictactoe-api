import express, { RequestHandler } from "express";
import { register, login, profile } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { registerValidator, loginValidator } from "../utils/validators/authValidator";

const router = express.Router();

router.post("/register", registerValidator, validate as any, register as RequestHandler);
router.post("/login", loginValidator, validate as any, login as RequestHandler);
router.get("/profile", authenticateToken as any, profile as RequestHandler);

export default router;
