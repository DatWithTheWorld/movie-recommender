from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80),  nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(120),  nullable=False)