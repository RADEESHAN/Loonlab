# Movie Explorer API Troubleshooting Guide

This guide helps you diagnose and fix common issues with the Movie Explorer app's API integration.

## Common Issues and Solutions

### 1. No Movies Displaying on the Homepage

#### Symptoms:
- "Failed to load movies: Server error"
- "No movies found" message
- Empty screen with loading indicator that never resolves

#### Solutions:

1. **Check the Backend Server**
   - Make sure the backend server is running on port 5000
   - Run `npm run dev` in the backend directory
   - Check terminal logs for API connection errors

2. **Verify API Key Configuration**
   - Visit the Admin page at `/admin`
   - Make sure you've added a valid TMDb API key
   - Click "Test API Key" to verify the key is working

3. **Check Browser Network Tab**
   - Open browser developer tools (F12)
   - Go to the Network tab
   - Reload the page and look for requests to `/api/movies/popular`
   - Check for any failed requests or error status codes

4. **Restart Both Servers**
   - Stop the frontend and backend servers
   - Start the backend server first: `cd backend && npm run dev`
   - Start the frontend server: `cd frontend && npm start`

### 2. API Key Related Issues

#### Symptoms:
- "Invalid API key" error messages
- Mock data showing instead of real movies
- "Please go to Admin page" messages

#### Solutions:

1. **Get a Valid API Key**
   - Register at [The Movie Database](https://www.themoviedb.org/)
   - Go to your account settings → API
   - Generate a new API key (v3 auth)

2. **Update API Key via Admin Page**
   - Navigate to `/admin`
   - Enter your valid TMDb API key
   - Save the changes and test the key
   - Return to homepage to see real data

3. **Update API Key in the .env File**
   - Open `backend/.env`
   - Replace `MOVIE_API_KEY=3e12345678901234567890abcdefghij` with your valid key
   - Restart the backend server

### 3. Infinite Scrolling Not Working

#### Symptoms:
- Only shows first page of results
- No additional movies load when scrolling down
- Pagination not working

#### Solutions:

1. **Check for Console Errors**
   - Open browser developer tools
   - Look for errors when scrolling
   - Check if pages are incrementing correctly

2. **Check API Parameters**
   - Verify the `page` parameter is being sent correctly
   - Check that the total pages count is being set properly

3. **Test Manually Loading More**
   - Try using the "Load More Movies" button
   - Check if movies append correctly to the existing list

## Advanced Troubleshooting

### Verify Backend API Endpoints

Test these endpoints directly in your browser or with a tool like Postman:

1. Test the health check: `http://localhost:5000/api/health`
2. Get popular movies: `http://localhost:5000/api/movies/popular?page=1`
3. Search for movies: `http://localhost:5000/api/movies/search?query=star%20wars&page=1`

### Check Backend Logs for API Errors

Look for these common error messages:

- "Invalid or missing TMDb API key"
- "TMDb API unauthorized access"
- "Failed to fetch popular movies"

### Check for CORS Issues

If you see CORS errors in the console:

1. Verify the CORS configuration in `backend/src/index.ts`
2. Make sure the frontend is making requests to the correct backend URL
3. Check that `config.json` has the correct `API_BASE_URL` value

## Quick Fixes

1. **Force Clear Cache and Reload**
   - In Chrome: Hold Shift + click Reload button
   - Or press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

2. **Reset Browser Data**
   - Clear cookies, local storage, and session storage
   - Try in an incognito/private browser window

3. **Reset to Mock Data**
   - If you're unable to get a valid API key, the app will work with mock data
   - Remove the API key from the Admin page to use fallback mock data

## Need More Help?

- Check the Movie Explorer GitHub repository for updates or known issues
- Refer to the TMDb API documentation at https://developers.themoviedb.org/3
- Contact support for additional assistance
