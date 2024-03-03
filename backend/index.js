import express from "express";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from "./config/passport-jwt-middleware.js";
import cors from "cors";
import configurePassport from "./config/passport.js";
import routes from "./routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect("mongodb://localhost:27017/blogs", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
    console.log("Conexión a MongoDB exitosa");
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use("/", routes);
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'avatar')));

const PORT = 8800

server.listen(PORT, () => {
    console.log(`Servidor conectado al puerto ${PORT}`);
});

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("comentario-eliminado", (deletedCommentId) => {
        console.log("Comentario eliminado:", deletedCommentId);
        io.emit("comentario-eliminado", deletedCommentId);
    });

    socket.on("comentario-agregado", (newComment) => {
        console.log("Comentario agregado:", newComment);
        io.emit("comentario-agregado", newComment);
    });

    socket.on("comentario-editado", (updatedComment) => {
        console.log("Comentario editado:", updatedComment);
        io.emit("comentario-editado", updatedComment);
    });
})