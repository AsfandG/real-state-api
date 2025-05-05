import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // create new user user and save it to db.

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res.status(200).json({ message: "user created successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create user",
        error: error.message,
      });
  }
};
export const login = (req, res) => {
  res.send({ message: "login" });
};
export const logout = (req, res) => {
  res.send({ message: "logout" });
};
