# Movie Explorer App

## Overview
Movie Explorer is a comprehensive web application that allows users to search for movies, view details, and discover trending films. The app fetches real-time data from TMDb API to display information about movies.

## Features

### User Interface
- **User Authentication**: Login and registration functionality
- **Search Bar**: Find movies by title
- **Movie Grid**: Display movie posters with title, release year, and rating
- **Detailed View**: Get comprehensive information about selected movies
- **Trending Movies**: Discover popular movies
- **Light/Dark Mode**: Toggle between light and dark themes for better user experience

### API Integration
- Integration with The Movie Database (TMDb) API for:
  - Trending movies
  - Movie search results
  - Movie details (title, poster, description, rating, genres, etc.)
- Error handling with user-friendly messages

### State Management
- React Context API for global state management
- Persistence of last searched movie in local storage
- Favorite movies storage for registered users

### Bonus Features
- **Filter Movies**: By genre, year, or rating
- **YouTube Trailers**: Watch movie trailers directly in the app
- **"Load More" Button**: Alternative to pagination for loading additional results

## Tech Stack
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **API**: TMDb (The Movie Database) API

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   MOVIE_API_KEY=your_tmdb_api_key
   MOVIE_API_BASE_URL=https://api.themoviedb.org/3
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Replace placeholders with your actual values.
5. Build and start the server:
   ```
   npm run build
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Update the `src/config.json` file with your backend API URL:
   ```json
   {
     "API_BASE_URL": "http://localhost:5000/api"
   }
   ```
4. Start the development server:
   ```
   npm start
   ```

## API Key Instructions
To use this application with real movie data, you need a valid TMDb API key:

### Getting a TMDb API Key
1. Register at [The Movie Database](https://www.themoviedb.org/signup) (free)
2. After confirming your email, go to your account settings → API
3. Follow the steps to request an API key (choose "Developer" option)
4. Generate a new API key (v3 auth)

### Setting Up Your API Key
You have two options for configuring your API key:

#### Option 1: Via the Admin Page (Recommended)
1. Start both the backend and frontend servers
2. Open the application in your browser
3. Navigate to the Admin page by clicking "Admin" in the navigation bar
4. Enter your TMDb API key in the input field
5. Click "Update API Key"
6. Use the "Test API Key" button to verify the connection
7. Return to the homepage to see real movie data

#### Option 2: Via the Backend .env File
1. Open the `backend/.env` file
2. Replace the placeholder API key with your real TMDb API key:
   ```
   MOVIE_API_KEY=your_actual_tmdb_api_key_here
   ```
3. Save the file and restart the backend server

**IMPORTANT**: Without a valid API key, the application will use mock data. The default API key in the project is just a placeholder and won't connect to TMDb's servers.

### Troubleshooting API Issues
If you're experiencing issues with the API connection:
1. Test your API key in the Admin section
2. Check your internet connection
3. Verify that your TMDb API key is active and valid
4. See TROUBLESHOOTING.md for detailed guidance

## Usage
1. Open the application in your browser (typically at http://localhost:3000)
2. Register for a new account or login with existing credentials
3. Browse popular movies on the homepage or search for specific titles
4. Click on movie cards to view detailed information and trailers
5. Add movies to your favorites for quick access later
