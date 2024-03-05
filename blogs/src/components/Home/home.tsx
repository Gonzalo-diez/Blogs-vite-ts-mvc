import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import { IoTrash, IoPencil } from "react-icons/io5";
import io from "socket.io-client";
import { useAuth } from "../Context/authContext";

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

interface HomeProps {
    isAuthenticated: boolean;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated }) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const navigate = useNavigate();
    const { userId } = useAuth();

    const token = localStorage.getItem("jwtToken");
    const socket = io("http://localhost:8800");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const blogsResponse = await axios.get<Blog[]>('http://localhost:8800/blogs/');
                setBlogs(blogsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        socket.on("connect", () => {
            console.log("Conexión establecida con el servidor de sockets");
        });

        socket.on('blog-eliminado', (deleteBlogId: string) => {
            console.log('Blog eliminado recibido:', deleteBlogId);
            setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== deleteBlogId));
        });

        socket.on('blog-editado', (updatedBlog: Blog) => {
            console.log('Blog editado recibido:', updatedBlog);
            setBlogs(prevBlogs => [...prevBlogs, updatedBlog]);
        });

        socket.on('blog-agregado', (newBlog: Blog) => {
            console.log('Nuevo blog agregado recibido:', newBlog);
            setBlogs(prevBlogs => [...prevBlogs, newBlog]);
        });

        fetchData();
    }, []);

    const handleEliminarBlog = async (blogId: string) => {
        try {
            navigate(`/blogs/protected/borrarBlog/${blogId}`);
        } catch (err: any) {
            console.log(err.message);
        }
    };

    const handleAgregarBlog = () => {
        navigate('/blogs/protected/agregarBlog');
    };

    return (
        <>
            <main className="home-container">
                <Container>
                    <Row>
                        <Col>
                            <section>
                                <h2>Bienvenido a este proyecto de creación, edición y borrrado de blogs</h2>
                            </section>
                        </Col>
                    </Row>
                    <Row>
                        {isAuthenticated && token ? (
                            <Button variant="primary" onClick={handleAgregarBlog}>
                                Agregar blog
                            </Button>
                        ) : (
                            <Col>
                                <h3>
                                    Si quieres probar las funciones de agregar y borrar blogs,
                                    créate una cuenta.
                                </h3>
                                <div className="cta-buttons">
                                    <Link to="/usuarios/login" className="btn btn-primary">
                                        Login
                                    </Link>
                                    <Link to="/usuarios/registro" className="btn btn-outline-primary">
                                        Registro
                                    </Link>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </main>
            <Container>
                <h1 className="text-center">Blog Posts</h1>
                <Row>
                    {blogs.map(blog => (
                        <Col key={blog._id} xs={12} md={6} lg={4}>
                            <Card className="mb-4">
                                <Card.Img variant="top" src={`http://localhost:8800/${blog.image}`} alt={blog.title} />
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Subtitle>{blog.category}</Card.Subtitle>
                                    <Card.Text>{blog.text}</Card.Text>
                                </Card.Body>
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" onClick={() => navigate(`/blogs/${blog._id}`)}>Ver más</Button>
                                    {isAuthenticated && userId && userId === blog.user._id && (
                                        <div className="inicio-link-container">
                                            <Button variant="warning" onClick={() => navigate(`/blogs/protected/editarBlog/${blog._id}`)} className="mx-2"><IoPencil /></Button>
                                            <Button variant="danger" onClick={() => handleEliminarBlog(blog._id)} className="mx-2"><IoTrash /></Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default Home;