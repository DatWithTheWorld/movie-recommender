from app import db

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    genres = db.Column(db.String(255))
    year = db.Column(db.Integer)
    description = db.Column(db.Text)
    trailer_url = db.Column(db.String(255))
    trailer_local = db.Column(db.String(255))
    director = db.Column(db.String(255))
    actors = db.Column(db.String(255))