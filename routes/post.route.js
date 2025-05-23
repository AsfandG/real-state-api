import express from "express";

import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/upload-middleware.js";
import {
  addPost,
  DeletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", verifyToken, upload.array("images", 6), addPost);
router.get("/:id", getPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, DeletePost);

export default router;
