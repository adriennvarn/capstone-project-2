from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema, fields

from config import db, bcrypt

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    due_date = db.Column(db.DateTime, nullable=False)
    complete = db.Column(db.Boolean, default=False)

    tags = db.relationship("Tag", secondary="project_tags", back_populates="projects")
    tasks = db.relationship(
        "Task", back_populates="project", cascade="all, delete-orphan"
    )


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    due_date = db.Column(db.DateTime, nullable=False)
    complete = db.Column(db.Boolean, default=False)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    project = db.relationship("Project", back_populates="tasks")

    users = db.relationship("User", secondary="user_assignments", back_populates="tasks")
    tags = db.relationship("Tag", secondary="task_tags", back_populates="tasks")


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    role = db.Column(db.String)
    _password_hash = db.Column(db.String)

    tasks = db.relationship("Task", secondary="user_assignments", back_populates="users")

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)

    projects = db.relationship(
        "Project", secondary="project_tags", back_populates="tags"
    )
    tasks = db.relationship("Task", secondary="task_tags", back_populates="tags")


user_assignments = db.Table(
    "user_assignments",
    db.metadata,
    db.Column("user", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("task", db.Integer, db.ForeignKey("tasks.id"), primary_key=True),
)

project_tags = db.Table(
    "project_tags",
    db.metadata,
    db.Column("project", db.Integer, db.ForeignKey("projects.id"), primary_key=True),
    db.Column("tag", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)

task_tags = db.Table(
    "task_tags",
    db.metadata,
    db.Column("task", db.Integer, db.ForeignKey("tasks.id"), primary_key=True),
    db.Column("tag", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)

###########
# Schemas #
###########


class ProjectSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    due_date = fields.DateTime()
    complete = fields.Bool()

    tags = fields.List(fields.Nested(lambda: TagSchema(exclude=("projects", "tasks"))))
    tasks = fields.List(fields.Nested(lambda: TaskSchema(exclude=("tags", "users"))))


class TaskSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    description = fields.Str()
    due_date = fields.DateTime()
    complete = fields.Bool()

    tags = fields.List(fields.Nested(lambda: TagSchema(exclude=("projects", "tasks"))))
    users = fields.List(fields.Nested(lambda: UserSchema(exclude=("tasks",))))


class UserSchema(Schema):
    id = fields.Int()
    name = fields.Str()
    email = fields.Email()
    role = fields.Str()

    tasks = fields.List(fields.Nested(lambda: TaskSchema(exclude=("users", "tags"))))


class TagSchema(Schema):
    id = fields.Int()
    name = fields.Str()

    projects = fields.List(
        fields.Nested(lambda: ProjectSchema(exclude=("tags", "tasks")))
    )
    tasks = fields.List(fields.Nested(lambda: TaskSchema(exclude=("tags",))))
