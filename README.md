Movie Recommender System

A comprehensive movie recommendation system with local trailer support, built with ReactJS, Flask, and PostgreSQL.

Features





Movie search and filtering by title, genre, year



Personalized recommendations using Collaborative Filtering, Content-Based Filtering, and Neural Collaborative Filtering



Local and YouTube trailer playback



User authentication (register, login, logout)



Commenting, favorites, and watch history



Data analytics with charts



Admin panel for trailer management



Responsive design with dark mode

Prerequisites





Node.js (v16+)



Python (3.8+)



Docker



PostgreSQL



Google API Key (optional for YouTube API)

Installation





Clone the repository:

git clone <repository-url>
cd movie-recommender



Download MovieLens dataset:





Download the MovieLens 25M dataset from https://grouplens.org/datasets/movielens/



Extract to backend/data/movielens/



Set up environment variables: Create a .env file in the root directory:

FLASK_ENV=development
DATABASE_URL=postgresql://admin:password@localhost:5432/movie_db
YOUTUBE_API_KEY=your_youtube_api_key
SECRET_KEY=your-secret-key



Install backend dependencies:

cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
pip install -r requirements.txt



Install frontend dependencies:

cd frontend
npm install



Run PostgreSQL with Docker:

docker run -d --name movie-db -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=movie_db postgres



Run the application:





Backend:

cd backend
flask run



Frontend:

cd frontend
npm start



Access the application:





Frontend: http://localhost:3000



Backend API: http://localhost:5000

Usage





Users: Register/login, search movies, view details, add comments, manage favorites, view watch history, and see recommendations.



Admins: Access /trailers to upload/delete local trailers (use .mp4 or .webm files).

Notes





Ensure backend/static/trailers/ has write permissions.



Video files should be <50MB for performance.



YouTube API Key is optional for fallback trailers.