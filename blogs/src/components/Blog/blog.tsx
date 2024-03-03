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

interface BlogProps {
    isAuthenticated: boolean;
}

const Blog: React.FC<BlogProps> = ({ isAuthenticated }) => {
    const [blog, setBlog] = useState<Blog | null>(null);
    const params = useParams<{ id: string }>();
    const id = params.id || null;
    const { userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogRes = await axios.get<Blog>(`http://localhost:8800/blogs/${id}`);
                setBlog(blogRes.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchBlog();
    }, [id]);

    return (
        <Container>
            <h1 className="text-center">Blog Details</h1>
            {blog && (
                <Card className="blog-details-container mx-auto">
                    <Card.Img variant="top" src={`http://localhost:8800/${blog.image}`} alt={blog.title} />
                    <Card.Body>
                        <Card.Title>{blog.title}</Card.Title>
                        <Card.Subtitle>{blog.category}</Card.Subtitle>
                        <Card.Text>{blog.text}</Card.Text>
                    </Card.Body>
                </Card>
            )}
            <Comentario
                isAuthenticated={isAuthenticated}
                userId={userId}
                blogId={id}
                navigate={navigate}
            />
        </Container>
    );
}

export default Blog;