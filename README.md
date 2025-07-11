# Movie Management App

## Features

- 🔐 User authentication (login/register)
- 🎬 Movie management (add, view, delete)
- 🔍 Search by Actor and Title
- 📂 Import movies from text files

## Tech Stack

- React 19, TypeScript, Redux Toolkit
- CSS Modules, Vite, Axios

## Quick Start

### Run with Docker (recommended)

```bash
docker run --name movies -p 3000:3000 -e API_URL=http://localhost:8000/api/v1 yuriiflys/movies
```

App will be available at `http://localhost:3000`

### Local Development

```bash
# Clone repository
git clone https://github.com/yuriiflys/movie-management-app.git
cd movie-management-app

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with correct API_URL

# Start development server
npm run dev
```

## API Configuration

Set your API URL via environment variable:

```bash
# In .env file
VITE_API_URL=http://192.168.1.44:8000/api/v1

# Or when running Docker
docker run -e API_URL=http://192.168.1.44:8000/api/v1 yuriiflys/movies
```

## Docker Commands

```bash
# Build image
docker build -t movie-app .

# Run container
docker run -d --name movies -p 3000:3000 -e API_URL=your-api-url movie-app

# View logs
docker logs movies

# Stop container
docker stop movies
```

## Movie Import Format

Upload `.txt` file with format:

```
Title: Movie Name
Release Year: 2023
Format: DVD
Stars: Actor 1, Actor 2

Title: Another Movie
Release Year: 2022
Format: Blu-Ray
Stars: Actor 3, Actor 4
```

Supported formats: VHS, DVD, Blu-Ray

## API Endpoints

App expects backend API with the following endpoints:

- `POST /sessions` - User login
- `POST /users` - User registration
- `GET /movies` - Get movies list
- `POST /movies` - Create movie
- `GET /movies/:id` - Get movie by ID
- `DELETE /movies/:id` - Delete movie
- `POST /movies/import` - Import movies
