// Sensor Monitoring and Reports Module
class SensorManager {
    constructor() {
        this.sensorData = this.loadSensorData();
        this.charts = {};
        this.init();
    }

    init() {
        // Initialize charts when sensor section is loaded
        this.setupSensorCharts();
    }

    loadSensorData() {
        return JSON.parse(localStorage.getItem('bioshield_sensor_data')) || {
            temperature: [],
            humidity: [],
            ammonia: [],
            timestamps: []
        };
    }

    setupSensorCharts() {
        // Simplified chart implementation using canvas
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    initializeCharts() {
        ['temp', 'humidity', 'ammonia'].forEach(type => {
            const canvas = document.getElementById(`${type}-chart`);
            if (canvas) {
                this.createSimpleChart(canvas, type);
            }
        });
    }

    createSimpleChart(canvas, dataType) {
        const ctx = canvas.getContext('2d');
        const data = this.sensorData[dataType === 'temp' ? 'temperature' : dataType];
        
        if (!data || data.length === 0) {
            // Show "No data" message
            ctx.fillStyle = '#757575';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set canvas size
        canvas.width = 300;
        canvas.height = 100;
        
        // Calculate chart dimensions
        const padding = 20;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        
        // Find min and max values
        const minValue = Math.min(...data.slice(-20)); // Last 20 readings
        const maxValue = Math.max(...data.slice(-20));
        const range = maxValue - minValue || 1;
        
        // Draw chart background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(padding, padding, chartWidth, chartHeight);
        
        // Draw data line
        ctx.beginPath();
        ctx.strokeStyle = this.getChartColor(dataType);
        ctx.lineWidth = 2;
        
        const recentData = data.slice(-20);
        recentData.forEach((value, index) => {
            const x = padding + (index / (recentData.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw current value
        if (recentData.length > 0) {
            const currentValue = recentData[recentData.length - 1];
            ctx.fillStyle = this.getChartColor(dataType);
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'right';
            
            const unit = dataType === 'temperature' ? '°C' : dataType === 'humidity' ? '%' : ' ppm';
            ctx.fillText(`${currentValue.toFixed(1)}${unit}`, canvas.width - 10, 20);
        }
    }

    getChartColor(dataType) {
        const colors = {
            temp: '#f44336',
            humidity: '#2196f3',
            ammonia: '#ff9800'
        };
        return colors[dataType] || '#4caf50';
    }

    updateSensorDisplays() {
        const tempElement = document.getElementById('temp-display');
        const humidityElement = document.getElementById('humidity-display');
        const ammoniaElement = document.getElementById('ammonia-display');

        if (this.sensorData.temperature.length > 0) {
            const temp = this.sensorData.temperature[this.sensorData.temperature.length - 1];
            if (tempElement) tempElement.textContent = `${temp.toFixed(1)}°C`;
            
            // Update status
            const tempStatus = this.getSensorStatus('temperature', temp);
            this.updateSensorStatus('temp', tempStatus);
        }

        if (this.sensorData.humidity.length > 0) {
            const humidity = this.sensorData.humidity[this.sensorData.humidity.length - 1];
            if (humidityElement) humidityElement.textContent = `${humidity.toFixed(1)}%`;
            
            const humidityStatus = this.getSensorStatus('humidity', humidity);
            this.updateSensorStatus('humidity', humidityStatus);
        }

        if (this.sensorData.ammonia.length > 0) {
            const ammonia = this.sensorData.ammonia[this.sensorData.ammonia.length - 1];
            if (ammoniaElement) ammoniaElement.textContent = `${ammonia.toFixed(1)} ppm`;
            
            const ammoniaStatus = this.getSensorStatus('ammonia', ammonia);
            this.updateSensorStatus('ammonia', ammoniaStatus);
        }

        // Refresh charts
        this.initializeCharts();
    }

    getSensorStatus(type, value) {
        const thresholds = {
            temperature: { min: 18, max: 32 },
            humidity: { min: 40, max: 75 },
            ammonia: { min: 0, max: 20 }
        };

        const threshold = thresholds[type];
        if (!threshold) return 'normal';

        if (value < threshold.min || value > threshold.max) {
            return 'warning';
        }
        return 'normal';
    }

    updateSensorStatus(sensorType, status) {
        const statusElement = document.querySelector(`#${sensorType}-display`)?.closest('.sensor-card')?.querySelector('.sensor-status');
        if (statusElement) {
            statusElement.className = `sensor-status ${status}`;
            statusElement.textContent = status === 'normal' ? 'Normal Range' : 'Out of Range';
        }
    }

    initCharts() {
        this.sensorData = this.loadSensorData();
        this.updateSensorDisplays();
    }
}

// Report Manager
class ReportManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize when needed
    }

    generateReport(reportType) {
        switch (reportType) {
            case 'animals':
                this.generateAnimalReport();
                break;
            case 'vaccines':
                this.generateVaccineReport();
                break;
            case 'sensors':
                this.generateSensorReport();
                break;
            case 'comprehensive':
                this.generateComprehensiveReport();
                break;
        }
    }

    generateAnimalReport() {
        const user = window.authManager?.getCurrentUser();
        if (!user || !user.animals) {
            alert('No animal data available for report generation.');
            return;
        }

        const animals = user.animals;
        let reportContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1>Animal Inventory Report</h1>
                <p><strong>Farm:</strong> ${user.farmName}</p>
                <p><strong>Location:</strong> ${user.farmLocation}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total Animals:</strong> ${animals.length}</p>
                <hr>
        `;

        // Animal summary by type
        const animalTypes = {};
        animals.forEach(animal => {
            animalTypes[animal.type] = (animalTypes[animal.type] || 0) + 1;
        });

        reportContent += `
            <h2>Animal Summary</h2>
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="padding: 8px; background: #f0f0f0;">Animal Type</th>
                    <th style="padding: 8px; background: #f0f0f0;">Count</th>
                </tr>
                ${Object.entries(animalTypes).map(([type, count]) => `
                    <tr>
                        <td style="padding: 8px;">${type.charAt(0).toUpperCase() + type.slice(1)}</td>
                        <td style="padding: 8px;">${count}</td>
                    </tr>
                `).join('')}
            </table>
        `;

        // Detailed animal list
        reportContent += `
            <h2>Detailed Animal List</h2>
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="padding: 8px; background: #f0f0f0;">Name</th>
                    <th style="padding: 8px; background: #f0f0f0;">Tag ID</th>
                    <th style="padding: 8px; background: #f0f0f0;">Type</th>
                    <th style="padding: 8px; background: #f0f0f0;">Breed</th>
                    <th style="padding: 8px; background: #f0f0f0;">Health Status</th>
                    <th style="padding: 8px; background: #f0f0f0;">Weight</th>
                </tr>
                ${animals.map(animal => `
                    <tr>
                        <td style="padding: 8px;">${animal.name}</td>
                        <td style="padding: 8px;">${animal.tagId}</td>
                        <td style="padding: 8px;">${animal.type}</td>
                        <td style="padding: 8px;">${animal.breed || 'Not specified'}</td>
                        <td style="padding: 8px;">${animal.healthStatus || 'Healthy'}</td>
                        <td style="padding: 8px;">${animal.weight ? animal.weight + ' kg' : 'Not recorded'}</td>
                    </tr>
                `).join('')}
            </table>
            </div>
        `;

        this.downloadReport(reportContent, `animal_report_${new Date().toISOString().split('T')[0]}.html`);
    }

    generateVaccineReport() {
        const user = window.authManager?.getCurrentUser();
        if (!user || !user.animals) {
            alert('No vaccination data available for report generation.');
            return;
        }

        let allVaccines = [];
        user.animals.forEach(animal => {
            if (animal.vaccines) {
                animal.vaccines.forEach(vaccine => {
                    allVaccines.push({
                        ...vaccine,
                        animalName: animal.name,
                        animalType: animal.type
                    });
                });
            }
        });

        let reportContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1>Vaccination Report</h1>
                <p><strong>Farm:</strong> ${user.farmName}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Total Vaccination Records:</strong> ${allVaccines.length}</p>
                <hr>
        `;

        if (allVaccines.length > 0) {
            reportContent += `
                <table border="1" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="padding: 8px; background: #f0f0f0;">Animal</th>
                        <th style="padding: 8px; background: #f0f0f0;">Vaccine</th>
                        <th style="padding: 8px; background: #f0f0f0;">Date Given</th>
                        <th style="padding: 8px; background: #f0f0f0;">Next Due</th>
                        <th style="padding: 8px; background: #f0f0f0;">Status</th>
                    </tr>
                    ${allVaccines.map(vaccine => `
                        <tr>
                            <td style="padding: 8px;">${vaccine.animalName} (${vaccine.animalType})</td>
                            <td style="padding: 8px;">${vaccine.name}</td>
                            <td style="padding: 8px;">${vaccine.dateGiven ? new Date(vaccine.dateGiven).toLocaleDateString() : 'Not given'}</td>
                            <td style="padding: 8px;">${new Date(vaccine.nextDueDate).toLocaleDateString()}</td>
                            <td style="padding: 8px;">${vaccine.completed ? 'Completed' : 'Pending'}</td>
                        </tr>
                    `).join('')}
                </table>
            `;
        } else {
            reportContent += '<p>No vaccination records found.</p>';
        }

        reportContent += '</div>';

        this.downloadReport(reportContent, `vaccine_report_${new Date().toISOString().split('T')[0]}.html`);
    }

    generateSensorReport() {
        const sensorData = JSON.parse(localStorage.getItem('bioshield_sensor_data')) || {};
        
        if (!sensorData.temperature || sensorData.temperature.length === 0) {
            alert('No sensor data available for report generation.');
            return;
        }

        const user = window.authManager?.getCurrentUser();
        let reportContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1>Environmental Monitoring Report</h1>
                <p><strong>Farm:</strong> ${user?.farmName || 'Unknown'}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Data Points:</strong> ${sensorData.temperature.length}</p>
                <hr>
        `;

        // Calculate statistics
        const temp = sensorData.temperature;
        const humidity = sensorData.humidity;
        const ammonia = sensorData.ammonia;

        if (temp.length > 0) {
            const tempStats = {
                min: Math.min(...temp),
                max: Math.max(...temp),
                avg: temp.reduce((a, b) => a + b, 0) / temp.length
            };

            const humidityStats = {
                min: Math.min(...humidity),
                max: Math.max(...humidity),
                avg: humidity.reduce((a, b) => a + b, 0) / humidity.length
            };

            const ammoniaStats = {
                min: Math.min(...ammonia),
                max: Math.max(...ammonia),
                avg: ammonia.reduce((a, b) => a + b, 0) / ammonia.length
            };

            reportContent += `
                <h2>Environmental Statistics</h2>
                <table border="1" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="padding: 8px; background: #f0f0f0;">Parameter</th>
                        <th style="padding: 8px; background: #f0f0f0;">Minimum</th>
                        <th style="padding: 8px; background: #f0f0f0;">Maximum</th>
                        <th style="padding: 8px; background: #f0f0f0;">Average</th>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Temperature</td>
                        <td style="padding: 8px;">${tempStats.min.toFixed(1)}°C</td>
                        <td style="padding: 8px;">${tempStats.max.toFixed(1)}°C</td>
                        <td style="padding: 8px;">${tempStats.avg.toFixed(1)}°C</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Humidity</td>
                        <td style="padding: 8px;">${humidityStats.min.toFixed(1)}%</td>
                        <td style="padding: 8px;">${humidityStats.max.toFixed(1)}%</td>
                        <td style="padding: 8px;">${humidityStats.avg.toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px;">Ammonia</td>
                        <td style="padding: 8px;">${ammoniaStats.min.toFixed(1)} ppm</td>
                        <td style="padding: 8px;">${ammoniaStats.max.toFixed(1)} ppm</td>
                        <td style="padding: 8px;">${ammoniaStats.avg.toFixed(1)} ppm</td>
                    </tr>
                </table>
            `;
        }

        reportContent += '</div>';

        this.downloadReport(reportContent, `sensor_report_${new Date().toISOString().split('T')[0]}.html`);
    }

    generateComprehensiveReport() {
        const user = window.authManager?.getCurrentUser();
        if (!user) {
            alert('Please log in to generate a comprehensive report.');
            return;
        }

        let reportContent = `
            <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;">
                <h1>Comprehensive Farm Management Report</h1>
                <div style="background: #f0f0f0; padding: 15px; margin: 20px 0;">
                    <p><strong>Farm Name:</strong> ${user.farmName}</p>
                    <p><strong>Location:</strong> ${user.farmLocation}</p>
                    <p><strong>Owner:</strong> ${user.name}</p>
                    <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <hr>
        `;

        // Farm Overview
        const animals = user.animals || [];
        const totalAnimals = animals.length;
        const healthyAnimals = animals.filter(a => (a.healthStatus || 'healthy') === 'healthy').length;
        
        reportContent += `
            <h2>Farm Overview</h2>
            <div style="display: flex; justify-content: space-between; margin: 20px 0;">
                <div style="text-align: center; border: 1px solid #ddd; padding: 15px; flex: 1; margin: 0 5px;">
                    <h3>${totalAnimals}</h3>
                    <p>Total Animals</p>
                </div>
                <div style="text-align: center; border: 1px solid #ddd; padding: 15px; flex: 1; margin: 0 5px;">
                    <h3>${healthyAnimals}</h3>
                    <p>Healthy Animals</p>
                </div>
                <div style="text-align: center; border: 1px solid #ddd; padding: 15px; flex: 1; margin: 0 5px;">
                    <h3>${((healthyAnimals / totalAnimals) * 100 || 0).toFixed(1)}%</h3>
                    <p>Health Rate</p>
                </div>
            </div>
        `;

        // Recent activities
        const activities = JSON.parse(localStorage.getItem('bioshield_activities')) || [];
        const recentActivities = activities.slice(0, 10);

        if (recentActivities.length > 0) {
            reportContent += `
                <h2>Recent Activities</h2>
                <ul>
                    ${recentActivities.map(activity => `
                        <li>${activity.description} - ${new Date(activity.timestamp).toLocaleDateString()}</li>
                    `).join('')}
                </ul>
            `;
        }

        // Alerts summary
        const alerts = JSON.parse(localStorage.getItem('bioshield_alerts')) || [];
        const activeAlerts = alerts.filter(alert => alert.active);

        if (activeAlerts.length > 0) {
            reportContent += `
                <h2>Active Alerts (${activeAlerts.length})</h2>
                <ul>
                    ${activeAlerts.map(alert => `
                        <li><strong>${alert.title}:</strong> ${alert.message}</li>
                    `).join('')}
                </ul>
            `;
        }

        reportContent += `
            <hr>
            <div style="margin-top: 30px; text-align: center; color: #666;">
                <p>Generated by BIOSHIELD Farm Management Portal v1.0.0</p>
                <p>This report contains confidential farm management information.</p>
            </div>
            </div>
        `;

        this.downloadReport(reportContent, `comprehensive_report_${new Date().toISOString().split('T')[0]}.html`);
    }

    downloadReport(content, filename) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show notification
        if (window.notificationManager) {
            window.notificationManager.addNotification(
                'Report generated and downloaded successfully!',
                'success'
            );
        }

        // Add activity
        if (window.authManager) {
            window.authManager.addActivity('report_generated', `Generated ${filename}`);
        }
    }
}

// Global functions
function generateReport(reportType) {
    window.reportManager?.generateReport(reportType);
}

// Initialize managers
document.addEventListener('DOMContentLoaded', () => {
    window.sensorManager = new SensorManager();
    window.reportManager = new ReportManager();
});