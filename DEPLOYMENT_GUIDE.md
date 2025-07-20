# Deployment Guide

## Backend Deployment on Render

### Prerequisites
1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository to Render

### Steps to Deploy Backend

1. **Create a New Web Service on Render:**
   - Go to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend code

2. **Configure the Service:**
   - **Name:** `multitune-backend` (or your preferred name)
   - **Region:** Choose the closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Environment Variables:**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   JAMENDO_CLIENT_ID=1feabb5a
   JAMENDO_CLIENT_SECRET=a09ec58089de9b36a926397b39dcb022
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Note the URL provided (e.g., `https://multitune-backend.onrender.com`)

## Frontend Deployment on Vercel

### Prerequisites
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`

### Steps to Deploy Frontend

#### Option 1: Using Vercel Dashboard
1. **Import Project:**
   - Go to your Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Environment Variables:**
   Add this environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
   ```
   Replace `your-backend-name` with your actual Render service name.

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note the URL provided (e.g., `https://your-project.vercel.app`)

#### Option 2: Using Vercel CLI
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Follow the prompts and set environment variables when asked.

### Post-Deployment Steps

1. **Update Backend CORS:**
   - Update the `CORS_ORIGIN` environment variable in Render
   - Set it to your Vercel domain: `https://your-project.vercel.app`

2. **Update Frontend API URL:**
   - Update the `VITE_API_BASE_URL` environment variable in Vercel
   - Set it to your Render backend URL: `https://your-backend-name.onrender.com/api`

3. **Test the Deployment:**
   - Visit your Vercel frontend URL
   - Test all functionality to ensure frontend and backend communicate properly

### Important Notes

- **Free Tier Limitations:**
  - Render free tier: Your backend may sleep after 15 minutes of inactivity
  - Vercel free tier: 100GB bandwidth per month

- **Custom Domains:**
  - Both Render and Vercel support custom domains
  - Configure them in their respective dashboards

- **Environment Variables:**
  - Never commit sensitive environment variables to your repository
  - Use the platforms' environment variable settings

### Troubleshooting

1. **CORS Errors:**
   - Ensure your frontend domain is added to backend CORS configuration
   - Check that environment variables are properly set

2. **API Connection Issues:**
   - Verify the API base URL in frontend environment variables
   - Check that your backend is running and accessible

3. **Build Failures:**
   - Check build logs in both platforms
   - Ensure all dependencies are listed in package.json

### Monitoring and Logs

- **Render:** View logs in the service dashboard
- **Vercel:** View deployment logs and function logs in the project dashboard
