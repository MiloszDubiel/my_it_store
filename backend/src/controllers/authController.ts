import { Request, Response } from "express";
import { connection } from "../config/db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2/promise";
import { log } from "../logger";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  password: string;
};

type Token = {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  email: string;
  role: string;
};

export const register = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, first_name, last_name],
    );
    log("ZAREJSTROWANo");
    res.json({ message: "Rejestracja zakończona sukcesem" });
  } catch (err: any) {
    log(err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res
      .status(400)
      .json({ message: "Nie podano hasła lub adresu email" });
  }

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT first_name, last_name, email, id, role, password FROM users WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Nieprawidłowy email" });
    }

    const user = rows[0] as User;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Nieprawidłowe hasło" });
    }

    const accessExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES || "900");

    if (!accessExpires || typeof accessExpires !== "number")
      throw new Error(
        "ACCESS_TOKEN_EXPIRES nie ustawiony w .env lub nie jest liczba",
      );

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: accessExpires },
    );

    const refreshToken = uuidv4();

    await connection.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))`,
      [user.id, refreshToken, process.env.REFRESH_TOKEN_EXPIRES],
    );

    res.json({ accessToken, refreshToken });
  } catch (err: any) {
    console.log(err);
    log(err);
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT refresh_token.id, user_id, token, email, role, expires_at FROM refresh_tokens INNER JOIN users ON users.id = refresh_token.user_id WHERE token = ? AND is_revoked = FALSE",
      [refreshToken],
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Nieprawidłowy refresh token" });
    }

    const tokenData = rows[0] as Token;

    if (!tokenData) {
      return "Brak przypisanego tokena";
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(403).json({ message: "Refresh token wygasł" });
    }

    const accessExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRES || "");

    if (isNaN(accessExpires)) {
      throw new Error("ACCESS_TOKEN_EXPIRES musi być liczbą");
    }

    const accessToken = jwt.sign(
      { id: tokenData.user_id, email: tokenData.email, role: tokenData.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: accessExpires },
    );

    res.json({ accessToken });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    await connection.query(
      "UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?",
      [refreshToken],
    );

    res.json({ message: "Wylogowano" });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
