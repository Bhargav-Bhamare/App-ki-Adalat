# NyaayDrishti Lawyer Login - Quick Testing Guide

## 🔧 What Was Fixed

The login issue was caused by a **mismatch between the login form field and Passport authentication configuration**:
- Your form sends: `email` field
- Passport expected: `username` field (default)
- **Solution:** Configured Passport to use `email` as the login field

## ✅ Quick Start

### Step 1: Start the Server
```bash
cd e:\Bhargav\NyaayDrishti
npm start
```

### Step 2: Open Login Page
Navigate to: `http://localhost:3000/login`

### Step 3: Login with Test Account
- **Email:** `test@lawyer.com`
- **Password:** `password123`

### Step 4: Expected Result
You should see:
1. ✓ Form submission succeeds
2. ✓ Redirected to `/lawyerDashboard`
3. ✓ Dashboard displays with lawyer info
4. ✓ Logged-in lawyer name visible

## 🔍 If Login Still Fails

### Check Error Messages
- Now you'll see **specific error messages** displayed on the login page
- Common errors:
  - "Incorrect password" - Password is wrong
  - "User not found" - Email doesn't exist
  - "An error occurred" - Server-side issue

### Debug Steps

1. **Verify test account exists:**
   ```bash
   node seed_test_lawyer.js
   ```
   Should show: `Test lawyer created successfully!`

2. **Check MongoDB connection:**
   ```bash
   node test_mongo.js
   ```
   Should show: `✓ MongoDB connection successful!`

3. **Check server logs**
   Look for errors in the terminal where you started `npm start`

## 📝 Creating Additional Test Accounts

You can now create accounts via the signup page:
1. Go to: `http://localhost:3000/signup`
2. Fill in all required fields:
   - Username (Lawyer Name)
   - Email
   - Password (minimum 6 characters recommended)
   - Bar Council Registration Number
   - Mobile Number
3. Click "Create Account"
4. You'll be automatically logged in
5. Complete your profile if needed

## 🎯 Key Changes Made

| File | Change |
|------|--------|
| `app.js` | Added `usernameField: 'email'` to LocalStrategy |
| `model/lawyer.js` | Added `usernameField: 'email'` to plugin config |
| `views/auth/login.ejs` | Added error message display block |
| `public/CSS/authstyles.css` | Added `.error-message` styling |

## 🚀 Next Steps (After Successful Login)

Once login works:
1. ✓ Dashboard displays lawyer information
2. ✓ Case management features work
3. ✓ All 10+ dashboard sections are functional
4. ✓ Dynamic lawyer name displays throughout

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to MongoDB" | Start MongoDB server: `mongod` |
| "Form not submitting" | Check browser console for JS errors |
| "Blank error message" | Server may not have restarted - restart with `npm start` |
| "Wrong password error" | Ensure exact match - is Caps Lock on? |
| "User not found" | Create account via signup page first |

## ✨ You're All Set!

The login functionality is now fixed and ready to use. Test with the provided credentials, and the full lawyer ecosystem will be accessible!
