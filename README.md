> [!CAUTION]
>
> # This README **is on development**. All information that appears is used as a template, so DO NOT RELY ON ANY INFORMATION WRITTEN HERE!

# 🍽 TrackBites

## Fullstack application to track total calories consumed.

---

## 📝 Quick Introduction

TrackBites is a **fullstack calorie tracker** that helps users monitor their daily food intake.  
With a structured approach based on **weeks → days → meals → foods**, it allows creating and organizing meals while automatically calculating the total calories consumed.

The app also includes:

- A **personal food catalog** with the option to add custom foods.
- **User authentication** for secure and personalized tracking.
- Fast search and filtering to easily find specific weeks.

In short, it's a simple but powerful tool for anyone who wants to keep track of their nutrition.

---

## 🛠 Technologies Used

| **Frontend**        | **Backend**          | **Development Tools** |
| ------------------- | -------------------- | --------------------- |
| React               | Node.js              | ESLint                |
| Redux & Redux Thunk | Express              | Prettier              |
| React Router DOM    | MongoDB & Mongoose   | Nodemon               |
| Vite                | JSON Web Token (JWT) | cross-env             |
| Axios               | Bcrypt               | json-server           |
|                     | CORS, Morgan, dotenv |                       |

---

## 🚀 Installation and Usage

**Requirements:** Node.js v20.19.4

### 1. Clone the repository

```bash
git clone <REPO_URL>
cd calories-app
```

### 2. Install dependencies

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
├─ frontend/       # React frontend code
├─ backend/        # Node + Express API
├─ dev-journal/    # Development log and learning notes (in Spanish)
├─ README.md       # This file
```

---

## 💡 Additional Notes

This project was built based on knowledge acquired from [fullstackopen.com](https://fullstackopen.com).
