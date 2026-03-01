import { Router } from "express";
import {
  loginToAllegro,
  allegroCallback,
  getOffersFromDatabase,
} from "../controllers/allegro.controller";

const router = Router();

router.get("/login", loginToAllegro);
router.get("/callback", allegroCallback);
router.get("/products", getOffersFromDatabase);

export default router;
