# Job Portal Project Documentation

## 1. Overview

This project is a full-stack Job Portal application using:

- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, MySQL
- Frontend: React, Vite, React Router, Axios
- Authentication: JWT
- API docs: Swagger / OpenAPI

The application supports role-based login, recruiter job management, candidate applications, and SQL-seeded startup data for immediate frontend display.

## 2. Current Functional Scope

### Implemented Features

- User registration and login with JWT
- Role-based access with `ADMIN`, `RECRUITER`, and `CANDIDATE`
- Public job listing and job details
- Candidate job application flow
- Candidate "My Applications" page
- Recruiter dashboard
- Recruiter applicant review and status updates
- SQL-seeded default recruiter and default jobs
- Separate login pages by role

### Partially Implemented

- Admin dashboard UI exists in the frontend
- Admin-specific backend management APIs are not implemented yet

## 3. Roles and Permissions

### `ADMIN`

- Can access the frontend admin dashboard route
- No dedicated backend admin API set is implemented yet

### `RECRUITER`

- Can log in
- Can post jobs
- Can view their own jobs
- Can open applicants for a job
- Can update application status
- Can delete their own jobs if no applications exist

### `CANDIDATE`

- Can register and log in
- Can browse all jobs
- Can apply to jobs
- Can view application history

## 4. Separate Login Pages

The frontend now uses role-specific login routes:

- `/login`
  Selector page for login type
- `/login/admin`
  Admin login page
- `/login/recruiter`
  Recruiter login page
- `/login/candidate`
  Candidate login page

These routes are handled in [`frontend/src/App.jsx`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\App.jsx) and use the reusable login component in [`frontend/src/components/LoginForm.jsx`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\components\LoginForm.jsx).

## 5. Startup SQL Data

Startup records are inserted through [`backend/src/main/resources/data.sql`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\backend\src\main\resources\data.sql).

### Seeded Recruiter

- Email: `recruiter@test.com`
- Password: `123456`
- Role: `RECRUITER`

### Seeded Jobs

The following default jobs are inserted if they do not already exist:

1. Frontend Developer at TechNova
2. Backend Java Engineer at DataBridge
3. Full Stack Developer at HireFlow
4. UI/UX Designer at PixelCraft
5. DevOps Engineer at CloudAxis

### SQL Initialization Settings

Configured in [`backend/src/main/resources/application.properties`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\backend\src\main\resources\application.properties):

- `spring.jpa.defer-datasource-initialization=true`
- `spring.sql.init.mode=always`

This ensures SQL runs on startup so the frontend can fetch seeded jobs from `/api/jobs`.

## 6. Backend Architecture

The backend uses the following layers:

- `controller`
  REST API endpoints
- `dto`
  Request / response objects
- `entity`
  JPA entities
- `repository`
  Database access layer
- `security`
  JWT filter and route authorization
- `exception`
  Global exception handling

## 7. Main Backend Components

### Authentication

- `AuthController`
  Register and login
- `SecurityConfig`
  Public and protected route rules
- `JwtFilter`
  Reads JWT from the `Authorization` header
- `JwtUtil`
  Token generation and validation

### Jobs

- `JobController`
  Public job listing
  Recruiter job creation
  Recruiter "my jobs"
  Recruiter delete job

### Applications

- `ApplicationController`
  Candidate apply
  Candidate application history
  Recruiter applicants by job
  Recruiter status update

### Root API

- `HomeController`
  Public `/` endpoint showing backend status and useful links

## 8. Database Entities

### User

Fields:

- `id`
- `name`
- `email`
- `password`
- `role`
- `createdAt`

### Job

Fields:

- `id`
- `title`
- `description`
- `location`
- `salary`
- `company`
- `recruiter`
- `createdAt`

### Application

Fields:

- `id`
- `job`
- `candidate`
- `resumeUrl`
- `status`
- `appliedDate`

## 9. Frontend Architecture

Main frontend areas:

- [`frontend/src/App.jsx`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\App.jsx)
  Application routing and top navigation
- [`frontend/src/api.js`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\api.js)
  Axios base client and JWT interceptor
- [`frontend/src/components/ProtectedRoute.jsx`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\components\ProtectedRoute.jsx)
  Route protection by role
- [`frontend/src/pages/Home.jsx`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\pages\Home.jsx)
  Job browsing with search and filters
- [`frontend/src/pages/RecruiterDashboard.jsx`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\pages\RecruiterDashboard.jsx)
  Recruiter management workflow
- [`frontend/src/pages/MyApplications.jsx`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\pages\MyApplications.jsx)
  Candidate application tracking

## 10. API Endpoints

### Public Endpoints

- `GET /`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/jobs`
- `GET /api/jobs/{id}`
- `GET /swagger-ui.html`
- `GET /v3/api-docs`

### Candidate Endpoints

- `POST /api/applications`
- `GET /api/applications/my-applications`

### Recruiter Endpoints

- `POST /api/jobs`
- `GET /api/jobs/my-jobs`
- `DELETE /api/jobs/{id}`
- `GET /api/applications/job/{jobId}`
- `PUT /api/applications/{applicationId}/status`

## 11. Sample Request Bodies

### Register

```json
{
  "name": "Asha",
  "email": "asha@test.com",
  "password": "123456",
  "role": "CANDIDATE"
}
```

### Login

```json
{
  "email": "recruiter@test.com",
  "password": "123456"
}
```

### Create Job

```json
{
  "title": "Software Engineer",
  "description": "Java Spring Boot developer required",
  "location": "Bangalore",
  "salary": 1200000,
  "company": "Tech Corp"
}
```

### Apply For Job

```json
{
  "jobId": 1,
  "resumeUrl": "https://example.com/resume.pdf"
}
```

### Update Application Status

```json
{
  "status": "REVIEWED"
}
```

## 12. How To Run

### Prerequisites

- Java 21
- MySQL Server
- Node.js
- Maven

Create database:

```sql
CREATE DATABASE job_portal;
```

### Backend

```powershell
cd "C:\Users\rajku\OneDrive\Desktop\Job Portal\backend"
mvn clean install
mvn spring-boot:run
```

### Frontend

```powershell
cd "C:\Users\rajku\OneDrive\Desktop\Job Portal\frontend"
cmd /c npm install
cmd /c npm run dev
```

## 13. Deployment Configuration

The project now supports environment-based deployment settings.

### Frontend Environment

Configured through [`frontend/src/api.js`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\src\api.js):

- `VITE_API_BASE_URL`

Example file:

- [`frontend/.env.example`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\frontend\.env.example)

### Backend Environment

Configured through [`backend/src/main/resources/application.properties`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\backend\src\main\resources\application.properties):

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`
- `SPRING_JPA_SHOW_SQL`
- `SPRING_SQL_INIT_MODE`
- `SERVER_PORT`
- `JWT_SECRET`
- `JWT_EXPIRATION`
- `APP_CORS_ALLOWED_ORIGINS`

Example file:

- [`backend/.env.example`](C:\Users\rajku\OneDrive\Desktop\Job%20Portal\backend\.env.example)

### Production Recommendations

For production:

1. Set `SPRING_SQL_INIT_MODE=never` unless you explicitly want demo seed data
2. Set `SPRING_JPA_SHOW_SQL=false`
3. Use a strong `JWT_SECRET`
4. Set `APP_CORS_ALLOWED_ORIGINS` to your frontend domain only
5. Do not keep local database credentials in production config

## 14. Deployment Steps

### Backend Deployment

Build:

```powershell
cd "C:\Users\rajku\OneDrive\Desktop\Job Portal\backend"
mvn clean package
```

Run:

```powershell
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

Build:

```powershell
cd "C:\Users\rajku\OneDrive\Desktop\Job Portal\frontend"
cmd /c npm install
cmd /c npm run build
```

Deploy the `dist` output to a static host.

## 15. Important URLs

- Frontend: `http://127.0.0.1:5173`
- Login selector: `http://127.0.0.1:5173/login`
- Recruiter login: `http://127.0.0.1:5173/login/recruiter`
- Candidate login: `http://127.0.0.1:5173/login/candidate`
- Admin login: `http://127.0.0.1:5173/login/admin`
- Backend root: `http://localhost:8080`
- Jobs API: `http://localhost:8080/api/jobs`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## 16. How To Verify The Seeded Jobs

1. Start MySQL.
2. Start the backend.
3. Open `http://localhost:8080/api/jobs`.
4. Confirm the seeded jobs are returned in the JSON response.
5. Start the frontend.
6. Open `http://127.0.0.1:5173`.
7. Confirm the home page displays the seeded jobs.

## 17. Current Limitations

- Public registration can still assign elevated roles if a client submits them directly
- Duplicate job applications are not blocked yet
- Backend test coverage is minimal
- Running the frontend without the backend will show job-loading errors because jobs are fetched from the API

## 18. Suggested Next Improvements

1. Prevent role escalation during registration by forcing public signup to `CANDIDATE`
2. Add duplicate-application protection so candidates cannot apply to the same job repeatedly
3. Add backend tests for auth, recruiter flows, candidate flows, and admin management
4. Add frontend integration tests for login, protected routes, posting jobs, applying, and admin actions
5. Add recruiter analytics and candidate profile management views
6. Improve DTO validation and structured API error responses
7. Clean up production readiness by removing sensitive local fallback credentials and tightening demo seed behavior
