# 🎓 Codivexa Learning Management System (LMS)

A modern, responsive, frontend-only Learning Management System (LMS) built using **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. The project simulates a real-world LMS like **Udemy**, **Coursera**, or **Skillshare** using **localStorage** for data persistence.

---

# 🚀 Features

## 🌐 Landing Page

- Modern Hero Section
- Responsive Navigation Bar
- Featured Courses
- Popular Categories
- Student Testimonials
- FAQ Section
- Contact Section
- Professional Footer
- Dark / Light Theme

---

# 🔐 Authentication

Supports three different user roles.

### Student

- Register
- Login
- Forgot Password
- Logout
- Profile Management

### Instructor

- Login
- Dashboard

### Admin

- Login
- Dashboard

Authentication is simulated using **localStorage**.

Registration Flow

```
Register
      ↓
Registration Successful
      ↓
Redirect to Login
      ↓
Login
      ↓
Dashboard
```

---

# 👨‍🎓 Student Features

- Browse Courses
- Search Courses
- Filter Courses
- Wishlist
- Enroll in Course
- Demo Payment Gateway
- Continue Learning
- Track Progress
- Take Quiz
- Submit Assignment
- Download Certificate
- Update Profile
- Notifications

---

# 📚 Course Module

Each course contains

- Thumbnail
- Title
- Description
- Instructor
- Rating
- Duration
- Number of Lessons
- Difficulty
- Price

After Enrollment

- Course appears in "My Enrolled Courses"
- Lessons become available
- Progress tracking starts

---

# 🎥 Learning Module

Each enrolled course provides

- Course Overview
- Video Lessons
- Embedded YouTube Videos
- Playlist
- Lesson Notes
- Resources
- Progress Bar
- Continue Learning
- Resume Last Lesson

Lesson Features

- Play Video
- Pause
- Previous Lesson
- Next Lesson
- Mark as Complete

Completing a lesson

- Updates Progress
- Unlocks Next Lesson
- Saves progress in localStorage

---

# 🤖 AI Quiz Module

After each completed topic

Automatically unlock

- MCQ Quiz
- Coding Questions

Quiz Features

- Timer
- Instant Result
- Score
- Explanation
- Correct Answers
- Pass / Fail

---

# 📝 Assignment Module

Supports multiple technology domains

- Data Structures & Algorithms
- Machine Learning
- Deep Learning
- Artificial Intelligence
- Python
- Java
- React
- Next.js
- Web Development
- Node.js
- SQL
- Cloud Computing
- Cyber Security
- DevOps
- Data Science

Assignment Types

- MCQs
- Coding Questions
- File Upload
- Text Submission

---

# 🏆 Certificate Module

Certificate unlocks only after

- All lessons completed
- Quiz passed
- Assignment submitted

Generated Certificate includes

- Student Name
- Course Name
- Instructor Name
- Completion Date
- Certificate ID
- QR Code
- Organization Logo
- Signature

Downloadable as PDF.

---

# 💳 Payment Module

Demo Payment Gateway

Supports

- UPI
- Credit Card
- Debit Card
- Net Banking
- Wallet

After payment

- Enrollment Success
- Invoice Generated
- Dashboard Updated

---

# 👨‍🏫 Instructor Dashboard

Instructor can

- View Dashboard
- Add Course
- Edit Course
- Delete Course
- Upload Videos
- Upload Notes
- Create Quiz
- Create Assignment
- Review Submissions
- Publish Results
- View Students

---

# 👨‍💼 Admin Dashboard

Admin has complete control over the platform.

Features

## Student Management

- View Students
- Edit Student
- Delete Student
- Deactivate Student

## Instructor Management

- Add Instructor
- Edit Instructor
- Delete Instructor

## Course Management

- Add Course
- Edit Course
- Delete Course
- Upload Thumbnail
- Upload Videos

## Payment Management

- Transactions
- Revenue
- Payment Status

## Certificate Management

- Generate
- View
- Revoke

## Reports

- Revenue
- Students
- Courses
- Certificates
- Payments

---

# 📊 Dashboard Analytics

Real-time analytics using localStorage

Displays

- Total Students
- Total Courses
- Revenue
- Certificates Issued
- Enrollments
- Active Students
- Course Completion
- Monthly Growth
- Recent Activities

Charts built using Recharts.

---

# 🔔 Notification System

- Success Toast
- Error Toast
- Warning Toast
- Information Toast

Supports both

- Dark Mode
- Light Mode

---

# 🌙 Theme

Supports

- Dark Mode
- Light Mode

Modern UI

- Glassmorphism
- Gradient Colors
- Smooth Animations
- Professional Typography
- Responsive Layout

---

# 💾 Local Storage

The project simulates backend functionality using localStorage.

Stores

- Users
- Login Session
- Courses
- Enrollments
- Progress
- Payments
- Quiz Results
- Assignment Results
- Certificates
- Notifications

---

# 📁 Folder Structure

```
app/
components/
contexts/
hooks/
layouts/
store/
services/
utils/
types/
constants/
data/
styles/
public/
assets/
```

---

# 🛠️ Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- React Hook Form
- Zod
- jsPDF
- QRCode
- React Hot Toast

---

# 📱 Responsive Design

Optimized for

- Desktop
- Laptop
- Tablet
- Mobile

---

# ⚡ Performance

- Fast Loading
- Lazy Loading
- Optimized Components
- Reusable Architecture
- Modular Design

---

# 👨‍💻 Team Work Division

## 👤 Member 1

### Authentication

- Login
- Registration
- Forgot Password
- Session Management

### Landing Page

- Navbar
- Hero
- Footer

### Student Module

- Dashboard
- Profile
- Notifications
- Search
- Wishlist

---

## 👤 Member 2

### Course Module

- Course Listing
- Course Details
- Video Learning
- Progress Tracking
- AI Quiz
- Assignments
- Demo Payment
- Certificate Generation

---

## 👤 Member 3

### Admin Module

- Admin Dashboard
- Instructor Dashboard
- Student Management
- Course Management
- Reports
- Analytics
- Revenue Charts
- Settings

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/your-username/codivexa-lms.git
```

Go to project directory

```bash
cd codivexa-lms
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📌 Future Enhancements

- Supabase Backend
- JWT Authentication
- Razorpay Integration
- AI Course Recommendation
- AI Chatbot
- Real-Time Notifications
- Live Classes
- Discussion Forums
- Email Verification
- Certificate Verification
- Leaderboards
- Multi-language Support

---

# 📄 License

This project is developed for educational purposes as a final-year B.Tech project.

---

# 👥 Developed By

**Team Codivexa**

- Member 1 – Authentication & Student Module
- Member 2 – Learning Module & Assessments
- Member 3 – Admin & Instructor Module

---

## ⭐ If you like this project, don't forget to star the repository!
