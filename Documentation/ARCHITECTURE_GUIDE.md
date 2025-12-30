# Lawyer Ecosystem - Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  lawyerDash.ejs (HTML Structure)                          │  │
│  │  ├─ Sidebar Navigation                                   │  │
│  │  ├─ Dashboard Sections (10 sections)                     │  │
│  │  ├─ Case Management Interface                            │  │
│  │  ├─ Modal Windows                                        │  │
│  │  └─ Form Components                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  script.js (Frontend Logic & API Calls)                  │  │
│  │  ├─ Profile Loading                                      │  │
│  │  ├─ Section Navigation                                   │  │
│  │  ├─ Case Management (CRUD)                               │  │
│  │  ├─ Search & Filters                                     │  │
│  │  ├─ Modals & Forms                                       │  │
│  │  ├─ API Integration                                      │  │
│  │  └─ Event Handlers                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  style.css (Styling & Responsive Design)                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             ↓ HTTP/AJAX
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (Node.js)                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Routes (lawyer.js)                                       │  │
│  │  ├─ /signup                    → renderSignUp             │  │
│  │  ├─ /login                     → renderLogin              │  │
│  │  ├─ /logout                    → logout                   │  │
│  │  ├─ /lawyerDashboard          → dashboard page           │  │
│  │  └─ /api/*                     → API endpoints            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Controllers                                              │  │
│  │  ├─ lawyer.js (Authentication)                           │  │
│  │  │   ├─ renderSignUp()                                   │  │
│  │  │   ├─ registerLawyer()                                 │  │
│  │  │   ├─ renderLogin()                                    │  │
│  │  │   ├─ login()                                          │  │
│  │  │   └─ logout()                                         │  │
│  │  │                                                        │  │
│  │  └─ dashboardController.js (Dashboard Data)              │  │
│  │      ├─ getLawyerDashboardData()                         │  │
│  │      ├─ getLawyerCases()                                 │  │
│  │      ├─ getNotifications()                               │  │
│  │      ├─ getDefects()                                     │  │
│  │      ├─ fileNewCase()                                    │  │
│  │      └─ updateLawyerProfile()                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Middleware & Authentication                             │  │
│  │  ├─ Passport.js (Local Strategy)                         │  │
│  │  ├─ Session Management                                   │  │
│  │  ├─ Flash Messages                                       │  │
│  │  └─ Role-Based Access Control                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             ↓ Mongoose ORM
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER (MongoDB)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Collections                                              │  │
│  │  ├─ Lawyers (Users)                                       │  │
│  │  │   ├─ email                                             │  │
│  │  │   ├─ password (hashed)                                 │  │
│  │  │   ├─ BarCouncilRegistrationNumber                      │  │
│  │  │   ├─ mobile                                            │  │
│  │  │   ├─ specializations                                   │  │
│  │  │   ├─ courts                                            │  │
│  │  │   ├─ totalCases, activeCases, disposedCases           │  │
│  │  │   └─ successRate                                       │  │
│  │  │                                                        │  │
│  │  ├─ Cases (from sample data - ready for real DB)          │  │
│  │  ├─ Notifications (from sample data)                      │  │
│  │  └─ Defects (from sample data)                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Authentication Flow

```
┌──────────────┐
│  User Visits │
│   /login     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Login Form (login.ejs)              │
│  - Email input                       │
│  - Password input                    │
│  - Only "Advocate Login" button      │
│  (No Judge/Court Master options)     │
└──────┬───────────────────────────────┘
       │ POST /login
       ▼
┌──────────────────────────────────────┐
│  Passport Authentication             │
│  - Find lawyer in DB by email        │
│  - Compare password hash             │
│  - Create session                    │
└──────┬───────────────────────────────┘
       │
    Success?
      / \
     /   \
    /     \
   ✓       ✗
  /         \
 ▼           ▼
YES          NO
 │           │
 │        Invalid
 │        Credentials
 │           │
 │    Redirect to /login
 │    with error message
 │
 ▼
Redirect to
/lawyerDashboard
│
▼
Check User Exists ──┐
in Database          │
                     │
   Yes ──────────────┘
   │                 │
   │              (If Missing)
   │              Redirect to
   │              /signup
   ▼
Dashboard Loads
- Fetch lawyer profile
- Load cases, notifications
- Display welcome message
- Show lawyer's name
```

---

## 🔄 Case Management Data Flow

```
USER ACTION: View My Cases
       │
       ▼
Click "My Cases" in Sidebar
       │
       ▼
showSection('my-cases')
       │
       ▼
loadAllCases()
       │
       ▼
fetch('/api/cases')
       │
       ▼
┌──────────────────────────────────────┐
│  Backend: GET /api/cases             │
│  ├─ Check authentication             │
│  ├─ Get lawyerId from session        │
│  ├─ Query cases for lawyer           │
│  └─ Return JSON                      │
└──────┬───────────────────────────────┘
       │
       ▼
displayCases(data)
       │
       ▼
Render case cards in DOM
│
├─ Case Number & Court
├─ Stage & Deadline
├─ Priority Indicator
├─ Status Badge
└─ Action Buttons


USER ACTION: Search/Filter Cases
       │
       ▼
Type in search box or
select filter option
       │
       ▼
filterCases()
       │
       ▼
Apply filters to allCases array
└─ Search term (case number/party)
  ├─ Court filter
  ├─ Stage filter
  └─ Priority filter
       │
       ▼
displayCases(filtered)
       │
       ▼
Update case list in DOM
```

---

## 📝 Case Filing Flow

```
USER ACTION: File New Case
       │
       ▼
Click "File New Case" in Sidebar
       │
       ▼
Show filing form with 6 steps
│
├─ Step 1: Case Type (dropdown)
├─ Step 2: Court (dropdown)
├─ Step 3: Petitioner Name (input)
├─ Step 4: Respondent Name (input)
├─ Step 5: Petition File (file upload)
├─ Step 6: Court Fee (number)
└─ Case Summary (textarea)
       │
       ▼
User fills form & clicks Submit
       │
       ▼
submitCaseFiling(event)
       │
       ▼
Validate form data
       │
       ▼
fetch('/api/file-case', {
  method: 'POST',
  body: formData
})
       │
       ▼
┌──────────────────────────────────────┐
│  Backend: POST /api/file-case        │
│  ├─ Validate inputs                  │
│  ├─ Generate diary number            │
│  ├─ Create case record               │
│  ├─ Save to database                 │
│  └─ Return diary number              │
└──────┬───────────────────────────────┘
       │
       ▼
Success Response
{
  success: true,
  diaryNumber: "DIARY/xxxx/xxxx",
  status: "Under Scrutiny",
  message: "Case filed successfully"
}
       │
       ▼
Display success alert
       │
       ▼
Clear form
       │
       ▼
Update case list
```

---

## 🔔 Notification System Flow

```
USER ACTION: View Notifications
       │
       ▼
Click "Notifications" in Sidebar
       │
       ▼
loadNotifications()
       │
       ▼
fetch('/api/notifications')
       │
       ▼
┌──────────────────────────────────────┐
│  Backend: GET /api/notifications     │
│  ├─ Get lawyerId                     │
│  ├─ Query notifications              │
│  ├─ Count unread                     │
│  └─ Return with metadata             │
└──────┬───────────────────────────────┘
       │
       ▼
displayNotifications(notifications)
       │
       ▼
For each notification:
├─ Get type (urgent/warning/success/info)
├─ Set border color based on type
│  ├─ urgent → Red
│  ├─ warning → Yellow
│  ├─ success → Green
│  └─ info → Blue
├─ Display icon, title, message
└─ Show timestamp
       │
       ▼
Update notification badge count
       │
       ▼
Render in UI


REAL-TIME UPDATES (Future)
       │
       ▼
WebSocket Connection
       │
       ├─ Server pushes new notification
       │
       ├─ Client receives via WebSocket
       │
       ├─ Sound/visual alert
       │
       ├─ Update badge count
       │
       └─ Add to notification list
```

---

## 📊 Data Structure

### Lawyer Document (MongoDB)
```javascript
{
  _id: ObjectId,
  username: "John Doe",
  email: "john@lawyer.com",
  password: "hashed_password_bcrypt",
  BarCouncilRegistrationNumber: 12345,
  mobile: "9876543210",
  specializations: ["Criminal Law", "Civil Law"],
  courts: ["District Court", "High Court"],
  totalCases: 28,
  activeCases: 12,
  disposedCases: 16,
  successRate: 72,
  isActive: true,
  vakalatnamaValidity: Date,
  profilePicture: "url/to/image",
  createdAt: Date,
  updatedAt: Date
}
```

### Case Object (Sample/Real)
```javascript
{
  caseNumber: "CRL/2024/00123",
  court: "District Court, Pune",
  stage: "Arguments",
  nextHearing: "Dec 28, 2025",
  timeSlot: "10:30 AM",
  status: "Listed",
  priority: "high",
  petitioner: "Ramesh Singh",
  respondent: "State of Maharashtra",
  yourSide: "Petitioner"
}
```

### Notification Object
```javascript
{
  type: "urgent",
  icon: "🔴",
  title: "Case Listed Tomorrow",
  caseNumber: "CRL/2024/00123",
  message: "Your case is listed...",
  timestamp: "2 hours ago"
}
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Route Protection              │
│  └─ Check user logged in (/lawyerDash)  │
└─────────┬───────────────────────────────┘
          │
┌─────────▼───────────────────────────────┐
│  Layer 2: Authentication                │
│  ├─ Passport.js Local Strategy          │
│  ├─ Compare password hashes             │
│  └─ Session creation                    │
└─────────┬───────────────────────────────┘
          │
┌─────────▼───────────────────────────────┐
│  Layer 3: Authorization                 │
│  ├─ Check role is LAWYER                │
│  ├─ Verify user in session              │
│  └─ Restrict admin routes               │
└─────────┬───────────────────────────────┘
          │
┌─────────▼───────────────────────────────┐
│  Layer 4: Data Protection               │
│  ├─ HTTPS (in production)               │
│  ├─ Encrypted passwords (bcrypt)        │
│  ├─ Session security                    │
│  └─ No sensitive data in URLs           │
└─────────┬───────────────────────────────┘
          │
┌─────────▼───────────────────────────────┐
│  Layer 5: Input Validation              │
│  ├─ Validate email format               │
│  ├─ Validate password length            │
│  ├─ Sanitize inputs                     │
│  └─ Check required fields               │
└─────────────────────────────────────────┘
```

---

## 🎯 User Journey Map

```
FIRST TIME USER:

     Signup Page
           │
           ├─ Fill form
           ├─ Verify email
           └─ Set password
           │
           ▼
     Login Page
           │
           └─ Enter credentials
           │
           ▼
     Dashboard (First Time)
           │
           ├─ See welcome message
           ├─ Check profile
           ├─ View sample cases
           └─ Explore features
           │
           ▼
     Learn System
           │
           ├─ Read documentation
           ├─ Try all sections
           └─ File a practice case
           │
           ▼
     Regular Usage


RETURNING USER:

     Login Page
           │
           └─ Quick login
           │
           ▼
     Dashboard
           │
           ├─ View notifications
           ├─ Check cases
           ├─ File new cases
           └─ Update profile
           │
           ▼
     Frequent Tasks
           │
           ├─ Monitor hearings
           ├─ Track defects
           └─ View analytics
           │
           ▼
     Logout
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Client Layer                    │
│  (Browser - Any OS/Device)              │
└────────────┬────────────────────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────────────┐
│         Load Balancer (Optional)        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│    Node.js Application Server           │
│    (Express + Passport + Socket.io)     │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐   ┌──────────────┐
│ Session  │   │  File Upload │
│  Store   │   │   Storage    │
│  (Redis) │   │   (AWS S3)   │
└──────────┘   └──────────────┘
      │             │
      └──────┬──────┘
             │
             ▼
┌─────────────────────────────────────────┐
│       MongoDB Database                  │
│  (Lawyers, Cases, Notifications, etc.)  │
└─────────────────────────────────────────┘
```

---

## 📈 Performance Optimization

```
Frontend Optimization:
├─ Lazy load sections
├─ Cache API responses
├─ Debounce search/filter
├─ Minimize DOM updates
└─ Use event delegation

Backend Optimization:
├─ Database indexing
├─ Query optimization
├─ Connection pooling
├─ Caching layer
└─ API response compression

Database Optimization:
├─ Create indexes on frequently queried fields
├─ Archive old data
├─ Regular vacuum
└─ Connection pooling
```

---

**Architecture Complete**  
**Last Updated**: December 30, 2025
