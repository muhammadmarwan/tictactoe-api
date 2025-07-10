import dotenv from "dotenv";
dotenv.config();

export const config = {
  pythonApiUrl: process.env.PYTHON_API_URL || "http://localhost:8000/game",
  pythonApiKey: process.env.INTERNAL_API_KEY || "",
  frontEndUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  port: process.env.PORT || 8000,
};
