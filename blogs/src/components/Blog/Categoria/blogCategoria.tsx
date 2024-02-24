import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Pagination } from 'react-bootstrap';

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

const BlogCategoria: React.FC = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const serverUrl = "http://localhost:8800";

    useEffect(() => {
        const fetchBlogsByCategory = async () => {
            try {
                const res = await axios.get<Blog[]>(`http://localhost:8800/blogs/categoria/${category}`);
                setBlogs(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBlogsByCategory();
    }, [category]);

    const blogsPerPage: number = 6;
    const indexOfLastBlog: number = currentPage * blogsPerPage;
    const indexOfFirstBlog: number = indexOfLastBlog - blogsPerPage;
    const currentBlogs: Blog[] = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (currentBlogs.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center alert">
                <p>No hay blogs de esta categoría.</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column align-items-center min-vh-100">
            {currentBlogs.map((item: Blog) => (
                <Card key={item._id} className="mb-4">
                    <Card.Img variant="top" src={`${serverUrl}/${item.image}`} alt={item.title} />
                    <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Subtitle>{item.category}</Card.Subtitle>
                        <Card.Text>{item.text}</Card.Text>
                        <Button onClick={() => navigate(`/productos/detalle/${item._id}`)}>Ver más</Button>
                    </Card.Body>
                </Card>
            ))}
            <Pagination className="mt-3">
                {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }).map((_, index: number) => (
                    <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}

export default BlogCategoria;