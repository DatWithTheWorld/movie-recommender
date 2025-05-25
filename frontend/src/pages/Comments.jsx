import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';
import { AuthContext } from '../context/AuthContext';

function Comments() {
  const { movie_id } = useParams();
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Comments for Movie ID: {movie_id}</h1>
      <CommentSection movieId={movie_id} userId={user?.user_id} />
    </div>
  );
}

export default Comments;