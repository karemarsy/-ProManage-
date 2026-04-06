# ProManage — Senior Developer Assignment

A Project Management web application built with Angular v20+, Node.js, Express, Prisma, and PostgreSQL.

---

## Architecture overview

The application uses a clean separation between frontend and backend:

- **Frontend** (`/frontend`) — Angular v20+ standalone components with Signals, lazy-loaded routes, CDK drag-and-drop Kanban board, and JWT auth via httpOnly cookies.
- **Backend** (`/backend`) — Node.js + Express REST API with Prisma ORM, Zod validation, Helmet security headers, and rate limiting.
- **Database** — PostgreSQL with Prisma migrations and proper indexes.

### Why these patterns?

- **Standalone Angular components** — no NgModules, simpler mental model, better tree-shaking.
- **Signals** — Angular's new reactive primitive, avoids RxJS boilerplate for simple state.
- **Service layer pattern** — controllers stay thin, all business logic lives in services, making it easy to test.
- **httpOnly cookies for JWT** — more secure than localStorage; cookies cannot be accessed by JavaScript, protecting against XSS attacks.
- **Prisma** — type-safe database access, automatic migrations, and excellent TypeScript integration.

---

## Features implemented

- User registration and login with JWT (httpOnly cookies)
- Role-based access control (Admin / Member)
- Project CRUD — create, list, update, archive, delete
- Project members (many-to-many)
- Task CRUD with status, priority, due date, assignee, and labels
- Kanban board with drag-and-drop between columns (Angular CDK)
- Task comments
- Dashboard with project overview and task statistics
- Protected routes with Angular auth guards
- CI/CD pipeline with GitHub Actions

---

## How to run locally

### Prerequisites

- Node.js 20+
- PostgreSQL running locally
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/promanage-senior-assignment.git
cd promanage-senior-assignment
```

### 2. Backend setup
```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npx prisma generate
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install --legacy-peer-deps
ng serve
```

Visit `http://localhost:4200`

---


## CI/CD pipeline

The GitHub Actions pipeline runs on every push and pull request to `main`/`master`:

1. **Install** — `npm ci` for reproducible installs
2. **Lint** — ESLint checks on backend TypeScript code
3. **Test + Coverage** — Jest runs all 53 tests, fails if coverage drops below 80%
4. **Security audit** — `npm audit` flags high-severity vulnerabilities
5. **Build** — TypeScript compilation (backend) and production build (frontend)

---

## Test coverage results
```
Test Suites: 9 passed
Tests:       53 passed

Coverage:
Statements : 93.8%
Branches   : 93.75%
Functions  : 92.1%
Lines      : 92.51%
```
