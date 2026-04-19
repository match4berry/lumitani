import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import farmersRouter from "./routes/farmers";
import commoditiesRouter from "./routes/commodities";
import gradesRouter from "./routes/grades";
import pricesRouter from "./routes/prices";
import productsRouter from "./routes/products";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/farmers", farmersRouter);
app.use("/api/commodities", commoditiesRouter);
app.use("/api/grades", gradesRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/products", productsRouter);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
