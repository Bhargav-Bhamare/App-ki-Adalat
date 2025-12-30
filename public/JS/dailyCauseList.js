// ==========================================
// DAILY CAUSE LIST - FRONTEND HANDLER
// ==========================================

/**
 * Load and display the daily cause list
 */
async function loadDailyCauseList() {
  try {
    const response = await fetch('/api/daily-cause-list?availableMinutes=300');
    if (!response.ok) throw new Error('Failed to fetch daily cause list');

    const payload = await response.json();
    const data = payload && payload.data ? payload.data : { dailyCauseList: [], summary: {} };

    // Generic container widget
    if (document.getElementById('cause-list-container')) {
      displayDailyCauseList(data);
      updateCauseListSummary(data.summary || {});
    }

    // Judge table
    if (document.getElementById('causeTableBody')) {
      // Use existing judge rendering if present on page
      try {
        // call renderJudgeTable if defined in page, else fallback to basic table fill
        if (typeof renderJudgeTable === 'function') renderJudgeTable(data.dailyCauseList || []);
        else fillCauseTable(data.dailyCauseList || []);
      } catch (e) { console.warn('Judge table render error', e); }
    }

    // Court Master table
    if (document.getElementById('causeListBody')) {
      try { renderCourtMasterTable(data.dailyCauseList || []); } catch (e) { console.warn('Court master render error', e); }
    }
  } catch (error) {
    console.error('Error loading daily cause list:', error);
    const gen = document.getElementById('cause-list-container');
    if (gen) gen.innerHTML = '<p style="color: red;">Error loading daily cause list</p>';
  }
}

/**
 * Display the daily cause list with animated time bars
 */
function displayDailyCauseList(causeListData) {
  const container = document.getElementById('cause-list-container');
  if (!container) return;
  const list = (causeListData && causeListData.dailyCauseList) || [];
  if (!list.length) {
    container.innerHTML = '<p style="text-align: center; color: #666;">No cases scheduled for today</p>';
    return;
  }

  let html = '<div class="daily-cause-list">';
  list.forEach((caseItem = {}, index) => {
    const score = caseItem.priority && typeof caseItem.priority.score === 'number' ? caseItem.priority.score : 0;
    const priorityPercentage = (score * 100).toFixed(1);
    const est = caseItem.estimatedTime || 0;
    const timePercentage = ((est / 300) * 100).toFixed(1);

    const caseNumber = caseItem.caseNumber || `UNDEF-${index}`;
    const petitioner = caseItem.petitioner || '—';
    const respondent = caseItem.respondent || '—';
    const stage = caseItem.stage || '';
    const startTime = caseItem.startTime || '';
    const endTime = caseItem.endTime || '';

    html += `
      <div class="cause-list-item" onclick="showCasePriorityDetail('${caseItem._id || ''}', '${caseNumber}')">
        <div class="cause-item-header">
          <div class="case-serial-number">#${index + 1}</div>
          <div class="case-info">
            <h4 class="case-number">${caseNumber}</h4>
            <p class="case-parties">${petitioner} v/s ${respondent}</p>
          </div>
          <div class="case-stage-badge">${stage}</div>
        </div>

        <div class="cause-item-timeline">
          <div class="time-slot">
            <span class="time-label">⏰ ${startTime} - ${endTime}</span>
            <span class="time-duration">${est} min</span>
          </div>
        </div>

        <div class="priority-visualization">
          <div class="priority-bar-container">
            <div class="priority-label">Priority Score</div>
            <div class="priority-bar">
              <div class="priority-fill" style="width: ${priorityPercentage}%;">
                <span class="priority-text">${priorityPercentage}%</span>
              </div>
            </div>
          </div>

          <div class="time-bar-container">
            <div class="time-label">Estimated Duration</div>
            <div class="time-bar">
              <div class="time-fill" style="width: ${timePercentage}%; background: linear-gradient(90deg, #4CAF50, #45a049);">
                <span class="time-text">${est}m</span>
              </div>
            </div>
          </div>
        </div>

        <div class="case-details-preview">
          <span class="case-type">📋 ${caseItem.caseType || ''}</span>
          <span class="court-type">🏛️ ${caseItem.courtType || ''}</span>
          <span class="priority-badge" style="background: ${getPriorityColor(score)};">
            ${getPriorityLabel(score)}
          </span>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Update cause list summary statistics
 */
function updateCauseListSummary(summary) {
  const summaryContainer = document.getElementById('cause-list-summary');
  if (!summaryContainer) return;

  let summaryHtml = `
    <div class="summary-stats">
      <div class="stat-item">
        <span class="stat-label">Cases Listed</span>
        <span class="stat-value">${summary.casesScheduled}/${summary.casesFiled}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Time Utilization</span>
        <span class="stat-value">${summary.utilizationPercentage}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Time Used</span>
        <span class="stat-value">${summary.totalMinutesUsed}/${summary.totalMinutesAvailable} min</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Buffer Remaining</span>
        <span class="stat-value">${summary.minBufferRemaining} min</span>
      </div>
    </div>
  `;

  summaryContainer.innerHTML = summaryHtml;
}

/**
 * Show priority details modal
 */
async function showCasePriorityDetail(caseId, caseNumber) {
  try {
    const response = await fetch(`/api/case-priority/${caseId}`);
    if (!response.ok) throw new Error('Failed to fetch priority details');
    const priorityData = await response.json();

    const modal = document.getElementById('priorityDetailModal');
    if (!modal) {
      // fallback alert
      alert(`Priority: ${(priorityData.priorityScore * 100).toFixed(1)}%\nEstimated: ${priorityData.estimatedTime} minutes`);
      return;
    }

    // Build a concise modal content
    let detailHtml = `<div class="modal-header"><h2 class="modal-title">Priority Analysis - ${caseNumber}</h2><span class="close-btn" onclick="closePriorityModal()">×</span></div>`;
    detailHtml += `<div class="modal-content"><div class="priority-score-section"><h3>Priority Score: <span class="score-value">${(priorityData.priorityScore * 100).toFixed(1)}%</span></h3><p class="score-description">Estimated Time: ${priorityData.estimatedTime} minutes</p></div>`;
    detailHtml += `<div class="breakdown-section"><h4>Priority Breakdown</h4><table class="breakdown-table"><thead><tr><th>Factor</th><th>Weight</th><th>Factor Value</th><th>Contribution</th></tr></thead><tbody>`;

    const breakdown = priorityData.breakdown || {};
    const factors = ['age','category','stage','vulnerability','adjournment'];
    factors.forEach(factor => {
      const b = breakdown[factor] || { weight:0, factor:0, contribution:0 };
      const contribution = (b.contribution * 100).toFixed(2);
      const factorLabel = factor.charAt(0).toUpperCase() + factor.slice(1);
      detailHtml += `<tr><td>${factorLabel}</td><td>${(b.weight*100).toFixed(0)}%</td><td>${(b.factor*100).toFixed(1)}%</td><td style=\"color:#2196F3;font-weight:bold\">${contribution}%</td></tr>`;
    });

    detailHtml += `</tbody></table></div>`;
    detailHtml += `<div class="reasoning-section"><h4>Priority Reasoning</h4><ul class="reasoning-list">`;
    (priorityData.reasoning || []).forEach(r => { detailHtml += `<li>${r}</li>`; });
    detailHtml += `</ul></div><div class="modal-actions"><button class="btn btn-primary" onclick="closePriorityModal()">Close</button></div></div>`;

    modal.innerHTML = detailHtml;
    modal.style.display = 'block';
  } catch (error) {
    console.error('Error showing priority detail:', error);
    alert('Error loading priority details: ' + error.message);
  }
}

/**
 * Close priority detail modal
 */
function closePriorityModal() {
  const modal = document.getElementById('priorityDetailModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Get color code based on priority score
 */
function getPriorityColor(score) {
  if (score >= 0.85) return '#d32f2f'; // Red - Highest priority
  if (score >= 0.70) return '#f57c00'; // Orange - High priority
  if (score >= 0.50) return '#fbc02d'; // Yellow - Medium priority
  return '#4caf50'; // Green - Lower priority
}

/**
 * Get priority label based on score
 */
function getPriorityLabel(score) {
  if (score >= 0.85) return '🔴 Critical';
  if (score >= 0.70) return '🟠 High';
  if (score >= 0.50) return '🟡 Medium';
  return '🟢 Normal';
}

// Load daily cause list when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Run loader on pages that include any known container
  if (document.getElementById('cause-list-container') || document.getElementById('causeTableBody') || document.getElementById('causeListBody') || document.getElementById('allCasesList')) {
    loadDailyCauseList();
    // Refresh every 30 seconds
    setInterval(loadDailyCauseList, 30000);
  }
});
