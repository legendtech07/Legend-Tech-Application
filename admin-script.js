// Loader timeout
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('adminContent').classList.remove('hidden');
            loadApplications();
        }, 500);
    }, 2000);
});

// Sample applications data
let applications = [];

// Load applications from localStorage
function loadApplications() {
    const savedApps = localStorage.getItem('legendTechApplications');
    applications = savedApps ? JSON.parse(savedApps) : [];
    
    updateStats();
    renderApplications();
}

// Update stats cards
function updateStats() {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'Pending').length;
    const approved = applications.filter(app => app.status === 'Approved').length;
    const rejected = applications.filter(app => app.status === 'Rejected').length;
    
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = total;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = pending;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = approved;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = rejected;
}

// Render applications table
function renderApplications(filterStatus = 'all') {
    const tbody = document.getElementById('applicationsTableBody');
    tbody.innerHTML = '';
    
    let filteredApps = applications;
    if (filterStatus !== 'all') {
        filteredApps = applications.filter(app => app.status === filterStatus);
    }
    
    if (filteredApps.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 30px;">
                    No applications found
                </td>
            </tr>
        `;
        return;
    }
    
    filteredApps.forEach((app, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${app.name}</td>
            <td>${app.email}</td>
            <td>${app.niche}</td>
            <td>${app.availability}</td>
            <td>${new Date(app.date).toLocaleDateString()}</td>
            <td>
                <span class="status-badge status-${app.status.toLowerCase()}">
                    ${app.status}
                </span>
            </td>
            <td>
                <button class="action-btn view-btn" data-index="${index}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showApplicationModal(index);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            editApplication(index);
        });
    });
}

// Show application modal
function showApplicationModal(index) {
    const app = applications[index];
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="app-detail-row">
            <div class="app-detail-label">Name:</div>
            <div class="app-detail-value">${app.name}</div>
        </div>
        <div class="app-detail-row">
            <div class="app-detail-label">Email:</div>
            <div class="app-detail-value">${app.email}</div>
        </div>
        <div class="app-detail-row">
            <div class="app-detail-label">Channel/Website:</div>
            <div class="app-detail-value">${app.channel || 'N/A'}</div>
        </div>
        <div class="app-detail-row">
            <div class="app-detail-label">Social Media:</div>
            <div class="app-detail-value">${app.social || 'N/A'}</div>
        </div>
        <div class="app-detail-row">
            <div class="app-detail-label">Niche:</div>
            <div class="app-detail-value">${app.niche}</div>
        </div>
        <div class="app-detail-row">
            <div class="app-detail-label">Availability:</div>
            <div class="app-detail-value">${app.availability}</div>
        </div>
        <div class="app-detail-row">
            <div class="app-detail-label">Application Date:</div>
            <div class="app-detail-value">${new Date(app.date).toLocaleString()}</div>
        </div>
        <div class="app-detail-row">
            <div class="app-detail-label">Status:</div>
            <div class="app-detail-value">
                <span class="status-badge status-${app.status.toLowerCase()}">
                    ${app.status}
                </span>
            </div>
        </div>
    `;
    
    // Set up modal buttons
    const modal = document.getElementById('applicationModal');
    const approveBtn = modal.querySelector('.approve-btn');
    const rejectBtn = modal.querySelector('.reject-btn');
    
    approveBtn.onclick = function() {
        updateApplicationStatus(index, 'Approved');
        modal.classList.remove('show');
    };
    
    rejectBtn.onclick = function() {
        updateApplicationStatus(index, 'Rejected');
        modal.classList.remove('show');
    };
    
    // Show modal
    modal.classList.add('show');
}

// Edit application
function editApplication(index) {
    // In a real app, you would implement edit functionality
    alert('Edit functionality would be implemented here');
}

// Update application status
function updateApplicationStatus(index, status) {
    applications[index].status = status;
    localStorage.setItem('legendTechApplications', JSON.stringify(applications));
    loadApplications();
}

// Filter applications by status
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const status = this.getAttribute('data-status');
        renderApplications(status);
    });
});

// Export applications
document.querySelector('.export-btn').addEventListener('click', function() {
    const dataStr = JSON.stringify(applications, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'legend-tech-applications.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

// Refresh applications
document.querySelector('.refresh-btn').addEventListener('click', loadApplications);

// Close modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('applicationModal').classList.remove('show');
});

// Close modal when clicking outside
document.getElementById('applicationModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

// Search functionality
document.querySelector('.search-bar input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#applicationsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Add these new functions to your existing admin-script.js

// Initialize charts
function initCharts() {
    // Applications Over Time Chart
    const appsCtx = document.getElementById('applicationsChart').getContext('2d');
    new Chart(appsCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Applications',
                data: [12, 19, 15, 24, 18, 22, 27],
                borderColor: '#6c5ce7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Status Distribution Chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'Approved', 'Rejected'],
            datasets: [{
                data: [12, 8, 4],
                backgroundColor: [
                    '#fdcb6e',
                    '#00b894',
                    '#d63031'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Niche Breakdown Chart
    const nicheCtx = document.getElementById('nicheChart').getContext('2d');
    new Chart(nicheCtx, {
        type: 'bar',
        data: {
            labels: ['Web Dev', 'Mobile', 'AI/ML', 'Data', 'DevOps', 'Design'],
            datasets: [{
                label: 'Applications',
                data: [8, 5, 6, 3, 4, 2],
                backgroundColor: '#6c5ce7'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Application Sources Chart
    const sourcesCtx = document.getElementById('sourcesChart').getContext('2d');
    new Chart(sourcesCtx, {
        type: 'polarArea',
        data: {
            labels: ['Website', 'Social Media', 'Referral', 'Job Board', 'Other'],
            datasets: [{
                data: [15, 12, 8, 5, 3],
                backgroundColor: [
                    '#6c5ce7',
                    '#fd79a8',
                    '#00cec9',
                    '#a29bfe',
                    '#ffeaa7'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Tab navigation
function setupTabNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Skip for external links
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                return;
            }
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.add('hidden');
                if (section.id === `${sectionId}Section`) {
                    section.classList.remove('hidden');
                    
                    // Initialize charts when analytics section is shown
                    if (sectionId === 'analytics') {
                        initCharts();
                    }
                }
            });
        });
    });
}

// Settings tabs
function setupSettingsTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}Tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Team member modal
function setupTeamMemberModal() {
    const addMemberBtn = document.querySelector('.add-member-btn');
    const addMemberModal = document.getElementById('addMemberModal');
    const cancelBtn = addMemberModal.querySelector('.cancel-btn');
    
    addMemberBtn.addEventListener('click', function() {
        addMemberModal.classList.add('show');
    });
    
    cancelBtn.addEventListener('click', function() {
        addMemberModal.classList.remove('show');
    });
}

// Initialize all functionality
function initAdminPanel() {
    setupTabNavigation();
    setupSettingsTabs();
    setupTeamMemberModal();
    loadApplications();
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

// Update the loader timeout to call initAdminPanel
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('adminContent').classList.remove('hidden');
            initAdminPanel();
        }, 500);
    }, 2000);
});

// Rest of your existing JavaScript...