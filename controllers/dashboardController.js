const Lawyer = require("../model/lawyer.js");
const Case = require("../model/case.js");
const { generateDailyCauseList } = require("../utils/priorityEngine.js");

// Sample data for demonstration (can be replaced with DB queries)
const sampleCases = [
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
  },
  {
    caseNumber: "CIV/2024/00456",
    court: "High Court, Mumbai",
    stage: "Evidence",
    nextHearing: "Jan 3, 2026",
    timeSlot: "2:00 PM",
    status: "Reserved",
    priority: "medium",
    petitioner: "ABC Corporation Ltd",
    respondent: "XYZ Industries",
    yourSide: "Petitioner"
  },
  {
    caseNumber: "CIV/2024/01890",
    court: "District Court, Pune",
    stage: "Admission",
    nextHearing: "Jan 10, 2026",
    timeSlot: "11:00 AM",
    status: "Pending",
    priority: "high",
    petitioner: "Priya Sharma",
    respondent: "Raj Kumar",
    yourSide: "Respondent"
  },
  {
    caseNumber: "FAM/2024/00445",
    court: "Family Court, Pune",
    stage: "Mediation",
    nextHearing: "Jan 15, 2026",
    timeSlot: "3:30 PM",
    status: "Waiting",
    priority: "medium",
    petitioner: "Anjali Patel",
    respondent: "Vikram Patel",
    yourSide: "Respondent"
  },
  {
    caseNumber: "WP/2024/01012",
    court: "High Court, Mumbai",
    stage: "Arguments",
    nextHearing: "Jan 5, 2026",
    timeSlot: "10:00 AM",
    status: "Listed",
    priority: "high",
    petitioner: "Citizens Rights Association",
    respondent: "State Government",
    yourSide: "Petitioner"
  }
];

const sampleNotifications = [
  {
    type: "urgent",
    icon: "🔴",
    title: "Case Listed Tomorrow",
    caseNumber: "CRL/2024/00123",
    message: "Your case is listed for hearing tomorrow at 10:15 AM in Courtroom 3, District Court.",
    timestamp: "2 hours ago"
  },
  {
    type: "warning",
    icon: "⚠️",
    title: "Defect Raised",
    caseNumber: "CIV/2024/01890",
    message: "Registry has identified defects. Please rectify within 7 days.",
    timestamp: "5 hours ago"
  },
  {
    type: "success",
    icon: "✅",
    title: "Order Reserved",
    caseNumber: "WP/2024/01012",
    message: "Judge has reserved the order after final arguments. Expected within 30 days.",
    timestamp: "1 day ago"
  },
  {
    type: "info",
    icon: "📝",
    title: "Case Adjourned",
    caseNumber: "FAM/2024/00445",
    message: "Case adjourned to Jan 10, 2026 due to respondent's absence.",
    timestamp: "2 days ago"
  }
];

const sampleDefects = [
  {
    caseNumber: "CIV/2024/01890",
    deadline: "Jan 5, 2026",
    reason: "Vakalatnama not properly stamped. Please submit corrected document with proper court fee stamp."
  },
  {
    caseNumber: "CRL/2024/02134",
    deadline: "Jan 8, 2026",
    reason: "Affidavit missing notary seal. Respondent address incomplete."
  }
];

// Get lawyer dashboard data
exports.getLawyerDashboardData = async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    // Return comprehensive dashboard data
    const dashboardData = {
      lawyer: {
        id: lawyer._id,
        name: lawyer.username,
        email: lawyer.email,
        mobile: lawyer.mobile,
        barCouncilNumber: lawyer.BarCouncilRegistrationNumber,
        specializations: lawyer.specializations || [],
        courts: lawyer.courts || [],
        vakalatnamaValidity: lawyer.vakalatnamaValidity
      },
      statistics: {
        todaysHearings: 4,
        upcomingThisWeek: 12,
        awaitingOrders: 8,
        pendingFilings: 2,
        adjournments: 3,
        totalCases: lawyer.totalCases || 0,
        activeCases: lawyer.activeCases || 0,
        disposedCases: lawyer.disposedCases || 0,
        successRate: lawyer.successRate || 0
      },
      cases: sampleCases,
      notifications: sampleNotifications,
      defects: sampleDefects
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
};

// Get all cases for a lawyer
exports.getLawyerCases = async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    // Fetch cases from database for this lawyer (use .lean() for plain JSON)
    const cases = await Case.find({ lawyerId: lawyerId }).sort({ nextHearingDate: 1 }).lean();

    // Ensure each case has a string _id and caseNumber fallback
    const safeCases = (cases || []).map((c, i) => ({
      _id: c._id ? String(c._id) : `C${i}`,
      caseNumber: c.caseNumber || `UNDEF-${i}`,
      petitioner: c.petitioner || '',
      respondent: c.respondent || '',
      caseType: c.caseType || '',
      stage: c.stage || '',
      nextHearingDate: c.nextHearingDate || null,
      timeSlot: c.timeSlot || '',
      status: c.status || '' ,
      courtType: c.courtType || '',
      courtFee: c.courtFee || 0
    }));

    res.json({
      cases: safeCases,
      totalCount: safeCases.length
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ error: "Error fetching cases" });
  }
};

// Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    res.json({
      notifications: sampleNotifications,
      totalCount: sampleNotifications.length,
      unreadCount: 4
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

// Get defects
exports.getDefects = async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    res.json({
      defects: sampleDefects,
      totalCount: sampleDefects.length
    });
  } catch (error) {
    console.error("Error fetching defects:", error);
    res.status(500).json({ error: "Error fetching defects" });
  }
};

// File new case
exports.fileNewCase = async (req, res) => {
  try {
    const { 
      caseType, 
      courtType, 
      petitioner, 
      respondent, 
      stage, 
      nextHearingDate, 
      timeSlot, 
      courtFee,
      affidavitId,
      vakalatnamaNumber
    } = req.body;
    const lawyerId = req.user._id;

    // Validate required fields
    if (!caseType || !courtType || !petitioner || !respondent || !stage || !nextHearingDate || !timeSlot) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate case number and diary number
    const caseNumber = `CASE/${Date.now()}/${Math.floor(Math.random() * 10000)}`;
    const diaryNumber = `DIARY/${Date.now()}/${Math.floor(Math.random() * 10000)}`;

    // Create new case in database
    const newCase = new Case({
      lawyerId: lawyerId,
      caseType: caseType,
      courtType: courtType,
      caseNumber: caseNumber,
      petitioner: petitioner,
      respondent: respondent,
      stage: stage,
      nextHearingDate: new Date(nextHearingDate),
      timeSlot: timeSlot,
      courtFee: courtFee || 0,
      status: "Under Scrutiny",
      affidavitId: affidavitId,
      vakalatnamaNumber: vakalatnamaNumber
    });

    const savedCase = await newCase.save();

    // Update lawyer's case statistics
    const lawyer = await Lawyer.findById(lawyerId);
    if (lawyer) {
      lawyer.totalCases = (lawyer.totalCases || 0) + 1;
      lawyer.activeCases = (lawyer.activeCases || 0) + 1;
      await lawyer.save();
    }

    res.json({
      success: true,
      caseId: savedCase._id,
      caseNumber: caseNumber,
      diaryNumber: diaryNumber,
      status: "Under Scrutiny",
      message: "Case filed successfully. Your case number is: " + caseNumber + " and diary number is: " + diaryNumber
    });
  } catch (error) {
    console.error("Error filing case:", error);
    res.status(500).json({ error: "Error filing case: " + error.message });
  }
};

// Update lawyer profile
exports.updateLawyerProfile = async (req, res) => {
  try {
    const lawyerId = req.user._id;
    const { mobile, specializations, courts } = req.body;

    const updatedLawyer = await Lawyer.findByIdAndUpdate(
      lawyerId,
      {
        mobile: mobile,
        specializations: specializations,
        courts: courts
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      lawyer: updatedLawyer
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
};

// ==========================================
// DAILY CAUSE LIST GENERATION
// ==========================================

/**
 * Get Daily Cause List for Court Master & Judge
 * Generates optimized daily schedule based on priority scoring
 */
exports.getDailyCauseList = async (req, res) => {
  try {
    // Get available court time from query params (default 300 minutes = 5 hours)
    const availableMinutes = parseInt(req.query.availableMinutes) || 300;
    
    // Fetch all pending cases from database as plain objects (.lean())
    const allCases = await Case.find({
      status: { $nin: ["Judgment", "Disposed", "Withdrawn"] }
    }).lean();

    console.log(`getDailyCauseList: fetched ${ (allCases || []).length } cases from DB`);
    if ((allCases || []).length > 0) console.log('Sample case:', allCases[0]);

    // Defensive: ensure nextHearingDate is Date for priority calculations
    const preparedCases = (allCases || []).map(c => ({
      ...c,
      // convert _id to string to avoid unexpected object shapes in client
      _id: c._id ? String(c._id) : c._id,
      nextHearingDate: c.nextHearingDate ? new Date(c.nextHearingDate) : null,
      createdAt: c.createdAt ? new Date(c.createdAt) : null
    }));

    // Generate daily cause list using priority engine
    const dailyCauseListData = generateDailyCauseList(preparedCases, availableMinutes);

    console.log(`getDailyCauseList: generated ${dailyCauseListData.dailyCauseList.length} scheduled cases, totalTimeUsed=${dailyCauseListData.summary.totalMinutesUsed}`);

    res.json({
      success: true,
      date: new Date().toLocaleDateString(),
      data: dailyCauseListData
    });
  } catch (error) {
    console.error("Error generating daily cause list:", error);
    res.status(500).json({ error: "Error generating daily cause list: " + error.message });
  }
};

/**
 * Get case priority details (for modal/detailed view)
 */
exports.getCasePriorityDetails = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const caseObj = await Case.findById(caseId);

    if (!caseObj) {
      return res.status(404).json({ error: "Case not found" });
    }

    const { calculatePriority, estimateCaseTime } = require("../utils/priorityEngine.js");
    
    const priority = calculatePriority(caseObj);
    const estimatedTime = estimateCaseTime(caseObj);

    res.json({
      success: true,
      caseNumber: caseObj.caseNumber,
      priorityScore: priority.score,
      estimatedTime: estimatedTime,
      breakdown: priority.breakdown,
      reasoning: priority.reasoning
    });
  } catch (error) {
    console.error("Error fetching case priority:", error);
    res.status(500).json({ error: "Error fetching case priority" });
  }
};
