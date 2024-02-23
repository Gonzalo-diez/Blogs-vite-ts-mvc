import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { useAuth } from "../Context/authContext";

const Registro: React.FC<{ setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; setUser: React.Dispatch<React.SetStateAction<any>>; }> = ({ setIsAuthenticated, setUser }) => {
  const { setAuthenticatedUserId } = useAuth();
  const [avatar, setAvatar] = useState<File | string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);

      const res = await axios.post("http://localhost:8800/usuarios/registro", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      if (res.status === 200) {
        const token = res.data.token;
        
        localStorage.setItem("jwtToken", token);
        setUser(res.data.user);
        setAuthenticatedUserId(res.data.user._id);
        setIsAuthenticated(true);
        navigate(`/usuarios/protected/${res.data.user._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  }

  return (
    <div className="form-container">
      <h2>Registro de usuario</h2>
      <Form onSubmit={handleRegistro}>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="apellido">
          <Form.Label>Apellido:</Form.Label>
          <Form.Control
            type="text"
            value={surname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="correoElectronico">
          <Form.Label>Correo Electrónico:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="contrasena">
          <Form.Label>Contraseña:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <Form.Control 
            type="file"
            onChange={handleSaveAvatar} 
          />
        </Form.Group>
        <div className="button-link-container">
          <Button variant="primary" type="submit">
            Registro
          </Button>
          <Link to="/usuarios/login">Login</Link>
        </div>
      </Form>
    </div>
  );
};

export default Registro;