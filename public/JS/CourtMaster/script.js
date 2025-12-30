        // Smooth scrolling to sections
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Case management functions
        function callCase(caseId) {
            const row = document.querySelector(`[data-case-id="${caseId}"]`);
            if (row) {
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.className = 'status-badge status-called';
                statusBadge.textContent = 'Called';
                
                console.log(`Case ${caseId} has been called`);
            }
        }

        function passOver(caseId) {
            const row = document.querySelector(`[data-case-id="${caseId}"]`);
            if (row) {
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.className = 'status-badge status-passed';
                statusBadge.textContent = 'Passed';
                
                console.log(`Case ${caseId} has been passed a`);
            }
        }

        function adjournCase(caseId) {
            const row = document.querySelector(`[data-case-id="${caseId}"]`);
            if (row) {
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.className = 'status-badge status-adjourned';
                statusBadge.textContent = 'Adjourned';
                
                console.log(`Case ${caseId} has been adjourned`);
            }
        }

        function markHeard(caseId) {
            const row = document.querySelector(`[data-case-id="${caseId}"]`);
            if (row) {
                const statusBadge = row.querySelector('.status-badge');
                statusBadge.className = 'status-badge status-heard';
                statusBadge.textContent = 'Heard';
                
                console.log(`Case ${caseId} has been marked as heard`);
            }
        }

        function finalizeDay() {
            if (confirm('Are you sure you want to finalize today\'s proceedings? This action cannot be undone.')) {
                alert('Day\'s proceedings have been finalized and archived.');
            }
        }

        // Filter functionality
        document.getElementById('priority-filter').addEventListener('change', filterCases);
        document.getElementById('stage-filter').addEventListener('change', filterCases);
        document.getElementById('advocate-search').addEventListener('input', filterCases);
        document.getElementById('pending-toggle').addEventListener('change', filterCases);

        function filterCases() {
            const priorityFilter = document.getElementById('priority-filter').value;
            const stageFilter = document.getElementById('stage-filter').value;
            const advocateSearch = document.getElementById('advocate-search').value.toLowerCase();
            const pendingOnly = document.getElementById('pending-toggle').checked;

            const rows = document.querySelectorAll('.case-row');

            rows.forEach(row => {
                const priority = row.querySelector('.priority-badge').classList.contains('priority-high') ? 'high' :
                                row.querySelector('.priority-badge').classList.contains('priority-medium') ? 'medium' : 'low';
                const stage = row.cells[3].textContent.toLowerCase();
                const status = row.querySelector('.status-badge').textContent.toLowerCase();
                const caseTitle = row.cells[2].textContent.toLowerCase();

                let show = true;

                if (priorityFilter && priority !== priorityFilter) show = false;
                if (stageFilter && !stage.includes(stageFilter.toLowerCase())) show = false;
                if (advocateSearch && !caseTitle.includes(advocateSearch)) show = false;
                if (pendingOnly && status !== 'pending') show = false;

                row.style.display = show ? '' : 'none';
            });
        }

        // Add click handlers for action buttons
        document.addEventListener('DOMContentLoaded', function() {
            // Add event listeners for all action buttons
            document.querySelectorAll('.btn-call').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const row = this.closest('.case-row');
                    const caseId = row.dataset.caseId;
                    callCase(caseId);
                });
            });

            document.querySelectorAll('.btn-pass').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const row = this.closest('.case-row');
                    const caseId = row.dataset.caseId;
                    passOver(caseId);
                });
            });

            document.querySelectorAll('.btn-adjourn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const row = this.closest('.case-row');
                    const caseId = row.dataset.caseId;
                    adjournCase(caseId);
                });
            });

            document.querySelectorAll('.btn-heard').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const row = this.closest('.case-row');
                    const caseId = row.dataset.caseId;
                    markHeard(caseId);
                });
            });
        });