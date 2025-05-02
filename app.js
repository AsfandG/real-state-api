import express from "express";
import authRoutes from "./routes/auth.routes.js";

const port = 5000;

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
