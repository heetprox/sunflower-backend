import { auth } from "@/lib/auth";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const router = Router();

router.get("/api/", (req, res) => {
  res.json({ message: "Router!" });
});

export default router;