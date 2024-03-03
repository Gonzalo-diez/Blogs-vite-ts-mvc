import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../Context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface EditarComentarioProps {
    socket: Socket;
}

const EditarComentario: React.FC<EditarComentarioProps> = ({ socket }) => {
    const { id } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState<string>('');

    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        const fetchComentario = async () => {
            try {
                const response = await axios.get<{ text: string; }>(
                    `http://localhost:8800/comentarios/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const comentario = response.data;
                setNewComment(comentario.text);
            } catch (error) {
                console.error('Error al obtener el comentario:', error);
            }
        };

        fetchComentario();
    }, [id, userId, token]);

    const handleComentarioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(event.target.value);
    };

    const handleActualizarComentario = async () => {
        try {
            const comentarioData = {
                text: newComment,
                userId: userId,
            };

            const response = await axios.put(
                `http://localhost:8800/comentarios/protected/editarComentario/${id}`,
                comentarioData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Datos a enviar', response.data);
            setNewComment('');
            navigate('/');
            socket.emit("comentario-editado", response);
        } catch (error) {
            console.error('Error al actualizar el comentario:', error);
        }
    };

    return (
        <Form>
            <Form.Group controlId="nuevoComentario">
                <Form.Label>Editar Comentario:</Form.Label>
                <Form.Control as="textarea" rows={3} value={newComment} onChange={handleComentarioChange} />
            </Form.Group>
            <Button onClick={handleActualizarComentario} variant="primary" className="mr-2">
                Actualizar Comentario
            </Button>
        </Form>
    );
};

export default EditarComentario;