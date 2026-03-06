import dotenv from "dotenv";
dotenv.config();
import express from "express";
import productsRoutes from "./routes/products.routes";
import authRoutes from "./routes/authRoute";
import favoriteRoutes from "./routes/favorite.routes";
import path from "node:path";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/favorite", favoriteRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
