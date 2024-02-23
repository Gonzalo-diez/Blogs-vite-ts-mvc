import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAuth } from "../Context/authContext";

interface User {
    _id: string,
    name: string,
    surname: string,
    email: string,
    password: string,
    avatar: string,
    createdBlogs: {
        _id: string,
        title: string,
        category: string,
        text: string, 
        image: string
    }
}

interface Blog {
    _id: string;
    title: string;
    text: string;
    category: string,
    image: string;
    user: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    };
}

interface UserProps {
    isAuthenticated: boolean;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

const User: React.FC<UserProps> = ({ isAuthenticated, user, setUser }) => {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<{ createdBlogs: Blog[] } | null>(null);

    const serverUrl = "http://localhost:8800";
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${serverUrl}/usuarios/protected/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data && res.data.name) {
                    setUser(res.data);
                } else {
                    console.error("La respuesta del servidor no tiene la estructura esperada:", res.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        const fetchData = async (url: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.data) {
                    setter(res.data);
                } else {
                    console.error("La respuesta del servidor no tiene la estructura esperada:", res.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
        fetchData(`${serverUrl}/usuarios/protected/blogsCreados/${userId}`, setBlogs);
    }, [userId]);

    const handleCambiarPassword = () => {
        navigate(`/usuarios/protected/cambiarContrasena/${userId}`);
    };

    const handlerEditarPerfil = () => {
        navigate(`/usuarios/protected/editarPerfil/${userId}`);
    };

    return (
        <section>
            {isAuthenticated ? (
                <div>
                    <div>
                        <div className="user-card-container">
                            <Card className="user-card">
                                <Card.Body>
                                    <Card.Title>Bienvenido usuario</Card.Title>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>
                                        <strong>Nombre:</strong> {user?.name || "No disponible"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Apellido:</strong> {user?.surname || "No disponible"}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <strong>Avatar:</strong>
                                        <img src={`${serverUrl}/${user?.avatar}`} alt="Avatar" className="user-avatar" />
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Button onClick={handlerEditarPerfil} className="mx-2">Editar Perfil</Button>
                            <Button onClick={handleCambiarPassword} className="mx-2">Cambiar Contraseña</Button>
                        </div>
                    </div>

                    <div className="created-blogs-container">
                        <h3>Blogs Creados:</h3>
                        {blogs && blogs.createdBlogs && blogs.createdBlogs.length > 0 ? (
                            <div>
                                <h4>Los blogs que has creado son:</h4>
                                {blogs.createdBlogs.map((blog) => (
                                    <div key={blog._id}>
                                        <h2>{blog.title}</h2>
                                        <p>{blog.category}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No has creado ni un blog aún.</p>
                        )}

                    </div>
                </div>
            ) : (
                <p>No está registrado o logueado.</p>
            )}
        </section>
    );
}

export default User;