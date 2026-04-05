# Finance Dashboard Backend

A Node.js/Express backend for a finance dashboard with PostgreSQL database. Features include user authentication, role-based access control, financial record management, and dashboard analytics.

## Features
- **User Authentication**: Register and login with JWT and Bcrypt.
- **Role-Based Access Control (RBAC)**: Supports roles like `admin`, `analyst`, and `viewer`.
- **Financial Records**: Create, read (with filters/search), update (partial supported), and delete (soft delete).
- **Dashboard API**: Summary totals, category breakdowns, and monthly trends (filtering out deleted records).
- **Validation**: Request validation using Joi.
- **Middleware**: Centralized error handling and CORS support.

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database

## Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your database credentials and `JWT_SECRET`.

## Database Setup
Run the following SQL to create the necessary tables:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- income/expense
    category VARCHAR(100),
    date DATE DEFAULT CURRENT_DATE,
    note TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the App
- In development (with nodemon):
  ```bash
  npm run dev
  ```
- In production:
  ```bash
  npm start
  ```

## API Documentation
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate user and get JWT.
- `GET /api/records`: Fetch financial records with filtering and pagination.
- `GET /api/dashboard/summary`: Get overall financial statistics.
- `GET /api/users` (admin): List all users with roles and status.
- `PATCH /api/users/:id/role` (admin): Change user role.
- `PATCH /api/users/:id/status` (admin): Activate/deactivate a user.

## Notes and Assumptions
- Public registration always creates a `viewer` account by design.
- Role assignment and user activation status changes are admin-only operations.
- Login is blocked for users with `is_active = false`.