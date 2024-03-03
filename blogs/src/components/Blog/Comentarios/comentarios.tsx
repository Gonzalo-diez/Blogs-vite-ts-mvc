import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Pagination } from 'react-bootstrap';
import { IoPencil, IoTrash } from 'react-icons/io5';
import AgregarComentario from './Agregar/agregarComentario';
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
    const COMMENTS_PER_PAGE = 3;
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    const displayedComments = comments.slice(startIndex, endIndex);

    const socket = io("http://localhost:8800");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const comentariosRes = await axios.get(`http://localhost:8800/blogs/comentarios/${blogId}`);
                setComments(comentariosRes.data);
            } catch (err) {
                console.error('Error al obtener comentarios:', err);
            }
        };

        socket.on("connection", () => {
            console.log("Conexión establecida con el servidor de sockets");
        });

        socket.on('comentario-agregado', (newComment: Comment) => {
            if (newComment.blog === blogId) {
                console.log('Nuevo comentario agregado:', newComment);
                setComments(prevComments => [...prevComments, newComment]);
            }
        });
    
        socket.on('comentario-editado', (nuevoComentario: Comment) => {
            if (nuevoComentario.blog === blogId) {
                console.log('Comentario actualizado:', nuevoComentario);
                setComments(prevComments => [...prevComments, nuevoComentario]);
            }
        });
    
        socket.on('comentario-eliminado', (deletedCommentId: string) => {
            console.log('Comentario eliminado:', deletedCommentId);
            setComments(prevComments => prevComments.filter(comment => comment._id !== deletedCommentId));
        });        
        
        fetchComments();

        return () => {
            socket.disconnect(); 
        };
    }, [blogId]);

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="comentario-container">
            {displayedComments.length === 0 && (
                <p>No hay comentarios aún.</p>
            )}
            {displayedComments.map(comment => (
                <div key={comment._id} className="comentario">
                    {comment.name && (
                        <p>
                            <strong>{comment.name}:</strong>
                        </p>
                    )}
                    <p>{comment.text}</p>
                    <p>Fecha: {new Date(comment.date).toLocaleString()}</p>
                    {isAuthenticated && userId === comment.user && (
                        <div className="inicio-link-container">
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
                                key={i + 1}
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
                <AgregarComentario
                    isAuthenticated={isAuthenticated}
                    userId={userId}
                    blogId={blogId}
                />
            )}
        </div>
    );
};

export default Comentario;