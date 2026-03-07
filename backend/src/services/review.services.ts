import { connection } from "../config/db.config";

export const insertReview = async (
  product_id: string | number,
  rating: string,
  comment: string,
  id: string | number,
) => {
  try {
    const [results] = await connection.query(
      `
      INSERT INTO product_reviews(product_id, user_id, rating, comment)
      VALUES(?,?,?,?)
      `,
      [product_id, id, rating, comment],
    );

    return results;
  } catch (error) {
    console.log(error);
  }
};

export const getProductRev = async (productId: string | number) => {
  console.log(productId);
  const [result] = await connection.query(
    `
    SELECT r.*, u.email
    FROM product_reviews r
    JOIN users u ON u.id = r.user_id
    WHERE product_id = ?
    ORDER BY created_at DESC
    `,
    [productId],
  );

  return result;
};

export const setComment = async (reviewId: number | string, reply: string) => {
  const result = await connection.query(
    `
    UPDATE product_reviews
    SET seller_reply = ?
    WHERE id = ?
    `,
    [reply, reviewId],
  );

  return result;
};
