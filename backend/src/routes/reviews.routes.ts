import { Router } from "express";
import {
  insertReviews,
  getProductReviews,
  setSellerComment,
} from "../controllers/reviews.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyToken, insertReviews);
router.get("/product/:id", getProductReviews);
router.put("/:id/reply", setSellerComment);

export default router;
