# EduTrack — Academic Management System

EduTrack is a full-stack SaaS application for student performance, task tracking, attendance, grading, and leave management.

## Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Frontend  | React + Vite, Tailwind CSS, Axios      |
| Backend   | Spring Boot 3.2, Java 17, Maven        |
| Database  | PostgreSQL                             |
| Security  | Spring Security, JWT                   |

## Project Structure

```
EduTrack/
├── backend/
│   ├── src/main/java/com/edutrack/
│   │   ├── config/          # Spring configuration, security, CORS, datasource
│   │   ├── controller/      # REST controllers and auth endpoints
│   │   ├── dto/             # Request and response DTOs
│   │   ├── model/           # JPA entities and enums
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JWT generation and auth filter
│   │   ├── service/         # Business logic and authentication
│   │   └── EduTrackApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/        # Axios API client and endpoint wrappers
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── DEPLOYMENT.md
└── .gitignore
```

## Local Setup

### Backend

```bash
cd backend
mvn clean package -DskipTests
java -jar target/edutrack-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deployment

For production, use:
- **Render** for backend and PostgreSQL
- **Vercel** for frontend

See `DEPLOYMENT.md` for the complete Render + Vercel deployment workflow, environment variable setup, and debugging steps.


### 6 — Run Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

---

## Roles & Features

### Admin
- Dashboard — class KPIs, task stats, subject averages
- User Management — add students (with roll number) and teachers (with subject), credentials set on creation
- Scores — view all scores grouped by subject
- Leaves — approve or reject student/teacher leave requests
- Calendar — add holidays, exams, meetings, events

### Teacher
- Tasks — assign tasks to multiple students (select all option), view by subject, see uploaded documents
- Scores — add marks manually or bulk upload via CSV (`roll_number,name,marks`), edit scores, bar chart
- Calendar — view academic events, apply for leave

### Student
- Dashboard — attendance %, task completion, avg score, upcoming deadlines
- Tasks — view assigned tasks, upload documents, submit tasks
- Attendance — monthly calendar view with present/absent/today indicators
- Performance — subject bar chart, score trend, all test records
- Calendar — view academic events, apply for leave

---

## CSV Score Upload Format

```csv
roll_number,name,marks
S001,Alice Smith,88
S002,Bob Johnson,74
S003,Carlos Williams,91
```

Upload via Teacher → Scores → Bulk Upload CSV. Specify test name, date, and max marks before uploading.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Role-based login |
| GET/POST | `/students/` | List / create students |
| GET/POST | `/teachers/` | List / create teachers |
| GET/POST | `/tasks/` | List / create tasks (multi-student) |
| PATCH | `/tasks/{id}` | Update task status |
| POST | `/tasks/{id}/documents` | Upload task document |
| DELETE | `/tasks/documents/{id}` | Remove document |
| GET | `/performance/dashboard` | Admin KPI stats |
| GET | `/performance/student-dashboard/{id}` | Student KPIs |
| GET/POST | `/performance/attendance` | List / mark attendance |
| GET | `/performance/attendance/{id}/summary` | Attendance % |
| GET/POST | `/scores/` | List / add scores |
| POST | `/scores/bulk-upload` | CSV bulk upload |
| PATCH | `/scores/{id}` | Edit score |
| GET/POST | `/leaves/` | List / apply leave |
| PATCH | `/leaves/{id}` | Approve / reject leave |
| GET/POST | `/calendar/` | List / add calendar events |
| GET | `/analytics/` | Class-wide analytics |
