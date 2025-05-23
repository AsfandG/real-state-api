import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.route.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = 5000;

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
