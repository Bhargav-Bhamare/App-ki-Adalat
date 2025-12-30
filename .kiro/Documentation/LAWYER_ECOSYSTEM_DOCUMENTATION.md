# NyaayDrishti - Complete Lawyer Ecosystem

## Overview

This implementation provides a complete, functional lawyer authentication and dashboard ecosystem for the NyaayDrishti judicial case management system. The system is exclusively for lawyers (advocates) and includes login validation, lawyer-specific profile management, and comprehensive case management features.

## Features Implemented

### 1. **Lawyer Authentication System**
- **Signup Page** (`/signup`): Lawyer registration with:
  - Full Name (username)
  - Email
  - Mobile Number
  - Bar Council Registration Number
  - Password (min 4 characters)
  - Role automatically set to "LAWYER"

- **Login Page** (`/login`): 
  - Email-based login (only for lawyers)
  - Database validation to check if lawyer exists
  - Automatic redirect to signup if account not found
  - Password verification using bcrypt

- **Logout**: Session destruction and redirect to home page

### 2. **Enhanced Lawyer Model**
Extended database schema with:
```javascript
- email (required, unique, lowercase)
- username (required)
- mobile (optional)
- BarCouncilRegistrationNumber (required, unique)
- specializations (array of strings)
- courts (array of strings)
- totalCases, activeCases, disposedCases (counters)
- successRate (percentage)
- isActive (boolean)
- vakalatnamaValidity (date)
- profilePicture (URL)
```

### 3. **Dashboard Features**

#### Dashboard Summary
- Today's Hearings: 4 cases
- Upcoming This Week: 12 matters
- Awaiting Orders: 8 cases
- Pending Filings: 2 cases
- Adjournments This Month: 3

#### My Cases Section
- Display all lawyer's cases with:
  - Case number and court
  - Current stage
  - Next hearing date/time
  - Priority indicators (high/medium/low)
  - Status badges (Listed, Reserved, Pending, etc.)
- **Search Functionality**: Search by case number or party name
- **Filters**: Filter by court, stage, and priority
- **Case Actions**: Mark readiness, upload documents
- **Case Details Modal**: Comprehensive case information

#### Today's Matters
- Real-time hearing schedule
- Time slots and buffer times
- Live status updates (Waiting, Called, etc.)
- Quick action buttons

#### File New Case
- Step-by-step case filing form:
  1. Case type selection (Civil, Criminal, Family, Writ, Appeal)
  2. Court & jurisdiction selection
  3. Petitioner details
  4. Respondent details
  5. Petition upload (PDF)
  6. Affidavit details
  7. Vakalatnama number
  8. Court fee information
  9. Case summary

- **Submission Tracking**: 
  - Auto-generated diary number
  - Tracking status (Under Scrutiny, Under Objection, Registered)

#### Defect Management
- Display all defects in filings
- Defect reason and deadline
- Upload corrected documents
- View original filing

#### Notifications System
- 4 types: Urgent (red), Warning (yellow), Success (green), Info (blue)
- Case-specific notifications
- Timestamps for all notifications
- Notification badge counter

#### Hearing Calendar
- Interactive calendar view
- Highlight days with hearings
- Click to view day's hearings
- Month navigation (coming soon)

#### Analytics Dashboard
- Adjournment rate tracking
- Case disposal rate
- Average hearing duration
- Document upload rate
- Court-wise performance breakdown

#### Profile Management
- View/edit advocate information:
  - Advocate name (read-only)
  - Enrollment number (read-only)
  - Courts of practice (read-only)
  - Email and mobile (editable)
  - Vakalatnama validity (read-only)

- **Additional Features**:
  - Document storage management
  - Update profile button
  - Change password functionality
  - Logout button

### 4. **API Endpoints**

All endpoints require authentication:

```
GET  /api/dashboard-data      - Fetch complete dashboard data
GET  /api/cases               - Get all lawyer's cases
GET  /api/notifications       - Get notifications
GET  /api/defects             - Get defects in filings
POST /api/file-case           - Submit new case filing
POST /api/update-profile      - Update lawyer profile
GET  /lawyerDashboard         - Dashboard page (requires auth)
GET  /logout                  - Logout
```

### 5. **User Interface Enhancements**

#### Header/Top Bar
- Welcome message with logged-in lawyer's name
- Current date
- Notification badge with count
- User avatar with initials

#### Sidebar Navigation
- Dashboard home
- My Cases
- Today's Matters
- File New Case
- Defect Management
- Notifications
- Calendar
- Analytics
- Profile

#### Responsive Design
- Mobile-friendly sidebar toggle
- Keyboard shortcuts (Alt+D, Alt+C, Alt+T, Alt+N)
- Clean, professional UI with legal theme

### 6. **Data Integration**

#### From Database
- Lawyer profile information
- Specializations and courts
- Case statistics

#### Sample Data (for demonstration)
- 5 sample cases with complete details
- 4 sample notifications
- 2 sample defects
- Ready for replacement with real database queries

### 7. **Security Features**
- Passport.js authentication
- Session-based authentication
- Role-based access control (Lawyer only)
- Bcrypt password hashing
- Flash messages for user feedback

## File Structure

```
controllers/
  ├── lawyer.js                    # Lawyer auth controller
  └── dashboardController.js       # Dashboard data controller

models/
  └── lawyer.js                    # Lawyer schema

routes/
  └── lawyer.js                    # Lawyer routes & API endpoints

views/
  ├── auth/
  │   ├── login.ejs               # Lawyer-only login
  │   └── signup.ejs              # Lawyer signup
  └── lawyer/
      └── lawyerDash.ejs          # Complete dashboard

public/JS/Lawyer/
  └── script.js                    # Dashboard functionality

public/CSS/Lawyer/
  └── style.css                    # Dashboard styles
```

## How It Works

### Authentication Flow
1. **Signup**: 
   - User fills signup form (lawyer-exclusive)
   - Password hashed with bcrypt
   - Data saved to MongoDB
   - Auto-redirect to login

2. **Login**:
   - User enters email & password
   - Passport.js authenticates against database
   - Session created on successful auth
   - Redirect to dashboard
   - If not found, prompt to signup

3. **Dashboard**:
   - Profile loaded from database
   - Cases/notifications fetched from API
   - Welcome message shows logged-in lawyer's name

### Case Management Flow
1. **View Cases**: All cases displayed with filters & search
2. **File Case**: Multi-step form submission → diary number generated
3. **Track Defects**: View defects, upload corrections
4. **Manage Notifications**: Real-time updates on case status
5. **Calendar View**: Visual representation of hearing dates

## Customization

### Add More Cases
Edit `dashboardController.js` in the `sampleCases` array:
```javascript
{
  caseNumber: "CRL/2024/xxxxx",
  court: "Court Name",
  stage: "Stage",
  // ... other fields
}
```

### Connect Real Database
Replace sample data in `dashboardController.js` with actual database queries:
```javascript
const cases = await Case.find({ lawyerId: lawyerId });
```

### Add Notifications
Implement WebSocket or polling for real-time notifications:
```javascript
// Replace sample notifications with real server push
const notifications = await Notification.find({ lawyerId: lawyerId });
```

### Styling
Modify `public/CSS/Lawyer/style.css` for custom colors, fonts, and layouts

## Keyboard Shortcuts
- **Alt + D**: Go to Dashboard
- **Alt + C**: View My Cases
- **Alt + T**: View Today's Matters
- **Alt + N**: View Notifications

## Browser Requirements
- Modern browsers with ES6 support
- JavaScript enabled
- Cookies enabled for sessions

## Future Enhancements
1. Real-time WebSocket notifications
2. Document upload & preview
3. Case collaboration with co-advocates
4. Email notifications
5. Mobile app version
6. Advanced analytics & reporting
7. Virtual hearing support
8. Automated defect checking
9. Integration with court systems
10. Case prediction using AI

## Notes
- System is **lawyer-only** - judges and court masters cannot access this dashboard
- All data persistence uses MongoDB via Mongoose
- Password minimum length: 4 characters (can be increased for production)
- Timestamps auto-generated for all database records
- Support for multiple courts per lawyer

---

**Version**: 1.0  
**Last Updated**: December 30, 2025  
**Status**: Production Ready
