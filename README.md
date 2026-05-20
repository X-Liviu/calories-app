# 🍽 TrackBites

![Status: Work in Progress](https://img.shields.io/badge/Status-Work_in_Progress-orange)
![Node.js](https://img.shields.io/badge/Node.js-v20.19.4-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success)
![Playwright](https://img.shields.io/badge/Playwright-E2E_Testing-red)

### Fullstack Calorie Tracking Application

**TrackBites** is a robust fullstack web application designed for the historical recording and counting of calories. Unlike simple counters, TrackBites allows users to manage their daily intake through a strict hierarchical structure of time and meals, facilitating exhaustive nutritional control.

The project follows an **NPM Monorepo** architecture, clearly divided into Client, API, and End-to-End Tests.

> 📄 **[Read the Full System Architecture Document (PDF)](./trackbites_architecture.pdf)**
>
> _An in-depth technical analysis of the application architecture, data modeling strategies, and engineering challenges faced during development._

---

## ✨ Key Features

The business logic is built upon four fundamental pillars:

### 🔐 1. Authentication & User Management

- **Secure Access:** Registration and Login system using JWT and Bcrypt.
- **Security:** Protected routes that require an active session.
- **Profile Management:** Users can modify personal data.
- **Full Control:** Option for complete account deletion (data wipe).

### 🍎 2. Personal Catalog (Food Bank)

Every user has their own "Food Bank" to streamline logging:

- **Full CRUD:** Create, Read, Update, and Delete foods in the personal catalog.
- **Efficiency:** Designed for quick insertion of frequently eaten foods without rewriting macros every time.

### 📅 3. The Tracker (Data Hierarchy)

The core of the application follows a strict hierarchy to organize data:

- **Weeks:** Users create/delete weeks to organize their history. (Includes yearly filtering and quick search).
- **Days:** Each week contains 7 days with specific visualization logic.
- **Meals:** "Meal Moments" (e.g., Breakfast, Lunch) added within each day.
- **Items:** Specific foods recorded within a meal.

### ⚡ 4. Flexible Logging

When adding food to a meal, the system offers two distinct methods:

- **From Catalog:** Quick selection of previously saved items.
- **Ad-hoc Entry:** Create a custom food item directly inside the meal (name & calories) without saving it to the global catalog.

---

## 🏗 Architecture & Testing Strategy

The project is structured as a Monorepo with a strong emphasis on testing coverage.

| Scope        | Directory   | Core Stack                                      | Testing Tools                                               |
| :----------- | :---------- | :---------------------------------------------- | :---------------------------------------------------------- |
| **Frontend** | `/frontend` | React, Redux & Thunk, React Router, Vite, Axios | Vitest (runner), JSDOM (environment), React Testing Library |
| **Backend**  | `/backend`  | Node.js, Express, JWT, Bcrypt, Mongoose         | Jest, Supertest                                             |
| **Database** | -           | MongoDB Atlas                                   | -                                                           |
| **E2E**      | `/e2e`      | -                                               | Playwright                                                  |

---

## 🔄 DevOps & CI/CD

The project utilizes a **Continuous Integration (CI)** pipeline configured via GitHub Actions (`pipeline.yml`).

**Verification Flow:**

1.  **Lint:** Code style verification.
2.  **Unit/Integration Tests:** Parallel execution of `test_backend` and `test_frontend`.
3.  **E2E Tests:** Executed only if the previous steps pass successfully.

---

## 🧠 Technical Challenges & Lessons Learned

Building TrackBites involved solving several complex architectural challenges:

- **Monorepo Management:** Coordinating a shared codebase required careful configuration of ESLint, Vite, and test runners across the Client, API, and E2E workspaces.
- **Comprehensive Testing Strategy:** Implementing unit tests (Vitest/Jest) for business logic alongside E2E tests (Playwright) to ensure critical user journeys (like logging complex meals) don't break during refactoring.
- **Data Hierarchy & State Management:** Managing the strict state hierarchy of _Weeks -> Days -> Meals -> Items_ required designing a robust Redux (Thunk) architecture to avoid redundant API calls while keeping the UI responsive and snappy.

---

## ⚙️ Environment Variables

Before running the application, you need to configure the environment variables.
Create a `.env` file in the `/backend` directory. Here is a template of the required variables:

```env
# /backend/.env
PORT=3001
MONGODB_URI=your_mongodb_atlas_connection_string
TEST_MONGODB_URI=your_mongodb_test_connection_string
SECRET=your_jwt_secret_key
```

---

## 🚀 Installation and Usage (for developers)

**Requirements:** Node.js v20.19.4

### 1. Clone the repository

```bash
git clone <REPO_URL>
cd calories-app
```

### 2. Install dependencies

Since this is a monorepo, install dependencies for the root and workspaces.

```bash
npm install
```

### 3. Setup Environment Variables

Navigate to the `backend` directory and set up your `.env` file as detailed in the Environment Variables section above to connect to your `MongoDB` instance.

### 4. Run in dev mode

**Terminal 1 (Frontend):**

```bash
cd calories-app
cd frontend
npm run dev
```

**Terminal 2 (Backend):**

```bash
cd calories-app
cd backend
npm run dev
```

### 5. Open in browser

Open your browser at http://localhost:5173 (default for Vite).

---

## 📂 Main Project Structure

```bash
calories-app/
├─ .github/        #GitHub Actions Workflows
├─ frontend/       # React frontend code
├─ backend/        # Node + Express API
├─ e2e/            # End-to-End Tests (Playwright)
├─ dev-journal/    # Development log and learning notes (in Spanish)
├─ README.md       # This file
```

---

## 💡 Additional Notes

To see more useful commands, whether on the root, backend, frontend or e2e directories, use: **npm run** to see all possible commands.

This project was built based on knowledge acquired from [fullstackopen.com](https://fullstackopen.com).
