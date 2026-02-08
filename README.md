> [!CAUTION]
>
> # This README **is on development**. All information that appears is used as a template, so DO NOT RELY ON ANY INFORMATION WRITTEN HERE!

# 🍽 TrackBites

### Fullstack Calorie Tracking Application

**TrackBites** is a robust fullstack web application designed for the historical recording and counting of calories. Unlike simple counters, TrackBites allows users to manage their daily intake through a strict hierarchical structure of time and meals, facilitating exhaustive nutritional control.

The project follows an **NPM Monorepo** architecture, clearly divided into Client, API, and End-to-End Tests.

---

## ✨ Key Features

The business logic is built upon four fundamental pillars:

### 🔐 1. Authentication & User Management

- **Secure Access:** Registration and Login system using JWT and Bcrypt.
- **Profile Management:** Users can modify personal data.
- **Full Control:** Option for complete account deletion (data wipe).
- **Security:** Protected routes that require an active session.

### 🍎 2. Personal Catalog (Food Bank)

Every user has their own "Food Bank" to streamline logging:

- **Full CRUD:** Create, Read, Update, and Delete foods in the personal catalog.
- **Efficiency:** Designed for quick insertion of frequently eaten foods without rewriting macros every time.

### 📅 3. The Tracker (Data Hierarchy)

The core of the application follows a strict hierarchy to organize data:

- **Weeks:** Users create/delete weeks to organize their history.
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
| **Backend**  | `/backend`  | Node.js, Express, JWT, Bcrypt                   | Jest, Supertest                                             |
| **Database** | -           | MongoDB Atlas + Mongoose                        | -                                                           |
| **E2E**      | `/e2e`      | -                                               | Playwright                                                  |

---

## 🔄 DevOps & CI/CD

The project utilizes a **Continuous Integration (CI)** pipeline configured via GitHub Actions (`pipeline.yml`).

**Verification Flow:**

1.  **Lint:** Code style verification.
2.  **Unit/Integration Tests:** Parallel execution of `test_backend` and `test_frontend`.
3.  **E2E Tests:** Executed only if the previous steps pass successfully.

---

## 🚀 Installation and Usage

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

### 3. Run on dev mode

```bash
cd calories-app
cd frontend
npm run dev
```

- On another terminal, at the same time:

```bash
cd calories-app
cd backend
npm run dev
```

### 4. Open on browser

Open your browser at http://localhost:5173 (default for Vite).

---

## 📂 Main Project Structure

```bash
calories-app/
├─ .github/ #GitHub Actions Workflows
├─ frontend/       # React frontend code
├─ backend/        # Node + Express API
├─ backend/        # Node + Express API
├─ backend/        # End-to-End Tests (Playwright)
├─ dev-journal/    # Development log and learning notes (in Spanish)
├─ README.md       # This file
```

---

## 💡 Additional Functionality

Yearly Filtering: Visualize weeks organized by year.

Search: Quickly filter and find specific weeks.

## 💡 Additional Notes

This project was built based on knowledge acquired from [fullstackopen.com](https://fullstackopen.com).
