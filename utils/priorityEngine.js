// ==========================================
// PRIORITY ENGINE - DAILY CAUSE LIST GENERATOR
// ==========================================

const Case = require("../model/case.js");

// ==========================================
// PART 1: URGENCY SCORE ALGORITHM
// ==========================================

/**
 * Calculate Priority Score (Ps) for a case
 * Formula: Ps = (W_age × A) + (W_cat × C) + (W_stage × S) + (W_vul × V) + (W_adj × L)
 * 
 * @param {Object} caseObj - Case object from database
 * @returns {Object} - {score: number, breakdown: object}
 */
function calculatePriority(caseObj) {
  // Weights
  const W_age = 0.05;      // Weight for age
  const W_cat = 0.20;      // Weight for category
  const W_stage = 0.40;    // Weight for stage (VERY IMPORTANT)
  const W_vul = 0.15;      // Weight for vulnerability
  const W_adj = 0.20;      // Weight for adjournment compensation

  // A - Age of Case (days since filing)
  const filingDate = new Date(caseObj.createdAt || caseObj.nextHearingDate);
  const today = new Date();
  const ageInDays = Math.floor((today - filingDate) / (1000 * 60 * 60 * 24));
  const A = Math.min(ageInDays / 100, 1); // Normalize to 0-1, cap at 365 days

  // C - Case Category Weight
  const categoryWeights = {
    habeas: 1.0,          // Habeas Corpus - highest priority
    bail: 0.95,           // Bail applications
    criminal: 0.80,       // Criminal cases
    family: 0.65,         // Family matters
    civil: 0.50,          // Civil suits
    writ: 0.75,           // Writ petitions
    appeal: 0.70,         // Appeals
    commercial: 0.45,     // Commercial
    land: 0.40            // Land disputes
  };
  const C = categoryWeights[caseObj.caseType?.toLowerCase()] || 0.50;

  // S - Stage Weight (CRITICAL - cases in later stages get priority)
  const stageWeights = {
    filing: 0.10,
    admission: 0.20,
    summons: 0.25,
    evidence: 0.50,
    arguments: 0.75,
    "final arguments": 0.95,  // HIGHEST - must be heard
    judgment: 0.90,
    hearing: 0.40
  };
  const S = stageWeights[caseObj.stage?.toLowerCase()] || 0.20;

  // V - Vulnerability Factor
  // Check if case involves vulnerable parties (simplified - can be expanded)
  let V = 0;
  if (caseObj.petitioner && caseObj.petitioner.toLowerCase().includes("senior")) V = 0.5;
  if (caseObj.petitioner && caseObj.petitioner.toLowerCase().includes("woman")) V = 0.4;
  if (caseObj.respondent && caseObj.respondent.toLowerCase().includes("senior")) V = 0.5;
  V = Math.min(V, 1);

  // L - Adjournment Compensation
  // If case was adjourned recently due to court time, give boost
  let L = 0;
  // Check if case has been hearing multiple times (simplified)
  // In real scenario, track adjournment history in database
  if (caseObj.status === "Adjourned" || caseObj.stage === "admission") {
    L = 0.30; // Boost for adjourned cases
  }

  // Calculate final priority score
  const priorityScore = (W_age * A) + (W_cat * C) + (W_stage * S) + (W_vul * V) + (W_adj * L);

  return {
    score: priorityScore,
    breakdown: {
      age: { weight: W_age, factor: A, contribution: W_age * A },
      category: { weight: W_cat, factor: C, contribution: W_cat * C },
      stage: { weight: W_stage, factor: S, contribution: W_stage * S },
      vulnerability: { weight: W_vul, factor: V, contribution: W_vul * V },
      adjournment: { weight: W_adj, factor: L, contribution: W_adj * L }
    },
    reasoning: generatePriorityReasoning(caseObj, {A, C, S, V, L})
  };
}

/**
 * Generate human-readable reasoning for priority score
 */
function generatePriorityReasoning(caseObj, factors) {
  const reasons = [];
  
  const {A, C, S, V, L} = factors;
  
  if (A > 0.5) reasons.push(`⏳ Case is ${Math.floor(A * 365)} days old`);
  
  if (S > 0.85) reasons.push("🔴 Final arguments stage - high priority");
  else if (S > 0.70) reasons.push("🟠 Arguments stage");
  else if (S > 0.40) reasons.push("🟡 Evidence/Hearing stage");
  else reasons.push("🟢 Early stage - admission/filing");
  
  if (C > 0.75) reasons.push(`⚖️ ${caseObj.caseType} - high importance category`);
  
  if (V > 0) reasons.push("👥 Vulnerable party involved");
  
  if (L > 0) reasons.push("📅 Compensation for previous adjournment");
  
  return reasons;
}

// ==========================================
// PART 2: TIME ESTIMATION
// ==========================================

/**
 * Estimate how much time a case needs in court
 * 
 * @param {Object} caseObj - Case object
 * @returns {number} - Time in minutes
 */
function estimateCaseTime(caseObj) {
  const timeEstimates = {
    // Format: "caseType-stage": minutes
    "habeas-hearing": 20,
    "bail-hearing": 15,
    "bail-evidence": 20,
    "criminal-admission": 10,
    "criminal-evidence": 40,
    "criminal-arguments": 60,
    "criminal-judgment": 20,
    "family-admission": 8,
    "family-evidence": 35,
    "family-arguments": 50,
    "civil-admission": 8,
    "civil-evidence": 30,
    "civil-arguments": 45,
    "writ-arguments": 50,
    "appeal-arguments": 60,
  };

  const key = `${caseObj.caseType?.toLowerCase()}-${caseObj.stage?.toLowerCase()}`;
  let baseTime = timeEstimates[key];

  // If not found, use stage-based defaults
  if (!baseTime) {
    const stageDefaults = {
      admission: 8,
      summons: 10,
      evidence: 35,
      arguments: 55,
      "final arguments": 60,
      judgment: 20,
      hearing: 20,
      default: 15
    };
    baseTime = stageDefaults[caseObj.stage?.toLowerCase()] || stageDefaults.default;
  }

  // Add buffer for complex cases (indicated by high priority)
  const {score} = calculatePriority(caseObj);
  if (score > 0.8) {
    baseTime = Math.ceil(baseTime * 1.1); // Add 10% for complex high-priority cases
  }

  return baseTime;
}

// ==========================================
// PART 3: TIME-BIN PACKING SCHEDULER
// ==========================================

/**
 * Generate Daily Cause List using time-bin packing algorithm
 * 
 * @param {Array} cases - Array of case objects
 * @param {number} availableMinutes - Total court time available (default 300 = 5 hours)
 * @param {number} bufferPercentage - Buffer time percentage (default 0.15 = 15%)
 * @returns {Object} - {dailyCauseList: Array, summary: Object}
 */
function generateDailyCauseList(cases, availableMinutes = 300, bufferPercentage = 0.15) {
  if (!cases || cases.length === 0) {
    return {
      dailyCauseList: [],
      summary: {
        totalMinutesAvailable: availableMinutes,
        totalMinutesUsed: 0,
        minBufferRequired: availableMinutes * bufferPercentage,
        casesFiled: 0,
        casesScheduled: 0,
        utilizationPercentage: 0
      }
    };
  }

  // Step 1: Calculate priority for each case
  const casesWithPriority = cases
    .filter(c => c.status !== "Judgment" && c.status !== "Disposed") // Only pending cases
    .map(caseObj => ({
      ...caseObj,
      ...calculatePriority(caseObj),
      estimatedTime: estimateCaseTime(caseObj)
    }))
    .sort((a, b) => b.score - a.score); // Sort by priority descending

  // Step 2: Apply constraints and bin packing
  const dailyCauseList = [];
  let totalTimeUsed = 0;
  const bufferRequired = availableMinutes * bufferPercentage;
  const effectiveAvailable = availableMinutes - bufferRequired;
  
  let finalArgumentCount = 0;
  const MAX_FINAL_ARGUMENTS = 2; // Constraint 1: Max 2 final argument cases per day

  for (const caseObj of casesWithPriority) {
    // Check if adding this case would exceed time
    if (totalTimeUsed + caseObj.estimatedTime > effectiveAvailable) {
      continue;
    }

    // Check constraint: max 2 final argument cases per day
    if (caseObj.stage?.toLowerCase() === "final arguments" || 
        caseObj.stage?.toLowerCase() === "arguments") {
      if (caseObj.stage?.toLowerCase() === "final arguments") {
        if (finalArgumentCount >= MAX_FINAL_ARGUMENTS) {
          continue;
        }
        finalArgumentCount++;
      }
    }

    // Add case to daily list
    dailyCauseList.push({
      _id: caseObj._id,
      caseNumber: caseObj.caseNumber,
      caseType: caseObj.caseType,
      courtType: caseObj.courtType,
      petitioner: caseObj.petitioner,
      respondent: caseObj.respondent,
      stage: caseObj.stage,
      priority: {
        score: caseObj.score,
        breakdown: caseObj.breakdown,
        reasoning: caseObj.reasoning
      },
      estimatedTime: caseObj.estimatedTime,
      startTime: generateTimeSlot(totalTimeUsed),
      endTime: generateTimeSlot(totalTimeUsed + caseObj.estimatedTime),
      timeSlot: caseObj.timeSlot
    });

    totalTimeUsed += caseObj.estimatedTime;
  }

  // Calculate utilization
  const utilizationPercentage = Math.round((totalTimeUsed / (availableMinutes - bufferRequired)) * 100);

  return {
    dailyCauseList: dailyCauseList,
    summary: {
      totalMinutesAvailable: availableMinutes,
      totalMinutesUsed: totalTimeUsed,
      minBufferRequired: bufferRequired,
      minBufferRemaining: availableMinutes - totalTimeUsed,
      casesFiled: cases.filter(c => c.status !== "Judgment" && c.status !== "Disposed").length,
      casesScheduled: dailyCauseList.length,
      utilizationPercentage: utilizationPercentage,
      disposalPotential: `${dailyCauseList.filter(c => c.stage?.toLowerCase() === "judgment").length} cases may be disposed`
    }
  };
}

/**
 * Generate time slot string from minutes offset
 */
function generateTimeSlot(minutesFromStart) {
  const courtStartHour = 10; // Court starts at 10:30 AM
  const courtStartMinute = 30;
  
  const totalMinutes = courtStartHour * 60 + courtStartMinute + minutesFromStart;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  calculatePriority,
  estimateCaseTime,
  generateDailyCauseList
};
