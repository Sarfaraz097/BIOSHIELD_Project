// Dashboard Manager
class DashboardManager {
    constructor() {
        this.currentSection = 'overview';
        this.sidebarCollapsed = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboardMetrics();
        this.loadRecentActivities();
        this.startSensorSimulation();
        this.addPoultryTableToOverview();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-toggle')) {
                this.toggleSidebar();
            }
        });

        // User menu dropdown
        document.addEventListener('click', (e) => {
            if (e.target.closest('.user-menu')) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleUserMenu();
            } else if (!e.target.closest('.user-dropdown')) {
                this.closeUserMenu();
            }
        });

        // Notification panel
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-icon')) {
                this.toggleNotifications();
            } else if (!e.target.closest('.notification-panel')) {
                this.closeNotifications();
            }
        });

        // Responsive sidebar handling
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                this.sidebarCollapsed = true;
                document.getElementById('sidebar').classList.add('collapsed');
                document.querySelector('.main-content').classList.add('expanded');
            } else if (window.innerWidth > 768 && this.sidebarCollapsed) {
                this.sidebarCollapsed = false;
                document.getElementById('sidebar').classList.remove('collapsed');
                document.querySelector('.main-content').classList.remove('expanded');
            }
        });
    }

    // Sidebar Management
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }

        // Mobile specific handling
        if (window.innerWidth <= 768) {
            if (this.sidebarCollapsed) {
                sidebar.classList.remove('show');
            } else {
                sidebar.classList.add('show');
            }
        }
    }

    // User Menu Management
    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            const isVisible = dropdown.classList.contains('show');
            if (isVisible) {
                dropdown.classList.remove('show');
            } else {
                dropdown.classList.add('show');
            }
            console.log('User menu toggled:', !isVisible);
        } else {
            console.error('User dropdown not found!');
        }
    }

    closeUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    // Notification Panel Management
    toggleNotifications() {
        const panel = document.getElementById('notification-panel');
        const wasHidden = !panel.classList.contains('show');
        panel.classList.toggle('show');

        // Load notifications when opening the panel
        if (wasHidden) {
            window.notificationManager?.loadNotifications();
        }
    }

    closeNotifications() {
        const panel = document.getElementById('notification-panel');
        panel.classList.remove('show');
    }

    // Section Navigation
    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[onclick*="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        let targetSection = document.getElementById(`${sectionName}-section`);
        
        if (!targetSection) {
            // Create section if it doesn't exist
            targetSection = this.createSection(sectionName);
        }

        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentSection = sectionName;

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.sidebarCollapsed = true;
            document.getElementById('sidebar').classList.remove('show');
        }

        // Load section specific data
        this.loadSectionData(sectionName);

        // Additional action for poultry section to render table
        if (sectionName === 'poultry') {
            if (typeof window.renderPoultryTable === 'function') {
                window.renderPoultryTable();
            }
            // Ensure poultry table container exists in poultry section
            const poultrySection = document.getElementById('poultry-section');
            if (poultrySection && !document.getElementById('poultry-table-container')) {
                const poultryTableContainer = document.createElement('div');
                poultryTableContainer.id = 'poultry-table-container';
                poultryTableContainer.className = 'poultry-table-container';
                poultrySection.appendChild(poultryTableContainer);
            }
        }
    }

    // Create dynamic sections
    createSection(sectionName) {
        const mainContent = document.querySelector('.main-content');
        const section = document.createElement('section');
        section.id = `${sectionName}-section`;
        section.className = 'content-section';

        const sectionContent = this.getSectionContent(sectionName);
        section.innerHTML = sectionContent;

        mainContent.appendChild(section);
        return section;
    }

    getSectionContent(sectionName) {
        const templates = {
            animals: `
                <div class="section-header">
                    <h1><i class="fas fa-paw"></i> Animal Management</h1>
                    <p>Manage your farm animals and their health records</p>
                </div>
                
                <div class="section-actions">
                    <button class="btn btn-primary" onclick="showAddAnimalModal()">
                        <i class="fas fa-plus"></i> Add New Animal
                    </button>
                    <button class="btn btn-outline">
                        <i class="fas fa-download"></i> Export List
                    </button>
                </div>
                
                <div class="animals-grid" id="animals-grid">
                    <div class="no-data">
                        <i class="fas fa-paw"></i>
                        <h3>No Animals Yet</h3>
                        <p>Start by adding your first animal to track their health and vaccination records.</p>
                        <button class="btn btn-primary" onclick="showAddAnimalModal()">
                            <i class="fas fa-plus"></i> Add First Animal
                        </button>
                    </div>
                </div>
            `,
            vaccines: `
                <div class="section-header">
                    <h1><i class="fas fa-syringe"></i> Vaccination Management</h1>
                    <p>Track and schedule animal vaccinations</p>
                </div>
                
                <div class="vaccine-dashboard">
                    <div class="vaccine-metrics">
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div class="metric-info">
                                <h3 id="due-vaccines">0</h3>
                                <p>Due This Week</p>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="metric-info">
                                <h3 id="overdue-vaccines">0</h3>
                                <p>Overdue</p>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="metric-info">
                                <h3 id="completed-vaccines">0</h3>
                                <p>Completed This Month</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="vaccine-schedule" id="vaccine-schedule">
                        <h3>Upcoming Vaccinations</h3>
                        <div class="no-data">
                            <i class="fas fa-calendar-alt"></i>
                            <p>No upcoming vaccinations scheduled</p>
                        </div>
                    </div>
                </div>
            `,
            sensors: `
                <div class="section-header">
                    <h1><i class="fas fa-thermometer-half"></i> Environmental Monitoring</h1>
                    <p>Monitor farm environmental conditions in real-time</p>
                </div>
                
                <div class="sensor-dashboard">
                    <div class="sensor-cards">
                        <div class="sensor-card">
                            <div class="sensor-header">
                                <i class="fas fa-thermometer-half"></i>
                                <h3>Temperature</h3>
                            </div>
                            <div class="sensor-value-large" id="temp-display">25°C</div>
                            <div class="sensor-status normal">Normal Range</div>
                            <canvas id="temp-chart" class="sensor-chart"></canvas>
                        </div>
                        
                        <div class="sensor-card">
                            <div class="sensor-header">
                                <i class="fas fa-tint"></i>
                                <h3>Humidity</h3>
                            </div>
                            <div class="sensor-value-large" id="humidity-display">65%</div>
                            <div class="sensor-status normal">Normal Range</div>
                            <canvas id="humidity-chart" class="sensor-chart"></canvas>
                        </div>
                        
                        <div class="sensor-card">
                            <div class="sensor-header">
                                <i class="fas fa-wind"></i>
                                <h3>Ammonia Level</h3>
                            </div>
                            <div class="sensor-value-large" id="ammonia-display">12 ppm</div>
                            <div class="sensor-status normal">Normal Range</div>
                            <canvas id="ammonia-chart" class="sensor-chart"></canvas>
                        </div>
                    </div>
                </div>
            `,
            alerts: `
                <div class="section-header">
                    <h1><i class="fas fa-exclamation-triangle"></i> Alerts & Notifications</h1>
                    <p>Monitor and manage farm alerts and warnings</p>
                </div>
                
                <div class="alert-dashboard">
                    <div class="alert-summary">
                        <div class="alert-stat critical">
                            <i class="fas fa-exclamation-circle"></i>
                            <span class="count" id="critical-alerts">0</span>
                            <span class="label">Critical</span>
                        </div>
                        <div class="alert-stat warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span class="count" id="warning-alerts">0</span>
                            <span class="label">Warning</span>
                        </div>
                        <div class="alert-stat info">
                            <i class="fas fa-info-circle"></i>
                            <span class="count" id="info-alerts">0</span>
                            <span class="label">Info</span>
                        </div>
                    </div>
                    
                    <div class="alert-list" id="alert-list">
                        <div class="no-data">
                            <i class="fas fa-check-circle"></i>
                            <h3>All Clear!</h3>
                            <p>No active alerts at this time.</p>
                        </div>
                    </div>
                </div>
            `,
            biosecurity: `
                <div class="section-header">
                    <h1><i class="fas fa-shield-virus"></i> Biosecurity Guidelines</h1>
                    <p>Follow essential biosecurity protocols to protect your farm</p>
                </div>
                
                <div class="biosecurity-content">
                    <div class="language-selector">
                        <select id="language-select" onchange="changeLanguage(this.value)">
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                    
                    <div class="guidelines-grid" id="guidelines-grid">
                        <!-- Guidelines will be populated dynamically -->
                    </div>
                </div>
            `,
            reports: `
                <div class="section-header">
                    <h1><i class="fas fa-chart-bar"></i> Reports & Analytics</h1>
                    <p>Generate comprehensive reports and analyze farm data</p>
                </div>

                <div class="report-dashboard">
                    <div class="report-types">
                        <div class="report-card" onclick="generateReport('animals')">
                            <i class="fas fa-paw"></i>
                            <h3>Animal Report</h3>
                            <p>Complete animal inventory and health records</p>
                            <button class="btn btn-primary">
                                <i class="fas fa-download"></i> Generate
                            </button>
                        </div>

                        <div class="report-card" onclick="generateReport('vaccines')">
                            <i class="fas fa-syringe"></i>
                            <h3>Vaccination Report</h3>
                            <p>Vaccination schedules and completion rates</p>
                            <button class="btn btn-primary">
                                <i class="fas fa-download"></i> Generate
                            </button>
                        </div>

                        <div class="report-card" onclick="generateReport('sensors')">
                            <i class="fas fa-thermometer-half"></i>
                            <h3>Environmental Report</h3>
                            <p>Sensor data and environmental conditions</p>
                            <button class="btn btn-primary">
                                <i class="fas fa-download"></i> Generate
                            </button>
                        </div>

                        <div class="report-card" onclick="generateReport('comprehensive')">
                            <i class="fas fa-file-alt"></i>
                            <h3>Comprehensive Report</h3>
                            <p>Complete farm management overview</p>
                            <button class="btn btn-primary">
                                <i class="fas fa-download"></i> Generate
                            </button>
                        </div>
                    </div>
                </div>
            `,
            poultry: `
                <div class="section-header">
                    <h1><i class="fas fa-dove"></i> Poultry Management</h1>
                    <p>Monitor poultry health, temperature, and vaccination schedules</p>
                </div>

                <div class="poultry-dashboard">
                    <div class="poultry-metrics">
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-thermometer-half"></i>
                            </div>
                            <div class="metric-info">
                                <h3 id="poultry-count">20</h3>
                                <p>Total Poultry</p>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-syringe"></i>
                            </div>
                            <div class="metric-info">
                                <h3 id="poultry-vaccines">15</h3>
                                <p>Vaccinated</p>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="metric-info">
                                <h3 id="poultry-alerts">2</h3>
                                <p>Need Attention</p>
                            </div>
                        </div>
                    </div>

                    <div class="poultry-table-container" id="poultry-table-container">
                        <!-- Poultry table will be rendered here -->
                    </div>
                </div>
            `
        };

        return templates[sectionName] || `
            <div class="section-header">
                <h1>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h1>
                <p>This section is under development.</p>
            </div>
            <div class="coming-soon">
                <i class="fas fa-cogs"></i>
                <h3>Coming Soon</h3>
                <p>This feature will be available in the next update.</p>
            </div>
        `;
    }

    // Load section specific data
    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'animals':
                if (window.animalManager) {
                    window.animalManager.loadAnimals();
                }
                break;
            case 'vaccines':
                if (window.vaccineManager) {
                    window.vaccineManager.loadVaccineData();
                }
                break;
            case 'sensors':
                if (window.sensorManager) {
                    window.sensorManager.initCharts();
                }
                break;
            case 'alerts':
                if (window.alertManager) {
                    window.alertManager.loadAlerts();
                }
                break;
            case 'biosecurity':
                if (window.biosecurityManager) {
                    window.biosecurityManager.loadGuidelines();
                }
                break;
            case 'reports':
                if (window.reportManager) {
                    window.reportManager.init();
                }
                break;
        }
    }

    // Update dashboard metrics
    updateDashboardMetrics() {
        const user = window.authManager?.getCurrentUser();
        if (!user) return;

        // Update animal count
        const totalAnimals = user.animals ? user.animals.length : 0;
        document.getElementById('total-animals').textContent = totalAnimals;

        // Update pending vaccines
        const pendingVaccines = this.calculatePendingVaccines(user);
        document.getElementById('pending-vaccines').textContent = pendingVaccines;

        // Update active alerts
        const activeAlerts = user.alerts ? user.alerts.filter(alert => alert.active).length : 0;
        document.getElementById('active-alerts').textContent = activeAlerts;

        // Update notification count
        this.updateNotificationCount(activeAlerts + pendingVaccines);
    }

    calculatePendingVaccines(user) {
        if (!user.animals) return 0;
        
        let pendingCount = 0;
        const today = new Date();
        
        user.animals.forEach(animal => {
            if (animal.vaccines) {
                animal.vaccines.forEach(vaccine => {
                    if (vaccine.nextDueDate) {
                        const dueDate = new Date(vaccine.nextDueDate);
                        if (dueDate <= today && !vaccine.completed) {
                            pendingCount++;
                        }
                    }
                });
            }
        });
        
        return pendingCount;
    }

    updateNotificationCount(count) {
        const notificationCount = document.getElementById('notification-count');
        notificationCount.textContent = count;
        
        if (count > 0) {
            notificationCount.classList.remove('zero');
        } else {
            notificationCount.classList.add('zero');
        }
    }

    // Load recent activities
    loadRecentActivities() {
        const activities = JSON.parse(localStorage.getItem('bioshield_activities')) || [];
        const recentActivities = activities.slice(0, 10);
        const container = document.getElementById('recent-activities');
        
        if (recentActivities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="activity-content">
                        <p><strong>Welcome to BIOSHIELD!</strong></p>
                        <span>Start by adding your first animals</span>
                        <small>Just now</small>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = recentActivities.map(activity => {
            const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
            const icon = this.getActivityIcon(activity.type);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p><strong>${activity.description}</strong></p>
                        <small>${timeAgo}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    getActivityIcon(type) {
        const icons = {
            login: 'sign-in-alt',
            logout: 'sign-out-alt',
            registration: 'user-plus',
            animal_added: 'paw',
            vaccine_scheduled: 'syringe',
            alert_created: 'exclamation-triangle',
            report_generated: 'file-alt'
        };
        return icons[type] || 'info-circle';
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }

    // Simulate sensor data
    startSensorSimulation() {
        this.updateSensorData();
        setInterval(() => {
            this.updateSensorData();
        }, 30000); // Update every 30 seconds
    }

    updateSensorData() {
        // Generate realistic sensor data
        const temperature = 20 + Math.random() * 15; // 20-35°C
        const humidity = 40 + Math.random() * 40; // 40-80%
        const ammonia = 5 + Math.random() * 20; // 5-25 ppm

        // Update dashboard display
        document.getElementById('live-temp').textContent = `${temperature.toFixed(1)}°C`;
        document.getElementById('live-humidity').textContent = `${humidity.toFixed(1)}%`;
        document.getElementById('live-ammonia').textContent = `${ammonia.toFixed(1)} ppm`;

        // Update average temperature in metrics
        document.getElementById('avg-temperature').textContent = `${temperature.toFixed(1)}°C`;

        // Store sensor data for charts
        const sensorData = JSON.parse(localStorage.getItem('bioshield_sensor_data')) || {
            temperature: [],
            humidity: [],
            ammonia: [],
            timestamps: []
        };

        const timestamp = new Date();
        sensorData.temperature.push(temperature);
        sensorData.humidity.push(humidity);
        sensorData.ammonia.push(ammonia);
        sensorData.timestamps.push(timestamp.toISOString());

        // Keep only last 100 readings
        if (sensorData.temperature.length > 100) {
            sensorData.temperature.shift();
            sensorData.humidity.shift();
            sensorData.ammonia.shift();
            sensorData.timestamps.shift();
        }

        localStorage.setItem('bioshield_sensor_data', JSON.stringify(sensorData));

        // Check for alerts
        this.checkSensorAlerts(temperature, humidity, ammonia);
    }

    checkSensorAlerts(temperature, humidity, ammonia) {
        const alerts = [];

        if (temperature > 32) {
            alerts.push({
                type: 'warning',
                message: `High temperature detected: ${temperature.toFixed(1)}°C`,
                sensor: 'temperature'
            });
        } else if (temperature < 18) {
            alerts.push({
                type: 'warning', 
                message: `Low temperature detected: ${temperature.toFixed(1)}°C`,
                sensor: 'temperature'
            });
        }

        if (humidity > 75) {
            alerts.push({
                type: 'warning',
                message: `High humidity detected: ${humidity.toFixed(1)}%`,
                sensor: 'humidity'
            });
        }

        if (ammonia > 20) {
            alerts.push({
                type: 'critical',
                message: `Dangerous ammonia level: ${ammonia.toFixed(1)} ppm`,
                sensor: 'ammonia'
            });
        }

        // Create notifications for alerts
        alerts.forEach(alert => {
            if (window.notificationManager) {
                window.notificationManager.addNotification(alert.message, alert.type);
            }
        });
    }

    // Add poultry table to overview section
    addPoultryTableToOverview() {
        const overviewSection = document.getElementById('overview-section');
        if (!overviewSection) return;

        // Check if poultry table container already exists to avoid duplicates
        if (document.getElementById('poultry-table-container')) return;

        const poultryContainer = document.createElement('div');
        poultryContainer.id = 'poultry-table-container';
        poultryContainer.className = 'poultry-table-container';

        // Add a header for the poultry section
        const poultryHeader = document.createElement('div');
        poultryHeader.className = 'section-header poultry-header';
        poultryHeader.innerHTML = `
            <h2><i class="fas fa-dove"></i> Poultry Health Overview</h2>
            <p>Real-time monitoring of poultry health status and vaccination schedules</p>
        `;

        overviewSection.appendChild(poultryHeader);
        overviewSection.appendChild(poultryContainer);

        // Render poultry table immediately after adding container
        setTimeout(() => {
            if (typeof window.renderPoultryTable === 'function') {
                window.renderPoultryTable();
            }
        }, 100);
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    window.dashboardManager.showSection(sectionName);
}

function toggleSidebar() {
    window.dashboardManager.toggleSidebar();
}

function toggleUserMenu() {
    console.log('toggleUserMenu called');
    if (window.dashboardManager) {
        window.dashboardManager.toggleUserMenu();
    } else {
        // Fallback if dashboard manager not ready
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
            console.log('Fallback user menu toggle executed');
        }
    }
}

function toggleNotifications() {
    window.dashboardManager.toggleNotifications();
}

function showProfile() {
    // TODO: Implement profile modal
    alert('Profile functionality coming soon!');
}

function showSettings() {
    // TODO: Implement settings modal
    alert('Settings functionality coming soon!');
}

// Initialize dashboard manager
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});