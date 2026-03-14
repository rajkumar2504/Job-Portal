# Online Job Portal

This is a production-ready, full-stack Job Portal built using Java 21, Spring Boot, MySQL, and React (Vite). It includes a fully functioning backend with layered architecture and a frontend framework to display jobs and auth. 

## 1. Features
### Backend
- **Authentication**: JWT token-based authentication with `Register` and `Login`. Role-based access control (Admin, Recruiter, Candidate).
- **Jobs**: Create, update, delete, view job postings.
- **Applications**: Candidates can apply using a resume and track status.
- **Documentation**: Integrated with Swagger (OpenAPI 3.0) for testing API endpoints.
- **Security**: Global exception handling, Spring Security, input validation.

### Frontend
- Vite + React + React Router + Axios installed. 
- You can extend the frontend by implementing the generated API endpoints for `Login`, `Register`, `Job listing`.

## 2. Directory Structure
```
Job Portal/
|-- backend/
|   |-- src/main/java/com/jobportal/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- entity/
|   |   |-- exception/
|   |   |-- repository/
|   |   |-- security/
|   |   |-- util/
|   |   |-- JobPortalApplication.java
|   |-- src/main/resources/
|   |   |-- application.properties
|   |-- pom.xml
|-- frontend/
|   |-- src/
|   |-- package.json
```

## 3. How to Run the Project Locally

### Prerequisites
- **Java 21**: Make sure Java is installed (`java -version`).
- **Maven**: Ensure `mvn` is installed.
- **Node.js**: Installed (`node -v` and `npm -v`).
- **MySQL Server**: Running on `localhost:3306`. Create a database named `job_portal`.

**Setup MySQL:**
```sql
CREATE DATABASE job_portal;
```
If your MySQL credentials differ from `root` / `root`, update `backend/src/main/resources/application.properties`.

### Running the Backend

1. Navigate to the backend directory:
```sh
cd backend
```
2. Build and run the project:
```sh
mvn clean install
mvn spring-boot:run
```
*(Alternatively, simply run the `JobPortalApplication.java` main class from your IDE).*

3. Access the API Documentation (Swagger UI):
Open your web browser and navigate to:
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Running the Frontend

1. Navigate to the frontend directory:
```sh
cd frontend
```
2. Install the missing dependencies (if not already fetched):
```sh
npm install
```
3. Start the dev server:
```sh
npm run dev
```

## 4. API Documentation

### Authentication Endpoints
- `POST /api/auth/register`
  Accepts: `{ "name": "John Doe", "email": "john@test.com", "password": "pass", "role": "CANDIDATE" }`
- `POST /api/auth/login`
  Accepts: `{ "email": "john@test.com", "password": "pass" }`
  Returns: JWT token string.

### Job Endpoints
- `GET /api/jobs?page=0&size=10` *(Public)*
- `POST /api/jobs` *(Recruiter Only)*
  Accepts: `{ "title": "Software Engineer", "description": "Desc", "location": "NY", "salary": 100000, "company": "Tech" }`
  Headers: `Authorization: Bearer <token>`

### Application Endpoints
- `POST /api/applications` *(Candidate Only)*
  Accepts: `{ "jobId": 1, "resumeUrl": "http://link.to.resume" }`
  Headers: `Authorization: Bearer <token>`
- `GET /api/applications/my-applications` *(Candidate Only)*
