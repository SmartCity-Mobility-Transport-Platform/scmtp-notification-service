import express from "express";
import { listNotifications } from "../models/Notification";

export function createHttpServer() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/notifications", (_req, res) => {
    const data = listNotifications(100);
    res.json(data);
  });

  return app;
}


