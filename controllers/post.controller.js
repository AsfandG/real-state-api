import { uploadToCloudinary } from "../helpers/uploadImage.js";
import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get Posts" });
  }
};

export const addPost = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const postData = JSON.parse(req.body.postData);
    const postDetail = JSON.parse(req.body.postDetail);

    const imagePaths = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.path).then((res) => res.url)
      )
    );

    postData.images = imagePaths;

    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add new Post",
      error: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: { username: true, avatar: true },
        },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to get Post" });
  }
};
export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: "Failed to udpate Posts" });
  }
};
export const DeletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Post" });
  }
};
