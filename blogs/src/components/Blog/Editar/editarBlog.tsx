import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import  io from "socket.io-client";
import { useAuth } from "../../Context/authContext";

interface Blog {
    _id: string;
    title: string;
    text: string;
    category: string;
    image: File | null;
    user: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    };
}

interface Props {
    isAuthenticated: boolean;
}

const EditarBlog: React.FC<Props> = ({ isAuthenticated }) => {
    const { id } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const token = localStorage.getItem("jwtToken");
    const socket = io("http://localhost:8800");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get<Blog>(
                    `http://localhost:8800/Blogs/${id}`
                );
                const blog = response.data;

                if (!blog) {
                    console.error("Blog no encontrado");
                    return;
                }

                setBlog(blog);
                setTitle(blog.title);
                setText(blog.text);
                setCategory(blog.category);
            } catch (error) {
                console.error("Error al obtener el blog:", error);
            }
        };
        fetchBlog();
    }, [id]);

    const handleActualizar = async () => {
        if (!isAuthenticated) {
            console.log("Debes estar autenticado para editar tus blogs.");
            navigate("/usuarios/login");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            formData.append("category", category);
            if (image) {
                formData.append("image", image);
            }
            if (userId) {
                formData.append("userId", userId);
            }

            const response = await axios.put(
                `http://localhost:8800/blogs/protected/editarBlog/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Blog actualizado correctamente:", response);
            socket.emit("blog-editado", response);
            navigate("/");
        } catch (error) {
            console.error("Error en la actualización:", error);
        }
    };

    const handleEditBlogImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="agregar-container">
            <h2>Actualizar blog</h2>
            <Form>
                <Form.Group controlId="title">
                    <Form.Label>Titulo del blog:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Titulo del blog"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="text">
                    <Form.Label>Texto:</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Texto del blog"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="category">
                    <Form.Label>categoria:</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="programacion">programación</option>
                        <option value="vida">vida</option>
                        <option value="libros">libros</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="imagen">
                    <Form.Label>imagen:</Form.Label>
                    <Form.Control
                        type="file"
                        required
                        onChange={handleEditBlogImage}
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={handleActualizar}
                    className="button-link-container"
                >
                    Actualizar
                </Button>
            </Form>
        </div>
    );
};

export default EditarBlog;