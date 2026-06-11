# DevPulse

A collaborative backend API for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** https://devpulse-blond.vercel.app

---

## Features

- User registration and authentication with JWT
- Role-based access control (`contributor` and `maintainer`)
- Create, read, update, and delete issues (`bugs` and `feature requests`)
- Sort issues by `newest` and `oldest`
- Secure password hashing with bcrypt
- PostgreSQL with raw SQL (no ORM)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js (LTS 24.x) | Runtime |
| TypeScript | Language |
| Express.js | Web framework |
| PostgreSQL | Relational database |
| Raw SQL | Direct pool.query() calls, No query builders, ORMs, or SQL JOINs |
| bcrypt | Password hashing, salt rounds is 10 |
| jsonwebtoken | JWT auth(standard tokens) |

---

## Local Setup

### Prerequisites

- Node.js 24.x or higher
- PostgreSQL database (or a hosted instance via NeonDB / Supabase)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/jonydevnath/DevPulse
cd DevPulse

# 2. Install dependencies
npm install

# 3. Create environment file
touch .env
# Fill in your CONNECTION_STRING, PORT, JWT_SECRET, EXCESS_TOKEN_EXPIRE

# 5. Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL/CONNECTION_STRING=postgresql://user:password@host:5432/devpulse
PORT=port number
JWT_SECRET=your_jwt_secret_here
EXCESS_TOKEN_EXPIRE=expire day of the token
```

---

## Database Schema

### `users`

| Column | Type | Constraints |
|---|---|---|
| `id` | SERIAL | PRIMARY KEY |
| `name` | VARCHAR | NOT NULL |
| `email` | VARCHAR | NOT NULL, UNIQUE |
| `password` | TEXT | NOT NULL |
| `role` | VARCHAR | DEFAULT `contributor`, CHECK (`contributor` or `maintainer`) |
| `created_at` | TIMESTAMP | DEFAULT NOW() |
| `updated_at` | TIMESTAMP | DEFAULT NOW() |

### `issues`

| Column | Type | Constraints |
|---|---|---|
| `id` | SERIAL | PRIMARY KEY |
| `title` | VARCHAR(150) | NOT NULL |
| `description` | TEXT | NOT NULL, min 20 chars |
| `type` | VARCHAR | CHECK (`bug` or `feature_request`) |
| `status` | VARCHAR | DEFAULT `open`, CHECK (`open`, `in_progress`, `resolved`) |
| `reporter_id` | INTEGER | NOT NULL (app-level validation) |
| `created_at` | TIMESTAMP | DEFAULT NOW() |
| `updated_at` | TIMESTAMP | DEFAULT NOW() |

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues (with sort) |
| GET | `/api/issues/:id` | Public | Get a single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Parameters for `GET /api/issues`

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |

**Example:**
```
GET /api/issues?sort=oldest
```

### Authentication Header

Protected endpoints require:
```
Authorization: <JWT_TOKEN>
```

---

## Response Format

**Success**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

---

## Permissions

| Action | Contributor | Maintainer |
|---|---|---|
| Register / Login | YES | YES |
| Create issue | YES | YES |
| View all issues | YES | YES |
| Update own issue (status `open` only) | YES | YES |
| Update any issue | NO | YES |
| Delete any issue | NO | YES |