# Environment Configuration Guide

This guide explains how to configure the frontend to connect to different backend environments.

## Environment Variables

Create a `.env` file in the `wenzetiindaku-frontend` directory with the following variables:

```env
# Environment Configuration
# Set to 'development' for local backend, 'production' for deployed backend
VITE_ENVIRONMENT=development

# Backend URLs
VITE_LOCAL_BACKEND_URL=http://localhost:5000/api
VITE_PRODUCTION_BACKEND_URL=https://wenzetiindaku-backend.onrender.com/api

# You can also override the backend URL directly
# VITE_API_URL=http://localhost:5000/api
```

## How It Works

The application uses the following priority order for determining the backend URL:

1. **VITE_API_URL** (if set) - Direct override, highest priority
2. **VITE_ENVIRONMENT** - Controls which backend to use
   - `development` → Uses `VITE_LOCAL_BACKEND_URL` (default: `http://localhost:5000/api`)
   - `production` → Uses `VITE_PRODUCTION_BACKEND_URL` (default: `https://wenzetiindaku-backend.onrender.com/api`)

## Usage Examples

### For Local Development
```env
VITE_ENVIRONMENT=development
VITE_LOCAL_BACKEND_URL=http://localhost:5000/api
```

### For Production Deployment
```env
VITE_ENVIRONMENT=production
VITE_PRODUCTION_BACKEND_URL=https://wenzetiindaku-backend.onrender.com/api
```

### For Custom Backend URL
```env
VITE_API_URL=http://your-custom-backend.com/api
```

## Quick Setup

1. **Create `.env` file** in the `wenzetiindaku-frontend` directory
2. **Copy the environment variables** from above
3. **Set `VITE_ENVIRONMENT=development`** for local development
4. **Set `VITE_ENVIRONMENT=production`** for production deployment
5. **Start your local backend** on port 5000 (for development)
6. **Run the frontend** with `npm run dev`

## Development Workflow

1. **Local Testing**: Set `VITE_ENVIRONMENT=development` and run your backend locally
2. **Testing**: Make changes, test locally
3. **Deployment**: Set `VITE_ENVIRONMENT=production` and deploy

## Notes

- The `.env` file should be added to `.gitignore` to keep sensitive information private
- Environment variables starting with `VITE_` are exposed to the client-side code
- Changes to `.env` require restarting the development server
