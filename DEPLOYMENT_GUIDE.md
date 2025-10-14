# Deployment Guide - Environment Variables

## 🚨 Important: .env Files and GitHub

You're absolutely right! `.env` files are **NOT** committed to GitHub for security reasons. Here's how to handle environment variables in different deployment scenarios:

## 📁 Local Development Setup

### 1. Create `.env` file locally
Create a `.env` file in your `wenzetiindaku-frontend` directory:

```env
# For local development
VITE_ENVIRONMENT=development
VITE_LOCAL_BACKEND_URL=http://localhost:5000/api
VITE_PRODUCTION_BACKEND_URL=https://wenzetiindaku-backend.onrender.com/api
```

### 2. This file stays local
- ✅ `.env` is already in `.gitignore` (won't be committed to GitHub)
- ✅ Only you have access to this file
- ✅ Safe for local development

## 🚀 Deployment Options

### Option 1: Netlify (Recommended for Frontend)

1. **Go to Netlify Dashboard** → Your Site → Site Settings → Environment Variables
2. **Add these variables:**
   ```
   VITE_ENVIRONMENT = production
   VITE_PRODUCTION_BACKEND_URL = https://wenzetiindaku-backend.onrender.com/api
   ```
3. **Redeploy** your site

### Option 2: Vercel

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add these variables:**
   ```
   VITE_ENVIRONMENT = production
   VITE_PRODUCTION_BACKEND_URL = https://wenzetiindaku-backend.onrender.com/api
   ```
3. **Redeploy** your site

### Option 3: Render (Static Site)

1. **Go to Render Dashboard** → Your Static Site → Environment
2. **Add these variables:**
   ```
   VITE_ENVIRONMENT = production
   VITE_PRODUCTION_BACKEND_URL = https://wenzetiindaku-backend.onrender.com/api
   ```
3. **Redeploy** your site

### Option 4: GitHub Pages

GitHub Pages doesn't support environment variables directly. You have two options:

#### Option A: Build Script with Environment
Create a build script that sets the environment:

```json
// In package.json
{
  "scripts": {
    "build:production": "VITE_ENVIRONMENT=production npm run build",
    "build:development": "VITE_ENVIRONMENT=development npm run build"
  }
}
```

#### Option B: Use Default Production Values
The code already defaults to production values, so you can just run `npm run build` and deploy.

## 🔧 Quick Setup Commands

### For Local Development:
```bash
# 1. Create .env file
echo "VITE_ENVIRONMENT=development" > .env
echo "VITE_LOCAL_BACKEND_URL=http://localhost:5000/api" >> .env
echo "VITE_PRODUCTION_BACKEND_URL=https://wenzetiindaku-backend.onrender.com/api" >> .env

# 2. Start development
npm run dev
```

### For Production Build:
```bash
# Build with production environment
VITE_ENVIRONMENT=production npm run build
```

## 📋 Environment Variable Reference

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_ENVIRONMENT` | Controls which backend to use | `development` or `production` |
| `VITE_LOCAL_BACKEND_URL` | Local backend URL | `http://localhost:5000/api` |
| `VITE_PRODUCTION_BACKEND_URL` | Production backend URL | `https://wenzetiindaku-backend.onrender.com/api` |
| `VITE_API_URL` | Direct override (highest priority) | `http://custom-backend.com/api` |

## 🎯 Your Workflow

1. **Local Development:**
   - Create `.env` with `VITE_ENVIRONMENT=development`
   - Run your backend locally on port 5000
   - Test your changes

2. **Deployment:**
   - Set environment variables in your hosting platform
   - Set `VITE_ENVIRONMENT=production`
   - Deploy

3. **No .env file needed in production** - environment variables are set in the hosting platform!

## 🔒 Security Notes

- ✅ `.env` files are in `.gitignore` (not committed to GitHub)
- ✅ Environment variables in hosting platforms are secure
- ✅ Only you can access your local `.env` file
- ✅ Production environment variables are encrypted by hosting platforms

## 🆘 Troubleshooting

### If your app connects to wrong backend:
1. Check environment variables in your hosting platform
2. Make sure `VITE_ENVIRONMENT=production` is set
3. Verify `VITE_PRODUCTION_BACKEND_URL` is correct
4. Redeploy after changing environment variables

### If local development doesn't work:
1. Make sure `.env` file exists in `wenzetiindaku-frontend` directory
2. Check that `VITE_ENVIRONMENT=development`
3. Verify your local backend is running on port 5000
4. Restart your development server after changing `.env`
