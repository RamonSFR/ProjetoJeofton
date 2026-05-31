import express from "express";
import cors from "cors";
import userRouter from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/test", (_req, res) => {
  res.json({ status: "ok" });
});
app.use(userRouter);

export default app;
