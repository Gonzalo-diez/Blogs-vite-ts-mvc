import express from "express";
import userRouter from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import commentRouter from "./routes/commentRoutes.js";

const router = express.Router();

router.use("/usuarios", userRouter);
router.use("/blogs", blogRouter);
router.use("/comentarios", commentRouter);

export default router;