import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  baseURL: config.pythonApiUrl + "/game",
  headers: {
    "x-internal-api-key": config.pythonApiKey,
  },
});

export const postMove = async (board: number[][], player: "O" | "X") => {
  const response = await apiClient.post("/move", { board, player });
  return response.data;
};

export const getGameState = async (board: number[][]) => {
  const boardStr = encodeURIComponent(JSON.stringify(board));
  const response = await apiClient.get(`/game-state?board=${boardStr}`);
  return response.data;
};
