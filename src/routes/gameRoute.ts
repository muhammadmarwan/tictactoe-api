import express, { RequestHandler } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { startGame, makeMove, getGameState, getStats } from '../controllers/gameController';
import { startGameValidator, makeMoveValidator, getGameStateValidator } from "../utils/validators/gameValidator";

const router = express.Router();

router.post('/start', startGameValidator, authenticateToken as any, startGame as RequestHandler);
router.post('/move', makeMoveValidator, authenticateToken as any, makeMove as RequestHandler);
router.get('/state/:gameSessionId', getGameStateValidator, authenticateToken as any, getGameState as RequestHandler);
router.get('/stats/me', authenticateToken as any, getStats as RequestHandler);

export default router;
