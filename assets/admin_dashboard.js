// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mainContent = document.querySelector('.main-content');
const navLinks = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');
const pageTitle = document.getElementById('pageTitle');
const notificationIcon = document.getElementById('notificationIcon');
const notificationDropdown = document.getElementById('notificationDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const searchInput = document.getElementById('searchInput');
const chatItems = document.querySelectorAll('.chat-item');

// State management
let currentPage = 'chat';
let isNotificationOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    bindEvents();
    loadInitialData();
});

// Initialize application
function initializeApp() {
    // Set initial active states
    updateActiveNavigation('chat');
    showPage('chatPage');
    
    // Add fade-in animation to main content
    mainContent.classList.add('fade-in');
    
    // Initialize notification badge animation
    animateNotificationBadge();
    
    console.log('Admin Panel initialized successfully');
}

// Bind all event listeners
function bindEvents() {
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Navigation links
    navLinks.forEach(link => {
        if (!link.closest('.logout')) {
            link.addEventListener('click', handleNavigation);
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Notification dropdown
    notificationIcon.addEventListener('click', toggleNotificationDropdown);
    
    // Chat functionality
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', handleMessageKeypress);
    messageInput.addEventListener('input', handleTyping);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Chat item selection
    chatItems.forEach(item => {
        item.addEventListener('click', () => selectChatItem(item));
    });
    
    // Close notification dropdown when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Load initial data
function loadInitialData() {
    // Simulate loading user data
    setTimeout(() => {
        updateUserStatus('online');
        loadRecentMessages();
    }, 500);
}

// Sidebar toggle functionality
function toggleSidebar() {
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

// Handle navigation between pages
function handleNavigation(e) {
    e.preventDefault();
    const page = e.currentTarget.getAttribute('data-page');
    
    if (page && page !== currentPage) {
        // Add loading state
        e.currentTarget.classList.add('loading');
        
        setTimeout(() => {
            switchToPage(page);
            e.currentTarget.classList.remove('loading');
        }, 300);
    }
}

// Switch to a specific page
function switchToPage(page) {
    currentPage = page;
    
    // Update navigation
    updateActiveNavigation(page);
    
    // Show corresponding page content
    const pageMap = {
        'chat': 'chatPage',
        'clients': 'clientsPage',
        'settings': 'settingsPage'
    };
    
    showPage(pageMap[page]);
    
    // Update page title
    const titleMap = {
        'chat': 'Chat',
        'clients': 'Clients',
        'settings': 'Settings'
    };
    
    pageTitle.textContent = titleMap[page];
    
    // Page-specific initialization
    switch(page) {
        case 'chat':
            initializeChatPage();
            break;
        case 'clients':
            initializeClientsPage();
            break;
        case 'settings':
            initializeSettingsPage();
            break;
    }
}

// Update active navigation state
function updateActiveNavigation(activePage) {
    navLinks.forEach(link => {
        const parentItem = link.closest('.nav-item');
        if (link.getAttribute('data-page') === activePage) {
            parentItem.classList.add('active');
        } else {
            parentItem.classList.remove('active');
        }
    });
}

// Show specific page content
function showPage(pageId) {
    pageContents.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('fade-in');
    }
}

// Notification dropdown functionality
function toggleNotificationDropdown(e) {
    e.stopPropagation();
    isNotificationOpen = !isNotificationOpen;
    
    if (isNotificationOpen) {
        notificationDropdown.classList.add('show');
        // Mark notifications as read
        setTimeout(() => {
            updateNotificationBadge(0);
        }, 1000);
    } else {
        notificationDropdown.classList.remove('show');
    }
}

// Handle clicks outside notification dropdown
function handleOutsideClick(e) {
    if (isNotificationOpen && !notificationDropdown.contains(e.target) && !notificationIcon.contains(e.target)) {
        notificationDropdown.classList.remove('show');
        isNotificationOpen = false;
    }
}

// Chat functionality
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessageToChat(message, 'sent');
        messageInput.value = '';
        
        // Simulate response
        setTimeout(() => {
            addMessageToChat("Thank you for your message!", 'received');
        }, 1000);
    }
}

function handleMessageKeypress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function handleTyping(e) {
    // Add typing indicator logic here
    const message = e.target.value;
    if (message.length > 0) {
        // Show typing indicator
    }
}

function addMessageToChat(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    
    if (type === 'received') {
        messageElement.innerHTML = `
            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b550?w=40&h=40&fit=crop&crop=face" alt="User">
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add animation
    messageElement.classList.add('fade-in');
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    chatItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const message = item.querySelector('p').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || message.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Chat item selection
function selectChatItem(item) {
    chatItems.forEach(chatItem => {
        chatItem.classList.remove('active');
    });
    
    item.classList.add('active');
    
    // Update chat header with selected user info
    const userName = item.querySelector('h4').textContent;
    const userAvatar = item.querySelector('img').src;
    
    document.querySelector('.chat-user-info h3').textContent = userName;
    document.querySelector('.chat-user-info img').src = userAvatar;
    
    // Load chat history for selected user
    loadChatHistory(userName);
}

// Load chat history
function loadChatHistory(userName) {
    // Clear current messages
    chatMessages.innerHTML = '';
    
    // Simulate loading messages
    const messages = [
        { text: `Hello! How can I help you today?`, type: 'received' },
        { text: `Hi there! I have a question about your services.`, type: 'sent' },
        { text: `Of course! I'd be happy to help. What would you like to know?`, type: 'received' }
    ];
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            addMessageToChat(msg.text, msg.type);
        }, index * 500);
    });
}

// Page-specific initializations
function initializeChatPage() {
    console.log('Chat page initialized');
    // Initialize real-time chat features
}

function initializeClientsPage() {
    console.log('Clients page initialized');
    // Load client data
    animateClientCards();
}

function initializeSettingsPage() {
    console.log('Settings page initialized');
    // Initialize settings forms
    animateSettingItems();
}

// Animation functions
function animateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.animation = 'pulse 2s infinite';
    }
}

function animateClientCards() {
    const cards = document.querySelectorAll('.client-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-in');
        }, index * 100);
    });
}

function animateSettingItems() {
    const items = document.querySelectorAll('.setting-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('fade-in');
        }, index * 150);
    });
}

// Utility functions
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function updateUserStatus(status) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator) {
        statusIndicator.className = `status-indicator ${status}`;
    }
    
    if (statusText) {
        statusText.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
}

function loadRecentMessages() {
    // Simulate loading recent messages
    setTimeout(() => {
        updateNotificationBadge(3);
    }, 1000);
}

// Handle window resize
function handleResize() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('show');
    }
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to close notification dropdown
    if (e.key === 'Escape' && isNotificationOpen) {
        notificationDropdown.classList.remove('show');
        isNotificationOpen = false;
    }
    
    // Ctrl/Cmd + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement === messageInput) {
        sendMessage();
    }
}

// Logout functionality
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        // Add logout animation
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            // Simulate logout
            alert('Logged out successfully!');
            // In a real app, redirect to login page
            location.reload();
        }, 500);
    }
}

// Real-time features simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate new messages
        if (Math.random() > 0.8) {
            updateNotificationBadge(Math.floor(Math.random() * 5) + 1);
        }
        
        // Simulate user status changes
        if (Math.random() > 0.9) {
            const statuses = ['online', 'offline'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            updateUserStatus(randomStatus);
        }
    }, 10000);
}

// Start real-time simulation
setTimeout(simulateRealTimeUpdates, 5000);

// Add CSS animations for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Export functions for potential external use
window.AdminPanel = {
    switchToPage,
    updateNotificationBadge,
    updateUserStatus,
    sendMessage
};