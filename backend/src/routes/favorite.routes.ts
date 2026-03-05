import express from "express";
import {
  toggleFavorite,
  getFavorites,
} from "../controllers/favorite.controller";

const router = express.Router();

router.post("/toggle/:productId", toggleFavorite);
router.get("/:userId", getFavorites);

export default router;
