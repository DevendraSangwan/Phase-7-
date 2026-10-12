# CollabSphere

CollabSphere is a team collaboration workspace for creating projects, sharing work with teammates, keeping project notes and files together, and using AI to explain code or generate project documentation.

## Features

- Register and log in with a user account.
- Create, update, and delete projects.
- Add and remove project members.
- Write, edit, and delete project notes, including Markdown content.
- Upload, view, download, and delete project files. Uploads are limited to 10 MB and are stored with Cloudinary.
- Use AI tools to explain code, generate documentation, generate a README, and generate code.
- Switch between light and dark themes.
- View project information and collaborate from the project dashboard.

## Tech stack

- **Frontend:** React 19, Vite, React Router, Axios
- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens
- **File storage:** Cloudinary
- **AI:** Google Gemini API

## Repository layout

```text
.
├── Backend/
│   ├── config/          # MongoDB, Cloudinary, and Gemini setup
│   ├── controllers/     # API request handlers
│   ├── middleware/      # Authentication, uploads, and error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # Express API routes
│   ├── app.js
│   ├── server.js
│   └── seed.js          # Optional demo-data seeder
└── Frontend/
    └── src/
        ├── api/         # API clients
        ├── components/  # Shared UI components
        ├── pages/       # Login, register, dashboard, and project pages
        └── styles/      # Application styles
```

## Requirements

- Node.js and npm
- A MongoDB connection string (local MongoDB or MongoDB Atlas)
- A Cloudinary account for file uploads
- A Google Gemini API key for AI features

## Configuration

Create `Backend/.env`:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/collabsphere
JWT_SECRET=replace-with-a-long-random-secret

# Required for file uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Required for AI features
GEMINI_API_KEY=your-gemini-api-key
```

Create `Frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Keep secret values in local environment files; do not commit them. The frontend API URL should include the `/api` prefix.

## Install and run

Install dependencies in each application directory:

```bash
cd Backend
npm install
```

In a second terminal:

```bash
cd Frontend
npm install
```

Start the API server from `Backend/`:

```bash
npm run dev
```

Start the Vite development server from `Frontend/`:

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The backend listens on port `5000` by default, or on the port set in `Backend/.env`.

## Available scripts

### Backend (`cd Backend`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |
| `npm run seed` | Clear application collections and insert demo data |

### Frontend (`cd Frontend`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

> **Warning:** `npm run seed` deletes all existing users, projects, notes, and file records in the configured database before it creates demo records. Only run it against a database that can safely be reset.

## API overview

All API routes are mounted under `/api`. Authenticated endpoints expect a bearer JWT in the `Authorization` header.

| Base path | Operations |
| --- | --- |
| `/api/auth` | `POST /register`, `POST /login` |
| `/api/projects` | List and create projects; retrieve, update, or delete a project; add or remove members |
| `/api/notes` | Create notes; list by project; update or delete a note |
| `/api/files` | Upload a file; list files by project; delete a file |
| `/api/gemini` | Explain code; generate documentation, a README, or code |
| `/api/admin` | Data-listing and database-statistics endpoints |

Project membership and ownership permissions apply to project operations. File uploads use multipart form data with the file field named `file` and are limited to 10 MB.

## Troubleshooting

- **Database connection fails:** Check that MongoDB is running and `MONGO_URI` is correct.
- **Login or authenticated requests fail:** Confirm `JWT_SECRET` is set and that the frontend points to the correct `VITE_API_URL`.
- **File uploads fail:** Verify all three Cloudinary environment variables and stay within the 10 MB upload limit.
- **AI requests fail:** Verify `GEMINI_API_KEY` and check the backend logs for provider errors.
- **Frontend API requests fail:** Restart Vite after changing `Frontend/.env`; Vite reads environment variables when it starts.
