// Animal Management System
class AnimalManager {
    constructor() {
        this.animals = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.currentUser = window.authManager?.getCurrentUser();
        if (this.currentUser && this.currentUser.animals) {
            this.animals = this.currentUser.animals;
        }
    }

    // Load and display animals
    loadAnimals() {
        this.init();
        const container = document.getElementById('animals-grid');
        
        if (!container) return;

        if (this.animals.length === 0) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-paw"></i>
                    <h3>No Animals Yet</h3>
                    <p>Start by adding your first animal to track their health and vaccination records.</p>
                    <button class="btn btn-primary" onclick="showAddAnimalModal()">
                        <i class="fas fa-plus"></i> Add First Animal
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="animals-header">
                <div class="search-filter">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="animal-search" placeholder="Search animals..." onkeyup="filterAnimals()">
                    </div>
                    <select id="animal-filter" onchange="filterAnimals()">
                        <option value="all">All Animals</option>
                        <option value="pigs">Pigs</option>
                        <option value="poultry">Poultry</option>
                        <option value="healthy">Healthy</option>
                        <option value="sick">Sick</option>
                        <option value="quarantined">Quarantined</option>
                    </select>
                </div>
            </div>
            <div class="animals-list" id="animals-list">
                ${this.animals.map(animal => this.renderAnimalCard(animal)).join('')}
            </div>
        `;
    }

    renderAnimalCard(animal) {
        const statusClass = animal.healthStatus || 'healthy';
        const statusIcon = this.getStatusIcon(statusClass);
        const ageText = this.calculateAge(animal.birthDate);
        const nextVaccine = this.getNextVaccine(animal);

        return `
            <div class="animal-card" data-id="${animal.id}">
                <div class="animal-header">
                    <div class="animal-avatar">
                        <i class="fas fa-${animal.type === 'pig' ? 'pig-face' : 'dove'}"></i>
                    </div>
                    <div class="animal-info">
                        <h3>${animal.name}</h3>
                        <p class="animal-breed">${animal.breed}</p>
                        <span class="animal-id">ID: ${animal.tagId}</span>
                    </div>
                    <div class="animal-status">
                        <span class="status-badge ${statusClass}">
                            <i class="fas fa-${statusIcon}"></i>
                            ${statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}
                        </span>
                    </div>
                </div>
                
                <div class="animal-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Age: ${ageText}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-weight"></i>
                        <span>Weight: ${animal.weight || 'Not recorded'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-syringe"></i>
                        <span>Next Vaccine: ${nextVaccine}</span>
                    </div>
                </div>
                
                <div class="animal-actions">
                    <button class="btn btn-sm btn-outline" onclick="viewAnimalDetails('${animal.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editAnimal('${animal.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="addVaccineRecord('${animal.id}')">
                        <i class="fas fa-syringe"></i> Vaccine
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removeAnimal('${animal.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getStatusIcon(status) {
        const icons = {
            healthy: 'check-circle',
            sick: 'exclamation-circle',
            quarantined: 'shield-alt',
            pregnant: 'heart',
            treated: 'pills'
        };
        return icons[status] || 'question-circle';
    }

    calculateAge(birthDate) {
        if (!birthDate) return 'Unknown';
        
        const birth = new Date(birthDate);
        const now = new Date();
        const diffTime = Math.abs(now - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffYears >= 1) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
        } else if (diffMonths >= 1) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
        } else if (diffWeeks >= 1) {
            return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
    }

    getNextVaccine(animal) {
        if (!animal.vaccines || animal.vaccines.length === 0) {
            return 'Not scheduled';
        }

        const upcomingVaccines = animal.vaccines
            .filter(v => v.nextDueDate && !v.completed)
            .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

        if (upcomingVaccines.length === 0) {
            return 'Up to date';
        }

        const nextVaccine = upcomingVaccines[0];
        const dueDate = new Date(nextVaccine.nextDueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `${nextVaccine.name} (${Math.abs(diffDays)} days overdue)`;
        } else if (diffDays === 0) {
            return `${nextVaccine.name} (Due today)`;
        } else {
            return `${nextVaccine.name} (${diffDays} days)`;
        }
    }

    // Add new animal
    addAnimal(animalData) {
        const newAnimal = {
            id: Date.now().toString(),
            ...animalData,
            createdAt: new Date().toISOString(),
            vaccines: [],
            healthRecords: []
        };

        this.animals.push(newAnimal);
        this.saveAnimals();
        
        // Add activity
        if (window.authManager) {
            window.authManager.addActivity('animal_added', `Added new ${animalData.type}: ${animalData.name}`);
        }

        this.loadAnimals();
        
        // Update dashboard metrics
        if (window.dashboardManager) {
            window.dashboardManager.updateDashboardMetrics();
        }

        return newAnimal;
    }

    // Update animal
    updateAnimal(animalId, animalData) {
        const animalIndex = this.animals.findIndex(a => a.id === animalId);
        if (animalIndex === -1) return null;

        this.animals[animalIndex] = {
            ...this.animals[animalIndex],
            ...animalData,
            updatedAt: new Date().toISOString()
        };

        this.saveAnimals();
        this.loadAnimals();
        
        return this.animals[animalIndex];
    }

    // Remove animal
    removeAnimal(animalId) {
        const animal = this.animals.find(a => a.id === animalId);
        if (!animal) return false;

        if (confirm(`Are you sure you want to remove ${animal.name}? This action cannot be undone.`)) {
            this.animals = this.animals.filter(a => a.id !== animalId);
            this.saveAnimals();
            this.loadAnimals();
            
            // Add activity
            if (window.authManager) {
                window.authManager.addActivity('animal_removed', `Removed ${animal.type}: ${animal.name}`);
            }

            // Update dashboard metrics
            if (window.dashboardManager) {
                window.dashboardManager.updateDashboardMetrics();
            }

            return true;
        }
        return false;
    }

    // Get animal by ID
    getAnimal(animalId) {
        return this.animals.find(a => a.id === animalId);
    }

    // Save animals to user data
    saveAnimals() {
        if (this.currentUser && window.authManager) {
            this.currentUser.animals = this.animals;
            window.authManager.updateUser(this.currentUser);
        }
    }

    // Filter animals based on search and filter criteria
    filterAnimals() {
        const searchTerm = document.getElementById('animal-search')?.value.toLowerCase() || '';
        const filterType = document.getElementById('animal-filter')?.value || 'all';
        const animalCards = document.querySelectorAll('.animal-card');

        animalCards.forEach(card => {
            const animalId = card.dataset.id;
            const animal = this.animals.find(a => a.id === animalId);
            
            if (!animal) {
                card.style.display = 'none';
                return;
            }

            let matchesSearch = true;
            let matchesFilter = true;

            // Search filter
            if (searchTerm) {
                const searchableText = `${animal.name} ${animal.breed} ${animal.tagId}`.toLowerCase();
                matchesSearch = searchableText.includes(searchTerm);
            }

            // Type filter
            if (filterType !== 'all') {
                switch (filterType) {
                    case 'pigs':
                        matchesFilter = animal.type === 'pig';
                        break;
                    case 'poultry':
                        matchesFilter = animal.type === 'chicken' || animal.type === 'duck' || animal.type === 'turkey';
                        break;
                    case 'healthy':
                        matchesFilter = animal.healthStatus === 'healthy' || !animal.healthStatus;
                        break;
                    case 'sick':
                        matchesFilter = animal.healthStatus === 'sick';
                        break;
                    case 'quarantined':
                        matchesFilter = animal.healthStatus === 'quarantined';
                        break;
                }
            }

            card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
        });
    }
}

// Modal Management
function showAddAnimalModal() {
    const modal = createAnimalModal();
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function editAnimal(animalId) {
    const animal = window.animalManager?.getAnimal(animalId);
    if (!animal) return;
    
    const modal = createAnimalModal(animal);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function viewAnimalDetails(animalId) {
    const animal = window.animalManager?.getAnimal(animalId);
    if (!animal) return;
    
    const modal = createAnimalDetailModal(animal);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function removeAnimal(animalId) {
    window.animalManager?.removeAnimal(animalId);
}

function createAnimalModal(animal = null) {
    const isEdit = animal !== null;
    const modalId = `animal-modal-${Date.now()}`;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isEdit ? 'Edit Animal' : 'Add New Animal'}</h2>
                <button class="modal-close" onclick="closeModal('${modalId}')">&times;</button>
            </div>
            
            <form id="${modalId}-form" onsubmit="${isEdit ? `updateAnimalForm('${animal.id}', '${modalId}')` : `addAnimalForm('${modalId}')`}; return false;">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="animal-name">Animal Name *</label>
                        <input type="text" id="animal-name" name="name" value="${animal?.name || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="animal-tag">Tag/ID *</label>
                        <input type="text" id="animal-tag" name="tagId" value="${animal?.tagId || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="animal-type">Animal Type *</label>
                        <select id="animal-type" name="type" required onchange="updateBreedOptions(this.value)">
                            <option value="">Select Type</option>
                            <option value="pig" ${animal?.type === 'pig' ? 'selected' : ''}>Pig</option>
                            <option value="chicken" ${animal?.type === 'chicken' ? 'selected' : ''}>Chicken</option>
                            <option value="duck" ${animal?.type === 'duck' ? 'selected' : ''}>Duck</option>
                            <option value="turkey" ${animal?.type === 'turkey' ? 'selected' : ''}>Turkey</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="animal-breed">Breed</label>
                        <select id="animal-breed" name="breed">
                            <option value="">Select Breed</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="animal-gender">Gender</label>
                        <select id="animal-gender" name="gender">
                            <option value="">Select Gender</option>
                            <option value="male" ${animal?.gender === 'male' ? 'selected' : ''}>Male</option>
                            <option value="female" ${animal?.gender === 'female' ? 'selected' : ''}>Female</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="animal-birth-date">Birth Date</label>
                        <input type="date" id="animal-birth-date" name="birthDate" value="${animal?.birthDate || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="animal-weight">Weight (kg)</label>
                        <input type="number" id="animal-weight" name="weight" step="0.1" value="${animal?.weight || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label for="animal-status">Health Status</label>
                        <select id="animal-status" name="healthStatus">
                            <option value="healthy" ${animal?.healthStatus === 'healthy' ? 'selected' : ''}>Healthy</option>
                            <option value="sick" ${animal?.healthStatus === 'sick' ? 'selected' : ''}>Sick</option>
                            <option value="quarantined" ${animal?.healthStatus === 'quarantined' ? 'selected' : ''}>Quarantined</option>
                            <option value="pregnant" ${animal?.healthStatus === 'pregnant' ? 'selected' : ''}>Pregnant</option>
                            <option value="treated" ${animal?.healthStatus === 'treated' ? 'selected' : ''}>Under Treatment</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group full-width">
                    <label for="animal-notes">Notes</label>
                    <textarea id="animal-notes" name="notes" rows="3">${animal?.notes || ''}</textarea>
                </div>
                
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal('${modalId}')">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        ${isEdit ? 'Update Animal' : 'Add Animal'}
                    </button>
                </div>
            </form>
        </div>
    `;
    
    modal.id = modalId;
    
    // Setup breed options after modal is added
    setTimeout(() => {
        updateBreedOptions(animal?.type || '');
        if (animal?.breed) {
            document.getElementById('animal-breed').value = animal.breed;
        }
    }, 100);
    
    return modal;
}

function updateBreedOptions(animalType) {
    const breedSelect = document.getElementById('animal-breed');
    if (!breedSelect) return;

    const breeds = {
        pig: ['Yorkshire', 'Landrace', 'Duroc', 'Hampshire', 'Pietrain', 'Large White', 'Chester White'],
        chicken: ['Rhode Island Red', 'Leghorn', 'Plymouth Rock', 'Australorp', 'Sussex', 'Orpington', 'Marans'],
        duck: ['Pekin', 'Mallard', 'Khaki Campbell', 'Runner', 'Rouen', 'Muscovy', 'Welsh Harlequin'],
        turkey: ['Broad Breasted White', 'Bronze', 'Narragansett', 'Bourbon Red', 'Royal Palm', 'Black Spanish']
    };

    breedSelect.innerHTML = '<option value="">Select Breed</option>';
    
    if (breeds[animalType]) {
        breeds[animalType].forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            option.textContent = breed;
            breedSelect.appendChild(option);
        });
    }
}

function addAnimalForm(modalId) {
    const form = document.getElementById(`${modalId}-form`);
    const formData = new FormData(form);
    const animalData = Object.fromEntries(formData.entries());
    
    // Validation
    if (!animalData.name || !animalData.tagId || !animalData.type) {
        alert('Please fill in all required fields.');
        return;
    }

    // Check for duplicate tag ID
    const existingAnimal = window.animalManager.animals.find(a => a.tagId === animalData.tagId);
    if (existingAnimal) {
        alert('An animal with this Tag/ID already exists. Please use a different ID.');
        return;
    }

    window.animalManager.addAnimal(animalData);
    closeModal(modalId);
    
    // Show success notification
    if (window.notificationManager) {
        window.notificationManager.addNotification(`Added new animal: ${animalData.name}`, 'success');
    }
}

function updateAnimalForm(animalId, modalId) {
    const form = document.getElementById(`${modalId}-form`);
    const formData = new FormData(form);
    const animalData = Object.fromEntries(formData.entries());
    
    // Validation
    if (!animalData.name || !animalData.tagId || !animalData.type) {
        alert('Please fill in all required fields.');
        return;
    }

    // Check for duplicate tag ID (excluding current animal)
    const existingAnimal = window.animalManager.animals.find(a => a.tagId === animalData.tagId && a.id !== animalId);
    if (existingAnimal) {
        alert('An animal with this Tag/ID already exists. Please use a different ID.');
        return;
    }

    window.animalManager.updateAnimal(animalId, animalData);
    closeModal(modalId);
    
    // Show success notification
    if (window.notificationManager) {
        window.notificationManager.addNotification(`Updated animal: ${animalData.name}`, 'success');
    }
}

function createAnimalDetailModal(animal) {
    const modalId = `animal-detail-${animal.id}`;
    const age = window.animalManager.calculateAge(animal.birthDate);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = modalId;
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2><i class="fas fa-${animal.type === 'pig' ? 'pig-face' : 'dove'}"></i> ${animal.name}</h2>
                <button class="modal-close" onclick="closeModal('${modalId}')">&times;</button>
            </div>
            
            <div class="animal-detail-content">
                <div class="animal-basic-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Tag/ID:</label>
                            <span>${animal.tagId}</span>
                        </div>
                        <div class="info-item">
                            <label>Type:</label>
                            <span>${animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}</span>
                        </div>
                        <div class="info-item">
                            <label>Breed:</label>
                            <span>${animal.breed || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <label>Gender:</label>
                            <span>${animal.gender || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <label>Age:</label>
                            <span>${age}</span>
                        </div>
                        <div class="info-item">
                            <label>Weight:</label>
                            <span>${animal.weight ? animal.weight + ' kg' : 'Not recorded'}</span>
                        </div>
                        <div class="info-item">
                            <label>Health Status:</label>
                            <span class="status-badge ${animal.healthStatus || 'healthy'}">${(animal.healthStatus || 'healthy').charAt(0).toUpperCase() + (animal.healthStatus || 'healthy').slice(1)}</span>
                        </div>
                        <div class="info-item">
                            <label>Added:</label>
                            <span>${new Date(animal.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                ${animal.notes ? `
                    <div class="animal-notes">
                        <h4>Notes:</h4>
                        <p>${animal.notes}</p>
                    </div>
                ` : ''}
                
                <div class="animal-vaccines">
                    <h4>Vaccination History</h4>
                    <div class="vaccine-history">
                        ${animal.vaccines && animal.vaccines.length > 0 ? 
                            animal.vaccines.map(vaccine => `
                                <div class="vaccine-record">
                                    <div class="vaccine-info">
                                        <strong>${vaccine.name}</strong>
                                        <span class="vaccine-date">${new Date(vaccine.dateGiven || vaccine.nextDueDate).toLocaleDateString()}</span>
                                    </div>
                                    <span class="vaccine-status ${vaccine.completed ? 'completed' : 'pending'}">
                                        ${vaccine.completed ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            `).join('') : 
                            '<p>No vaccination records yet.</p>'
                        }
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeModal('${modalId}')">Close</button>
                <button class="btn btn-primary" onclick="editAnimal('${animal.id}'); closeModal('${modalId}');">
                    <i class="fas fa-edit"></i> Edit Animal
                </button>
                <button class="btn btn-secondary" onclick="addVaccineRecord('${animal.id}'); closeModal('${modalId}');">
                    <i class="fas fa-syringe"></i> Add Vaccine
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

function filterAnimals() {
    window.animalManager?.filterAnimals();
}

function addVaccineRecord(animalId) {
    // This will be handled by the vaccine manager
    if (window.vaccineManager) {
        window.vaccineManager.showAddVaccineModal(animalId);
    }
}

// Initialize animal manager
document.addEventListener('DOMContentLoaded', () => {
    window.animalManager = new AnimalManager();

    // Poultry data array
    const poultryData = [
        { id: 101, type: "Chicken", bodyTemp: "39.2°C", lastVaccine: "2025-08-01", nextVaccine: "2025-09-15", healthStatus: "Healthy", disease: "-" },
        { id: 102, type: "Chicken", bodyTemp: "39.5°C", lastVaccine: "2025-08-10", nextVaccine: "2025-09-25", healthStatus: "Healthy", disease: "-" },
        { id: 103, type: "Chicken", bodyTemp: "40.1°C", lastVaccine: "2025-07-20", nextVaccine: "2025-09-05", healthStatus: "Unhealthy", disease: "Avian Influenza" },
        { id: 104, type: "Chicken", bodyTemp: "38.9°C", lastVaccine: "2025-08-05", nextVaccine: "2025-09-18", healthStatus: "Healthy", disease: "-" },
        { id: 105, type: "Chicken", bodyTemp: "39.4°C", lastVaccine: "2025-08-15", nextVaccine: "2025-09-28", healthStatus: "Healthy", disease: "-" },

        { id: 201, type: "Pig", bodyTemp: "38.8°C", lastVaccine: "2025-08-05", nextVaccine: "2025-09-20", healthStatus: "Healthy", disease: "-" },
        { id: 202, type: "Pig", bodyTemp: "39.0°C", lastVaccine: "2025-07-25", nextVaccine: "2025-09-10", healthStatus: "Healthy", disease: "-" },
        { id: 203, type: "Pig", bodyTemp: "39.8°C", lastVaccine: "2025-08-12", nextVaccine: "2025-09-30", healthStatus: "Unhealthy", disease: "Swine Fever" },
        { id: 204, type: "Pig", bodyTemp: "38.5°C", lastVaccine: "2025-08-02", nextVaccine: "2025-09-22", healthStatus: "Healthy", disease: "-" },
        { id: 205, type: "Pig", bodyTemp: "39.2°C", lastVaccine: "2025-08-18", nextVaccine: "2025-10-05", healthStatus: "Healthy", disease: "-" },

        { id: 301, type: "Duck", bodyTemp: "40.0°C", lastVaccine: "2025-08-15", nextVaccine: "2025-09-28", healthStatus: "Healthy", disease: "-" },
        { id: 302, type: "Duck", bodyTemp: "39.3°C", lastVaccine: "2025-07-30", nextVaccine: "2025-09-12", healthStatus: "Healthy", disease: "-" },
        { id: 303, type: "Duck", bodyTemp: "40.5°C", lastVaccine: "2025-08-10", nextVaccine: "2025-09-25", healthStatus: "Unhealthy", disease: "Duck Viral Enteritis" },
        { id: 304, type: "Duck", bodyTemp: "39.6°C", lastVaccine: "2025-08-18", nextVaccine: "2025-10-01", healthStatus: "Healthy", disease: "-" },
        { id: 305, type: "Duck", bodyTemp: "39.8°C", lastVaccine: "2025-08-22", nextVaccine: "2025-10-05", healthStatus: "Healthy", disease: "-" },

        { id: 401, type: "Turkey", bodyTemp: "39.5°C", lastVaccine: "2025-08-12", nextVaccine: "2025-09-29", healthStatus: "Healthy", disease: "-" },
        { id: 402, type: "Turkey", bodyTemp: "39.9°C", lastVaccine: "2025-07-30", nextVaccine: "2025-09-14", healthStatus: "Unhealthy", disease: "Turkey Rhinotracheitis" },
        { id: 403, type: "Turkey", bodyTemp: "39.1°C", lastVaccine: "2025-08-08", nextVaccine: "2025-09-26", healthStatus: "Healthy", disease: "-" },
        { id: 404, type: "Turkey", bodyTemp: "38.7°C", lastVaccine: "2025-08-18", nextVaccine: "2025-10-02", healthStatus: "Healthy", disease: "-" },
        { id: 405, type: "Turkey", bodyTemp: "39.4°C", lastVaccine: "2025-08-25", nextVaccine: "2025-10-10", healthStatus: "Unhealthy", disease: "Fowl Cholera" }
    ];

    // Function to render poultry data table
    function renderPoultryTable() {
        const container = document.getElementById('poultry-table-container');
        if (!container) return;

        let tableHTML = `
            <table class="poultry-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Body Temp</th>
                        <th>Last Vaccine</th>
                        <th>Next Vaccine</th>
                        <th>Health Status</th>
                        <th>Disease Name</th>
                    </tr>
                </thead>
                <tbody>
        `;

        poultryData.forEach(item => {
            const healthClass = item.healthStatus.toLowerCase() + '-status';
            const diseaseDisplay = item.healthStatus === 'Healthy' ? '-' : item.disease;
            const diseaseClass = item.healthStatus === 'Unhealthy' ? 'disease-name' : '';

            tableHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.type}</td>
                    <td>${item.bodyTemp}</td>
                    <td>${item.lastVaccine}</td>
                    <td>${item.nextVaccine}</td>
                    <td class="${healthClass}">${item.healthStatus}</td>
                    <td class="${diseaseClass}">${diseaseDisplay}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    // Render poultry table on page load
    renderPoultryTable();

    // Make renderPoultryTable globally accessible
    window.renderPoultryTable = renderPoultryTable;
});
