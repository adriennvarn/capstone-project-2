from datetime import datetime
from app import app
from models import *

with app.app_context():
    ##  Delete all rows in tables
    print("Deleting rows...")
    # Empty association tables first
    db.session.execute(user_assignments.delete())
    db.session.execute(task_tags.delete())
    db.session.execute(project_tags.delete())
    
    User.query.delete()
    Project.query.delete()
    Task.query.delete()
    Tag.query.delete()

    #  Add user models
    print("Adding users...")
    sally = User(name="Sally", role="user", email="sally@site.com")
    joe = User(name="Joe", role="manager", email="joe@site.com")
    adrienn = User(name="Adrienn", role="admin", email="adrienn@site.com")
    
    sally.password_hash = "password"
    joe.password_hash = "password"
    adrienn.password_hash = "password"
    
    db.session.add_all([sally, joe, adrienn])
    db.session.commit()

    #  Add project models
    print("Adding projects...")
    project1 = Project(
        name="Capstone Part 2",
        description="Full stack productivity application",
        due_date=datetime(2026, 11, 21),
    )
    project2 = Project(
        name="Portfolio Site",
        description="Complete work on frontend portfolio site",
        due_date=datetime(2026, 12, 31),
    )
    db.session.add_all([project1, project2])
    db.session.commit()

    #  Add task models
    print("Adding tasks...")
    task1 = Task(name="Models", due_date=datetime(2026, 11, 10))
    task2 = Task(name="API", due_date=datetime(2026, 11, 12))
    task3 = Task(name="Better UI", due_date=datetime(2026, 12, 31))
    db.session.add_all([task1, task2, task3])
    db.session.commit()
    
    #  Add tag models
    print("Adding tags...")
    tag1 = Tag(name="coding")
    tag2 = Tag(name="design")
    tag3 = Tag(name="marketing")
    db.session.add_all([tag1, tag2, tag3])
    db.session.commit()
    
    #  Link models
    print("Linking models...")
    task1.users.append(sally)
    task2.users.append(joe)
    task2.users.append(adrienn)
    task3.users.append(joe)
    task3.users.append(sally)
    
    project1.tasks.append(task1)
    project1.tasks.append(task2)
    project2.tasks.append(task3)
    
    project1.tags.append(tag1)
    project1.tags.append(tag2)
    project1.tags.append(tag3)
    project2.tags.append(tag3)
    
    task1.tags.append(tag1)
    task1.tags.append(tag2)
    task2.tags.append(tag1)
    task3.tags.append(tag2)
    task3.tags.append(tag3)
    
    db.session.commit()
    
    print("All done!")