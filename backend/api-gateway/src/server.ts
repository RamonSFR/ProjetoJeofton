import "dotenv/config";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

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
    pathRewrite: (path) => {
      if (path === "/users" || path.startsWith("/users/")) {
        const rest = path.replace(/^\/users/, "");
        return rest.length > 0 ? rest : "/";
      }
      return path;
    },
  }),
);

app.use(
  "/restaurants",
  createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path === "/restaurants" || path.startsWith("/restaurants/")) {
        const rest = path.replace(/^\/restaurants/, "");
        return rest.length > 0 ? rest : "/";
      }
      return path;
    },
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

// Realtime service endpoint info (clients connect directly via WebSocket)
app.get("/realtime/info", (_req, res) => {
  res.json({
    url: REALTIME_SERVICE_URL,
    message: "Connect to this URL for WebSocket realtime events",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`api-gateway na porta ${PORT}`);
});
