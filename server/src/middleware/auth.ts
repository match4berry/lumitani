import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
  userName?: string;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
      userId: number;
      email: string;
      name: string;
    };
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userName = decoded.name;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const generateToken = (userId: number, email: string, name: string) => {
  return jwt.sign(
    { userId, email, name },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" }
  );
};
