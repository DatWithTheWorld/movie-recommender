from flask import Blueprint, jsonify, request
from app import db
from models.user import User
from models.role import Role
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print("Received data:", data)  # In ra dữ liệu client gửi lên

        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password or not email:
            return jsonify({'error': 'Missing required fields'}), 400

        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()

        if existing_user:
            print("User already exists:", existing_user)
            return jsonify({'message': 'User already registered'}), 200

        hashed_password = generate_password_hash(password)
        user = User(username=username, password=hashed_password, email=email)
        db.session.add(user)
        db.session.commit()

        role = Role(name='user', user_id=user.id)
        db.session.add(role)
        db.session.commit()

        return jsonify({'message': 'User registered'}), 201

    except Exception as e:
        print("Error:", str(e))  # In ra lỗi
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing credentials'}), 400

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        role = Role.query.filter_by(user_id=user.id).first()
        return jsonify({
            'user_id': user.id,
            'username': user.username,
            'role': role.name if role else 'user'
        }), 200

    return jsonify({'error': 'Invalid credentials'}), 401
