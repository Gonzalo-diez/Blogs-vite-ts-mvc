import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

interface User {
  _id: string;
}

interface Props {
  isAuthenticated: boolean;
  user: User | null;
}

const AgregarBlog: React.FC<Props> = ({ isAuthenticated, user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null); 
  const [category, setCategory] = useState("");

  const userId = user ? user._id : null;
  const token = localStorage.getItem("jwtToken");

  const handleAgregar = async () => {
    if (!isAuthenticated) {
      console.log("Debes estar autenticado para agregar productos.");
      navigate("/login");
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

      const response = await axios.post(
        "http://localhost:8800/blogs/protected/agregarBlog",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message);

      navigate("/");
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleSaveImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { 
      setImage(e.target.files[0]); 
    }
  };

  return (
    <div className="agregar-container">
      <h2>Agregar blog</h2>
      <Form>
        <Form.Group controlId="title">
          <Form.Label>Titulo:</Form.Label>
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
        <Form.Group controlId="image">
          <Form.Label>Imagen:</Form.Label>
          <Form.Control type="file" onChange={handleSaveImage} />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>categoria:</Form.Label>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>---</option>
            <option value="programacion">programación</option>
            <option value="vida">vida</option>
            <option value="libros">libros</option>
          </Form.Select>
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleAgregar}
          className="button-link-container"
        >
          Agregar producto
        </Button>
      </Form>
    </div>
  );
};

export default AgregarBlog;
