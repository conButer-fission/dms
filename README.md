# Dentist Management System

A full-stack web application for managing a dental practice, including patient records and appointments

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Deployment Instructions

### Backend Deployment (Using Heroku)

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

4. Set up environment variables in Heroku:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

5. Deploy the backend:
   ```bash
   git subtree push --prefix server heroku main
   ```

### Frontend Deployment (Using Netlify)

1. Build the React application:
   ```bash
   cd client
   npm install
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy to Netlify:
   ```bash
   netlify deploy
   ```

4. Set up environment variables in Netlify:
   - REACT_APP_API_URL: Your Heroku backend URL

### Alternative Deployment Options

#### Using Docker

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Run the containers:
   ```bash
   docker-compose up -d
   ```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```


