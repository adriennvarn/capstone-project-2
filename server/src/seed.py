import random
from datetime import datetime
from app import app
from models import *

with app.app_context():
    ## Delete all rows in tables
    print("Deleting rows...")
    # Empty association tables first
    db.session.execute(user_assignments.delete())
    db.session.execute(task_tags.delete())
    db.session.execute(project_tags.delete())

    User.query.delete()
    Project.query.delete()
    Task.query.delete()
    Tag.query.delete()

    # Add user models
    print("Adding users...")
    adrienn = User(name="Adrienn", role="admin", email="adrienn@site.com")
    joe = User(name="Joe", role="manager", email="joe@site.com")
    sally = User(name="Sally", role="user", email="sally@site.com")
    alex = User(name="Alex", role="user", email="alex@site.com")

    users = [adrienn, joe, sally, alex]
    for user in users:
        user.password_hash = "password"

    db.session.add_all(users)
    db.session.commit()

    # Add project models
    print("Adding projects...")
    project1 = Project(
        name="REST API Refactor",
        description="Migrate legacy endpoints to Flask-RESTful with Marshmallow schemas",
        due_date=datetime(2026, 12, 5),
    )
    project2 = Project(
        name="Developer Portfolio",
        description="Build responsive React frontend with interactive project showcases",
        due_date=datetime(2026, 12, 15),
    )
    project3 = Project(
        name="CI/CD Pipeline Automation",
        description="Configure GitHub Actions for automated testing and container builds",
        due_date=datetime(2026, 12, 22),
    )
    project4 = Project(
        name="Task Tracker App",
        description="Full stack productivity application with role-based access control",
        due_date=datetime(2027, 1, 10),
    )
    project5 = Project(
        name="CLI Log Analyzer",
        description="Python command-line utility for parsing and filtering server logs",
        due_date=datetime(2027, 1, 20),
    )

    projects = [project1, project2, project3, project4, project5]
    db.session.add_all(projects)
    db.session.commit()

    # Add task models (3 tasks per project, unique names, valid due dates)
    print("Adding tasks...")
    tasks_by_project = [
        (
            project1,
            [
                Task(
                    name="Define SQLAlchemy Models",
                    description="Create relational models and association tables",
                    due_date=datetime(2026, 11, 25),
                ),
                Task(
                    name="Build Marshmallow Schemas",
                    description="Configure nested serialization and validation rules",
                    due_date=datetime(2026, 11, 30),
                ),
                Task(
                    name="Add JWT Auth Middleware",
                    description="Protect endpoints with HTTP-only cookies and role checks",
                    due_date=datetime(2026, 12, 4),
                ),
            ],
        ),
        (
            project2,
            [
                Task(
                    name="Design Component Wireframes",
                    description="Plan layout structure and responsive breakpoints",
                    due_date=datetime(2026, 12, 2),
                ),
                Task(
                    name="Implement React Router Views",
                    description="Set up dynamic routes and protected navigation guards",
                    due_date=datetime(2026, 12, 9),
                ),
                Task(
                    name="Optimize Asset Bundling",
                    description="Configure Vite build settings and lazy-loaded routes",
                    due_date=datetime(2026, 12, 14),
                ),
            ],
        ),
        (
            project3,
            [
                Task(
                    name="Write Pytest Unit Suite",
                    description="Add test coverage for model validations and API routes",
                    due_date=datetime(2026, 12, 12),
                ),
                Task(
                    name="Create Multi-Stage Dockerfile",
                    description="Package backend and frontend builds into slim images",
                    due_date=datetime(2026, 12, 17),
                ),
                Task(
                    name="Configure Automated Linting",
                    description="Run Flake8 and ESLint checks on every pull request",
                    due_date=datetime(2026, 12, 21),
                ),
            ],
        ),
        (
            project4,
            [
                Task(
                    name="Build Custom Fetch Hooks",
                    description="Handle loading states, error boundaries, and refetching",
                    due_date=datetime(2026, 12, 28),
                ),
                Task(
                    name="Create Tag Filtering UI",
                    description="Allow users to filter projects and tasks by tags",
                    due_date=datetime(2027, 1, 4),
                ),
                Task(
                    name="Implement Role Permissions",
                    description="Restrict admin and manager actions in UI and API",
                    due_date=datetime(2027, 1, 9),
                ),
            ],
        ),
        (
            project5,
            [
                Task(
                    name="Implement Regex Log Parser",
                    description="Extract timestamps, status codes, and tracebacks",
                    due_date=datetime(2027, 1, 8),
                ),
                Task(
                    name="Add JSON Export Flag",
                    description="Format filtered log summaries for downstream scripts",
                    due_date=datetime(2027, 1, 14),
                ),
                Task(
                    name="Package CLI Entrypoint",
                    description="Configure pyproject.toml console scripts and help flags",
                    due_date=datetime(2027, 1, 19),
                ),
            ],
        ),
    ]

    all_tasks = []
    for _, project_tasks in tasks_by_project:
        all_tasks.extend(project_tasks)

    db.session.add_all(all_tasks)
    db.session.commit()

    # Add tag models
    print("Adding tags...")
    tag1 = Tag(name="backend")
    tag2 = Tag(name="frontend")
    tag3 = Tag(name="devops")
    tag4 = Tag(name="testing")
    tag5 = Tag(name="python")

    tags = [tag1, tag2, tag3, tag4, tag5]
    db.session.add_all(tags)
    db.session.commit()

    # Link models
    print("Linking models...")
    for project, project_tasks in tasks_by_project:
        for task in project_tasks:
            project.tasks.append(task)

            # Assign 1 to 3 random users to every task
            assigned_users = random.sample(users, k=random.randint(1, 3))
            for user in assigned_users:
                task.users.append(user)

            # Assign 1 to 2 random tags to every task
            assigned_tags = random.sample(tags, k=random.randint(1, 2))
            for tag in assigned_tags:
                task.tags.append(tag)

        # Assign 1 to 3 random tags to every project
        project_assigned_tags = random.sample(tags, k=random.randint(1, 3))
        for tag in project_assigned_tags:
            project.tags.append(tag)

    db.session.commit()

    print("All done!")
