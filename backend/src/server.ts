import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import allegroRoutes from "./routes/allegro.routes";
import authRoutes from "./routes/authRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/allegro", allegroRoutes);



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
