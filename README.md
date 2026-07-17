# Shareable Notes App
This is my first serious project, a simple but handy notes app I built from scratch. You can jot down notes, come back later to edit them, and organize things however you like. The cool part is you can share any note with other people on the app just by entering their email, and you'll also get a feed of notes that others have decided to share with you.
## Tech Stack

**Frontend:** React, TypeScript, Vite, React Router, Axios

**Backend:** Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt, Zod

## API Endpoints

### Users
- `POST /api/users/register` — Create a new account
- `POST /api/users/login` — Log into your account
- `GET /api/users/me` — Get the currently logged in user
- `POST /api/users/logout` — Log out and clear the session

### Notes
- `GET /api/notes` — Get all your personal notes
- `POST /api/notes` — Create a new note
- `GET /api/notes/:id` — Get a specific note by ID
- `PUT /api/notes/:id` — Edit a note
- `DELETE /api/notes/:id` — Delete a note

### Sharing
- `POST /api/notes/:id/share` — Share a note with another user by email
- `DELETE /api/notes/:id/share/:userId` — Remove someone's access to a shared note
- `GET /api/notes/:id/shares` — See who you've shared a note with
- `GET /api/notes/sharedwithme` — See all notes others have shared with you

## What I Learned

- Basic CRUD operations (create, read, update, delete) for managing notes
- Basic TypeScript across both frontend and backend
- Many-to-many relationships in PostgreSQL for the note sharing system
- Basic CSS styling to build a clean UI
- Handling multiple users with authentication and protected routes
- JWT authentication with HTTP-only cookies for secure sessions
- Input validation using Zod on the backend
