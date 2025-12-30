# 🧪 DAILY CAUSE LIST - COMPLETE TESTING GUIDE

## ✅ TESTING CHECKLIST

### Phase 1: Setup (5 minutes)

- [ ] Start MongoDB server
- [ ] Start Node.js application
- [ ] Access http://localhost:3000
- [ ] Login as test lawyer (test@lawyer.com / password123)

---

## Phase 2: File Test Cases (10 minutes)

File 5-6 different cases with varying properties:

### Case 1: Criminal Bail (High Priority Expected)
```
Case Type: criminal
Court Type: district
Petitioner: Ramesh Singh (senior citizen, age 75)
Respondent: State of Maharashtra
Stage: final arguments
Next Hearing Date: TODAY
Time Slot: 10:30 AM
Affidavit ID: 101
Vakalatnama: 1001
Court Fee: 5000

Expected Priority: 🔴 CRITICAL (0.90+)
Expected Duration: 20 minutes
```

### Case 2: Civil Suit (Medium Priority)
```
Case Type: civil
Court Type: high
Petitioner: ABC Corporation Ltd
Respondent: XYZ Industries
Stage: evidence
Next Hearing Date: 5 days from now
Time Slot: 2:00 PM
Affidavit ID: 102
Vakalatnama: 1002
Court Fee: 10000

Expected Priority: 🟡 MEDIUM (0.40-0.60)
Expected Duration: 30 minutes
```

### Case 3: Family Matter (Medium Priority)
```
Case Type: family
Court Type: district
Petitioner: Anjali Patel (woman litigant)
Respondent: Vikram Patel
Stage: hearing
Next Hearing Date: 3 days from now
Time Slot: 11:00 AM
Affidavit ID: 103
Vakalatnama: 1003
Court Fee: 2000

Expected Priority: 🟡 MEDIUM (0.50+)
Expected Duration: 25 minutes
```

### Case 4: Criminal (Medium-High Priority)
```
Case Type: criminal
Court Type: district
Petitioner: State of Delhi
Respondent: Mohan Lal
Stage: arguments
Next Hearing Date: 30 days ago (PAST - triggers age calculation)
Time Slot: 3:00 PM
Affidavit ID: 104
Vakalatnama: 1004
Court Fee: 3000

Expected Priority: 🟠 HIGH (0.70-0.80)
Expected Duration: 50 minutes
```

### Case 5: Civil Appeal (Lower Priority)
```
Case Type: civil
Court Type: high
Petitioner: Person A
Respondent: Person B
Stage: admission
Next Hearing Date: 5 days from now
Time Slot: 1:00 PM
Affidavit ID: 105
Vakalatnama: 1005
Court Fee: 8000

Expected Priority: 🟢 NORMAL (0.20-0.40)
Expected Duration: 8 minutes
```

### Case 6: Criminal with Age (High Priority)
```
Case Type: criminal
Court Type: district
Petitioner: Village Council
Respondent: Private Party
Stage: final arguments
Next Hearing Date: 90 days ago (VERY OLD)
Time Slot: 4:00 PM
Affidavit ID: 106
Vakalatnama: 1006
Court Fee: 4000

Expected Priority: 🔴 CRITICAL (0.85+)
Expected Duration: 60 minutes
```

---

## Phase 3: View Judge Dashboard (5 minutes)

### Step 1: Navigate to Judge Dashboard
```
URL: http://localhost:3000/judge (or your judge dashboard URL)
Expected: Daily Cause List table appears on right panel
```

### Step 2: Verify Cases Display
```
Check:
✓ All 6 cases appear in the table
✓ Cases ordered by priority (highest first)
✓ Each case shows: Case #, Title, Stage, Time slot
✓ Table has proper styling
```

### Step 3: Expected Order in List
```
1. Case 6 - Criminal (Final Args, 90 days) - 🔴 0.95
2. Case 1 - Criminal Bail (Senior citizen) - 🔴 0.90
3. Case 4 - Criminal (Arguments, 30 days) - 🟠 0.75
4. Case 3 - Family (Vulnerability) - 🟡 0.55
5. Case 2 - Civil (Evidence) - 🟡 0.50
6. Case 5 - Civil (Admission) - 🟢 0.35
```

### Step 4: Verify Time Slot Assignment
```
Expected allocation (in order):
Case 6: 10:30-11:30 (60 min)
Case 1: 11:30-11:50 (20 min)
Case 4: 11:50-12:40 (50 min)
Case 3: 12:40-13:05 (25 min)
Case 2: 13:05-13:35 (30 min)

Total used: 185 minutes
Buffer remaining: 115 minutes (out of 300)
Utilization: 65% (Good! - target 70-85%)
```

---

## Phase 4: Click Case and View Priority Details (5 minutes)

### Step 1: Click Case #1 (Bail)
```
Expected Modal Opens Showing:
├─ Case Number: CASE/...
├─ Priority Score: ~90%
├─ Estimated Time: 20 minutes
│
├─ Factor Breakdown Table:
│  ├─ Age: 5% weight × 0.20 factor = 1% contribution
│  ├─ Category: 20% weight × 0.95 factor = 19% contribution
│  ├─ Stage: 40% weight × 0.95 factor = 38% contribution
│  ├─ Vulnerability: 15% weight × 0.50 factor = 7.5% contribution
│  └─ Adjournment: 20% weight × 0 = 0% contribution
│
└─ Reasoning Points:
   ├─ 👥 Vulnerable party involved (senior citizen)
   ├─ 🔴 Final arguments stage - high priority
   ├─ ⚖️ Criminal Bail - very high importance
   └─ ⏳ Case is recent (age not major factor)
```

### Step 2: Verify All Values Make Sense
```
Checklist:
✓ Percentages add up to 90-95%
✓ Reasoning includes relevant factors
✓ Vulnerability detected correctly
✓ Stage weight is dominant (40%)
✓ No math errors
```

### Step 3: Click Close and Try Another Case
```
Click Case #5 (Civil Admission):
Expected:
├─ Lower priority score (~35%)
├─ Shorter estimated time (8 min)
├─ Reasoning shows early stage
└─ No vulnerability factor
```

---

## Phase 5: Real-Time Updates (5 minutes)

### Step 1: Keep Judge Dashboard Open
```
Note the current time and list
Wait and observe the auto-refresh counter
(Updates every 30 seconds)
```

### Step 2: File Another Case (New Tab)
```
Open lawyer dashboard in new tab
File a new case:
├─ Case Type: criminal
├─ Stage: arguments
├─ Petitioner: New Case Test
├─ Respondent: Test State
└─ Other details: as needed

Click "Submit for Filing"
Expected: Success alert, case saved
```

### Step 3: Watch Judge Dashboard Auto-Update
```
Within 30 seconds:
✓ Judge dashboard page refreshes
✓ New case appears in Daily Cause List
✓ Cases re-ordered by priority
✓ New case gets appropriate priority score
✓ Time slots recalculated
```

---

## Phase 6: Mobile Responsiveness (5 minutes)

### Step 1: Open Judge Dashboard on Mobile
```
Methods:
- Use browser developer tools (F12 → Ctrl+Shift+M)
- Or view on actual mobile device
```

### Step 2: Test Responsive Design
```
Check:
✓ Daily Cause List table is readable
✓ Case details still visible
✓ Priority bars scale properly
✓ Modal closes without issue
✓ No horizontal scrolling needed
```

### Step 3: Test Touch Interactions
```
✓ Click/tap cases work smoothly
✓ Modal opens and closes
✓ All buttons responsive
✓ No layout broken on small screens
```

---

## Phase 7: Browser Console Verification (5 minutes)

### Step 1: Open Developer Tools
```
Press: F12 (or right-click → Inspect)
Go to: Console tab
```

### Step 2: Check for Errors
```
Expected: NO red error messages
Expected: Possible info/warning logs

Search for keywords:
✗ "Error loading daily cause list"
✗ "Failed to fetch"
✗ "undefined"
✗ Any JavaScript errors
```

### Step 3: Check Network Tab
```
Go to: Network tab
Refresh page
Look for:
✓ GET /api/daily-cause-list (should be 200 OK)
✓ Response contains valid JSON
✓ Load time < 1 second
```

### Step 4: Verify API Response
```
Click the daily-cause-list request
Go to: Response tab
Expected structure:
{
  "success": true,
  "date": "MM/DD/YYYY",
  "data": {
    "dailyCauseList": [...],
    "summary": {...}
  }
}
```

---

## Phase 8: Advanced Tests (Optional)

### Test A: Performance with Many Cases
```
File 20+ test cases
Observe:
✓ Page still loads quickly
✓ Auto-refresh completes in <5 seconds
✓ UI remains responsive
✓ No freezing or lag
```

### Test B: Different Case Combinations
```
Try combinations:
├─ All criminal cases
├─ All civil cases
├─ Mix of types
└─ Edge cases (very old vs very new)

Verify:
✓ Priority algorithm handles all types
✓ Time slots calculated correctly
✓ Constraints enforced
```

### Test C: Constraint Verification
```
Theory: Max 2 final argument cases per day

Test:
1. File 5 cases with stage = "final arguments"
2. Check daily cause list
3. Verify only 2 appear (others excluded)
4. Confirm constraint works

Expected: ✓ Constraint enforced
```

### Test D: Time Estimation Accuracy
```
Compare estimated times to actual:
1. Note estimated times in cause list
2. As cases are heard, compare to actual
3. Refine time estimates if needed

Track:
├─ Criminal arguments: expected 60, actual 50
├─ Civil evidence: expected 30, actual 25
└─ Family hearing: expected 25, actual 22
```

---

## ✅ SUCCESS CRITERIA

All of the following should be true:

### Basic Functionality
- [ ] Cases appear in daily cause list
- [ ] Cases ordered by priority score
- [ ] Priority scores in 0-1 range
- [ ] Time slots non-overlapping
- [ ] Auto-refresh works (30 sec interval)

### Accuracy
- [ ] Age factor calculated correctly
- [ ] Category weights applied properly
- [ ] Stage weights dominant (40%)
- [ ] Vulnerability detected for seniors/women
- [ ] Adjournment boost applied when needed

### UI/UX
- [ ] Colors match priority (red=urgent, green=low)
- [ ] Animations smooth and visible
- [ ] Modal opens/closes properly
- [ ] Mobile responsive and usable
- [ ] No console errors

### Real-Time Updates
- [ ] New case appears within 30 sec
- [ ] Priority recalculated for new case
- [ ] List reorders automatically
- [ ] No manual refresh needed
- [ ] Page doesn't reload abruptly

### Performance
- [ ] Loads in <1 second
- [ ] Handles 50+ cases smoothly
- [ ] API response <500ms
- [ ] UI renders without lag
- [ ] Mobile performance acceptable

---

## 🐛 DEBUGGING TIPS

### If Cases Don't Appear

**Step 1: Verify Cases Exist**
```javascript
// In browser console:
fetch('/api/daily-cause-list')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Step 2: Check Database**
```bash
# In MongoDB client:
db.cases.find().pretty()  # Should show your test cases
db.cases.count()          # Should be > 0
```

**Step 3: Check API**
```bash
curl http://localhost:3000/api/daily-cause-list
# Should return valid JSON
```

---

### If Priorities Seem Wrong

**Step 1: Verify Formula**
```javascript
// Review priorityEngine.js
// Check W_age, W_cat, W_stage, W_vul, W_adj values
// Should be 0.05, 0.20, 0.40, 0.15, 0.20
```

**Step 2: Check Case Data**
```javascript
// Verify case object has:
✓ caseType (lowercase)
✓ stage (lowercase)
✓ createdAt or nextHearingDate (for age calc)
✓ Other required fields
```

**Step 3: Manually Calculate**
```
Case: criminal, stage="final arguments", 30 days old
A = 30/100 = 0.30
C = 0.80
S = 0.95
V = 0 (no seniors/women)
L = 0 (not adjourned)

Ps = (0.05×0.30) + (0.20×0.80) + (0.40×0.95) + 0 + 0
   = 0.015 + 0.16 + 0.38
   = 0.555 (55.5%)

Compare with actual score in UI
```

---

### If Time Slots Overlap

**Solution:**
Check `estimateCaseTime()` function
Verify case type + stage combinations
Reduce estimated times if too long

---

### If Auto-Refresh Doesn't Work

**Step 1: Check JavaScript Console**
```
Look for errors related to setInterval
Verify loadDailyCauseList() is defined
Check if fetch is completing
```

**Step 2: Verify API Endpoint**
```bash
curl http://localhost:3000/api/daily-cause-list
# Should return data without errors
```

**Step 3: Check Server Logs**
```
Look for errors in Node.js console
Verify GET /api/daily-cause-list requests appear
```

---

## 📊 TEST RESULT TRACKING

Create a spreadsheet:

| Test | Expected | Actual | Pass? | Notes |
|------|----------|--------|-------|-------|
| Cases appear | 6 cases | ? | ? | |
| Order correct | By priority | ? | ? | |
| Priority scores | 0.0-1.0 range | ? | ? | |
| Time calculation | Non-overlapping | ? | ? | |
| Mobile responsive | Readable on mobile | ? | ? | |
| Auto-refresh | Updates in 30 sec | ? | ? | |
| No console errors | 0 errors | ? | ? | |
| Performance | <1 sec load | ? | ? | |

---

## 🎉 FINAL VERIFICATION

Once all tests pass:

1. ✅ Document any customizations made
2. ✅ Note any performance metrics observed
3. ✅ Take screenshots of working system
4. ✅ Create backup of database
5. ✅ Ready for production deployment!

---

**Testing Status:** Ready to begin
**Estimated Time:** 45-60 minutes
**Difficulty:** Easy (no coding required)

Start with Phase 1 and work through sequentially.

Good luck testing! 🚀

