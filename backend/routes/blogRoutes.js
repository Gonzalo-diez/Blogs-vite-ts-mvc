import express from "express";
import multer from "multer";
import passport from "../config/passport-jwt-middleware.js";
import blogController from "../controllers/blogController.js";

const blogRouter = express.Router();
const protectWithJWT = passport.authenticate('jwt', { session: false });
blogRouter.use("/protected", protectWithJWT);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

blogRouter.get("/", blogController.getAllBlogs);
blogRouter.get("/:id", blogController.getBlogByDetail);
blogRouter.get("/comentarios/:id", blogController.getCommentsByBlog);
blogRouter.get("/categoria/:category", blogController.getBlogByCategory);
blogRouter.post("/protected/agregarBlog", protectWithJWT, upload.single("image"), blogController.addBlog);
blogRouter.put("/protected/editarBlog/:id", protectWithJWT, upload.single("image"), blogController.updateBlog);
blogRouter.delete("/protected/borrarBlog/:id", protectWithJWT, blogController.deleteBlog);

export default blogRouter;