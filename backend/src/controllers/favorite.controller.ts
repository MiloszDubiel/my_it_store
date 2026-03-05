import { Request, Response } from "express";
import { connection } from "../config/db.config";

export const toggleFavorite = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { productId } = req.params;

  try {
    const [existing]: any = await connection.query(
      "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?",
      [userId, productId],
    );

    if (existing.length > 0) {
      await connection.query(
        "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
        [userId, productId],
      );

      return res.json({ favorite: false });
    }

    await connection.query(
      "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",
      [userId, productId],
    );

    res.json({ favorite: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [rows] = await connection.query(
      `
      SELECT p.*
      FROM favorites f
      JOIN products p ON p.id = f.product_id
      WHERE f.user_id = ?
      `,
      [userId],
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};
