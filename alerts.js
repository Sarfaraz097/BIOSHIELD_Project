// Alert and Notification Management System
class NotificationManager {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('bioshield_notifications')) || [];
        this.init();
    }

    init() {
        this.updateNotificationCount();
        this.loadNotifications();

        // Add a test notification for debugging
        setTimeout(() => {
            this.addNotification('Welcome to BIOSHIELD! Your notification system is working.', 'info');
        }, 2000);

        // For testing: force dashboard visible to true to show notifications on login page
        this.isDashboardVisible = () => true;

        // Start periodic checks for alerts
        this.startAlertMonitoring();
    }

    // Add notification
    addNotification(message, type = 'info', persistent = false) {
        // Only show notifications if user is logged in and dashboard is visible
        if (!this.isDashboardVisible()) {
            return;
        }
        
        const notification = {
            id: Date.now().toString(),
            message: message,
            type: type, // success, info, warning, critical
            timestamp: new Date().toISOString(),
            read: false,
            persistent: persistent
        };

        this.notifications.unshift(notification);
        
        // Keep only last 100 notifications
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100);
        }

        this.saveNotifications();
        this.updateNotificationCount();
        this.loadNotifications();

        // Show toast notification for new alerts
        // this.showToast(notification); // Disabled to prevent automatic pop-ups
    }

    // Check if dashboard is visible (user is logged in)
    isDashboardVisible() {
        const dashboard = document.getElementById('dashboard');
        const authContainer = document.getElementById('auth-container');
        
        return dashboard && 
               dashboard.style.display !== 'none' && 
               authContainer && 
               authContainer.style.display === 'none';
    }
    
    // Show toast notification
    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${notification.message}</div>
                <div class="toast-time">${this.formatTime(new Date())}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to toast container
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        toastContainer.appendChild(toast);

        // Auto-remove non-critical toasts after 5 seconds
        if (notification.type !== 'critical') {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 5000);
        }

        // Play notification sound for critical alerts
        if (notification.type === 'critical') {
            this.playNotificationSound();
        }
    }

    playNotificationSound() {
        // Create audio context for notification sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio notification not supported');
        }
    }

    // Load notifications into panel
    loadNotifications() {
        console.log('🔄 loadNotifications called');
        const container = document.getElementById('notification-list');
        console.log('Container found:', !!container);
        console.log('Dashboard visible:', this.isDashboardVisible());
        console.log('Notifications count:', this.notifications.length);

        if (!container || !this.isDashboardVisible()) {
            console.log('❌ Not loading notifications - container or dashboard not ready');
            return;
        }

        if (this.notifications.length === 0) {
            console.log('📭 No notifications to display');
            container.innerHTML = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No new notifications</p>
                </div>
            `;
            return;
        }

        console.log('✅ Loading', this.notifications.length, 'notifications');
        container.innerHTML = this.notifications.map(notification => {
            const timeAgo = this.getTimeAgo(new Date(notification.timestamp));
            return `
                <div class="notification-item ${notification.read ? 'read' : ''}" data-id="${notification.id}">
                    <div class="notification-icon ${notification.type}">
                        <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${timeAgo}</div>
                    </div>
                    <button class="notification-dismiss" onclick="removeNotification('${notification.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');

        // Mark notifications as read when panel is viewed
        setTimeout(() => {
            this.markAllAsRead();
        }, 1000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle',
            critical: 'exclamation-circle'
        };
        return icons[type] || 'bell';
    }

    // Update notification count
    updateNotificationCount() {
        // Only update count if dashboard is visible
        if (!this.isDashboardVisible()) {
            return;
        }
        
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.getElementById('notification-count');
        
        if (countElement) {
            countElement.textContent = unreadCount;
            if (unreadCount > 0) {
                countElement.classList.remove('zero');
            } else {
                countElement.classList.add('zero');
            }
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateNotificationCount();
    }

    // Remove notification
    removeNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationCount();
        this.loadNotifications();
    }

    // Clear all notifications
    clearAllNotifications() {
        if (confirm('Are you sure you want to clear all notifications?')) {
            this.notifications = [];
            this.saveNotifications();
            this.updateNotificationCount();
            this.loadNotifications();
        }
    }

    // Save notifications to localStorage
    saveNotifications() {
        localStorage.setItem('bioshield_notifications', JSON.stringify(this.notifications));
    }

    // Format time ago
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

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Start monitoring for alerts
    startAlertMonitoring() {
        // Check for vaccine reminders every minute
        setInterval(() => {
            this.checkVaccineReminders();
        }, 60000);

        // Check for sensor alerts (already handled by sensor simulation)
        
        // Check for other alerts every 5 minutes
        setInterval(() => {
            this.checkSystemAlerts();
        }, 300000);
    }

    // Check vaccine reminders
    checkVaccineReminders() {
        if (window.vaccineManager) {
            const reminders = window.vaccineManager.generateVaccineReminders();
            reminders.forEach(reminder => {
                // Check if we've already sent this reminder today
                const today = new Date().toDateString();
                const reminderKey = `vaccine_${reminder.animalId}_${reminder.vaccineId}_${today}`;
                
                if (!localStorage.getItem(reminderKey)) {
                    this.addNotification(reminder.message, reminder.type, true);
                    localStorage.setItem(reminderKey, 'sent');
                }
            });
        }
    }

    // Check system alerts
    checkSystemAlerts() {
        const user = window.authManager?.getCurrentUser();
        if (!user) return;

        // Check for animals without recent health updates
        if (user.animals) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            user.animals.forEach(animal => {
                const lastUpdate = new Date(animal.updatedAt || animal.createdAt);
                if (lastUpdate < oneWeekAgo) {
                    const alertKey = `health_check_${animal.id}_${new Date().toDateString()}`;
                    if (!localStorage.getItem(alertKey)) {
                        this.addNotification(
                            `Health check reminder: ${animal.name} hasn't been updated in a week`,
                            'warning'
                        );
                        localStorage.setItem(alertKey, 'sent');
                    }
                }
            });
        }

        // Check for data backup reminder (monthly)
        const lastBackupReminder = localStorage.getItem('last_backup_reminder');
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        if (!lastBackupReminder || new Date(lastBackupReminder) < oneMonthAgo) {
            this.addNotification(
                'Don\'t forget to backup your farm data regularly!',
                'info'
            );
            localStorage.setItem('last_backup_reminder', new Date().toISOString());
        }
    }
}

// Alert Management System
class AlertManager {
    constructor() {
        this.alerts = JSON.parse(localStorage.getItem('bioshield_alerts')) || [];
        this.init();
    }

    init() {
        this.currentUser = window.authManager?.getCurrentUser();
    }

    // Load alerts for the alerts section
    loadAlerts() {
        this.init();
        
        // Get active alerts
        const activeAlerts = this.alerts.filter(alert => alert.active);
        
        // Count alerts by type
        const criticalCount = activeAlerts.filter(a => a.type === 'critical').length;
        const warningCount = activeAlerts.filter(a => a.type === 'warning').length;
        const infoCount = activeAlerts.filter(a => a.type === 'info').length;

        // Update alert counters
        this.updateAlertCounts(criticalCount, warningCount, infoCount);
        
        // Display alerts
        this.displayAlerts(activeAlerts);
    }

    updateAlertCounts(critical, warning, info) {
        const criticalElement = document.getElementById('critical-alerts');
        const warningElement = document.getElementById('warning-alerts');
        const infoElement = document.getElementById('info-alerts');

        if (criticalElement) criticalElement.textContent = critical;
        if (warningElement) warningElement.textContent = warning;
        if (infoElement) infoElement.textContent = info;
    }

    displayAlerts(alerts) {
        const container = document.getElementById('alert-list');
        if (!container) return;

        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-check-circle"></i>
                    <h3>All Clear!</h3>
                    <p>No active alerts at this time.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = alerts.map(alert => {
            const timeAgo = this.getTimeAgo(new Date(alert.timestamp));
            return `
                <div class="alert-item ${alert.type}">
                    <div class="alert-icon">
                        <i class="fas fa-${this.getAlertIcon(alert.type)}"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-message">${alert.message}</div>
                        <div class="alert-time">${timeAgo}</div>
                    </div>
                    <div class="alert-actions">
                        <button class="btn btn-sm btn-outline" onclick="resolveAlert('${alert.id}')">
                            <i class="fas fa-check"></i> Resolve
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="dismissAlert('${alert.id}')">
                            <i class="fas fa-times"></i> Dismiss
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    getAlertIcon(type) {
        const icons = {
            critical: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    // Create alert
    createAlert(title, message, type = 'info', source = 'system', animalId = null) {
        const alert = {
            id: Date.now().toString(),
            title: title,
            message: message,
            type: type,
            source: source,
            animalId: animalId,
            timestamp: new Date().toISOString(),
            active: true,
            resolved: false,
            resolvedAt: null
        };

        this.alerts.unshift(alert);
        this.saveAlerts();

        // Also add as notification
        if (window.notificationManager) {
            window.notificationManager.addNotification(
                `${title}: ${message}`,
                type,
                type === 'critical'
            );
        }

        // Add activity
        if (window.authManager) {
            window.authManager.addActivity('alert_created', title);
        }

        return alert;
    }

    // Resolve alert
    resolveAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (!alert) return;

        alert.active = false;
        alert.resolved = true;
        alert.resolvedAt = new Date().toISOString();

        this.saveAlerts();
        this.loadAlerts();

        // Add activity
        if (window.authManager) {
            window.authManager.addActivity('alert_resolved', alert.title);
        }

        // Add notification
        if (window.notificationManager) {
            window.notificationManager.addNotification(
                `Alert resolved: ${alert.title}`,
                'success'
            );
        }
    }

    // Dismiss alert
    dismissAlert(alertId) {
        if (confirm('Are you sure you want to dismiss this alert?')) {
            const alert = this.alerts.find(a => a.id === alertId);
            if (!alert) return;

            alert.active = false;
            alert.dismissed = true;
            alert.dismissedAt = new Date().toISOString();

            this.saveAlerts();
            this.loadAlerts();

            // Add activity
            if (window.authManager) {
                window.authManager.addActivity('alert_dismissed', alert.title);
            }
        }
    }

    // Save alerts
    saveAlerts() {
        localStorage.setItem('bioshield_alerts', JSON.stringify(this.alerts));
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
}

// Global functions
function removeNotification(notificationId) {
    window.notificationManager?.removeNotification(notificationId);
}

function clearAllNotifications() {
    window.notificationManager?.clearAllNotifications();
}

function resolveAlert(alertId) {
    window.alertManager?.resolveAlert(alertId);
}

function dismissAlert(alertId) {
    window.alertManager?.dismissAlert(alertId);
}

// Initialize managers
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
    window.alertManager = new AlertManager();
});