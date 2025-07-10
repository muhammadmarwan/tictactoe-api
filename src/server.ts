import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoute";
import gameRoutes from "./routes/gameRoute";
import { prisma } from "./utils/db"; 
import { config } from "./config";

const app = express();

// CORS
app.use(cors({
  origin: config.frontEndUrl,
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/game', gameRoutes);

// Health check
app.get("/", (_req, res) => {
  res.send("Tic Tac Toe API is running");
});

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed, Prisma disconnected");
    process.exit(0);
  });
});
