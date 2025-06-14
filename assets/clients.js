// Global variables
let currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    school: 'ABC University',
    memberSince: 'January 2024',
    initials: 'JD'
};

let messages = [];
let isTyping = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
});

// Initialize App
function initializeApp() {
    showSection('dashboard');
    updateUserInterface();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Chat input
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        messageInput.addEventListener('input', function() {
            updateCharCounter();
        });
    }

    // Form submissions
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }

    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }

    // Modal click outside to close
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });

    // Close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    if (navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }

    // Special handling for chat section
    if (sectionId === 'chat') {
        scrollToBottom();
    }
}

// User Data Management
function loadUserData() {
    updateUserInterface();
}

function updateUserInterface() {
    // Update dashboard user info
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-phone').textContent = currentUser.phone;
    document.getElementById('user-school').textContent = currentUser.school;
    document.getElementById('user-since').textContent = currentUser.memberSince;
    document.getElementById('user-initials').textContent = currentUser.initials;

    // Update edit form
    document.getElementById('edit-name').value = currentUser.name;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-phone').value = currentUser.phone;
    document.getElementById('edit-school').value = currentUser.school;
}

function generateInitials(name) {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
}

// Profile Management
function showEditProfile() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.add('active');
}

function updateProfile() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const school = document.getElementById('edit-school').value.trim();

    if (!name || !email || !phone || !school) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Update user data
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    currentUser.school = school;
    currentUser.initials = generateInitials(name);

    // Update UI
    updateUserInterface();
    closeModal('edit-profile-modal');
    showAlert('Profile updated successfully!', 'success');
}

function showChangePassword() {
    const modal = document.getElementById('change-password-modal');
    modal.classList.add('active');
    
    // Clear form
    document.getElementById('change-password-form').reset();
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert('Please fill in all password fields', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showAlert('New password must be at least 8 characters long', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match', 'error');
        return;
    }

    // Simulate password change
    closeModal('change-password-modal');
    showAlert('Password changed successfully!', 'success');
}

// Chat Functionality
function sendMessage() {
    const input = document.getElementById('message-input');
    const messageText = input.value.trim();

    if (!messageText) return;

    // Add user message
    addMessage(messageText, 'user');
    input.value = '';
    updateCharCounter();

    // Simulate admin typing
    setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            addAdminResponse(messageText);
        }, 1500 + Math.random() * 1000);
    }, 500);
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-avatar">${currentUser.initials}</div>
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
        messageDiv.classList.add('slide-in-right');
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">A</div>
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
                <span class="message-time">${currentTime}</span>
            </div>
        `;
        messageDiv.classList.add('slide-in-left');
    }

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // Store message
    messages.push({
        text: text,
        sender: sender,
        timestamp: new Date().toISOString()
    });
}

function addAdminResponse(userMessage) {
    const responses = [
        "Thank you for your message! I'll help you with that.",
        "I understand your concern. Let me assist you with this matter.",
        "That's a great question! Here's what I can tell you:",
        "I'm here to help! Could you provide more details about your issue?",
        "Thank you for reaching out. I'll look into this for you.",
        "I appreciate you contacting us. How can I further assist you?",
        "That's something I can definitely help you with.",
        "I see what you're asking about. Let me provide you with the information you need.",
        "Thank you for your patience. I'm here to resolve any issues you might have.",
        "I'm glad you reached out! Let me help you with that right away."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, 'admin');
}

function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message admin-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">A</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

function clearChat() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = `
        <div class="message admin-message">
            <div class="message-avatar">A</div>
            <div class="message-content">
                <p>Hello! How can I help you today?</p>
                <span class="message-time">${new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}</span>
            </div>
        </div>
    `;
    messages = [];
    showAlert('Chat cleared successfully!', 'info');
}

function updateCharCounter() {
    const input = document.getElementById('message-input');
    const counter = document.getElementById('char-count');
    const currentLength = input.value.length;
    counter.textContent = currentLength;
    
    if (currentLength > 450) {
        counter.style.color = '#dc3545';
    } else if (currentLength > 400) {
        counter.style.color = '#fd7e14';
    } else {
        counter.style.color = '#999';
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

// Modal Management
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Notifications
function showNotifications() {
    const notifications = [
        {
            title: 'Welcome to TidBid!',
            message: 'Thank you for joining our platform. Explore all the features we have to offer.',
            time: '2 hours ago'
        },
        {
            title: 'System Update',
            message: 'We have improved our chat system for better performance.',
            time: '1 day ago'
        },
        {
            title: 'New Features Available',
            message: 'Check out our new dashboard features and improved user interface.',
            time: '3 days ago'
        }
    ];

    let notificationHtml = '<div class="notification-list">';
    notifications.forEach(notification => {
        notificationHtml += `
            <div class="notification-item">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <small>${notification.time}</small>
            </div>
        `;
    });
    notificationHtml += '</div>';

    showAlert(notificationHtml, 'info');
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = message;

    // Add to current section
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        const container = activeSection.querySelector('.container');
        if (container) {
            container.insertBefore(alert, container.firstChild);
        }
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showAlert('Logging out...', 'info');
        setTimeout(() => {
            // In a real app, this would redirect to login page
            window.location.reload();
        }, 1000);
    }
}

// Export functions for potential use in Flutter WebView
window.TidBidApp = {
    showSection,
    sendMessage,
    updateProfile,
    changePassword,
    clearChat,
    logout,
    showNotifications,
    currentUser,
    messages
};

// Initialize character counter
document.addEventListener('DOMContentLoaded', function() {
    updateCharCounter();
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768 && navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        html {
            scroll-behavior: smooth;
        }
    `;
    document.head.appendChild(style);
});

// Prevent form submission on Enter in input fields (except chat)
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input:not(#message-input)');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && input.type !== 'submit') {
                e.preventDefault();
                // Move to next input or submit form
                const form = input.closest('form');
                if (form) {
                    const formInputs = form.querySelectorAll('input');
                    const currentIndex = Array.from(formInputs).indexOf(input);
                    if (currentIndex < formInputs.length - 1) {
                        formInputs[currentIndex + 1].focus();
                    } else {
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            }
        });
    });
});

// Add loading states for better UX
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Add focus management for accessibility
document.addEventListener('DOMContentLoaded', function() {
    // Focus management for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
});