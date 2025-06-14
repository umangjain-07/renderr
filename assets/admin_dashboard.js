// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const chatOverlay = document.getElementById('chatOverlay');
const mainContent = document.getElementById('mainContent');
const pageTitle = document.getElementById('pageTitle');
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const pageContents = document.querySelectorAll('.page-content');
const notificationIcon = document.getElementById('notificationIcon');
const notificationDropdown = document.getElementById('notificationDropdown');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const chatBackBtn = document.getElementById('chatBackBtn');
const chatSearchInput = document.getElementById('chatSearchInput');
const chatViewPage = document.getElementById('chatViewPage');
const chatPage = document.getElementById('chatPage');
const chatUserName = document.getElementById('chatUserName');
const chatUserImg = document.getElementById('chatUserImg');
const chatUserStatus = document.getElementById('chatUserStatus');

// Chat data storage for individual chats
const chatData = {
    sarah: {
        name: 'Sarah Johnson',
        img: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face',
        status: 'Active now',
        messages: [
            { content: "Hey! How are you doing today?", sent: false },
            { content: "Hi Sarah! I'm doing great, thanks for asking. How about you?", sent: true },
            { content: "I'm doing well! Just wanted to check in and see how the project is going.", sent: false },
            { content: "The project is going smoothly! We should have everything ready by the end of the week.", sent: true }
        ]
    },
    mike: {
        name: 'Mike Chen',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        status: 'Online',
        messages: [
            { content: "Hi there! How's the development going?", sent: false },
            { content: "Going great! Almost finished with the new features.", sent: true },
            { content: "Thanks for the quick response!", sent: false }
        ]
    },
    emma: {
        name: 'Emma Wilson',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        status: 'Last seen 3 hours ago',
        messages: [
            { content: "Can we schedule a meeting?", sent: false },
            { content: "Sure! What time works best for you?", sent: true },
            { content: "How about tomorrow at 2 PM?", sent: false }
        ]
    },
    david: {
        name: 'David Brown',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        status: 'Online',
        messages: [
            { content: "Perfect! Let's do it.", sent: false },
            { content: "Sounds good to me!", sent: true }
        ]
    }
};

let currentChat = 'sarah';
let isMobile = window.innerWidth <= 768;

// Sidebar Toggle
sidebarToggle.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
    } else {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
});

// Close sidebar when clicking overlay
sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    sidebarOverlay.classList.remove('show');
});

// Handle window resize
window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
        chatOverlay.classList.remove('show');
    }
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        
        // Update active nav item
        document.querySelector('.nav-item.active').classList.remove('active');
        link.parentElement.classList.add('active');
        
        // Hide all pages
        pageContents.forEach(page => page.classList.remove('active'));
        
        // Show target page
        document.getElementById(targetPage + 'Page').classList.add('active');
        
        // Update page title
        const titles = {
            'chat': 'Chat',
            'clients': 'Clients',
            'settings': 'Settings'
        };
        pageTitle.textContent = titles[targetPage];
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        }
    });
});

// Notification Dropdown
notificationIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('show');
});

// Close notification dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationIcon.contains(e.target)) {
        notificationDropdown.classList.remove('show');
    }
});

// Chat functionality
function addMessage(content, isSent = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : ''}`;
    
    const currentChatData = chatData[currentChat];
    const imgSrc = isSent 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        : currentChatData.img;
    
    messageDiv.innerHTML = `
        <img src="${imgSrc}" alt="${isSent ? 'You' : currentChatData.name}">
        <div class="message-content">${content}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat data
    chatData[currentChat].messages.push({ content, sent: isSent });
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, true);
        messageInput.value = '';
        
        // Simulate response after 1 second
        setTimeout(() => {
            const responses = [
                "Thanks for your message!",
                "That sounds great!",
                "I'll get back to you on that.",
                "Perfect, let's do it!",
                "Absolutely, I agree.",
                "Sure, I can help with that."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, false);
        }, 1000);
    }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Load chat messages for a specific chat
function loadChatMessages(chatId) {
    const chat = chatData[chatId];
    if (!chat) return;
    
    chatMessages.innerHTML = '';
    
    chat.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sent ? 'sent' : ''}`;
        
        const imgSrc = message.sent 
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
            : chat.img;
        
        messageDiv.innerHTML = `
            <img src="${imgSrc}" alt="${message.sent ? 'You' : chat.name}">
            <div class="message-content">${message.content}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update chat header
function updateChatHeader(chatId) {
    const chat = chatData[chatId];
    if (!chat) return;
    
    chatUserName.textContent = chat.name;
    chatUserImg.src = chat.img;
    chatUserStatus.textContent = chat.status;
}

// Open individual chat (especially for mobile)
function openChat(chatId) {
    currentChat = chatId;
    
    // Update active chat item
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-chat="${chatId}"]`).classList.add('active');
    
    // Load chat data
    updateChatHeader(chatId);
    loadChatMessages(chatId);
    
    // Show chat view page
    chatPage.classList.remove('active');
    chatViewPage.classList.add('active');
    pageTitle.textContent = chatData[chatId].name;
    
    // On mobile, show overlay
    if (isMobile) {
        chatOverlay.classList.add('show');
    }
}

// Close chat view and return to chat list
function closeChatView() {
    chatViewPage.classList.remove('active');
    chatPage.classList.add('active');
    pageTitle.textContent = 'Chat';
    
    if (isMobile) {
        chatOverlay.classList.remove('show');
    }
}

// Chat item selection
document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
        const chatId = item.getAttribute('data-chat');
        openChat(chatId);
    });
});

// Chat back button
chatBackBtn.addEventListener('click', closeChatView);

// Close chat overlay
// Close chat overlay - only close if clicking outside the chat container
chatOverlay.addEventListener('click', (e) => {
    // Only close if clicking directly on the overlay (not bubbling from chat container)
    if (e.target === chatOverlay) {
        closeChatView();
    }
});

// Chat search functionality
chatSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const message = item.querySelector('p').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || message.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial mobile state
    isMobile = window.innerWidth <= 768;
    
    // Initialize chat messages for the active chat
    loadChatMessages(currentChat);
});