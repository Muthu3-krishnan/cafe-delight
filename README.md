# Cafe Delight — Cafe Management System

Full-stack cafe ordering & management app: **React** (dark sidebar UI, orange accent) + **Spring Boot** backend + **PostgreSQL** (H2 for local testing), JWT auth with **USER** and **ADMIN** roles, and email notifications when an order is placed or its status changes.

Deploy target: **Netlify** (frontend) + **Render** (backend) + **Render Postgres / any cloud Postgres** (database).

---

## 1. Features

| Feature | Where it lives |
|---|---|
| Register / Login (JWT), roles USER & ADMIN | `AuthController`, `SecurityConfig` |
| Customer: browse menu, search/filter, add to order, sticky cart bar | `Menu.jsx`, `Cart.jsx` |
| Customer: order history with live status | `MyOrders.jsx` |
| Admin: dashboard stats | `Dashboard.jsx` |
| Admin: menu management (image cards, add/edit/delete) | `AdminMenu.jsx`, `MenuController` |
| Admin: orders table, status tabs, update-status dropdown | `AdminOrders.jsx`, `AdminOrderController` |
| Email sent when an order is placed **and** when its status changes | `EmailService` |
| Notifications feed (derived from order activity) | `Notifications.jsx` |
| Works with H2 locally, Postgres in production — same jar, just env vars | `application.properties` |

---

## 2. Local setup (no Postgres needed to test)

### Backend
Requires Java 17+ and Maven.

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080` using an in-memory **H2** database by default — nothing to install. On first boot it seeds:
- Admin: `admin@cafedemo.com` / `Admin@123`
- 8 starter menu items with images

H2 console (optional): `http://localhost:8080/h2-console` — JDBC URL `jdbc:h2:mem:cafedb`, user `sa`, blank password.

### Frontend
Requires Node 18+.

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`, talking to the backend at `http://localhost:8080/api` (see `.env.example`; copy to `.env` to override).

### Real emails locally (optional)
Set these as environment variables before running the backend (or edit `application.properties` directly for local-only testing):

```
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-gmail-app-password
```

Gmail: enable 2FA, then create an **App Password** (Google Account → Security → App passwords) — your normal password won't work over SMTP. Order placement never fails because of email — a send failure is logged, not thrown.

---

## 3. Deploying online (your job: click-deploy; everything else is already wired)

The backend reads **all** environment-specific config (DB, CORS, JWT secret, mail) from environment variables, with safe local defaults. You don't need to touch code — just set env vars on Render and Netlify.

### Step A — Database: create a Postgres instance
Use Render's managed Postgres (or Supabase/Neon/ElephantSQL — any Postgres works). Note down:
- Host, port, database name, username, password
  (Render gives you a full "External Database URL" like `postgresql://user:pass@host:5432/dbname`)

### Step B — Backend on Render
1. New **Web Service** → connect this repo → root directory `backend`.
2. Build command: `mvn clean package -DskipTests`
3. Start command: `java -jar target/cafe-hotel-demo-1.0.0.jar`
4. Environment variables to set on Render:

   | Key | Value |
   |---|---|
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>:<port>/<dbname>` |
   | `SPRING_DATASOURCE_USERNAME` | your Postgres username |
   | `SPRING_DATASOURCE_PASSWORD` | your Postgres password |
   | `SPRING_DATASOURCE_DRIVER` | `org.postgresql.Driver` |
   | `SPRING_JPA_DATABASE_PLATFORM` | `org.hibernate.dialect.PostgreSQLDialect` |
   | `JWT_SECRET` | any long random string |
   | `MAIL_USERNAME` | your SMTP/Gmail address |
   | `MAIL_PASSWORD` | your SMTP/Gmail app password |
   | `CORS_ALLOWED_ORIGINS` | `https://<your-site>.netlify.app` (set after Step C, then redeploy) |

   Render sets `PORT` automatically; `application.properties` already reads it.

5. Deploy. Your backend URL will look like `https://cafe-hotel-backend.onrender.com`.

### Step C — Frontend on Netlify
1. New site from this repo → base directory `frontend`.
2. Build command: `npm run build`
3. Publish directory: `frontend/build`
4. Environment variable:

   | Key | Value |
   |---|---|
   | `REACT_APP_API_URL` | `https://cafe-hotel-backend.onrender.com/api` |

5. Deploy. Your frontend URL will look like `https://cafe-delight.netlify.app`.

### Step D — Close the loop
Go back to Render and set `CORS_ALLOWED_ORIGINS` to your real Netlify URL from Step C, then redeploy the backend so the browser is allowed to call it. (You can list more than one origin, comma-separated, e.g. to also allow `http://localhost:3000` while testing.)

That's it — frontend and backend are now pointed at each other and at the cloud Postgres database.

---

## 4. Project structure

```
cafe-demo/
├── backend/                          Spring Boot API
│   └── src/main/java/com/cafedemo/
│       ├── model/                    User, MenuItem, CafeOrder, OrderItem, Role, OrderStatus
│       ├── repository/               Spring Data repositories
│       ├── dto/                      Request/response payloads
│       ├── security/                 JwtUtil
│       ├── config/                   SecurityConfig (env-driven CORS), JwtAuthFilter
│       ├── service/                  OrderService, EmailService, UserDetailsServiceImpl
│       └── controller/               AuthController, MenuController, OrderController, AdminOrderController
└── frontend/                         React app
    └── src/
        ├── api/axios.js              Axios instance + JWT interceptor (REACT_APP_API_URL)
        ├── context/AuthContext.js
        ├── components/               Sidebar, Topbar, AppShell, ProtectedRoute
        └── pages/                    Login, Register, Menu, Cart, OrderSuccess, MyOrders,
                                       Dashboard, AdminMenu, AdminOrders, Notifications, Settings
```

## 5. Order statuses

`PENDING → PREPARING → READY → DELIVERED` (or `CANCELLED` at any point). An admin changes status from the Orders table dropdown; the customer sees the same status on **My Orders**, and an email is sent to them on every change.
"# cafe-delight" 
