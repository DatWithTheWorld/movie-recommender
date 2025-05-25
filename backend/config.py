import os
from dotenv import load_dotenv
load_dotenv()
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
    SECRET_KEY = os.getenv('SECRET_KEY', '9bccde9c93d30a1a2864ce53cbc21530')
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static/trailers')
