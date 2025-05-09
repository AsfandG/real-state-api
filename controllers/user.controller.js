import { uploadToCloudinary } from "../helpers/uploadImage.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
  try {
  } catch (error) {
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.status(200).json(user);
  try {
  } catch (error) {
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authenticated!" });
  }

  let updatedPassword = null;
  let avatarUrl = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      avatarUrl = result.url;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authenticated!" });
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user!" });
  }
};
