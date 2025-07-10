import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { registerUser, loginUser, getUserProfile } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await registerUser(email, password);
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message || "Login failed" });
  }
};

export const profile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const profile = await getUserProfile(req.user.email);
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to fetch profile" });
  }
};
