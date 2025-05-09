import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/upload-middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, upload.single("avatar"), updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
