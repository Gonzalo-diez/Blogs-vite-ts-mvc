import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card } from 'react-bootstrap'; 

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

const Blog: React.FC = () => {
    const [blog, setBlog] = useState<Blog | null>(null); 
    const { id } = useParams<{ id: string }>();
    
    useEffect(() => {
        const fetchBlog = async() => {
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

    return(
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
        </Container>
    );
}

export default Blog;
