from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.json.compact = False
    
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    
    return app

db = SQLAlchemy()
migrate = Migrate()
api = Api()