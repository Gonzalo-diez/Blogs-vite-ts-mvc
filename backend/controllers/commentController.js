import mongoose from "mongoose";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import Comment from "../models/comment.js";

const commentController = {
    getCommentById: async (req, res) => {
        const commentId = req.params.id;

        try {
            const commentObjectId = new mongoose.Types.ObjectId(commentId);
            const comment = await Comment.findById(commentObjectId).select("text rating").exec();
            if (!comment) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.json(comment);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    addComment: async (req, res) => {
        const { text, userId, blogId, name } = req.body;
    
        try {
            const blog = await Blog.findById(blogId).exec();
    
            if (!blog) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const newComment = new Comment({
                text,
                user: userId,
                blog: blogId,
                name,
            });
    
            await newComment.save();
    
            return res.json('Comentario agregado');
        } catch (err) {
            console.error('Error al guardar el comentario:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },    

    editComment: async (req, res) => {
        const commentId = req.params.id;
        const { text, userId } = req.body;

        try {
            const user = await User.findById(userId).exec();
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const comment = await Comment.findById(commentId).exec();

            if (!comment) {
                return res.status(404).json({ error: "Comentario no encontrado" });
            }

            if (comment.user.toString() !== userId) {
                return res.status(403).json({ error: "No tienes permisos para editar este producto" });
            }

            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { text, user: userId },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }

            return res.json('Comentario actualizado');
        } catch (err) {
            console.error('Error en la actualización del comentario:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },

    deleteComment: async (req, res) => {
        const commentId = req.params.id;

        try {
            const result = await Comment.deleteOne({ _id: commentId });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Comentario no encontrado' });
            }

            return res.json('Comentario eliminado');
        } catch (err) {
            console.error('Error al eliminar el comentario:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },
}

export default commentController;