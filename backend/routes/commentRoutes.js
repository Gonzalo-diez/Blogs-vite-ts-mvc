import express from "express";
import passport from "../config/passport-jwt-middleware.js";
import commentController from "../controllers/commentController.js";

const commentRouter = express.Router();
const protectWithJWT = passport.authenticate('jwt', { session: false });
commentRouter.use("/protected", protectWithJWT);

commentRouter.get("/:id", commentController.getCommentById);
commentRouter.post("/protected/agregarComentario", protectWithJWT, commentController.addComment);
commentRouter.put("/protected/editarComentario/:id", protectWithJWT, commentController.editComment);
commentRouter.delete("/protected/borrarComentario/:id", protectWithJWT, commentController.deleteComment);

export default commentRouter;