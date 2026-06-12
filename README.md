# 🌌 Tutor CRM Portal

### 🎓 Smart Tuition Management Platform

---

## 📂 Project Directory Structure

The project has been separated into two dedicated directories:

* **frontend**: The React + Vite client dashboard application.
* **backend**: The Node + Express backend server.

---

## 🚀 How to Run the Project

### Option A: Workspace Concurrent Runner (Recommended)
You can launch both Frontend and Backend concurrently from the root folder:

1. **Install dependencies** across the workspace, frontend, and backend folders:
   ```bash
   npm run install:all
   ```
2. **Start the development servers**:
   ```bash
   npm run dev
   ```

* Frontend is accessible at: **`http://localhost:3000`**
* Backend is running on port: **`5000`**

### Option B: Run Directories Separately

#### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies & run:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```

#### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies & run:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```

---

## ⚙️ Backend Environment Variables (`backend/.env`)
Create/modify the `.env` file under the `backend` folder:
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/tutorcrm
JWT_SECRET=super_secret_tutor_crm_jwt_token_key_123!
GEMINI_API_KEY=your_gemini_api_key_here
```

---

# 🔐 Role Based Login

<div align="center">

| 👑 Master Admin | 🛠️ Admin | 👨‍🏫 Tutor | 🎓 Student | 👨‍👩‍👧 Parent |
| --------------- | --------- | ----------- | ---------- | --------------- |

</div>

Each role gets personalized access and dashboard features.

---

# 👑 Master Admin Dashboard

✨ Full platform access
✨ User management
✨ Reports & analytics
✨ Monitor all modules
✨ System control

---

# 🛠️ Admin Dashboard

### 👨‍🎓 Student Management

🔹 Add students
🔹 Assign students to tutors
🔹 Update records
🔹 View enrollment

### 👨‍🏫 Tutor Management

🔹 Add/Edit/Delete tutors
🔹 Assign tutor courses
🔹 View tutor details

### 💳 Fees

🔹 Payment completed / pending
🔹 Fee tracking
🔹 Update payment details

### 📚 Courses

🔹 Add courses
🔹 Update course details
🔹 Course assignment

---

# 👨‍🏫 Tutor Dashboard

✅ Attendance tracking
✅ Course access
✅ Quizzes & exams
✅ Profile management
✅ Announcements
✅ Weekly performance review
✅ Student score tracking

---

# 🎓 Student Dashboard

📘 Enroll courses
👨‍🏫 Tutor details
📝 Exams & quizzes
📊 Performance tracking
💬 Feedback
📢 Announcements

---

# 👨‍👩‍👧 Parent Dashboard

👦 Child enrolled courses
📚 Student details
👨‍🏫 Tutor details
💳 Payment status
💰 Fee payment options
📈 Academic progress

---

# 🌊 Core Modules

| Module                   |        Access |
| ------------------------ | ------------: |
| 🔐 Authentication        |           All |
| 👨‍🎓 Student Management |         Admin |
| 👨‍🏫 Tutor Management   |         Admin |
| 📚 Courses               |   Admin/Tutor |
| 📝 Exams                 | Tutor/Student |
| 💳 Payments              |  Admin/Parent |
| 📢 Announcements         |           All |
| 📊 Reports               |         Admin |

---

# 🚀 Tech Stack

```txt
⚛️ Frontend   → React + Vite + Tailwind CSS
🛠 Backend    → Node.js / Express
🗄 Database   → MongoDB / MySQL
🔗 Versioning → Git + GitHub
```

---

# 📊 ER Diagram

![ER Diagram](./assets/er_diagram.png)

---

# 🎯 Goal

✔️ Simplify tuition center management
✔️ Improve communication
✔️ Track attendance & performance
✔️ Manage fees efficiently
✔️ Give parents transparency

---

<div align="center">

## ⭐ Tutor CRM Portal ⭐

### Built with teamwork, learning & innovation 💙

</div>
