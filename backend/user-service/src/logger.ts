import pino from "pino";

const logLevel =
  process.env.LOG_LEVEL ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

export const logger = pino({
  name: "user-service",
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
});
