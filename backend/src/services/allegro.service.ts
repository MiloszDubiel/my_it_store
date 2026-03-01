import axios from "axios";
import { connection } from "../config/db.config";

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:5000/allegro/callback";

/* ===========================
   AUTH URL
=========================== */
export const getAuthorizationUrl = (): string => {
  return `https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI,
  )}`;
};

/* ===========================
   ZAPIS TOKENA DO DB
=========================== */
const saveToken = async (
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
) => {
  await connection.execute(
    `INSERT INTO allegro_token (id, access_token, refresh_token, expires_at)
     VALUES (1, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     access_token = VALUES(access_token),
     refresh_token = VALUES(refresh_token),
     expires_at = VALUES(expires_at)`,
    [accessToken, refreshToken, expiresAt],
  );
};

const getTokenFromDB = async () => {
  const [rows]: any = await connection.execute(
    "SELECT * FROM allegro_token WHERE id = 1",
  );

  if (rows.length === 0) return null;
  return rows[0];
};

/* ===========================
   WYMIANA CODE → TOKEN
=========================== */
export const exchangeCodeForToken = async (code: string) => {
  const response = await axios.post(
    "https://allegro.pl/auth/oauth/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
    {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const expiresAt = Date.now() + response.data.expires_in * 1000;

  await saveToken(
    response.data.access_token,
    response.data.refresh_token,
    expiresAt,
  );
};

/* ===========================
   REFRESH TOKEN
=========================== */
const refreshToken = async (refreshTokenValue: string) => {
  const response = await axios.post(
    "https://allegro.pl/auth/oauth/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshTokenValue,
    }),
    {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const expiresAt = Date.now() + response.data.expires_in * 1000;

  await saveToken(
    response.data.access_token,
    response.data.refresh_token,
    expiresAt,
  );

  return response.data.access_token;
};

/* ===========================
   ZAWSZE WAŻNY TOKEN
=========================== */
export const getValidAllegroToken = async (): Promise<string> => {
  const tokenData = await getTokenFromDB();

  if (!tokenData) {
    throw new Error("Allegro not connected yet");
  }

  const isExpired = Date.now() > tokenData.expires_at - 60_000;

  if (isExpired) {
    return await refreshToken(tokenData.refresh_token);
  }

  return tokenData.access_token;
};

export const saveProducts = async (products: any[]) => {
  const query = `
      INSERT INTO allegro_products 
  (external_id, price, product_data)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE
      price = VALUES(price),
      product_data = VALUES(product_data)

  `;

  for (const product of products) {
    await connection.query(query, [
      product.id,
      product.price,
      JSON.stringify(product),
    ]);
  }
};

/* ===========================
   PRZYKŁADOWE POBIERANIE PRODUKTÓW
=========================== */
export const fetchComputerOffers = async () => {
  const token = await getValidAllegroToken();

  const phrases = [
    "komputer",
    "laptop",
    "tablet",
    "karta graficzna",
    "procesor",
    "ram",
    "dysk ssd",
    "płyta główna",
    "monitor",
    "klawiatura",
    "mysz",
  ];

  const categories = ["2", "491", "257767", "4312", "258487"];

  const limit = 100;

  const requests = phrases.flatMap((phrase) =>
    categories.map(async (categoryId) => {
      let offset = 0;
      let collected: any[] = [];

      while (true) {
        const response = await axios.get(
          "https://api.allegro.pl/sale/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.allegro.public.v1+json",
              "Accept-Language": "pl-PL",
            },
            params: {
              phrase,
              "category.id": categoryId,
              language: "pl-PL",
              limit,
              offset,
            },
          },
        );

        const products = response.data.products;

        collected.push(...products);

        if (products.length < limit) break;

        offset += limit;
      }

      return collected;
    }),
  );

  const results = await Promise.all(requests);
  const allProducts = results.flat();

  const uniqueProducts = Array.from(
    new Map(allProducts.map((p) => [p.id, p])).values(),
  );

  const productsWithPrice = uniqueProducts.map((product: any) => ({
    ...product,
    price: Math.floor(Math.random() * 4000) + 1000,
  }));

  await saveProducts(productsWithPrice);
  console.log("Zapisano:", productsWithPrice.length);
};

export const getProducts = async () => {
  const [rows] = await connection.query("SELECT * FROM allegro_products");

  return rows;
};
