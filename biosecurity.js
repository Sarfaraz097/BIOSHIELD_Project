// Biosecurity Guidelines Module
class BiosecurityManager {
    constructor() {
        this.currentLanguage = 'en';
        this.guidelines = this.initializeGuidelines();
        this.init();
    }

    init() {
        this.loadLanguagePreference();
    }

    loadLanguagePreference() {
        const savedLanguage = localStorage.getItem('bioshield_language');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
        }
    }

    saveLanguagePreference() {
        localStorage.setItem('bioshield_language', this.currentLanguage);
    }

    initializeGuidelines() {
        return {
            en: {
                title: "Biosecurity Guidelines",
                subtitle: "Essential protocols to protect your farm",
                categories: [
                    {
                        id: 'entry_control',
                        title: 'Farm Entry Control',
                        icon: 'shield-alt',
                        description: 'Control who enters your farm and how',
                        steps: [
                            {
                                title: 'Visitor Registration',
                                description: 'Maintain a visitor log with contact details and purpose of visit',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Vehicle Disinfection',
                                description: 'Disinfect all vehicles entering the farm premises',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Restricted Access Areas',
                                description: 'Clearly mark and restrict access to sensitive areas',
                                priority: 'medium',
                                completed: false
                            },
                            {
                                title: 'Entry Point Signage',
                                description: 'Post biosecurity rules and contact information at entry points',
                                priority: 'medium',
                                completed: false
                            }
                        ]
                    },
                    {
                        id: 'personal_hygiene',
                        title: 'Personal Hygiene',
                        icon: 'hands-wash',
                        description: 'Personal cleanliness protocols for all farm personnel',
                        steps: [
                            {
                                title: 'Hand Washing Stations',
                                description: 'Install hand washing facilities at entry points and between animal areas',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Protective Clothing',
                                description: 'Provide clean coveralls, boots, and gloves for all personnel',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Shower Facilities',
                                description: 'Provide shower facilities for high-risk areas',
                                priority: 'medium',
                                completed: false
                            },
                            {
                                title: 'Personal Items Storage',
                                description: 'Designate areas for personal items outside animal areas',
                                priority: 'medium',
                                completed: false
                            }
                        ]
                    },
                    {
                        id: 'animal_health',
                        title: 'Animal Health Management',
                        icon: 'stethoscope',
                        description: 'Monitor and maintain animal health',
                        steps: [
                            {
                                title: 'Daily Health Checks',
                                description: 'Conduct daily visual health inspections of all animals',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Vaccination Schedule',
                                description: 'Maintain up-to-date vaccination records for all animals',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Quarantine Procedures',
                                description: 'Isolate new or sick animals in designated quarantine areas',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Veterinary Consultation',
                                description: 'Establish regular veterinary check-up schedule',
                                priority: 'medium',
                                completed: false
                            }
                        ]
                    },
                    {
                        id: 'feed_water',
                        title: 'Feed and Water Safety',
                        icon: 'tint',
                        description: 'Ensure safe and clean feed and water supply',
                        steps: [
                            {
                                title: 'Water Quality Testing',
                                description: 'Test water quality regularly for contaminants',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Feed Storage',
                                description: 'Store feed in clean, dry, rodent-proof containers',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Feed Source Verification',
                                description: 'Source feed only from certified suppliers',
                                priority: 'medium',
                                completed: false
                            },
                            {
                                title: 'Clean Feeding Equipment',
                                description: 'Clean and disinfect feeding equipment regularly',
                                priority: 'medium',
                                completed: false
                            }
                        ]
                    },
                    {
                        id: 'waste_management',
                        title: 'Waste Management',
                        icon: 'trash-alt',
                        description: 'Proper disposal and management of farm waste',
                        steps: [
                            {
                                title: 'Dead Animal Disposal',
                                description: 'Dispose of dead animals according to local regulations',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Manure Management',
                                description: 'Compost or properly treat manure before use',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Medical Waste',
                                description: 'Dispose of syringes and medical waste safely',
                                priority: 'medium',
                                completed: false
                            },
                            {
                                title: 'General Farm Waste',
                                description: 'Maintain clean farm environment with proper waste disposal',
                                priority: 'medium',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            es: {
                title: "Guías de Bioseguridad",
                subtitle: "Protocolos esenciales para proteger su granja",
                categories: [
                    {
                        id: 'entry_control',
                        title: 'Control de Entrada a la Granja',
                        icon: 'shield-alt',
                        description: 'Controle quién entra a su granja y cómo',
                        steps: [
                            {
                                title: 'Registro de Visitantes',
                                description: 'Mantenga un registro de visitantes con detalles de contacto y propósito de la visita',
                                priority: 'high',
                                completed: false
                            },
                            {
                                title: 'Desinfección de Vehículos',
                                description: 'Desinfecte todos los vehículos que ingresen a las instalaciones de la granja',
                                priority: 'high',
                                completed: false
                            }
                        ]
                    }
                    // Add more Spanish translations as needed
                ]
            },
            fr: {
                title: "Directives de Biosécurité",
                subtitle: "Protocoles essentiels pour protéger votre ferme",
                categories: [
                    {
                        id: 'entry_control',
                        title: 'Contrôle d\'Accès à la Ferme',
                        icon: 'shield-alt',
                        description: 'Contrôlez qui entre dans votre ferme et comment',
                        steps: [
                            {
                                title: 'Enregistrement des Visiteurs',
                                description: 'Tenez un registre des visiteurs avec les coordonnées et le but de la visite',
                                priority: 'high',
                                completed: false
                            }
                        ]
                    }
                ]
            },
            de: {
                title: "Biosicherheitsrichtlinien",
                subtitle: "Wesentliche Protokolle zum Schutz Ihres Betriebs",
                categories: [
                    {
                        id: 'entry_control',
                        title: 'Betriebszugangskontrolle',
                        icon: 'shield-alt',
                        description: 'Kontrollieren Sie, wer Ihren Betrieb betritt und wie',
                        steps: [
                            {
                                title: 'Besucherregistrierung',
                                description: 'Führen Sie ein Besucherprotokoll mit Kontaktdaten und Zweck des Besuchs',
                                priority: 'high',
                                completed: false
                            }
                        ]
                    }
                ]
            }
        };
    }

    loadGuidelines() {
        const container = document.getElementById('guidelines-grid');
        if (!container) return;

        const currentGuidelines = this.guidelines[this.currentLanguage] || this.guidelines.en;
        
        container.innerHTML = `
            <div class="guidelines-header">
                <h2>${currentGuidelines.title}</h2>
                <p>${currentGuidelines.subtitle}</p>
            </div>
            
            <div class="guidelines-categories">
                ${currentGuidelines.categories.map(category => `
                    <div class="guideline-category">
                        <div class="category-header" onclick="toggleCategory('${category.id}')">
                            <div class="category-icon">
                                <i class="fas fa-${category.icon}"></i>
                            </div>
                            <div class="category-info">
                                <h3>${category.title}</h3>
                                <p>${category.description}</p>
                            </div>
                            <div class="category-progress">
                                <div class="progress-circle">
                                    <span>${this.getCategoryProgress(category)}%</span>
                                </div>
                                <i class="fas fa-chevron-down toggle-icon"></i>
                            </div>
                        </div>
                        
                        <div class="category-content" id="category-${category.id}" style="display: none;">
                            <div class="steps-list">
                                ${category.steps.map((step, index) => `
                                    <div class="guideline-step ${step.priority}">
                                        <div class="step-checkbox">
                                            <input type="checkbox" 
                                                   id="step-${category.id}-${index}"
                                                   ${step.completed ? 'checked' : ''}
                                                   onchange="toggleStepCompletion('${category.id}', ${index})">
                                            <label for="step-${category.id}-${index}"></label>
                                        </div>
                                        <div class="step-content">
                                            <h4>${step.title}</h4>
                                            <p>${step.description}</p>
                                            <span class="priority-badge priority-${step.priority}">
                                                ${step.priority.charAt(0).toUpperCase() + step.priority.slice(1)} Priority
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="guidelines-footer">
                <div class="overall-progress">
                    <h4>Overall Compliance: ${this.getOverallProgress()}%</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.getOverallProgress()}%"></div>
                    </div>
                </div>
                
                <div class="guidelines-actions">
                    <button class="btn btn-primary" onclick="generateComplianceReport()">
                        <i class="fas fa-file-alt"></i> Generate Report
                    </button>
                    <button class="btn btn-outline" onclick="resetProgress()">
                        <i class="fas fa-undo"></i> Reset Progress
                    </button>
                </div>
            </div>
        `;
    }

    getCategoryProgress(category) {
        const completedSteps = category.steps.filter(step => step.completed).length;
        return Math.round((completedSteps / category.steps.length) * 100);
    }

    getOverallProgress() {
        const currentGuidelines = this.guidelines[this.currentLanguage] || this.guidelines.en;
        let totalSteps = 0;
        let completedSteps = 0;

        currentGuidelines.categories.forEach(category => {
            totalSteps += category.steps.length;
            completedSteps += category.steps.filter(step => step.completed).length;
        });

        return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        this.saveLanguagePreference();
        this.loadGuidelines();

        // Update language selector
        const selector = document.getElementById('language-select');
        if (selector) {
            selector.value = language;
        }

        // Add activity
        if (window.authManager) {
            window.authManager.addActivity('language_changed', `Language changed to ${language}`);
        }
    }

    toggleCategory(categoryId) {
        const content = document.getElementById(`category-${categoryId}`);
        const header = content.previousElementSibling;
        const icon = header.querySelector('.toggle-icon');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        }
    }

    toggleStepCompletion(categoryId, stepIndex) {
        const currentGuidelines = this.guidelines[this.currentLanguage] || this.guidelines.en;
        const category = currentGuidelines.categories.find(cat => cat.id === categoryId);
        
        if (category && category.steps[stepIndex]) {
            category.steps[stepIndex].completed = !category.steps[stepIndex].completed;
            
            // Save progress
            this.saveProgress();
            
            // Update progress display
            this.loadGuidelines();

            // Add activity
            if (window.authManager) {
                const action = category.steps[stepIndex].completed ? 'completed' : 'uncompleted';
                window.authManager.addActivity('biosecurity_step', 
                    `${action.charAt(0).toUpperCase() + action.slice(1)} biosecurity step: ${category.steps[stepIndex].title}`);
            }

            // Show notification
            if (window.notificationManager && category.steps[stepIndex].completed) {
                window.notificationManager.addNotification(
                    `Biosecurity step completed: ${category.steps[stepIndex].title}`,
                    'success'
                );
            }
        }
    }

    saveProgress() {
        localStorage.setItem('bioshield_biosecurity_progress', JSON.stringify(this.guidelines));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('bioshield_biosecurity_progress');
        if (savedProgress) {
            try {
                const savedGuidelines = JSON.parse(savedProgress);
                // Merge saved progress with current guidelines
                this.mergeProgress(savedGuidelines);
            } catch (error) {
                console.error('Error loading biosecurity progress:', error);
            }
        }
    }

    mergeProgress(savedGuidelines) {
        Object.keys(this.guidelines).forEach(language => {
            if (savedGuidelines[language]) {
                this.guidelines[language].categories.forEach(category => {
                    const savedCategory = savedGuidelines[language]?.categories?.find(cat => cat.id === category.id);
                    if (savedCategory) {
                        category.steps.forEach((step, index) => {
                            if (savedCategory.steps[index]) {
                                step.completed = savedCategory.steps[index].completed;
                            }
                        });
                    }
                });
            }
        });
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all biosecurity progress?')) {
            Object.keys(this.guidelines).forEach(language => {
                this.guidelines[language].categories.forEach(category => {
                    category.steps.forEach(step => {
                        step.completed = false;
                    });
                });
            });

            this.saveProgress();
            this.loadGuidelines();

            // Add activity
            if (window.authManager) {
                window.authManager.addActivity('biosecurity_reset', 'Biosecurity progress reset');
            }

            // Show notification
            if (window.notificationManager) {
                window.notificationManager.addNotification(
                    'Biosecurity progress has been reset',
                    'info'
                );
            }
        }
    }

    generateComplianceReport() {
        const currentGuidelines = this.guidelines[this.currentLanguage] || this.guidelines.en;
        let reportHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1>Biosecurity Compliance Report</h1>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Overall Compliance:</strong> ${this.getOverallProgress()}%</p>
                <hr>
        `;

        currentGuidelines.categories.forEach(category => {
            const progress = this.getCategoryProgress(category);
            const completedSteps = category.steps.filter(step => step.completed);
            const pendingSteps = category.steps.filter(step => !step.completed);

            reportHtml += `
                <div style="margin-bottom: 30px;">
                    <h2>${category.title} (${progress}% Complete)</h2>
                    <p>${category.description}</p>
                    
                    ${completedSteps.length > 0 ? `
                        <h4>✅ Completed Steps:</h4>
                        <ul>
                            ${completedSteps.map(step => `<li>${step.title}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${pendingSteps.length > 0 ? `
                        <h4>⏳ Pending Steps:</h4>
                        <ul>
                            ${pendingSteps.map(step => `
                                <li>${step.title} 
                                    <span style="color: ${step.priority === 'high' ? '#f44336' : '#ff9800'};">
                                        (${step.priority.toUpperCase()} PRIORITY)
                                    </span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        });

        reportHtml += '</div>';

        // Create and download report
        const blob = new Blob([reportHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `biosecurity_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show notification
        if (window.notificationManager) {
            window.notificationManager.addNotification(
                'Biosecurity compliance report generated successfully',
                'success'
            );
        }

        // Add activity
        if (window.authManager) {
            window.authManager.addActivity('report_generated', 'Generated biosecurity compliance report');
        }
    }
}

// Global functions
function changeLanguage(language) {
    window.biosecurityManager?.changeLanguage(language);
}

function toggleCategory(categoryId) {
    window.biosecurityManager?.toggleCategory(categoryId);
}

function toggleStepCompletion(categoryId, stepIndex) {
    window.biosecurityManager?.toggleStepCompletion(categoryId, stepIndex);
}

function generateComplianceReport() {
    window.biosecurityManager?.generateComplianceReport();
}

function resetProgress() {
    window.biosecurityManager?.resetProgress();
}

// Initialize biosecurity manager
document.addEventListener('DOMContentLoaded', () => {
    window.biosecurityManager = new BiosecurityManager();
    
    // Load saved progress
    window.biosecurityManager.loadProgress();
});