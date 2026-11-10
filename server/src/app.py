#!/usr/bin/env python3

from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    verify_jwt_in_request,
)
from sqlalchemy.exc import IntegrityError


from config import create_app, db, api
from models import *


class Health(Resource):
    """Server health check route"""

    def get(self):
        response = {"status": "ok"}

        return response, 200


class Signup(Resource):
    """Sign up for an account"""

    def post(self):
        request_json = request.get_json()

        name = request_json.get("name")
        email = request_json.get("email")
        password = request_json.get("password")
        role = request_json.get("role")

        user = User(
            name=name,
            email=email,
            role=role,
        )
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()
            access_token = create_access_token(identity=str(user.id))
            return {"token": access_token, "user": UserSchema().dump(user)}, 201
        except IntegrityError as err:
            print(err)
            return {"errors": ["422 Unprocessable Entity"]}, 422


class Login(Resource):
    """Login route"""

    def post(self):
        request_json = request.get_json()

        email = request_json.get("email")
        password = request_json.get("password")

        user = User.query.filter(User.email == email).first()

        if user and user.authenticate(password):
            token = create_access_token(identity=str(user.id))
            return {"token": token, "user": UserSchema().dump(user)}, 200

        return {"errors": ["401 Unauthorized"]}, 401


class Projects(Resource):
    """GET: Access all projects with optional pagination.
    Optionally, provide an ID to return a specific project.
    POST: Add a new project."""

    def get(self, id=None):
        #  If an ID is provided, return that specific project.
        if id:
            project = Project.query.filter(Project.id == id).first()
            return ProjectSchema().dump(project), 200

        #  Form pagination
        args = request.args
        page = args.get("page", 1, type=int)
        per_page = args.get("per_page", 10, type=int)

        pagination = Project.query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        projects = pagination.items

        # Return information on pagination in addition to items
        response = {
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
            "total_pages": pagination.pages,
            "items": [ProjectSchema().dump(project) for project in projects],
        }

        return response, 200

    def post(self):
        return {"error": "Not yet implemented"}, 500


class Tasks(Resource):
    """Access a given task by ID"""

    def get(self, id):
        task = Task.query.filter(Task.id == id).first()
        return TaskSchema().dump(task), 200


class Users(Resource):
    """GET: Access a list of users.
    Optionally, specify an ID for a specific user."""
    
    def get(self, id=None):
        if id:
            user = User.query.filter(User.id == id).first()
            return UserSchema().dump(user), 200
        
        users = User.query.all()
        return [UserSchema().dump(user) for user in users], 200


api.add_resource(Health, "/health", endpoint="health")
api.add_resource(Signup, "/signup", endpoint="signup")
api.add_resource(Login, "/login", endpoint="login")
api.add_resource(Projects, "/projects", "/projects/<int:id>", endpoint="projecsts")
api.add_resource(Tasks, "/tasks/<int:id>", endpoint="tasks")
api.add_resource(Users, "/users", "/users/<int:id>", endpoint="users")

#  App must be created after api resources are added, as the api.init_app is in create_app
app = create_app()


@app.before_request
def is_logged_in():
    """Verify user is logged in or on an open access page"""
    open_access_list = [
        "signup",
        "login",
        "health",
    ]
    if request.endpoint not in open_access_list and not verify_jwt_in_request():
        return {"errors": ["401 Unauthorized"]}, 401


if __name__ == "__main__":
    app.run(debug=True)
