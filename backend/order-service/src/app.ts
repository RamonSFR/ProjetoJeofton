import express from "express";
import cors from "cors";
import orderRouter from "./routes/order-routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/orders", orderRouter);

app.get("/test", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
