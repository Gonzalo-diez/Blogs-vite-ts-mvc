import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card } from 'react-bootstrap';
import { useAuth } from "../Context/authContext";
import Comentario from "./Comentarios/comentarios";

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

interface Comment {
    _id: string;
    text: string;
    user: string;
    blog: string;
    name?: string;
    date: string;
}

interface BlogProps {
    isAuthenticated: boolean;
}

const Blog: React.FC<BlogProps> = ({ isAuthenticated }) => {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const params = useParams<{ id: string }>();
    const id = params.id || null;
    const { userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogRes = await axios.get<Blog>(`http://localhost:8800/blogs/${id}`);
                setBlog(blogRes.data);

                const comentariosRes = await axios.get<Comment[]>(`http://localhost:8800/blogs/comentarios/${id}`);
                setComments(comentariosRes.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBlog();
    }, [id]);

    const handleEliminarComentario = async (commentId: string) => {
        try {
            const token = localStorage.getItem("jwtToken");

            await axios.delete(`http://localhost:8800/comentarios/protected/borrarComentario/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
        }
    };

    return (
        <Container>
            <h1>Blog Details</h1>
            {blog && (
                <Card>
                    <Card.Img variant="top" src={`http://localhost:8800/${blog.image}`} alt={blog.title} />
                    <Card.Body>
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Subtitle>{blog.category}</Card.Subtitle>
                        <Card.Text>{blog.text}</Card.Text>
                    </Card.Body>
                </Card>
            )}
            <Comentario
                comments={comments}
                isAuthenticated={isAuthenticated}
                userId={userId}
                blogId={id}
                handleEliminarComentario={handleEliminarComentario}
                navigate={navigate}
            />
        </Container>
    );
}

export default Blog;