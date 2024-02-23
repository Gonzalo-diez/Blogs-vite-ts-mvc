import express from "express";
import multer from "multer";
import passport from "../config/passport-jwt-middleware.js";
import userController from "../controllers/userController.js";

const userRouter = express.Router();
const protectWithJWT = passport.authenticate('jwt', { session: false });
userRouter.use("/protected", protectWithJWT);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "avatar");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

userRouter.post("/registro", upload.single("avatar"), userController.register);
userRouter.post("/login", userController.login);
userRouter.put("/protected/editarPerfil/:id", protectWithJWT, upload.single("avatar"), userController.editUserProfile);
userRouter.put("/protected/cambiarContraseña", protectWithJWT, userController.changeUserPassword);
userRouter.get("/detalle/:id", userController.getUserDetail);
userRouter.get("/protected/:id", protectWithJWT, userController.getUserById);
userRouter.get("/protected/blogsCreados/:userId", protectWithJWT, userController.getUserBlogs);
userRouter.get("/protected/logout/:id", protectWithJWT, userController.logout);

export default userRouter;