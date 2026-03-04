import { Router } from "express";
import {
  loginToAllegro,
  allegroCallback,
  getOffersFromDatabase,
  getProductByID,
} from "../controllers/allegro.controller";

const router = Router();

router.get("/login", loginToAllegro);
router.get("/callback", allegroCallback);
router.get("/products", getOffersFromDatabase);
router.get("/products/:slug/:id", getProductByID);
export default router;
