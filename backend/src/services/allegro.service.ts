import axios from "axios";
import { connection } from "../config/db.config";
import console from "node:console";
import { Query } from "mysql2";

//HELPER
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function formatDateForMySQL(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

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
    (external_id, price, stock, createdAt, category_id, category_name, brand, model, product_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      price = VALUES(price),
      stock = VALUES(stock),
      createdAt = VALUES(createdAt),
      category_id = VALUES(category_id),
      category_name = VALUES(category_name),
      brand = VALUES(brand),
      model = VALUES(model),
      product_data = VALUES(product_data)
  `;

  for (const product of products) {
    const path = product.category?.path || [];
    const lastCategory = path.length ? path[path.length - 1] : null;

    const categoryId = lastCategory?.id || null;
    const categoryName = lastCategory?.name || null;

    const brandParam = product.parameters?.find(
      (p: any) => p.name?.toLowerCase() === "marka",
    );
    const brand =
      brandParam?.valuesLabels?.[0] || brandParam?.values?.[0] || null;

    const modelParam = product.parameters?.find(
      (p: any) => p.name?.toLowerCase() === "model",
    );
    const model =
      modelParam?.valuesLabels?.[0] || modelParam?.values?.[0] || null;

    console.log({ categoryId, categoryName, brand, model });

    await connection.query(query, [
      product.id,
      product.price,
      product.stock,
      product.createdAt,
      categoryId,
      categoryName,
      brand,
      model,
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
    "Komputer",
    "Laptop",
    "Karta graficzna",
    "Procesor",
    "RAM",
    "SSD",
    "HDD",
    "Płyta główna",
    "Motherboard",
    "CPU",
    "GPU",
    "Pamięć operacyjna",
    "Dysk HDD",
    "Dysk SSD",
  ];

  const categoryIds = {
    Komputer: "2",
    Podzespoly: "4226",
    GPU: "46146",
    CPU: "260288",
    Motherboard: "260289",
  };

  const categories = [
    categoryIds.Komputer,
    categoryIds.Podzespoly,
    categoryIds.GPU,
    categoryIds.CPU,
    categoryIds.Motherboard,
    "257767",
    "4312",
    "258487",
  ];
  const limit = 100;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  let allProducts: any[] = [];

  for (const phrase of phrases) {
    for (const categoryId of categories) {
      let pageId: string | undefined = undefined;

      while (true) {
        const params: any = {
          phrase,
          "category.id": categoryId,
          language: "pl-PL",
          limit,
        };
        if (pageId) params["page.id"] = pageId;

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
            },
          },
        );

        const products = response.data.products ?? [];
        allProducts.push(...products);

        if (!response.data.page?.id) break;

        pageId = response.data.page.id;

        await sleep(300);
      }
    }
  }

  const uniqueProducts = Array.from(
    new Map(allProducts.map((p) => [p.id, p])).values(),
  );

  const productsWithExtras = uniqueProducts.map((product: any) => ({
    ...product,
    price: Math.floor(Math.random() * 4000) + 1000,
    stock: Math.floor(Math.random() * 50) + 1,
    createdAt: randomDate(new Date(2022, 0, 1), new Date()),
  }));

  await saveProducts(productsWithExtras);
  console.log("Zapisano:", productsWithExtras.length);
};

const componentsCategories = [
  "Procesory",
  "Dyski HDD",
  "Dyski SSD",
  "Pamięć RAM",
  "Karty graficzne",
  "Płyty główne",
  "GPU",
  "CPU",
  "SSD",
  "HDD",
  "RAM",
];

function mapMainCategory(categoryName: string | null) {
  if (!categoryName) return null;

  if (componentsCategories.includes(categoryName)) {
    return {
      main: "Podzespoły",
      sub: categoryName,
    };
  }

  return {
    main: categoryName,
    sub: null,
  };
}
export const getProducts = async (params: any) => {
  const { categories, brands, min, max, stock, search } = params;

  let query = "SELECT * FROM allegro_products WHERE 1=1";
  const queryParams: any[] = [];

  if (categories) {
    const cats = (categories as string).split(",");
    query += ` AND category_name IN (${cats.map(() => "?").join(",")})`;
    queryParams.push(...cats);
  }

  if (brands) {
    const b = (brands as string).split(",");
    query += ` AND brand IN (${b.map(() => "?").join(",")})`;
    queryParams.push(...b);
  }

  if (min) {
    query += " AND price >= ?";
    queryParams.push(Number(min));
  }

  if (max) {
    query += " AND price <= ?";
    queryParams.push(Number(max));
  }

  if (stock === "1") {
    query += " AND stock > 0";
  }

  if (search) {
    query += " AND product_data LIKE ?";
    queryParams.push(`%${search}%`);
  }

  const [rows]: any = await connection.query(query, queryParams);

  return rows.map((product: any) => {
    const mapped = mapMainCategory(product.category_name);
    return {
      ...product,
      main_category: mapped?.main,
      sub_category: mapped?.sub,
    };
  });
};

export const getCurrtentProdcut = async (id: string) => {
  const [rows] = await connection.query(
    "SELECT * FROM allegro_products WHERE external_id = ?",
    [id],
  );
  const row = (rows as any[])[0];
  if (!row) {
    return null;
  }
  return row;
};
