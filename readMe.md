## Steps to upload image

1. install cloudinary multer
2. get the cloudinary configuration from cloudinary and store it in the .env file
3. for cloudinary.config use seperate file and export cloudinary from there.
4. create folder named "helper" with file "uploadImage.js" and the following code in it.
   import { cloudinary } from "../utils/cloudinary.js";

const uploadToCloudinary = async (filePath) => {
try {
const res = await cloudinary.uploader.upload(filePath);
return {
url: res.secure_url,
};
} catch (error) {
throw new Error("Error while uploading image");
}
};

export { uploadToCloudinary };

5. As I need to upload user image in update user. so I put the uploadTocloudinary function in the update user api like that:
   "export const updateUser = async (req, res) => {
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
};"

6. Multer is a middleware for handling multipart/form-data, which is primarily used for file uploads in Express.js.

🔍 1. Browsers send images using multipart/form-data
When a user uploads an image from a form (<input type="file">), the browser sends that image in multipart format — which includes binary file data.

Problem:
Express does not understand or parse this multipart/form-data by default.

✅ Solution: Use Multer
Multer parses that incoming multipart/form-data, and gives you access to the file in req.file.

📦 What Multer Ac

📦 What Multer Actually Does
When you use this:

js
Copy
Edit
upload.single("avatar")
Multer:

Parses the form.

Extracts the file (image) from the incoming request.

Saves it (temporarily) on disk (because you used diskStorage).

Makes it available on req.file, so you can send it to Cloudinary

---

7.router.put("/:id", verifyToken, upload.single("avatar"), updateUser);
