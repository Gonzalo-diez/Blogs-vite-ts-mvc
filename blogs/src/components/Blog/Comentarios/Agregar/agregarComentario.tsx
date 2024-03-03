import React, { useState, useEffect } from 'react';
import { Button, Form, Toast } from 'react-bootstrap';
import { BiSolidCommentAdd } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";
import { useAuth } from '../../../Context/authContext';

interface Comment {
    _id: string;
    text: string;
    user: string;
    blog: string;
    name?: string;
    date: string;
}

interface AgregarComentarioProps {
    isAuthenticated: boolean;
    userId: string | null;
    blogId: string | null;
}

const AgregarComentario: React.FC<AgregarComentarioProps> = ({
    isAuthenticated,
    blogId,
}) => {
    const { userId } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [userName, setUserName] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showToastComentario, setShowToastComentario] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const socket = io("http://localhost:8800");

    useEffect(() => {
        socket.on('comentario-agregado', (newComment: Comment) => {
            if (newComment.blog === blogId) {
                console.log('Nuevo comentario agregado:', newComment);
                setComments(prevComments => [...prevComments, newComment]);
            }
        });
    })

    const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const handleComentarioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(event.target.value);
    };

    const handleSubmitComentario = async () => {
        if (isAuthenticated) {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    console.error('No se encontró el token de autenticación.');
                    return;
                }
    
                const nuevoComentario = {
                    text: newComment,
                    userId: userId,
                    blogId: id,
                    name: userName,
                };
    
                const response = await axios.post(`http://localhost:8800/comentarios/protected/agregarComentario`, nuevoComentario, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.status === 200) {
                    setNewComment("");
                    setShowToastComentario(true);
                }

                socket.emit("comentario-agregado", nuevoComentario);

                setShowForm(false); 
            } catch (err) {
                console.error('Error al agregar el comentario:', err);
            }
        } else {
            alert("Debes iniciar sesión o registrarte para comentar.");
        }
    };    

    return (
        <div className="nuevo-comentario">
            {isAuthenticated && showForm && (
                <Form>
                    <Form.Group controlId="nombre">
                        <Form.Label>Tu Nombre:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tu nombre"
                            value={userName}
                            onChange={handleNombreChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="nuevoComentario">
                        <Form.Label>Deja una opinión:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newComment}
                            onChange={handleComentarioChange}
                        />
                    </Form.Group>
                    <Button onClick={handleSubmitComentario} variant="primary" className="btn-comentario">
                        <BiSolidCommentAdd /> Comentario
                    </Button>
                </Form>
            )}
            {!isAuthenticated && (
                <p>Debes iniciar sesión para dejar un comentario.</p>
            )}
            <Toast
                show={showToastComentario}
                onClose={() => setShowToastComentario(false)}
                delay={3000}
                autohide
                bg="success"
                className="text-white"
            >
                <Toast.Header>
                    <strong className="mr-auto">Comentario agregado</strong>
                </Toast.Header>
                <Toast.Body>Tu comentario se agregó.</Toast.Body>
            </Toast>
        </div>
    );
};

export default AgregarComentario;