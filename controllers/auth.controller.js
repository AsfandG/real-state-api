import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  // create new user user and save it to db.

  const newUser = await prisma.user.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(newUser);
};
export const login = (req, res) => {
  res.send({ message: "login" });
};
export const logout = (req, res) => {
  res.send({ message: "logout" });
};
