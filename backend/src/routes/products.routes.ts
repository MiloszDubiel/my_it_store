import { Router } from "express";
import {
  loginToAllegro,
  allegroCallback,
  getOffersFromDatabase,
  getProductByID,
  getProductByExternalID,
} from "../controllers/prodcuts.controller";

const router = Router();

router.get("/login", loginToAllegro);
router.get("/callback", allegroCallback);
router.get("/products", getOffersFromDatabase);
router.get("/products/:slug/:id", getProductByExternalID);
router.get("/products/:id", getProductByID);
export default router;
