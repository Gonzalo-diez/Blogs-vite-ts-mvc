import React, { useEffect, useState } from "react"; 
import axios from "axios";

interface Blog {
    _id: string;
    title: string;
    text: string;
    image: string;
    user: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    };
}

const Home: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const blogsResponse = await axios.get<Blog[]>('http://localhost:8800/blogs/');
                setBlogs(blogsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Blog Posts</h1>
            <ul>
                {blogs.map(blog => (
                    <li key={blog._id}>
                        <h2>{blog.title}</h2>
                        <p>{blog.text}</p>
                        <img src={`http://localhost:8800/${blog.image}`} alt={blog.title} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;