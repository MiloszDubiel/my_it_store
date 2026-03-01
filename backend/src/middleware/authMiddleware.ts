import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, } from "../types/express";
import { JwtUserPayload } from "../types/jwt";

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Brak tokena" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_ACCESS_SECRET as string
    );

    if (typeof decoded === "string") {
      return res.status(403).json({ message: "Nieprawidłowy token" });
    }

    const user = decoded as JwtUserPayload;

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch {
    return res.status(403).json({ message: "Nieprawidłowy token" });
  }
};