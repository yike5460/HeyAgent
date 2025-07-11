# Authentication Setup Guide

This guide will help you set up Google and GitHub SSO authentication with Cloudflare D1 database.

## 1. Install Required Dependencies

```bash
npm install @cloudflare/d1 @auth/d1-adapter wrangler
```

## 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Cloudflare D1 Database
DATABASE_URL=your-d1-database-url
D1_DATABASE_ID=your-d1-database-id

# Development Settings
NODE_ENV=development
```

## 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret to your `.env.local`

## 4. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the form:
   - Application name: "HeyAgent"
   - Homepage URL: `http://localhost:3000` (development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret
6. Add them to your `.env.local`

## 5. Cloudflare D1 Database Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler auth login
   ```

3. Create a D1 database:
   ```bash
   wrangler d1 create heyprompt-auth
   ```

4. Update `wrangler.toml` with your database ID from the previous command

5. Create the database schema:
   ```bash
   wrangler d1 execute heyprompt-auth --file=./schema.sql
   ```

6. For local development, create local database:
   ```bash
   wrangler d1 execute heyprompt-auth --local --file=./schema.sql
   ```

## 6. Update Auth Configuration

1. Open `src/lib/auth.ts`
2. Uncomment the D1Adapter import and usage:
   ```typescript
   import { D1Adapter } from "@auth/d1-adapter"
   // ...
   adapter: D1Adapter(getDatabase()),
   ```

## 7. Generate NextAuth Secret

Generate a secure secret for NextAuth.js:

```bash
openssl rand -base64 32
```

Add this to your `NEXTAUTH_SECRET` environment variable.

## 8. Database Migrations

When you make changes to the database schema, run:

```bash
# For production
wrangler d1 execute heyprompt-auth --file=./schema.sql

# For local development
wrangler d1 execute heyprompt-auth --local --file=./schema.sql
```

## 9. Development vs Production

### Development
- Use `http://localhost:3000` for callback URLs
- Use local D1 database with `--local` flag
- Set `NODE_ENV=development`

### Production
- Use your actual domain for callback URLs
- Use production D1 database
- Set `NODE_ENV=production`
- Update `NEXTAUTH_URL` to your production URL

## 10. Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "Sign In" and test both Google and GitHub authentication
4. Check the D1 database to confirm user records are being created

## 11. Common Issues

### OAuth Errors
- Ensure callback URLs exactly match what's configured in OAuth apps
- Check that OAuth apps are enabled and not restricted
- Verify client IDs and secrets are correct

### Database Errors
- Ensure D1 database is created and schema is applied
- Check that database binding in `wrangler.toml` is correct
- For local development, make sure you're using the `--local` flag

### NextAuth Errors
- Ensure `NEXTAUTH_SECRET` is set and secure
- Check that `NEXTAUTH_URL` matches your current environment
- Verify all required environment variables are set

## 12. Security Considerations

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Regularly rotate OAuth secrets
- Enable 2FA for your Google and GitHub accounts
- Monitor authentication logs for suspicious activity
- Use HTTPS in production
- Set up proper CORS policies
- Implement rate limiting for auth endpoints

## 13. Database Backup

Regularly backup your D1 database:

```bash
wrangler d1 export heyprompt-auth --output=backup.sql
```

## 14. Monitoring

Set up monitoring for:
- Failed authentication attempts
- Database connection issues
- OAuth provider availability
- User registration patterns

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review NextAuth.js debug logs (set `debug: true` in development)
3. Verify OAuth provider settings
4. Check Cloudflare D1 database status
5. Review environment variables

For additional help, consult:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps) 