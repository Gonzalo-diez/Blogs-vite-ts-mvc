import React, { useState } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { IoPencil, IoTrash } from 'react-icons/io5';
import AgregarComentario from './Agregar/agregarComentario';

interface Comment {
    _id: string;
    text: string;
    user: string;
    blog: string;
    name?: string;
    date: string;
}

interface ComentarioProps {
    comments: Comment[];
    isAuthenticated: boolean;
    userId: string | null;
    blogId: string | null;
    handleEliminarComentario: (commentId: string) => void;
    navigate: (path: string) => void;
}

const Comentario: React.FC<ComentarioProps> = ({
    comments,
    isAuthenticated,
    userId,
    handleEliminarComentario,
    navigate,
    blogId,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 3;
    const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
    const endIndex = startIndex + COMMENTS_PER_PAGE;
    const displayedComments = comments.slice(startIndex, endIndex);

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