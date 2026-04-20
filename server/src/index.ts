import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import farmersRouter from "./routes/farmers";
import commoditiesRouter from "./routes/commodities";
import gradesRouter from "./routes/grades";
import pricesRouter from "./routes/prices";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import usersRouter from "./routes/users";
import commissionsRouter from "./routes/commissions";
import salesReportRouter from "./routes/salesReport";

const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: '*', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  // Allow these headers in requests
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  // Expose these headers to the browser
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  // Cache preflight requests for 24 hours
  maxAge: 86400,
};

// const corsOptions = {
//   origin: 'http://localhost:3000', // Only allow this origin
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific methods
//   credentials: true, // Allow cookies/authorization headers if needed
//   optionsSuccessStatus: 204 // Handle preflight requests
// };


app.use(express.json());
app.use(cors(corsOptions));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/farmers", farmersRouter);
app.use("/api/commodities", commoditiesRouter);
app.use("/api/grades", gradesRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/commissions", commissionsRouter);
app.use("/api/sales-report", salesReportRouter);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, (data) => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start()