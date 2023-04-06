import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { useService } from '../../hooks/useService';
import { gameServiceFactory } from '../../services/gameService';
import { commentServiceFactory } from '../../services/commentService';
import { useAuthContext } from '../../contexts/AuthContext';

import { AddComment } from './AddComment/AddComment';


export const GameDetails = ({
    setDeletedGame,
}) => {
    const { gameId } = useParams();
    const { userId, isAuthenticated, email } = useAuthContext();
    const [game, setGame] = useState({});
    const gameService = useService(gameServiceFactory);
    const commentService = useService(commentServiceFactory);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            gameService.getOne(gameId),
            commentService.getAll(gameId),
        ]).then(([gameData, comments]) => {
                setGame({
                    ...gameData,
                    comments,
                });
            });
        // gameService.getOne(gameId)
        //     .then(result => {
        //         setGame(result);
        //         // return commentSevice.getAll(gameId);
        //     })
        // // .then(result => {
        // //     setCommnets(result);
        // // });
    }, [gameId]);

    const onCommentSubmit = async (values) => {
        const response = await commentService.create(gameId, values.comment);

        setGame(state => ({
            ...state,
            comments: [
                ...state.comments, 
                {
                    ...response,
                    author: {
                        email,
                    }
                }
            ]
        }));
    };

    const isOwner = game._ownerId === userId;

    const onDeleteClick = async () => {
        await gameService.delete(game._id);

        setDeletedGame(game);

        navigate('/catalog');
    };

    return (
        <section id="game-details">
            <h1>Game Details</h1>
            <div className="info-section">

                <div className="game-header">
                    <img className="game-img" src={game.imageUrl} />
                    <h1>{game.title}</h1>
                    <span className="levels">MaxLevel: {game.maxLevel}</span>
                    <p className="type">{game.category}</p>
                </div>

                <p className="text">
                    {game.summary}
                </p>

                <div className="details-comments">
                    <h2>Comments:</h2>
                    <ul>
                        {game.comments && game.comments.map(comment => (
                            <li key={comment._id} className="comment">
                                <p>{comment.author.email}: {comment.comment}</p>
                            </li>
                        ))}
                    </ul>
                    {!game.comments?.length && (
                        <p className="no-comment">No comments.</p>
                    )}
                </div>

                {isOwner && (
                    <div className="buttons">
                        <Link to="./edit" className="button">Edit</Link>
                        <button className="button" onClick={onDeleteClick}>Delete</button>
                    </div>
                )}
            </div>

            {isAuthenticated && <AddComment onCommentSubmit={onCommentSubmit} />}
        </section>
    );
};