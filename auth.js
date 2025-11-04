// Authentication System
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('bioshield_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('bioshield_current_user')) || null;
        this.currentStep = 1;
        this.selectedUserType = 'farmer';
        this.selectedLoginMethod = 'email';
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.currentUser) {
            this.showDashboard();
        } else {
            this.showAuth();
        }
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading').classList.add('hide');
        }, 1500);
    }

    // Show/Hide Sections
    showAuth() {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
        
        // Clear any existing toast notifications
        this.clearToastNotifications();
    }

    showDashboard() {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
        
        // Update user name in dashboard
        if (this.currentUser) {
            document.getElementById('user-name').textContent = this.currentUser.name;
        }
        
        // Initialize dashboard data
        window.dashboardManager?.init();
    }

    // Toggle between login and register forms
    showLogin() {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        this.clearMessages();
    }

    showRegister() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        this.clearMessages();
    }

    // Form Validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    validatePhoneNumber(phone) {
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        return phoneRegex.test(phone);
    }

    // Show form errors
    showFieldError(fieldId, message) {
        const formGroup = document.getElementById(fieldId).closest('.form-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(fieldId) {
        const formGroup = document.getElementById(fieldId).closest('.form-group');
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showGlobalMessage(message, type = 'error') {
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message-global show`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        const activeForm = document.querySelector('.auth-form:not([style*="none"])');
        activeForm.insertBefore(messageDiv, activeForm.querySelector('form'));
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    clearMessages() {
        document.querySelectorAll('.error-message-global, .success-message').forEach(el => el.remove());
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
            const errorEl = group.querySelector('.error-message');
            if (errorEl) errorEl.remove();
        });
    }
    
    // Clear toast notifications
    clearToastNotifications() {
        const toastContainer = document.getElementById('toast-container');
        if (toastContainer) {
            toastContainer.innerHTML = '';
            toastContainer.remove();
        }
        // Also remove any individual toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
    }

    // Login Handler
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const loginBtn = document.querySelector('#login-form .auth-btn');
        
        // Clear previous errors
        this.clearMessages();
        
        // Validation
        let hasErrors = false;
        
        if (!email) {
            this.showFieldError('login-email', 'Email is required');
            hasErrors = true;
        } else if (!this.validateEmail(email)) {
            this.showFieldError('login-email', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!password) {
            this.showFieldError('login-password', 'Password is required');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check credentials
            const user = this.users.find(u => u.email === email && u.password === password);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('bioshield_current_user', JSON.stringify(user));
                
                // Add login activity
                this.addActivity('login', `User ${user.name} logged in successfully`);
                
                this.showDashboard();
                // Delay notification until dashboard is fully loaded
                setTimeout(() => {
                    this.showNotification('Welcome back to BIOSHIELD!', 'success');
                }, 500);
            } else {
                this.showGlobalMessage('Invalid email or password. Please try again.', 'error');
            }
        } catch (error) {
            this.showGlobalMessage('Login failed. Please try again.', 'error');
        } finally {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }

    // Registration Handler
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('register-name').value.trim(),
            email: document.getElementById('register-email').value.trim(),
            phone: document.getElementById('register-phone').value.trim(),
            farmName: document.getElementById('register-farm').value.trim(),
            farmLocation: document.getElementById('register-location').value.trim(),
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };
        
        const registerBtn = document.querySelector('#register-form .auth-btn');
        
        // Clear previous errors
        this.clearMessages();
        
        // Validation
        let hasErrors = false;
        
        if (!formData.name) {
            this.showFieldError('register-name', 'Full name is required');
            hasErrors = true;
        }
        
        if (!formData.email) {
            this.showFieldError('register-email', 'Email is required');
            hasErrors = true;
        } else if (!this.validateEmail(formData.email)) {
            this.showFieldError('register-email', 'Please enter a valid email address');
            hasErrors = true;
        } else if (this.users.find(u => u.email === formData.email)) {
            this.showFieldError('register-email', 'Email already exists');
            hasErrors = true;
        }
        
        if (!formData.phone) {
            this.showFieldError('register-phone', 'Phone number is required');
            hasErrors = true;
        } else if (!this.validatePhoneNumber(formData.phone)) {
            this.showFieldError('register-phone', 'Please enter a valid phone number');
            hasErrors = true;
        }
        
        if (!formData.farmName) {
            this.showFieldError('register-farm', 'Farm name is required');
            hasErrors = true;
        }
        
        if (!formData.farmLocation) {
            this.showFieldError('register-location', 'Farm location is required');
            hasErrors = true;
        }
        
        if (!formData.password) {
            this.showFieldError('register-password', 'Password is required');
            hasErrors = true;
        } else if (!this.validatePassword(formData.password)) {
            this.showFieldError('register-password', 'Password must be at least 6 characters');
            hasErrors = true;
        }
        
        if (!formData.confirmPassword) {
            this.showFieldError('confirm-password', 'Please confirm your password');
            hasErrors = true;
        } else if (formData.password !== formData.confirmPassword) {
            this.showFieldError('confirm-password', 'Passwords do not match');
            hasErrors = true;
        }
        
        if (hasErrors) return;
        
        // Show loading state
        registerBtn.classList.add('loading');
        registerBtn.disabled = true;
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                farmName: formData.farmName,
                farmLocation: formData.farmLocation,
                password: formData.password,
                registrationDate: new Date().toISOString(),
                animals: [],
                vaccines: [],
                alerts: []
            };
            
            this.users.push(newUser);
            localStorage.setItem('bioshield_users', JSON.stringify(this.users));
            
            // Auto-login after registration
            this.currentUser = newUser;
            localStorage.setItem('bioshield_current_user', JSON.stringify(newUser));
            
            // Add registration activity
            this.addActivity('registration', `Welcome to BIOSHIELD! Account created for ${newUser.farmName}`);
            
            this.showGlobalMessage('Registration successful! Welcome to BIOSHIELD!', 'success');
            
            setTimeout(() => {
                this.showDashboard();
                // Delay notification until dashboard is fully loaded
                setTimeout(() => {
                    this.showNotification('Account created successfully! Welcome to BIOSHIELD!', 'success');
                }, 500);
            }, 2000);
            
        } catch (error) {
            this.showGlobalMessage('Registration failed. Please try again.', 'error');
        } finally {
            registerBtn.classList.remove('loading');
            registerBtn.disabled = false;
        }
    }

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.addActivity('logout', `User ${this.currentUser.name} logged out`);
            this.currentUser = null;
            localStorage.removeItem('bioshield_current_user');
            this.showAuth();
            
            // Clear forms
            document.querySelectorAll('form').forEach(form => form.reset());
            this.clearMessages();
        }
    }

    // Utility functions
    addActivity(type, description) {
        const activities = JSON.parse(localStorage.getItem('bioshield_activities')) || [];
        activities.unshift({
            id: Date.now().toString(),
            type: type,
            description: description,
            timestamp: new Date().toISOString(),
            userId: this.currentUser?.id
        });
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(50);
        }
        
        localStorage.setItem('bioshield_activities', JSON.stringify(activities));
    }

    showNotification(message, type = 'info') {
        if (window.notificationManager) {
            window.notificationManager.addNotification(message, type);
        }
    }

    // Get current user data
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user data
    updateUser(userData) {
        if (this.currentUser) {
            Object.assign(this.currentUser, userData);
            localStorage.setItem('bioshield_current_user', JSON.stringify(this.currentUser));
            
            // Update in users array
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                this.users[userIndex] = this.currentUser;
                localStorage.setItem('bioshield_users', JSON.stringify(this.users));
            }
        }
    }
}

// Password toggle functionality
function togglePassword(fieldId, toggleIcon) {
    const passwordField = document.getElementById(fieldId);
    const isPassword = passwordField.type === 'password';
    
    passwordField.type = isPassword ? 'text' : 'password';
    toggleIcon.classList.toggle('fa-eye-slash', !isPassword);
    toggleIcon.classList.toggle('fa-eye', isPassword);
}

// Global functions for HTML onclick handlers
function showLogin() {
    window.authManager.showLogin();
}

function showRegister() {
    window.authManager.showRegister();
}

function handleLogin(event) {
    window.authManager.handleLogin(event);
}

function handleRegister(event) {
    window.authManager.handleRegister(event);
}

function logout() {
    window.authManager.logout();
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Enhanced Authentication Functions

// User Type Selection
function selectUserType(type) {
    window.authManager.selectedUserType = type;
    document.querySelectorAll('.user-type-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
}

// Login Method Switching
function switchLoginMethod(method) {
    window.authManager.selectedLoginMethod = method;
    
    // Update tab appearance
    document.querySelectorAll('.method-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('active');
    
    // Show/hide appropriate input fields
    document.getElementById('email-login').style.display = method === 'email' ? 'block' : 'none';
    document.getElementById('phone-login').style.display = method === 'phone' ? 'block' : 'none';
}

// Multi-step Registration Navigation
function nextStep() {
    const authManager = window.authManager;
    const currentStep = authManager.currentStep;
    
    if (validateCurrentStep(currentStep)) {
        if (currentStep < 3) {
            authManager.currentStep++;
            showRegistrationStep(authManager.currentStep);
        }
    }
}

function previousStep() {
    const authManager = window.authManager;
    if (authManager.currentStep > 1) {
        authManager.currentStep--;
        showRegistrationStep(authManager.currentStep);
    }
}

function showRegistrationStep(step) {
    // Hide all steps
    document.querySelectorAll('.registration-step').forEach(stepEl => {
        stepEl.style.display = 'none';
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step-${step}`);
    currentStepEl.style.display = 'block';
    currentStepEl.classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepIndicator, index) => {
        stepIndicator.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepIndicator.classList.add('completed');
        } else if (index + 1 === step) {
            stepIndicator.classList.add('active');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const submitBtn = document.querySelector('.register-submit');
    
    prevBtn.style.display = step > 1 ? 'block' : 'none';
    nextBtn.style.display = step < 3 ? 'block' : 'none';
    submitBtn.style.display = step === 3 ? 'block' : 'none';
}

function validateCurrentStep(step) {
    const authManager = window.authManager;
    let isValid = true;
    
    authManager.clearMessages();
    
    switch (step) {
        case 1: // Personal Information
            const firstName = document.getElementById('register-firstname').value.trim();
            const lastName = document.getElementById('register-lastname').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const phone = document.getElementById('register-phone').value.trim();
            
            if (!firstName) {
                authManager.showFieldError('register-firstname', 'First name is required');
                isValid = false;
            }
            
            if (!lastName) {
                authManager.showFieldError('register-lastname', 'Last name is required');
                isValid = false;
            }
            
            if (!email) {
                authManager.showFieldError('register-email', 'Email is required');
                isValid = false;
            } else if (!authManager.validateEmail(email)) {
                authManager.showFieldError('register-email', 'Please enter a valid email address');
                isValid = false;
            } else if (authManager.users.find(u => u.email === email)) {
                authManager.showFieldError('register-email', 'Email already exists');
                isValid = false;
            }
            
            if (!phone) {
                authManager.showFieldError('register-phone', 'Phone number is required');
                isValid = false;
            } else if (!authManager.validatePhoneNumber(phone)) {
                authManager.showFieldError('register-phone', 'Please enter a valid phone number');
                isValid = false;
            }
            break;
            
        case 2: // Farm Details
            const farmName = document.getElementById('register-farm').value.trim();
            const farmLocation = document.getElementById('register-location').value.trim();
            
            if (!farmName) {
                authManager.showFieldError('register-farm', 'Farm name is required');
                isValid = false;
            }
            
            if (!farmLocation) {
                authManager.showFieldError('register-location', 'Farm location is required');
                isValid = false;
            }
            break;
            
        case 3: // Security
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const acceptTerms = document.getElementById('accept-terms').checked;
            
            if (!password) {
                authManager.showFieldError('register-password', 'Password is required');
                isValid = false;
            } else if (!authManager.validatePassword(password)) {
                authManager.showFieldError('register-password', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            if (!confirmPassword) {
                authManager.showFieldError('confirm-password', 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                authManager.showFieldError('confirm-password', 'Passwords do not match');
                isValid = false;
            }
            
            if (!acceptTerms) {
                authManager.showGlobalMessage('Please accept the Terms of Service and Privacy Policy', 'error');
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

// Password Strength Checker
function checkPasswordStrength(password) {
    const strengthEl = document.getElementById('password-strength');
    if (!strengthEl) return;
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthEl.classList.remove('weak', 'medium', 'strong');
    
    if (password.length === 0) {
        strengthEl.classList.remove('show');
        return;
    }
    
    strengthEl.classList.add('show');
    
    if (strength <= 2) {
        strengthEl.classList.add('weak');
        feedback = 'Weak - Add uppercase, numbers, and symbols';
    } else if (strength <= 3) {
        strengthEl.classList.add('medium');
        feedback = 'Medium - Add more complexity';
    } else {
        strengthEl.classList.add('strong');
        feedback = 'Strong password!';
    }
    
    strengthEl.textContent = feedback;
}

// Enhanced Login Handler
function handleEnhancedLogin(event) {
    event.preventDefault();
    
    const authManager = window.authManager;
    const loginMethod = authManager.selectedLoginMethod;
    const userType = authManager.selectedUserType;
    
    let identifier, password;
    
    if (loginMethod === 'email') {
        identifier = document.getElementById('login-email').value.trim();
        password = document.getElementById('login-password').value;
        
        if (!identifier) {
            authManager.showFieldError('login-email', 'Email is required');
            return;
        }
        if (!authManager.validateEmail(identifier)) {
            authManager.showFieldError('login-email', 'Please enter a valid email address');
            return;
        }
    } else {
        identifier = document.getElementById('login-phone').value.trim();
        password = document.getElementById('login-password').value;
        
        if (!identifier) {
            authManager.showFieldError('login-phone', 'Phone number is required');
            return;
        }
        if (!authManager.validatePhoneNumber(identifier)) {
            authManager.showFieldError('login-phone', 'Please enter a valid phone number');
            return;
        }
    }
    
    if (!password) {
        authManager.showFieldError('login-password', 'Password is required');
        return;
    }
    
    // Find user by identifier
    const user = authManager.users.find(u => {
        if (loginMethod === 'email') {
            return u.email === identifier && u.password === password;
        } else {
            return u.phone === identifier && u.password === password;
        }
    });
    
    if (user) {
        authManager.currentUser = user;
        localStorage.setItem('bioshield_current_user', JSON.stringify(user));
        authManager.showDashboard();
        // Delay notification until dashboard is fully loaded
        setTimeout(() => {
            authManager.showNotification(`Welcome back, ${user.name}!`, 'success');
        }, 500);
    } else {
        authManager.showGlobalMessage('Invalid credentials. Please try again.', 'error');
    }
}

// Enhanced Registration Handler
function handleEnhancedRegister(event) {
    event.preventDefault();
    
    if (!validateCurrentStep(3)) {
        return;
    }
    
    const authManager = window.authManager;
    
    const formData = {
        firstName: document.getElementById('register-firstname').value.trim(),
        lastName: document.getElementById('register-lastname').value.trim(),
        email: document.getElementById('register-email').value.trim(),
        phone: document.getElementById('register-phone').value.trim(),
        dob: document.getElementById('register-dob').value,
        farmName: document.getElementById('register-farm').value.trim(),
        farmLocation: document.getElementById('register-location').value.trim(),
        farmSize: document.getElementById('register-farm-size').value,
        farmType: document.getElementById('register-farm-type').value,
        license: document.getElementById('register-license').value.trim(),
        password: document.getElementById('register-password').value,
        newsletter: document.getElementById('newsletter-opt').checked
    };
    
    const registerBtn = document.querySelector('.register-submit');
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;
    
    setTimeout(() => {
        try {
            const newUser = {
                id: Date.now().toString(),
                name: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob,
                farmName: formData.farmName,
                farmLocation: formData.farmLocation,
                farmSize: formData.farmSize,
                farmType: formData.farmType,
                license: formData.license,
                password: formData.password,
                newsletter: formData.newsletter,
                registrationDate: new Date().toISOString(),
                userType: authManager.selectedUserType,
                animals: [],
                vaccines: [],
                alerts: []
            };
            
            authManager.users.push(newUser);
            localStorage.setItem('bioshield_users', JSON.stringify(authManager.users));
            
            authManager.currentUser = newUser;
            localStorage.setItem('bioshield_current_user', JSON.stringify(newUser));
            
            authManager.showGlobalMessage('Registration successful! Welcome to BIOSHIELD!', 'success');
            
            setTimeout(() => {
                authManager.showDashboard();
                // Delay notification until dashboard is fully loaded
                setTimeout(() => {
                    authManager.showNotification('Account created successfully!', 'success');
                }, 500);
            }, 2000);
            
        } catch (error) {
            authManager.showGlobalMessage('Registration failed. Please try again.', 'error');
        } finally {
            registerBtn.classList.remove('loading');
            registerBtn.disabled = false;
        }
    }, 1500);
}

// Show Terms/Privacy (placeholder functions)
function showTerms() {
    alert('Terms of Service\n\nBy using BIOSHIELD, you agree to our terms of service...');
}

function showPrivacy() {
    alert('Privacy Policy\n\nWe respect your privacy and protect your personal information...');
}

function showForgotPassword() {
    alert('Forgot Password\n\nPlease contact support at support@bioshield.com for password recovery.');
}

// Clear form errors on input
document.addEventListener('input', (event) => {
    if (event.target.matches('input[type="email"], input[type="password"], input[type="text"], input[type="tel"]')) {
        if (window.authManager) {
            window.authManager.clearFieldError(event.target.id);
        }
        
        // Check password strength for registration password
        if (event.target.id === 'register-password') {
            checkPasswordStrength(event.target.value);
        }
    }
});
