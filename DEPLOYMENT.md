# EduTrack Deployment Guide

This document explains how to deploy the EduTrack Spring Boot backend to Render and the React/Vite frontend to Vercel.

## 1. Prepare the Backend for Render

### 1.1 Verify environment-based configuration
- `backend/src/main/resources/application.properties` now uses:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CORS_ALLOWED_ORIGINS`
- `backend/src/main/java/com/edutrack/config/DataSourceConfig.java` normalizes Render-style PostgreSQL URLs.

### 1.2 Verify JWT support
- `backend/src/main/java/com/edutrack/security/JwtService.java` issues and validates JWT tokens.
- `backend/src/main/java/com/edutrack/security/JwtAuthenticationFilter.java` validates incoming requests.
- `backend/src/main/java/com/edutrack/config/SecurityConfig.java` protects all endpoints except `/auth/**`.
- `backend/src/main/java/com/edutrack/controller/AuthController.java` returns a JWT token on login.

### 1.3 Verify CORS support
- `backend/src/main/java/com/edutrack/config/WebConfig.java` uses `CORS_ALLOWED_ORIGINS`.

## 2. Configure Render PostgreSQL

1. Create a PostgreSQL database in Render.
2. Copy the `DATABASE_URL` from the Render database dashboard.
3. In Render Web Service environment variables, add:
   - `DATABASE_URL` = the Render database URL
   - `JWT_SECRET` = a strong Base64 key (`openssl rand -base64 48` recommended)
   - `CORS_ALLOWED_ORIGINS` = `https://<your-frontend>.vercel.app`

> If Render provides `postgres://...`, `DataSourceConfig` will convert it to the proper JDBC URL.

## 3. Configure the Backend Service on Render

1. Create a new Web Service in Render.
2. Select your GitHub repository and choose the `backend` folder.
3. For build command, use:
   - `./mvnw clean package -DskipTests` if you add a Maven wrapper
   - otherwise `mvn clean package -DskipTests`
4. For start command, use:
   - `java -jar target/edutrack-backend-0.0.1-SNAPSHOT.jar`
   - or use Docker if you choose `backend/Dockerfile`.
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS`

## 4. Deploy the Frontend on Vercel

1. Import the GitHub repository in Vercel.
2. Set the root directory to `frontend`.
3. Use build command:
   - `npm install && npm run build`
4. Use output directory:
   - `dist`
5. Add environment variable:
   - `VITE_API_BASE_URL` = `https://<your-backend>.onrender.com`

## 5. Frontend Authentication

- `frontend/src/services/api.js` now attaches JWT from session storage.
- `frontend/src/context/AuthContext.jsx` stores the authenticated user and token.

## 6. Verify After Deployment

- Public backend URL should be reachable and return valid API responses.
- Public frontend URL should load successfully and connect to the backend.
- `/auth/login` should return a JWT token.
- The backend should create PostgreSQL tables automatically with Hibernate.

## 7. Debugging Checklist

### CORS failures
- Verify `CORS_ALLOWED_ORIGINS` exactly matches the Vercel URL.
- Inspect browser console errors.

### Render deployment failures
- Check Render build logs for Maven and Docker errors.
- Ensure `DATABASE_URL` and `JWT_SECRET` are set.

### PostgreSQL connection errors
- Validate the URL format.
- Confirm Render database is running and accessible.

### Hibernate startup issues
- Confirm `spring.jpa.hibernate.ddl-auto=update` is present.
- Look for schema or permission errors in Render logs.

### Vercel frontend API failures
- Confirm `VITE_API_BASE_URL` uses `https://`.
- Check network tab for failed requests.
