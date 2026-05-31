import "dotenv/config";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { logger } from "./logger";

const PORT = Number(process.env.PORT ?? 3000);
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL ?? "http://127.0.0.1:3001";
const RESTAURANT_SERVICE_URL =
  process.env.RESTAURANT_SERVICE_URL ?? "http://127.0.0.1:3002";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL ?? "http://127.0.0.1:3003";
const REALTIME_SERVICE_URL =
  process.env.REALTIME_SERVICE_URL ?? "http://127.0.0.1:3006";

const app = express();

const rewritePrefixedPath = (prefix: string) => (path: string) => {
  if (path === prefix || path.startsWith(`${prefix}/`)) {
    const rest = path.replace(new RegExp(`^${prefix}`), "");
    return rest.length > 0 ? rest : "/";
  }

  return path;
};

// Enable CORS for the frontend origin (development-friendly)
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

app.get("/test", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
});

app.use(
  "/users",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: rewritePrefixedPath("/users"),
  }),
);

app.use(
  "/api/users",
  createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: rewritePrefixedPath("/api/users"),
  }),
);

app.use(
  "/restaurants",
  createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: rewritePrefixedPath("/restaurants"),
  }),
);

app.use(
  "/api/restaurants",
  createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: rewritePrefixedPath("/api/restaurants"),
  }),
);

app.use(
  "/orders",
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path === "" || path === "/") {
        return "/orders";
      }
      if (path.startsWith("/")) {
        return `/orders${path}`;
      }
      return `/orders/${path}`;
    },
  }),
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      const cleanedPath = path.replace(/^\/api\/orders/, "");
      if (cleanedPath === "" || cleanedPath === "/") {
        return "/orders";
      }
      if (cleanedPath.startsWith("/")) {
        return `/orders${cleanedPath}`;
      }
      return `/orders/${cleanedPath}`;
    },
  }),
);

// Realtime service endpoint info (clients connect directly via WebSocket)
app.get("/realtime/info", (_req, res) => {
  res.json({
    url: REALTIME_SERVICE_URL,
    message: "Connect to this URL for WebSocket realtime events",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  logger.info({ port: PORT }, "api-gateway iniciado");
});
