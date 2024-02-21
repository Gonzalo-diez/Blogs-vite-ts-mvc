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
const io = new Server(server);
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
app.use(cors());
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

io.on("connection", (socket) => {
    console.log("Nuevo cliente se ha conectado");

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    })
})

const PORT = 8800

server.listen(PORT, () => {
    console.log(`Servidor y WebSocket conectados en el puerto ${PORT}`);
});