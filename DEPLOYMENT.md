# RhythmRep Deployment Guide

This guide will help you deploy RhythmRep to Netlify with Neon database.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Neon Database**: Sign up at [neon.tech](https://neon.tech)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Set up Neon Database

### 1.1 Create Neon Project
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Note down your connection string (it looks like: `postgresql://user:password@host/database`)

### 1.2 Set up Database Schema
1. In your Neon dashboard, go to the SQL Editor
2. Copy and paste the contents of `neon-schema.sql`
3. Execute the script to create all tables and sample data

### 1.3 Get Connection String
1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string
3. You'll need this for the next step

## Step 2: Deploy to Netlify

### 2.1 Connect Repository
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your RhythmRep repository

### 2.2 Configure Build Settings
Use these settings in Netlify:

- **Build command**: `npm run build`
- **Publish directory**: `client/dist`
- **Node version**: `18`

### 2.3 Set Environment Variables
In your Netlify dashboard, go to Site settings > Environment variables and add:

```
DATABASE_URL=your_neon_connection_string_here
NODE_ENV=production
```

### 2.4 Update CORS Settings
In the `netlify/functions/api.js` file, update the CORS origins:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-name.netlify.app', 'https://your-custom-domain.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Replace `your-app-name` with your actual Netlify app name.

### 2.5 Update API URL
In `client/src/lib/config.ts`, update the production URL:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-app-name.netlify.app/.netlify/functions/api' 
    : 'http://localhost:5000'
  );
```

## Step 3: Deploy

### 3.1 Trigger Deployment
1. Push your changes to GitHub
2. Netlify will automatically build and deploy your site
3. Monitor the build logs for any errors

### 3.2 Verify Deployment
1. Check that your site is accessible at `https://your-app-name.netlify.app`
2. Test the API endpoints by visiting `https://your-app-name.netlify.app/.netlify/functions/api/health`
3. Test user registration and login functionality

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain
1. In Netlify dashboard, go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

### 4.2 Update CORS and API URLs
Remember to update the CORS origins and API URLs with your custom domain.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version is set to 18
   - Check build logs for specific error messages

2. **Database Connection Issues**
   - Verify `DATABASE_URL` environment variable is set correctly
   - Check that Neon database is accessible
   - Ensure SSL is enabled for production

3. **API Endpoints Not Working**
   - Verify the Netlify function is deployed correctly
   - Check function logs in Netlify dashboard
   - Ensure CORS settings are correct

4. **CORS Errors**
   - Update CORS origins to include your actual domain
   - Check that credentials are enabled
   - Verify all required headers are allowed

### Debugging

1. **Check Function Logs**
   - Go to Netlify dashboard > Functions
   - Click on the `api` function
   - View logs for debugging

2. **Test API Locally**
   - Use `netlify dev` to test functions locally
   - Check that database connection works

3. **Database Queries**
   - Use Neon's SQL Editor to verify data
   - Check that tables are created correctly

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `NODE_ENV` | Environment (production/development) | Yes |
| `VITE_API_URL` | Custom API URL (optional) | No |

## File Structure for Deployment

```
RhythmRep/
├── client/                 # Frontend React app
├── netlify/
│   └── functions/
│       └── api.js         # Serverless API function
├── netlify.toml           # Netlify configuration
├── neon-schema.sql        # Database schema
├── package.json           # Dependencies
└── DEPLOYMENT.md          # This guide
```

## Performance Optimization

1. **Database Indexes**: The schema includes optimized indexes
2. **Connection Pooling**: Neon handles connection pooling automatically
3. **CDN**: Netlify provides global CDN for static assets
4. **Caching**: Implement appropriate caching headers

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Restrict origins to your actual domains
3. **Input Validation**: All inputs are validated server-side
4. **Password Hashing**: Passwords are hashed using bcrypt
5. **SSL**: Always use HTTPS in production

## Monitoring

1. **Netlify Analytics**: Monitor site performance
2. **Function Logs**: Check API function performance
3. **Database Metrics**: Monitor Neon database usage
4. **Error Tracking**: Set up error monitoring

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Netlify and Neon documentation
3. Check function logs for specific error messages
4. Verify all environment variables are set correctly

## Updates and Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Database Backups**: Neon provides automatic backups
3. **Monitoring**: Set up alerts for critical issues
4. **Testing**: Test thoroughly before deploying updates 