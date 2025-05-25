import { useState, useEffect } from 'react';
import axios from 'axios';

function CommentSection({ movieId, userId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/comments/${movieId}`)
      .then(response => setComments(response.data))
      .catch(error => console.error(error));
  }, [movieId]);

  const handleAddComment = () => {
    axios.post('http://localhost:5000/comments', {
      user_id: userId,
      movie_id: movieId,
      content: newComment
    })
      .then(() => {
        setNewComment('');
        axios.get(`http://localhost:5000/comments/${movieId}`)
          .then(response => setComments(response.data));
      })
      .catch(error => console.error(error));
  };

  const handleDeleteComment = (id) => {
    axios.delete(`http://localhost:5000/comments/${id}`)
      .then(() => {
        setComments(comments.filter(c => c.id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Comments</h3>
      {userId ? (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded dark:bg-dark-card dark:text-white"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Post Comment
          </button>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">Please log in to comment.</p>
      )}
      <div className="mt-4 space-y-2">
        {comments.map(comment => (
          <div key={comment.id} className="p-2 border rounded dark:bg-dark-card dark:text-white">
            <p>{comment.content}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
            {comment.user_id === userId && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;