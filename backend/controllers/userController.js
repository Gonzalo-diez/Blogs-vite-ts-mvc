import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";
import passport from "passport";
import Blog from "../models/blog.js";
import User from "../models/user.js";

const userController = {
    register: async (req, res, next) => {
        const { name, surname, email, password } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const newUser = new User({
                name,
                surname,
                email,
                password,
                avatar: imageName,
            });

            await newUser.save();

            const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '1h' });

            return res.json({
                message: "Usuario registrado!",
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    surname: newUser.surname,
                    email: newUser.email,
                    avatar: newUser.avatar,
                },
                token: token,
            });
        } catch (err) {
            return next(err);
        }
    },

    login: (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

            return res.json({
                message: "Inicio de sesión exitoso",
                user: { _id: user._id, name: user.name, surname: user.surname, email: user.email },
                token: token,
            });
        })(req, res, next);
    },

    getUserDetail: async (req, res) => {
        const id = req.params.id;

        try {
            const userId = new mongoose.Types.ObjectId(id);

            const user = await User.findOne({ _id: userId })
                .select("name surname email avatar")
                .exec();

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            return res.json(user);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getUserById: async (req, res) => {
        const userId = req.params.id;

        try {
            const userIdObject = new mongoose.Types.ObjectId(userId);

            const user = await User.findById(userIdObject).select("name surname email avatar").exec();

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    getUserBlogs: async (req, res) => {
        const userId = req.params.userId; 
    
        try {
            const user = await User.findById(userId).exec();
    
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
    
            const userBlogs = await Blog.find({ user: userId }).exec(); 
    
            return res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    avatar: user.avatar,
                },
                createdBlogs: userBlogs,
            });
        } catch (err) {
            console.error("Error al obtener los blogs del usuario:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },    

    editUserProfile: async (req, res) => {
        const userId = req.params.id;
        const { name, surname, email } = req.body;

        try {
            const imageName = req.file ? req.file.filename : null;

            if (!imageName) {
                return res.status(400).json({ error: 'No se proporcionó una imagen válida' });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, surname, email, avatar: imageName },
                { new: true }
            );

            console.log('Usuario actualizado:', updatedUser);

            if (!updatedUser) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            return res.json("Perfil de usuario actualizado!");
        } catch (err) {
            console.error("Error en la actualización del perfil:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    changeUserPassword: async (req, res) => {
        const userId = req.params.userId;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    oldPassword: oldPassword,
                    password: newPassword,
                    confirmPassword: confirmPassword,
                },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            return res.json("Contraseña de usuario actualizada!");
        } catch (err) {
            console.error("Error en la actualización de la contraseña:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },

    logout: (req, res) => {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ error: "No hay una sesión activa para cerrar" });
            }
            req.logout((err) => {
                if (err) {
                    console.error('Error al cerrar sesión:', err);
                    return res.status(500).json({ error: 'Error al cerrar sesión' });
                }

                res.json({ message: 'Sesión cerrada exitosamente' });
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            res.status(500).json({ error: "Error al cerrar sesión", details: error.message });
        }
    },
}

export default userController;