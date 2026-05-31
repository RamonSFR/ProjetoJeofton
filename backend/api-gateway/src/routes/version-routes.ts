import { Router } from "express";

const router = Router();

function resolveEnvironment(): string {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  if (nodeEnv === "production") return "Production";
  if (nodeEnv === "staging") return "Staging";
  return "Development";
}

router.get("/version", (_req, res) => {
  res.json({
    version: process.env.APP_VERSION ?? "0.0.0",
    environment: resolveEnvironment(),
    buildDate: process.env.BUILD_DATE ?? new Date().toISOString(),
  });
});

export default router;
