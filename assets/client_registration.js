const form = document.getElementById('registrationForm');
const registerBtn = document.getElementById('registerBtn');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordStrength = document.getElementById('passwordStrength');
const backLink = document.getElementById('backLink');
const loginLink = document.getElementById('loginLink');

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
        case 0:
        case 1:
            feedback = 'Very weak password';
            passwordStrength.className = 'password-strength weak';
            break;
        case 2:
            feedback = 'Weak password';
            passwordStrength.className = 'password-strength weak';
            break;
        case 3:
            feedback = 'Medium password';
            passwordStrength.className = 'password-strength medium';
            break;
        case 4:
            feedback = 'Strong password';
            passwordStrength.className = 'password-strength strong';
            break;
        case 5:
            feedback = 'Very strong password';
            passwordStrength.className = 'password-strength strong';
            break;
    }

    return { strength, feedback };
}

// Real-time password strength checking
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    if (password.length > 0) {
        const result = checkPasswordStrength(password);
        passwordStrength.textContent = result.feedback;
    } else {
        passwordStrength.textContent = '';
        passwordStrength.className = 'password-strength';
    }
});

// Password confirmation validation
confirmPasswordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword.length > 0) {
        if (password !== confirmPassword) {
            confirmPasswordInput.classList.add('error');
        } else {
            confirmPasswordInput.classList.remove('error');
        }
    }
});

// Form validation
function validateForm() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    // Required field validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            document.getElementById(field).classList.add('error');
            showError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        document.getElementById('email').classList.add('error');
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (data.phone && !phoneRegex.test(data.phone)) {
        document.getElementById('phone').classList.add('error');
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    // Password validation
    if (data.password) {
        const passwordResult = checkPasswordStrength(data.password);
        if (passwordResult.strength < 3) {
            document.getElementById('password').classList.add('error');
            showError('password', 'Password must be stronger');
            isValid = false;
        }
    }

    // Password confirmation validation
    if (data.password !== data.confirmPassword) {
        document.getElementById('confirmPassword').classList.add('error');
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    // Terms acceptance validation
    if (!data.terms) {
        document.getElementById('terms').parentElement.classList.add('error');
        showError('terms', 'You must accept the terms of service');
        isValid = false;
    }

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (fieldId === 'terms') {
        field.parentElement.parentElement.appendChild(errorDiv);
    } else {
        field.parentElement.appendChild(errorDiv);
    }
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        registerBtn.classList.add('pulse');
        setTimeout(() => registerBtn.classList.remove('pulse'), 1000);
        return;
    }

    // Show loading state
    registerBtn.disabled = true;
    registerBtn.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 10px;">
            <span style="width: 20px; height: 20px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
            Creating Account...
        </span>
    `;

    // Simulate API call
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Account created successfully! Redirecting to login...';
        form.insertBefore(successDiv, form.firstChild);
        
        // Simulate redirect to login after success
        setTimeout(() => {
            alert('Registration successful! You can now log in.');
            // Here you would typically navigate to login screen
            // In Flutter context, you might want to pop back or navigate
        }, 2000);
        
    } catch (error) {
        // Show error message
        registerBtn.disabled = false;
        registerBtn.innerHTML = 'Create Account';
        alert('Registration failed. Please try again.');
    }
});

// Navigation handlers
backLink.addEventListener('click', (e) => {
    e.preventDefault();
    // This will be handled by Flutter's shouldOverrideUrlLoading
    window.location.href = 'back';
});

document.getElementById('loginLink').addEventListener('click', (e) => {
  e.preventDefault();
  if (window.flutter_inappwebview) {
    window.flutter_inappwebview.callHandler('navigateToClientLogin');
  } else {
    // fallback for web, just redirect or handle normally
    window.location.href = 'login.html'; // update path as needed
  }
});


// Add CSS for spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Add entrance animation to form
setTimeout(() => {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        setTimeout(() => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}, 300);