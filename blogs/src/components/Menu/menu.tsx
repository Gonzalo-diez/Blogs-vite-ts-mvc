import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../Context/authContext';
import axios from "axios";

interface MenuProps {
    isAuthenticated: boolean;
    user: {
        avatar: string;
    } | null;
}

const Menu: React.FC<MenuProps> = ({ isAuthenticated, user }) => {
    const { userId } = useAuth();
    const navigate = useNavigate();

    const serverUrl = "http://localhost:8800";
    const token = localStorage.getItem("jwtToken");

    const handleLogOut = async () => {
        try {
            if (!token) {
                console.warn('Token no disponible');
                navigate('/', { replace: true });
                return;
            }

            await axios.get(`${serverUrl}/usuarios/protected/logout/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            localStorage.removeItem('jwtToken');
            console.log('Token eliminado correctamente');
            navigate('/', { replace: true });
        } catch (err) {
            console.error('Error en cerrar sesión:', err);
        }
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary mb-0">
            <Container>
                <Navbar.Brand as={Link} to="/">Blogs</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isAuthenticated && token ? (
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/blogs/categoria/programacion">programacion</Nav.Link>
                            <Nav.Link as={Link} to="/blogs/categoria/vida">vida</Nav.Link>
                            <Nav.Link as={Link} to="/blogs/categoria/libros">libros</Nav.Link>
                            <NavDropdown
                                title={<img src={`${serverUrl}/${user?.avatar}`} className="avatar" />}
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item as={Link} to={`/usuarios/protected/${userId}`}>Perfil</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={`/usuarios/protected/editarPerfil/${userId}`}>Ajustes</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogOut}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ) : (
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/blogs/categoria/programacion">programacion</Nav.Link>
                            <Nav.Link as={Link} to="/blogs/categoria/vida">vida</Nav.Link>
                            <Nav.Link as={Link} to="/blogs/categoria/libros">libros</Nav.Link>
                            <Nav.Link as={Link} to="/usuarios/login"><FaUser /></Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Menu;