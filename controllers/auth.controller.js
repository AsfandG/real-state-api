import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

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
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });
    // Generate cookie token
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: "Login successfull " });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successfull!" });
};
