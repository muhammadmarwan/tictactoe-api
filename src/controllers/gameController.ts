import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  startGameService,
  makeMoveService,
  getGameStateService,
  getStatsService,
} from "../services/gameService";

export const startGame = async (req: AuthRequest, res: Response) => {
  const { startPlayer } = req.body;

  if (!["user", "computer"].includes(startPlayer)) {
    return res.status(400).json({ message: "startPlayer must be user or computer" });
  }

  try {
    const result = await startGameService(req.user!.id, startPlayer);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to start game", error: err.message });
  }
};

export const makeMove = async (req: AuthRequest, res: Response) => {
  const { gameSessionId, moveRow, moveCol, turn } = req.body;

  if (![0, 1, 2].includes(moveRow) || ![0, 1, 2].includes(moveCol)) {
    return res.status(400).json({ message: "Invalid move coordinates" });
  }

  if (!["user", "computer"].includes(turn)) {
    return res.status(400).json({ message: "Player must be user or computer" });
  }

  try {
    const result = await makeMoveService(req.user!.id, gameSessionId, moveRow, moveCol, turn);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: "Error processing move", error: err.message });
  }
};

export const getGameState = async (req: AuthRequest, res: Response) => {
  const { gameSessionId } = req.params;

  try {
    const result = await getGameStateService(gameSessionId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching game state", error: err.message });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getStatsService(req.user!.id);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
};
