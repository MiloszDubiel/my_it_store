import { Request, Response } from "express";
import {
  getAuthorizationUrl,
  exchangeCodeForToken,
  getProducts,
} from "../services/allegro.service";

export const loginToAllegro = (req: Request, res: Response) => {
  const url = getAuthorizationUrl();
  res.redirect(url);
};

export const allegroCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).send("Missing authorization code");
    }

    await exchangeCodeForToken(code);

    res.redirect("http://localhost:3000/?allegro=connected");
  } catch (error) {
    console.error(error);
    res.status(500).send("OAuth failed");
  }
};

export const getOffersFromDatabase = async (req: Request, res: Response) => {
  let query = { ...req.query };

  try {
    const offers = await getProducts(query);
    res.json(offers);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Błąd pobierania ofert" });
  }
};
