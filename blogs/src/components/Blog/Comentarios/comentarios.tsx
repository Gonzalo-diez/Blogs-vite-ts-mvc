import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Pagination, Form } from 'react-bootstrap';
import { IoPencil, IoTrash } from 'react-icons/io5';
import { BiSolidCommentAdd } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import io from "socket.io-client";

interface Comment {
    _id: string;
    text: string;
    user: string;
    blog: string;
    name?: string;
    date: string;
}

interface ComentarioProps {
    isAuthenticated: boolean;
    userId: string | null;
    blogId: string | null;
    navigate: (path: string) => void;
}

const Comentario: React.FC<ComentarioProps> = ({
    isAuthenticated,
    userId,
    navigate,
    blogId,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [comments, setComments] = useState<Comment[]>([]);
    const { id } = useParams<{ id: string }>();
    const [userName, setUserName] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showForm, setShowForm] = useState(true);
    const COMMENTS_PER_PAGE = 3;
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    const displayedComments = comments.slice(startIndex, endIndex);

    const socket = io("http://localhost:8800");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (blogId) {
                    const comentariosRes = await axios.get(`http://localhost:8800/blogs/comentarios/${blogId}`);
                    setComments(comentariosRes.data);
                }
            } catch (err) {
                console.error('Error al obtener comentarios:', err);
            }
        };

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/usuarios/detalle/${userId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Error al obtener los detalles del usuario:', error);
            }
        };

        if (isAuthenticated && userId) {
            fetchUserDetails();
        }

        socket.on("connect", () => {
            console.log("Conexión establecida con el servidor de sockets");
        });

        socket.on('comentario-eliminado', (deletedCommentId: string) => {
            console.log('Comentario eliminado recibido:', deletedCommentId);
            setComments(prevComments => prevComments.filter(comment => comment._id !== deletedCommentId));
        });

        socket.on('comentario-editado', (updatedComment: Comment) => {
            console.log('Comentario editado recibido:', updatedComment);
            setComments(prevComments => [...prevComments, updatedComment]);
        })

        socket.on('comentario-agregado', (newComment: Comment) => {
            console.log('Nuevo comentario agregado recibido:', newComment);
            setComments(prevComments => [...prevComments, newComment]);
        });

        fetchComments();
        return () => {
            socket.off('comentario-eliminado');
            socket.off('comentario-agregado');
            console.log('Socket events cleanup');
        };
    }, [blogId, isAuthenticated, userId]);

    const handleEliminarComentario = async (commentId: string) => {
        try {
            const token = localStorage.getItem("jwtToken");

            await axios.delete(`http://localhost:8800/comentarios/protected/borrarComentario/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            socket.emit("comentario-eliminado", commentId);

            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
        }
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="comentario-container">
            {displayedComments.length === 0 && (
                <p>No hay comentarios aún.</p>
            )}
            {displayedComments.map((comment, index) => (
                <div key={`${comment._id}-${index}`} className="comentario">
                    {comment.name && (
                        <p key={`name-${comment._id}-${index}`}>
                            <strong>{comment.name}:</strong>
                        </p>
                    )}
                    <p key={`text-${comment._id}-${index}`}>{comment.text}</p>
                    <p key={`date-${comment._id}-${index}`}>Fecha: {moment(comment.date).format('lll')}</p>

                    {isAuthenticated && userId === comment.user && (
                        <div className="inicio-link-container" key={`buttons-${comment._id}-${index}`}>
                            <Button variant="warning" onClick={() => navigate(`/comentarios/protected/editarComentario/${comment._id}`)}>
                                <IoPencil />
                            </Button>
                            <Button variant="danger" onClick={() => handleEliminarComentario(comment._id)}>
                                <IoTrash />
                            </Button>
                        </div>
                    )}
                </div>
            ))}
            {comments.length > COMMENTS_PER_PAGE && (
                <div className="pagination-container">
                    <Pagination>
                        {Array.from({ length: Math.ceil(comments.length / COMMENTS_PER_PAGE) }, (_, i) => (
                            <Pagination.Item
                                key={`page-${i + 1}`}
                                active={i + 1 === currentPage}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            )}
            {isAuthenticated && (
                <div className="nuevo-comentario">
                    {isAuthenticated && showForm && (
                        <Form>
                            <Form.Group controlId="nombre">
                                <Form.Label>Tu Nombre:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    value={isAuthenticated ? userName : ''} 
                                    onChange={handleComentarioChange}
                                    required
                                    disabled={isAuthenticated}
                                />
                            </Form.Group>
                            <Form.Group controlId="nuevoComentario">
                                <Form.Label>Deja una opinión:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={handleComentarioChange}
                                    required
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
                </div>
            )}
        </div>
    );
};

export default Comentario;