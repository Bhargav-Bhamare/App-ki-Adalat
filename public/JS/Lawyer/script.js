
        // Navigation
        function showSection(sectionId) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(sectionId).classList.remove('hidden');

            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            event.target.classList.add('active');

            // Load cases when My Cases section is shown
            if (sectionId === 'my-cases') {
                loadAllCases();
            }
        }

        // Load all cases
        function loadAllCases() {
            const casesList = document.getElementById('allCasesList');
            const cases = [
                {
                    number: 'CRL/2024/00123',
                    court: 'District Court, Pune',
                    stage: 'Arguments',
                    priority: 'high',
                    nextHearing: 'Dec 28, 2025',
                    timeSlot: '10:30 AM',
                    status: 'Listed'
                },
                {
                    number: 'CIV/2024/00456',
                    court: 'High Court, Mumbai',
                    stage: 'Evidence',
                    priority: 'medium',
                    nextHearing: 'Jan 3, 2026',
                    timeSlot: '2:00 PM',
                    status: 'Reserved'
                },
                {
                    number: 'FAM/2024/00789',
                    court: 'Family Court, Pune',
                    stage: 'Admission',
                    priority: 'low',
                    nextHearing: 'Jan 5, 2026',
                    timeSlot: '11:00 AM',
                    status: 'Listed'
                },
                {
                    number: 'WP/2024/01012',
                    court: 'High Court, Mumbai',
                    stage: 'Arguments',
                    priority: 'high',
                    nextHearing: 'Dec 30, 2025',
                    timeSlot: '3:00 PM',
                    status: 'Listed'
                },
                {
                    number: 'CRL/2024/01145',
                    court: 'District Court, Pune',
                    stage: 'Hearing',
                    priority: 'high',
                    nextHearing: 'Dec 29, 2025',
                    timeSlot: '10:00 AM',
                    status: 'Adjourned'
                }
            ];

            casesList.innerHTML = cases.map(c => `
                <div class="case-card" onclick="openCaseDetail('${c.number}')">
                    <div class="case-header">
                        <div>
                            <div class="case-number">${c.number}</div>
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
                        <button class="btn btn-primary" onclick="event.stopPropagation(); markReadiness('${c.number}')">Mark Ready</button>
                        <button class="btn btn-outline" onclick="event.stopPropagation(); uploadDocument('${c.number}')">Upload Doc</button>
                    </div>
                </div>
            `).join('');
        }

        // Modal Functions
        function openCaseDetail(caseNumber) {
            document.getElementById('caseDetailModal').classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Action Functions
        function markReadiness(caseNumber) {
            alert(`Mark Readiness for case ${caseNumber}\n\nOptions:\n✓ Ready for hearing\n✗ Not Ready (reason required)`);
        }

        function uploadDocument(caseNumber) {
            alert(`Upload Document for case ${caseNumber}\n\nAccepted formats: PDF, DOC, DOCX\nMax size: 10 MB`);
        }

        // Calendar Functions
        function previousMonth() {
            alert('Previous month - Calendar navigation functionality');
        }

        function nextMonth() {
            alert('Next month - Calendar navigation functionality');
        }

        // Search and Filter
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('caseSearch');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    // Filter cases based on search
                    console.log('Searching for:', e.target.value);
                });
            }

            const filters = ['courtFilter', 'stageFilter', 'priorityFilter'];
            filters.forEach(filterId => {
                const filter = document.getElementById(filterId);
                if (filter) {
                    filter.addEventListener('change', function(e) {
                        console.log(`Filter ${filterId} changed to:`, e.target.value);
                    });
                }
            });

            // Form submission
            const filingForm = document.querySelector('.filing-form');
            if (filingForm) {
                filingForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('Case Filing Submitted!\n\nDiary Number: DRY/2025/00789\nStatus: Under Scrutiny\n\nYou will receive notifications about the filing status.');
                });
            }

            // Close modal on outside click
            window.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.remove('active');
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