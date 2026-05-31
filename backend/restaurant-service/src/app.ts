import express from "express";
import cors from "cors";
import productRouter from "./routes/product-routes";
import restaurantRouter from "./routes/restaurantRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/test", (_req, res) => {
  res.json({ status: "ok" });
});
app.use(productRouter);
app.use(restaurantRouter);

export default app;
