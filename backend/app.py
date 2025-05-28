from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
import os
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Tạo thư mục lưu trailer nếu chưa tồn tại
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Import routes sau khi đã tạo app và db
from routes import auth, movies, recommendations, comments, favorites, history, analytics, trailers
from routes.chatbot import chatbot_bp

# Đăng ký các blueprints
app.register_blueprint(auth.bp)
app.register_blueprint(movies.bp)
app.register_blueprint(recommendations.bp)
app.register_blueprint(comments.bp)
app.register_blueprint(favorites.bp)
app.register_blueprint(history.bp)
app.register_blueprint(analytics.bp)
app.register_blueprint(trailers.bp)
app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)