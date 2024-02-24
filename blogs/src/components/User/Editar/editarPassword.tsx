import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../Context/authContext';
import { useNavigate } from 'react-router-dom';

const EditarPassword: React.FC = () => {
    const { userId } = useAuth();
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleSavePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        try {
            const token = localStorage.getItem("jwtToken");

            const response = await axios.put(`http://localhost:8800/usuarios/protected/cambiarContrasena/${userId}`, {
                oldPassword,
                newPassword,
                confirmPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Respuesta del servidor:', response.data);
            navigate(`/usuarios/protected/${userId}`);

        } catch (error) {
            console.error('Error al guardar cambios de contraseña:', error);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mt-3 mb-4">Cambiar Contraseña</h2>
                    {!passwordsMatch && (
                        <p className="text-danger">Las contraseñas no coinciden. Por favor, inténtalo de nuevo.</p>
                    )}
                    <Form>
                        <Form.Group className="mb-3" controlId="formViejaContrasena">
                            <Form.Label>Vieja Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu vieja contraseña"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formNuevaContrasena">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formConfirmarContrasena">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordsMatch(true);
                                }}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleSavePassword}>
                            Guardar Cambios
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditarPassword;