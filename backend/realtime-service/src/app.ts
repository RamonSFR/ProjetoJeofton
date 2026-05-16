import express from "express";

const app = express();

app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "realtime-service" });
});

export default app;
