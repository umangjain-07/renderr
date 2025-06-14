// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const signInBtn = document.querySelector('.sign-in-btn');
const rememberCheckbox = document.getElementById('remember');
const signUpLink = document.getElementById('signUpLink');

document.getElementById('signUpLink').addEventListener('click', () => {
  if (window.flutter_inappwebview) {
    // Call Flutter handler if available
    window.flutter_inappwebview.callHandler('navigateToClientRegistration');
  }
});
// Form validation patterns
const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^.{8,}$/ // At least 8 characters
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadRememberedCredentials();
    addInputAnimations();
});

// Event Listeners
function initializeEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmission);
    
    // Password toggle
    passwordToggle.addEventListener('click', togglePasswordVisibility);
    
    // Input validation
    emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
    passwordInput.addEventListener('blur', () => validateField(passwordInput, 'password'));
    
    // Real-time validation
    emailInput.addEventListener('input', () => clearErrors(emailInput));
    passwordInput.addEventListener('input', () => clearErrors(passwordInput));
    
    // Social login
    document.querySelector('.google-btn').addEventListener('click', handleGoogleLogin);
    
    // Sign up link
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Sign up functionality will be implemented soon!', 'info');
    });
    
    // Forgot password
    document.querySelector('.forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        handleForgotPassword();
    });
}


// Form validation
function validateForm() {
    let isValid = true;
    
    // Validate email
    if (!validateField(emailInput, 'email')) {
        isValid = false;
    }
    
    // Validate password
    if (!validateField(passwordInput, 'password')) {
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(input, type) {
    const value = input.value.trim();
    const inputGroup = input.closest('.input-group');
    
    // Remove existing error
    clearErrors(input);
    
    if (!value) {
        showFieldError(input, `${type.charAt(0).toUpperCase() + type.slice(1)} is required`);
        return false;
    }
    
    if (!validationPatterns[type].test(value)) {
        let errorMessage = '';
        if (type === 'email') {
            errorMessage = 'Please enter a valid email address';
        } else if (type === 'password') {
            errorMessage = 'Password must be at least 8 characters long';
        }
        showFieldError(input, errorMessage);
        return false;
    }
    
    // Show success state
    inputGroup.classList.add('success');
    return true;
}

// Show field error
function showFieldError(input, message) {
    const inputGroup = input.closest('.input-group');
    inputGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = inputGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    inputGroup.appendChild(errorElement);
    
    // Add error styles to input
    input.style.borderColor = '#e74c3c';
    input.style.background = '#fdf2f2';
}

// Clear field errors
function clearErrors(input) {
    const inputGroup = input.closest('.input-group');
    inputGroup.classList.remove('error', 'success');
    
    const errorMessage = inputGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Reset input styles
    input.style.borderColor = '';
    input.style.background = '';
}

// Password visibility toggle
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Update toggle icon
    passwordToggle.textContent = type === 'password' ? '👁' : '🙈';
}

// Loading state management
function setLoadingState(isLoading) {
    if (isLoading) {
        signInBtn.classList.add('loading');
        signInBtn.textContent = '';
        signInBtn.disabled = true;
    } else {
        signInBtn.classList.remove('loading');
        signInBtn.textContent = 'Sign in';
        signInBtn.disabled = false;
    }
}

// Add null checks at the beginning
if (!loginForm || !emailInput || !passwordInput || !passwordToggle || !signInBtn) {
    console.error('Required form elements not found');
    if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('showError', 'Form elements missing');
    }
}

// Fix the simulateLogin function to return a proper response
async function simulateLogin(email, password) {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Return a successful login response
        return { 
            success: true, 
            message: 'Login successful' 
        };
    } catch (error) {
        console.error('Login simulation error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

// Update handleFormSubmission to prevent duplicate submissions
let isSubmitting = false;

async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    isSubmitting = true;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!validateForm()) {
        isSubmitting = false;
        return;
    }
    
    setLoadingState(true);
    
    try {
        const loginResult = await simulateLogin(email, password);
        
        if (loginResult.success) {
            if (rememberCheckbox.checked) saveCredentials(email);
            
            showNotification('Login successful! Redirecting...', 'success');
            
            // Add slight delay before navigation
            setTimeout(() => {
                if (window.flutter_inappwebview) {
                    window.flutter_inappwebview.callHandler('navigateToClients');
                }
            }, 1500);
        } else {
            showNotification(loginResult.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Unexpected error occurred', 'error');
    } finally {
        isSubmitting = false;
        setLoadingState(false);
    }
}

// Add safe event listener helper
function safeAddEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.error(`Element not found for ${event} event`);
    }
}

// Update initializeEventListeners to use safeAddEventListener
function initializeEventListeners() {
    safeAddEventListener(loginForm, 'submit', handleFormSubmission);
    safeAddEventListener(passwordToggle, 'click', togglePasswordVisibility);
    safeAddEventListener(emailInput, 'blur', () => validateField(emailInput, 'email'));
    safeAddEventListener(passwordInput, 'blur', () => validateField(passwordInput, 'password'));
    safeAddEventListener(emailInput, 'input', () => clearErrors(emailInput));
    safeAddEventListener(passwordInput, 'input', () => clearErrors(passwordInput));
    
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }
    
    safeAddEventListener(signUpLink, 'click', (e) => {
        e.preventDefault();
        showNotification('Sign up functionality will be implemented soon!', 'info');
    });
    
    const forgotPassword = document.querySelector('.forgot-password');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            handleForgotPassword();
        });
    }
}// Google login handler
function handleGoogleLogin() {
    showNotification('Google Sign-In integration coming soon!', 'info');
    
    // Simulate Google login process
    setTimeout(() => {
        showNotification('Google authentication would redirect here', 'info');
    }, 1000);
}

// Forgot password handler
function handleForgotPassword() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address first', 'warning');
        emailInput.focus();
        return;
    }
    
    if (!validationPatterns.email.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }
    
    showNotification(`Password reset link sent to ${email}`, 'success');
}

// Remember credentials functionality
function saveCredentials(email) {
    const credentials = {
        email: email,
        timestamp: Date.now()
    };
    
    window.rememberedCredentials = credentials;
}

function loadRememberedCredentials() {
    // In a real app, check secure storage
    if (window.rememberedCredentials) {
        const { email, timestamp } = window.rememberedCredentials;
        const daysPassed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
        
        if (daysPassed < 30) {
            emailInput.value = email;
            rememberCheckbox.checked = true;
        } else {
            clearSavedCredentials();
        }
    }
}

function clearSavedCredentials() {
    window.rememberedCredentials = null;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styles for notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '0.9rem',
        maxWidth: '300px',
        zIndex: '1000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    });
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Input animations and enhancements
function addInputAnimations() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
        // Focus animations
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            if (!this.value) {
                this.parentNode.classList.remove('filled');
            } else {
                this.parentNode.classList.add('filled');
            }
        });
        
        // Initial state check
        if (input.value) {
            input.parentNode.classList.add('filled');
        }
    });
}

// Enhanced form interactions
document.addEventListener('keydown', function(e) {
    // Allow Enter to submit form when focused on inputs
    if (e.key === 'Enter' && (e.target.matches('input[type="email"]') || e.target.matches('input[type="password"]'))) {
        loginForm.dispatchEvent(new Event('submit'));
    }
    
    // ESC to clear focused input
    if (e.key === 'Escape' && e.target.matches('input')) {
        e.target.blur();
    }
});

// Add floating animation to illustration elements
function animateFloatingElements() {
    const elements = document.querySelectorAll('.element');
    
    elements.forEach((element, index) => {
        const delay = index * 2000; // Stagger animations
        const duration = 4000 + (index * 1000); // Vary duration
        
        setInterval(() => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = `float ${duration}ms ease-in-out`;
        }, duration + delay);
    });
}

// Initialize floating animations
setTimeout(animateFloatingElements, 1000);

// Add ripple effect to buttons
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.sign-in-btn, .google-btn').forEach(addRippleEffect);

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .input-group.focused input {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
        background: white !important;
    }
    
    .input-group.success input {
        border-color: #27ae60 !important;
        background: #f8fff8 !important;
    }
    
    .notification {
        cursor: pointer;
    }
    
    .notification:hover {
        opacity: 0.9;
    }
`;

document.head.appendChild(rippleStyle);

// Demo mode helper - shows demo credentials

// Performance optimization - lazy load heavy animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
});

// Observe illustration for lazy animation
const illustration = document.querySelector('.illustration');
if (illustration) {
    observer.observe(illustration);
}

// Add smooth scrolling for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        simulateLogin,
        showNotification
    };
}