import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";

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

interface Props {
  isAuthenticated: boolean;
}

const BorrarBlog: React.FC<Props> = ({ isAuthenticated }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalleBlog = async () => {
      try {
        const { data: datosBlog } = await axios.get<Blog>(
          `http://localhost:8800/blogs/detalle/${id}`
        );
        setBlog(datosBlog);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };
    fetchDetalleBlog();
  }, [id]);

  const handleEliminar = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");

      await axios.delete(`http://localhost:8800/productos/protected/borrarBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleCancelar = () => {
    navigate(`/blogs/${id}`);
  };

  return (
    <Container className="text-center">
      <h2>Eliminar Producto</h2>
      <p>¿Estás seguro de que deseas eliminar este producto?</p>
      {blog && (
        <div className="eliminar-container">
          <h2>{blog.title}</h2>
          <p>{blog.category}</p>
        </div>
      )}
      <Button variant="danger" onClick={handleEliminar} className="m-2">
        Sí, eliminar
      </Button>
      <Button variant="secondary" onClick={handleCancelar}>
        No, cancelar
      </Button>
    </Container>
  );
};

export default BorrarBlog;
