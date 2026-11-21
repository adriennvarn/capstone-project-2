# Project Management

This is a demonstration full-stack productivity application, enabling project management for admins, managers, and team members alike. 
For this demonstration, a user can select their permissions level when signing up. Obviously, in production, this would be restricted. 

### Features
- Simple, functional UI
- Organize projects and the tasks within them, assign users to tasks, and manage due dates.
- Industry standard user authentication (using JWT HTTP-only cookies)
- Data stored on a separate Flask server

### Technologies Used
- Flask
  - SQLAlchemy
  - JWT Authentication
  - Marshmallow
- React
  - Tailwind CSS
  - React Router DOM
- ESLint and Black for formatting and linting

## Installation
Begin by forking and cloning the repo. 
### Server
- Inside the `server` folder, run `pipenv install` and `pipenv shell`
- `cd` to the `src` folder and run `flask db upgrade` to prepare the database, and `python3 seed.py` to seed the database.
- Run `flask run` to initialize the Flask server.
### Client
- Inside the `client` folder, run `npm install`
- Run `npm run dev` to initialize the Vite server.

Once these are complete, the site can be accessed at `http://localhost:5173`

## Future Plans
- Better error handling (more descriptive errors when, for instance, an invalid form entry is submitted)
- Allow users to update their own information (currently, only admins can update users)
- Implement and display task completion
  - Currently, the database already supports marking tasks and whole projects complete, but this isn't integrated into the React application yet
- Responsive UI design
- Ability to search projects and tasks
- User detail pages should list all tasks assigned to that user
