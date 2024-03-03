import mongoose from 'mongoose';
import User from "../models/user.js";
import Comment from "../models/comment.js";
import Blog from "../models/blog.js";

const blogController = {
    getAllBlogs: async (req, res, next) => {
        try {
            const blog = await Blog.find({}).populate({
                path: 'user',
                model: 'User',
            });
            return res.json(blog);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getBlogByCategory: async (req, res, next) => {
        const category = req.params.category;

        try {
            const blog = await Blog.find({ category }).exec();
            return res.json(blog);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getBlogByDetail: async (req, res, next) => {
        const id = req.params.id;
    
        try {
            const blogId = new mongoose.Types.ObjectId(id);
            const blog = await Blog.findOne({ _id: blogId }).exec();
    
            if (!blog) {
                return res.status(404).json({ error: "Blog no encontrado" });
            }
    
            return res.json(blog);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getCommentsByBlog: async (req, res, next) => {
        const blogId = req.params.id;
    
        try {
            const comments = await Comment.find({ blog: blogId }).exec();
            return res.json(comments);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },    
    

    addBlog: async (req, res, next) => {
        const { title, userId, text, category } = req.body;
    
        try {
            const user = await User.findById(userId).exec();
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }
    
            const newBlog = new Blog({
                title,
                category,
                user: userId,
                image: imageName,
                text,
            });
    
            const savedBlog = await newBlog.save();
    
            user.createdBlogs.push(savedBlog);
            await user.save();
    
            return res.json({
                message: "Blog creado!!!",
                Product: newBlog,
            });
        } catch (err) {
            console.error("Error al guardar el Blog:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
    

    updateBlog: async (req, res, next) => {
        const blogId = req.params.id;
        const { title, userId, text } = req.body;

        try {
            const user = await User.findById(userId).exec();
            
            if (!user) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const blog = await Blog.findById(blogId).exec();

            if (!blog) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            if (blog.user.toString() !== userId) {
                return res.status(403).json({ error: "No tienes permisos para editar este producto" });
            }

            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const updatedBlog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    title,
                    image: imageName,
                    user: userId,
                    text,
                },
                { new: true }
            );

            if (!updatedBlog) {
                return res.status(404).json({ error: "Blog no encontrado" });
            }

            return res.json("Blog actualizado!");
        } catch (err) {
            console.error("Error en la actualización:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    deleteBlog: async (req, res, next) => {
        const blogId = req.params.id;

        try {
            const deleteBlog = await Blog.deleteOne({ _id: blogId });

            if (deleteBlog.deletedCount === 0) {
                return res.status(404).json({ error: "Blog no encontrado" });
            }

            return res.json("Blog eliminado!");
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
}

export default blogController;