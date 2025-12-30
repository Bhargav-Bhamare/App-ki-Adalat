// ==========================================
// LAWYER DASHBOARD - COMPLETE FUNCTIONALITY
// ==========================================

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    loadLawyerProfile();
    loadDashboardData();
    updateCurrentDate();
    setInterval(updateCurrentDate, 60000); // Update date every minute
    console.log('NyaayDrishti Advocate Dashboard Loaded Successfully');
});

// ==========================================
// 1. LOAD LAWYER PROFILE
// ==========================================
async function loadLawyerProfile() {
    try {
        const response = await fetch('/api/dashboard-data');
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        const lawyer = data.lawyer;
        
        // Update welcome message and avatar
        document.getElementById('lawyerName').textContent = `Adv. ${lawyer.name}`;
        document.getElementById('advocateName').value = lawyer.name;
        document.getElementById('advocateEmail').value = lawyer.email;
        document.getElementById('advocateMobile').value = lawyer.mobile || '+91 -------';
        
        // Set user initials
        const initials = lawyer.name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('userInitials').textContent = initials.substring(0, 2);
        
        // Store lawyer data for later use
        window.currentLawyer = lawyer;
    } catch (error) {
        console.error('Error loading profile:', error);
        // Show demo data if API fails
        document.getElementById('lawyerName').textContent = 'Adv. Demo Lawyer';
    }
}

// ==========================================
// 2. LOAD DASHBOARD DATA
// ==========================================
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard-data');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        
        const data = await response.json();
        
        // Load recent cases
        loadRecentCases(data.cases.slice(0, 2));
        
        // Store all cases for filtering
        window.allCases = data.cases;
        window.allNotifications = data.notifications;
        window.allDefects = data.defects;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Dashboard will show sample data from HTML
    }
}

// Load recent cases
function loadRecentCases(cases) {
    if (cases && cases.length > 0) {
        console.log('Recent cases loaded:', cases);
    }
}

// ==========================================
// 3. SECTION NAVIGATION
// ==========================================
        // Navigation
        function showSection(sectionId) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }

            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            if (event.target) {
                event.target.closest('a')?.classList.add('active');
            }

            // Load cases when My Cases section is shown
            if (sectionId === 'my-cases') {
                loadAllCases();
            }
            
            // Load section-specific data
            loadSectionData(sectionId);
        }
        
        async function loadSectionData(sectionId) {
            switch(sectionId) {
                case 'notifications':
                    await loadNotifications();
                    break;
                case 'defects':
                    await loadDefects();
                    break;
                case 'calendar':
                    initializeCalendar();
                    break;
                case 'analytics':
                    updateAnalytics();
                    break;
            }
        }


        // Load all cases
        async function loadAllCases() {
            try {
                const response = await fetch('/api/cases');
                if (!response.ok) throw new Error('Failed to fetch cases');
                
                const data = await response.json();
                displayCases(data.cases);
                window.allCases = data.cases;
            } catch (error) {
                console.error('Error loading cases:', error);
                if (window.allCases) {
                    displayCases(window.allCases);
                }
            }
        }
        
        function displayCases(cases) {
            const casesList = document.getElementById('allCasesList');
            if (!casesList) return;
            
            casesList.innerHTML = cases.map(c => `
                <div class="case-card" onclick="openCaseDetail('${c.caseNumber}')">
                    <div class="case-header">
                        <div>
                            <div class="case-number">${c.caseNumber}</div>
                            <div class="case-court">${c.court}</div>
                        </div>
                        <span class="priority-indicator priority-${c.priority}"></span>
                    </div>
                    <div class="case-details">
                        <div class="case-detail-item">
                            <div class="detail-label">Stage</div>
                            <div class="detail-value">${c.stage}</div>
                        </div>
                        <div class="case-detail-item">
                            <div class="detail-label">Next Hearing</div>
                            <div class="detail-value">${c.nextHearing}</div>
                        </div>
                        <div class="case-detail-item">
                            <div class="detail-label">Time Slot</div>
                            <div class="detail-value">${c.timeSlot}</div>
                        </div>
                        <div class="case-detail-item">
                            <div class="detail-label">Status</div>
                            <span class="status-badge status-${c.status.toLowerCase()}">${c.status}</span>
                        </div>
                    </div>
                    <div class="case-actions">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); markReadiness('${c.caseNumber}')">Mark Ready</button>
                        <button class="btn btn-outline" onclick="event.stopPropagation(); uploadDocument('${c.caseNumber}')">Upload Doc</button>
                    </div>
                </div>
            `).join('');
        }
        
        // Filter cases
        function filterCases() {
            const searchTerm = document.getElementById('caseSearch')?.value.toLowerCase() || '';
            const courtFilter = document.getElementById('courtFilter')?.value || '';
            const stageFilter = document.getElementById('stageFilter')?.value || '';
            const priorityFilter = document.getElementById('priorityFilter')?.value || '';
            
            let filtered = window.allCases || [];
            
            if (searchTerm) {
                filtered = filtered.filter(c => 
                    c.caseNumber.toLowerCase().includes(searchTerm) ||
                    c.petitioner.toLowerCase().includes(searchTerm) ||
                    c.respondent.toLowerCase().includes(searchTerm)
                );
            }
            
            if (courtFilter) {
                filtered = filtered.filter(c => c.court.toLowerCase().includes(courtFilter));
            }
            
            if (stageFilter) {
                filtered = filtered.filter(c => c.stage.toLowerCase() === stageFilter);
            }
            
            if (priorityFilter) {
                filtered = filtered.filter(c => c.priority === priorityFilter);
            }
            
            displayCases(filtered);
        }

        // Modal Functions
        function openCaseDetail(caseNumber) {
            const caseData = (window.allCases || []).find(c => c.caseNumber === caseNumber);
            if (!caseData) {
                alert('Case data not found');
                return;
            }
            
            const modal = document.getElementById('caseDetailModal');
            if (modal) {
                // Update modal title
                modal.querySelector('.modal-title').textContent = `Case Details - ${caseData.caseNumber}`;
                
                // Update case details
                const detailLabels = modal.querySelectorAll('.case-detail-item');
                if (detailLabels.length >= 4) {
                    // Case Type
                    detailLabels[0].querySelector('.detail-value').textContent = caseData.caseType || 'N/A';
                    // Current Stage
                    detailLabels[1].querySelector('.detail-value').textContent = caseData.stage || 'N/A';
                    // Court Type
                    detailLabels[2].querySelector('.detail-value').textContent = caseData.courtType || 'N/A';
                    // Filed On (nextHearingDate)
                    const filedDate = caseData.nextHearingDate ? new Date(caseData.nextHearingDate).toLocaleDateString() : 'N/A';
                    detailLabels[3].querySelector('.detail-value').textContent = filedDate;
                }
                
                // Update parties info
                const partySection = Array.from(modal.querySelectorAll('.section')).find(s => 
                    s.textContent.includes('Parties & Advocates')
                );
                if (partySection) {
                    const paragraphs = partySection.querySelectorAll('p');
                    if (paragraphs.length >= 3) {
                        paragraphs[0].innerHTML = `<strong>Petitioner:</strong> ${caseData.petitioner || 'N/A'}`;
                        paragraphs[1].innerHTML = `<strong>Respondent:</strong> ${caseData.respondent || 'N/A'}`;
                        paragraphs[2].innerHTML = `<strong>Status:</strong> ${caseData.status || 'N/A'}`;
                    }
                }
                
                modal.style.display = 'block';
            }
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });

        // Action Functions
        function markReadiness(caseNumber) {
            alert(`✅ Case ${caseNumber} marked as ready for hearing.`);
        }

        function uploadDocument(caseNumber) {
            alert(`📄 Upload document dialog for case ${caseNumber}.\n\nFeature: Document upload modal will open here.`);
        }
        
        // Notifications
        async function loadNotifications() {
            try {
                const response = await fetch('/api/notifications');
                if (!response.ok) throw new Error('Failed to fetch notifications');
                
                const data = await response.json();
                displayNotifications(data.notifications);
                window.allNotifications = data.notifications;
                document.getElementById('notificationCount').textContent = data.unreadCount;
            } catch (error) {
                console.error('Error loading notifications:', error);
                if (window.allNotifications) {
                    displayNotifications(window.allNotifications);
                }
            }
        }
        
        function displayNotifications(notifications) {
            const container = document.querySelector('#notifications .case-list');
            if (!container) return;
            
            const colorMap = {
                'urgent': 'var(--red)',
                'warning': 'var(--yellow)',
                'success': 'var(--green)',
                'info': 'var(--secondary-blue)'
            };
            
            container.innerHTML = notifications.map(notif => `
                <div class="case-card" style="border-left: 4px solid ${colorMap[notif.type] || 'var(--secondary-blue)'};">
                    <div class="case-header">
                        <div>
                            <div class="case-number">${notif.icon} ${notif.title}</div>
                            <div class="case-court">Case ${notif.caseNumber}</div>
                        </div>
                        <small style="color: var(--steel-grey);">${notif.timestamp}</small>
                    </div>
                    <p style="color: var(--steel-grey); margin-top: 0.5rem;">${notif.message}</p>
                </div>
            `).join('');
        }
        
        // Defects
        async function loadDefects() {
            try {
                const response = await fetch('/api/defects');
                if (!response.ok) throw new Error('Failed to fetch defects');
                
                const data = await response.json();
                displayDefects(data.defects);
                window.allDefects = data.defects;
            } catch (error) {
                console.error('Error loading defects:', error);
                if (window.allDefects) {
                    displayDefects(window.allDefects);
                }
            }
        }
        
        function displayDefects(defects) {
            const container = document.querySelector('#defects .section');
            if (!container) return;
            
            if (defects.length === 0) {
                container.innerHTML = '<p style="color: var(--green); font-size: 1.1rem;">✅ No defects! All your filings are in order.</p>';
                return;
            }
            
            container.innerHTML = defects.map(defect => `
                <div class="defect-item">
                    <div class="defect-header">
                        <div class="defect-case">${defect.caseNumber}</div>
                        <div class="defect-deadline">Deadline: ${defect.deadline}</div>
                    </div>
                    <div class="defect-reason">
                        <strong>Defect Reason:</strong> ${defect.reason}
                    </div>
                    <div class="case-actions">
                        <button class="btn btn-primary" onclick="uploadCorrectedDocument('${defect.caseNumber}')">Upload Corrected Document</button>
                        <button class="btn btn-outline" onclick="viewOriginalFiling('${defect.caseNumber}')">View Original Filing</button>
                    </div>
                </div>
            `).join('');
        }
        
        function uploadCorrectedDocument(caseNumber) {
            alert(`📄 Upload corrected document for case ${caseNumber}.`);
        }
        
        function viewOriginalFiling(caseNumber) {
            alert(`📋 View original filing details for case ${caseNumber}.`);
        }

        // Calendar Functions
        function initializeCalendar() {
            addCalendarListeners();
        }
        
        function addCalendarListeners() {
            const calendarDays = document.querySelectorAll('.calendar-day');
            calendarDays.forEach(day => {
                day.addEventListener('click', function() {
                    const dayNumber = this.querySelector('.day-number')?.textContent;
                    if (dayNumber) {
                        showDayHearings(dayNumber);
                    }
                });
            });
        }
        
        function showDayHearings(day) {
            alert(`Hearings on Dec ${day}, 2025:\n\nView today's matters section for full details.`);
        }

        function previousMonth() {
            alert('Navigation to previous month - Feature coming soon');
        }

        function nextMonth() {
            alert('Navigation to next month - Feature coming soon');
        }
        
        // Analytics
        function updateAnalytics() {
            console.log('Analytics section loaded');
        }
        
        // Update current date
        function updateCurrentDate() {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const today = new Date().toLocaleDateString('en-US', options);
            const dateElement = document.getElementById('currentDate');
            if (dateElement) {
                dateElement.textContent = today;
            }
        }
        
        // File new case
        async function submitCaseFiling(event) {
            event.preventDefault();
            
            const formData = {
                caseType: event.target.querySelector('select')?.value,
                court: event.target.querySelectorAll('select')[1]?.value,
                petitioner: event.target.querySelector('input[placeholder*="Petitioner"]')?.value,
                respondent: event.target.querySelector('input[placeholder*="Respondent"]')?.value,
                caseDescription: event.target.querySelector('textarea')?.value,
                courtFee: event.target.querySelector('input[placeholder*="Fee"]')?.value
            };
            
            try {
                const response = await fetch('/api/file-case', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) throw new Error('Failed to file case');
                
                const data = await response.json();
                alert(`✅ Success!\nDiary Number: ${data.diaryNumber}\nStatus: ${data.status}`);
                event.target.reset();
            } catch (error) {
                console.error('Error filing case:', error);
                
            }
        }
        
        // Profile management
        function updateProfile() {
            const lawyerData = {
                mobile: document.getElementById('advocateMobile')?.value,
                specializations: ['Criminal Law', 'Civil Law'],
                courts: ['District Court', 'High Court']
            };
            
            fetch('/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lawyerData)
            })
            .then(res => res.json())
            .then(data => alert('✅ Profile updated successfully!'))
            .catch(err => alert('Error updating profile'));
        }
        
        function changePassword() {
            const newPassword = prompt('Enter new password:');
            if (newPassword && newPassword.length >= 4) {
                alert('✅ Password change initiated. Verification email sent.');
            } else if (newPassword) {
                alert('❌ Password must be at least 4 characters long.');
            }
        }
        
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = '/logout';
            }
        }

        // Search and Filter
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('caseSearch');
            if (searchInput) {
                searchInput.addEventListener('input', filterCases);
            }

            const filters = ['courtFilter', 'stageFilter', 'priorityFilter'];
            filters.forEach(filterId => {
                const filter = document.getElementById(filterId);
                if (filter) {
                    filter.addEventListener('change', filterCases);
                }
            });

            // Form submission
            const filingForm = document.querySelector('.filing-form');
            if (filingForm) {
                filingForm.addEventListener('submit', submitCaseFiling);
            }

            // Close modal on outside click
            window.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.style.display = 'none';
                }
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                // Alt + D for Dashboard
                if (e.altKey && e.key === 'd') {
                    showSection('dashboard');
                }
                // Alt + C for My Cases
                if (e.altKey && e.key === 'c') {
                    showSection('my-cases');
                }
                // Alt + T for Today's Matters
                if (e.altKey && e.key === 't') {
                    showSection('today-matters');
                }
                // Alt + N for Notifications
                if (e.altKey && e.key === 'n') {
                    showSection('notifications');
                }
            });
        });

        // Readiness Management Section
        function showReadinessForm(caseNumber) {
            const form = `
                <div class="section">
                    <h3>Case Readiness - ${caseNumber}</h3>
                    <div class="form-group">
                        <label>Mark case as:</label>
                        <select id="readinessStatus" onchange="toggleReasonField()">
                            <option value="ready">Ready for Hearing</option>
                            <option value="not-ready">Not Ready</option>
                        </select>
                    </div>
                    <div class="form-group hidden" id="reasonField">
                        <label>Reason (Mandatory):</label>
                        <textarea placeholder="Please specify the reason for not being ready"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Availability Window:</label>
                        <input type="datetime-local">
                    </div>
                    <button class="btn btn-primary">Submit Readiness Status</button>
                </div>
            `;
            console.log('Readiness form for:', caseNumber);
        }

        function toggleReasonField() {
            const status = document.getElementById('readinessStatus').value;
            const reasonField = document.getElementById('reasonField');
            if (status === 'not-ready') {
                reasonField.classList.remove('hidden');
            } else {
                reasonField.classList.add('hidden');
            }
        }

        // Notification sound/visual indicator (simulated)
        function checkNewNotifications() {
            // This would normally check for new notifications from server
            console.log('Checking for new notifications...');
        }

        // Set interval to check notifications every 30 seconds
        setInterval(checkNewNotifications, 30000);

        // Export case summary
        function exportCaseSummary(caseNumber) {
            alert(`Exporting case summary for ${caseNumber}\n\nFormats available:\n- PDF\n- Word Document\n- Excel Spreadsheet`);
        }

        // Print functionality
        function printCaseDetails() {
            window.print();
        }

        // Mobile menu toggle
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('active');
        }

        // Add mobile menu button for small screens
        if (window.innerWidth <= 768) {
            const menuBtn = document.createElement('button');
            menuBtn.innerHTML = '☰';
            menuBtn.style.cssText = 'position: fixed; top: 1rem; left: 1rem; z-index: 1001; padding: 0.5rem 1rem; background: var(--primary-navy); color: white; border: none; border-radius: 5px; font-size: 1.5rem; cursor: pointer;';
            menuBtn.onclick = toggleSidebar;
            document.body.appendChild(menuBtn);
        }

        // Simulate real-time updates for Today's Matters
        function updateLiveStatus() {
            const statusElements = document.querySelectorAll('.live-status');
            // This would normally fetch real-time data from server
            console.log('Updating live status for today\'s matters...');
        }

        // Update every 60 seconds
        setInterval(updateLiveStatus, 60000);

        // Auto-save notes functionality
        let notesSaveTimeout;
        function autoSaveNotes() {
            clearTimeout(notesSaveTimeout);
            notesSaveTimeout = setTimeout(() => {
                console.log('Auto-saving notes...');
                // Save to backend here
            }, 2000); // Save 2 seconds after user stops typing
        }

        // Add event listener to notes textarea when modal opens
        document.addEventListener('DOMContentLoaded', function() {
            const notesArea = document.querySelector('#caseDetailModal textarea');
            if (notesArea) {
                notesArea.addEventListener('input', autoSaveNotes);
            }
        });

        // Initialize dashboard
        console.log('NyaayDrishti Advocate Dashboard Loaded Successfully');
        console.log('Keyboard Shortcuts:');
        console.log('Alt + D: Dashboard');
        console.log('Alt + C: My Cases');
        console.log('Alt + T: Today\'s Matters');
        console.log('Alt + N: Notifications');