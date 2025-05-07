import express from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/should-be-logged-in", verifyToken, (req, res) => {
  res.status(200).json({ message: "You are authenticated!" });
});

router.get("/should-be-admin", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });
    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not Authorized!" });
    }
  });

  res.status(200).json({ message: "You are authenticated!" });
});

export default router;
