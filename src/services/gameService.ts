import { prisma } from "../utils/db";
import * as pythonApiService from "../services/pythonApiService";

export const updateUserStats = async (
  userId: string,
  gameStatus: string,
  lastMover: "user" | "computer"
) => {
  let result: "WIN" | "LOSS" | "DRAW";

  if (gameStatus === "DRAW") {
    result = "DRAW";
  } else if (
    (gameStatus === "WIN" && lastMover === "user") ||
    (gameStatus === "LOSS" && lastMover === "computer")
  ) {
    result = "WIN";
  } else {
    result = "LOSS";
  }

  const existingStats = await prisma.userStats.findUnique({ where: { userId } });

  if (!existingStats) {
    await prisma.userStats.create({
      data: {
        userId,
        wins: result === "WIN" ? 1 : 0,
        losses: result === "LOSS" ? 1 : 0,
        draws: result === "DRAW" ? 1 : 0,
      },
    });
  } else {
    await prisma.userStats.update({
      where: { userId },
      data: {
        wins: result === "WIN" ? { increment: 1 } : undefined,
        losses: result === "LOSS" ? { increment: 1 } : undefined,
        draws: result === "DRAW" ? { increment: 1 } : undefined,
      },
    });
  }
};

export const startGameService = async (userId: string, startPlayer: "user" | "computer") => {
  const emptyBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const gameSession = await prisma.gameSession.create({
    data: {
      userId,
      board: emptyBoard,
      status: "ONGOING",
      startPlayer,
    },
  });

  let board = emptyBoard;

  if (startPlayer === "computer") {
    const response = await pythonApiService.postMove(board, "O");
    board = response.board;

    await prisma.gameSession.update({
      where: { id: gameSession.id },
      data: { board },
    });
  }

  return {
    gameSessionId: gameSession.id,
    board,
    status: "ONGOING",
    nextTurn: startPlayer === "computer" ? "user" : "computer",
  };
};

export const makeMoveService = async (
  userId: string,
  gameSessionId: string,
  moveRow: number,
  moveCol: number,
  turn: "user" | "computer"
) => {
  const session = await prisma.gameSession.findUnique({ where: { id: gameSessionId } });
  if (!session) throw new Error("Game session not found");
  if (session.status !== "ONGOING") throw new Error("Game has ended");

  let board = session.board as number[][];

  const symbol = turn === "user" ? -1 : 1;

  if (board[moveRow][moveCol] !== 0) throw new Error("Cell already occupied");

  board[moveRow][moveCol] = symbol;

  await prisma.gameSession.update({
    where: { id: gameSessionId },
    data: { board },
  });

  const stateResponse = await pythonApiService.getGameState(board);

  if (stateResponse.status !== "ONGOING") {
    await prisma.gameSession.update({
      where: { id: gameSessionId },
      data: { status: stateResponse.status.toUpperCase() },
    });

    await updateUserStats(userId, stateResponse.status, "user");

    return {
      board,
      status: stateResponse.status,
      message: "Game ended",
      nextTurn: "none",
    };
  }

  const computerMoveResponse = await pythonApiService.postMove(board, "O");

  board = computerMoveResponse.board;

  await prisma.gameSession.update({
    where: { id: gameSessionId },
    data: { board },
  });

  const finalStateResponse = await pythonApiService.getGameState(board);

  if (finalStateResponse.status !== "ONGOING") {
    await prisma.gameSession.update({
      where: { id: gameSessionId },
      data: { status: finalStateResponse.status },
    });

    await updateUserStats(userId, finalStateResponse.status, "computer");
  }

  const finalStatus = (finalStateResponse.status || "ONGOING").toUpperCase();
  const nextTurn = finalStatus === "ONGOING" ? "user" : "none";

  return {
    board,
    status: finalStateResponse.status || "ONGOING",
    nextTurn,
  };
};

export const getGameStateService = async (gameSessionId: string) => {
  const session = await prisma.gameSession.findUnique({ where: { id: gameSessionId } });
  if (!session) throw new Error("Game session not found");

  return {
    board: session.board,
    status: session.status,
  };
};

export const getStatsService = async (userId: string) => {
  const stats = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      stats: {
        select: {
          wins: true,
          losses: true,
          draws: true,
        },
      },
    },
  });

  if (!stats) throw new Error("User stats not found");

  return {
    wins: stats.stats?.wins || 0,
    losses: stats.stats?.losses || 0,
    draws: stats.stats?.draws || 0,
  };
};
