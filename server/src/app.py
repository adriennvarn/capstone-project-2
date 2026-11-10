#!/usr/bin/env python3

from flask import request, make_response
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    verify_jwt_in_request,
)
from flask_jwt_extended.exceptions import NoAuthorizationError
from jwt.exceptions import ExpiredSignatureError
from sqlalchemy.exc import IntegrityError

from functools import wraps
from datetime import datetime

from config import create_app, db, api
from models import *

INTEGRITY_ERROR_RESPONSE = {"errors": ["422 Unprocessable Entity"]}, 422
DATE_FORMAT = "%Y-%m-%d"


def role_required(*allowed_roles):
    """Automatically verify role permissions."""

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except NoAuthorizationError:
                return {"errors": ["401 Not Autheticated"]}, 401

            # Get the identity from the token and query the user
            current_user_id = get_jwt_identity()
            current_user = User.query.filter(User.id == current_user_id).first()

            # Check if the user exists and has the allowed roles
            if not current_user or current_user.role not in allowed_roles:
                return {
                    "errors": ["403 Forbidden: Higher permission role required"]
                }, 403

            # If authorized, proceed to the actual resource method
            return fn(*args, **kwargs)

        return wrapper

    return decorator


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
        except IntegrityError:
            return INTEGRITY_ERROR_RESPONSE


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
    """Supports GET, POST, PATCH, DELETE.\n
    GET: Access all projects with optional pagination.
    Optionally, provide an ID to return a specific project."""

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

    @role_required("admin")
    def post(self):
        json = request.get_json()

        project = Project(
            name=json.get("name"),
            description=json.get("description"),
            due_date=datetime.strptime(json.get("due_date"), DATE_FORMAT),
        )

        tags = [Tag.query.filter(Tag.id == id).first() for id in json.get("tag_ids")]
        for tag in tags:
            project.tags.append(tag)
        
        try:
            db.session.add(project)
            db.session.commit()
            return ProjectSchema().dump(project), 201
        except IntegrityError:
            return INTEGRITY_ERROR_RESPONSE
    
    @role_required("admin")
    def patch(self, id):
        json = request.get_json()
        project = Project.query.filter(Project.id == id).first()
        
        project.name = json.get("name") or project.name
        project.description = json.get("description") or project.description
        project.due_date = (
            datetime.strptime(json.get("due_date"), DATE_FORMAT)
            if json.get("due_date")
            else project.due_date
        )
        project.complete = json.get("complete") or project.complete
        
        if json.get("tag_ids"):
            #  Remove existing tags and start fresh
            project.tags = []
            for tag_id in json.get("tag_ids"):
                tag = Tag.query.filter(Tag.id == tag_id).first()
                project.tags.append(tag)
        
        if json.get("task_ids"):
            #  Remove existing tasks and start fresh
            project.tasks = []
            for task_id in json.get("task_ids"):
                task = Task.query.filter(Task.id == task_id).first()
                project.tasks.append(task)
                
        try:
            db.session.commit()
            return ProjectSchema().dump(project), 200
        except IntegrityError:
            return INTEGRITY_ERROR_RESPONSE
    
    @role_required("admin")
    def delete(self, id):
        project = Project.query.filter(Project.id == id).first()
        try:
            db.session.delete(project)
            db.session.commit()
            return {}, 204
        except:
            return {"errors": "500 Internal Server Error: Could not delete Project"}, 500


class Tasks(Resource):
    """Supports GET, POST, PATCH, DELETE.\n
    Manages given task by ID."""

    def get(self, id):
        task = Task.query.filter(Task.id == id).first()
        return TaskSchema().dump(task), 200

    @role_required("manager", "admin")
    def post(self):
        json = request.get_json()

        task = Task(
            name=json.get("name"),
            description=json.get("description"),
            due_date=datetime.strptime(json.get("due_date"), DATE_FORMAT),
        )

        project = Project.query.filter(Project.id == json.get("project_id")).first()
        users = [
            User.query.filter(User.id == id).first() for id in json.get("user_ids")
        ]
        tags = [Tag.query.filter(Tag.id == id).first() for id in json.get("tag_ids")]

        task.project = project
        for user in users:
            task.users.append(user)
        for tag in tags:
            task.tags.append(tag)

        try:
            db.session.add(task)
            db.session.commit()
            return TaskSchema().dump(task), 201
        except IntegrityError:
            return INTEGRITY_ERROR_RESPONSE

    @role_required("manager", "admin")
    def patch(self, id):
        json = request.get_json()
        task = Task.query.filter(Task.id == id).first()
        task.name = json.get("name") or task.name
        task.description = json.get("description") or task.description
        task.due_date = (
            datetime.strptime(json.get("due_date"), DATE_FORMAT)
            if json.get("due_date")
            else task.due_date
        )
        task.complete = json.get("complete") or task.complete

        if json.get("project_id"):
            project = Project.query.filter(Project.id == json.get("project_id")).first()
            task.project = project
        if json.get("user_ids"):
            #  Remove existing users and start fresh, as provided list will include all selected users,
            # not just changed ones.
            task.users = []
            for user_id in json.get("user_ids"):
                user = User.query.filter(User.id == user_id).first()
                task.users.append(user)
        if json.get("tag_ids"):
            #  Remove existing tags and start fresh, as provided list will include all selected users,
            # not just changed ones.
            task.tags = []
            for tag_id in json.get("tag_ids"):
                tag = Tag.query.filter(Tag.id == tag_id).first()
                task.tags.append(tag)

        try:
            db.session.commit()
            return TaskSchema().dump(task), 200
        except IntegrityError:
            return INTEGRITY_ERROR_RESPONSE

    @role_required("manager", "admin")
    def delete(self, id):
        task = Task.query.filter(Task.id == id).first()
        try:
            db.session.delete(task)
            db.session.commit()
            return {}, 204
        except:
            return {"errors": "500 Internal Server Error: Could not delete Task"}, 500


class Users(Resource):
    """GET: Access a list of users.
    Optionally, specify an ID for a specific user."""

    def get(self, id=None):
        if id:
            user = User.query.filter(User.id == id).first()
            return UserSchema().dump(user), 200

        @role_required("admin")
        def all_users():
            users = User.query.all()
            return [UserSchema().dump(user) for user in users]

        return all_users(), 200


api.add_resource(Health, "/health", endpoint="health")
api.add_resource(Signup, "/signup", endpoint="signup")
api.add_resource(Login, "/login", endpoint="login")
api.add_resource(Projects, "/projects", "/projects/<int:id>", endpoint="projecsts")
api.add_resource(Tasks, "/tasks", "/tasks/<int:id>", endpoint="tasks")
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
    if request.endpoint not in open_access_list:
        try:
            verify_jwt_in_request()
        except NoAuthorizationError:
            return {"errors": ["401 Not Autheticated"]}, 401
        except ExpiredSignatureError:
            return {"errors": ["Signature expired, please login again."]}, 401


if __name__ == "__main__":
    app.run(debug=True)
