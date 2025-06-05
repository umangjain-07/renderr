
        // DOM Elements
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const mainContent = document.getElementById('mainContent');
        const pageTitle = document.getElementById('pageTitle');
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        const pageContents = document.querySelectorAll('.page-content');
        const notificationIcon = document.getElementById('notificationIcon');
        const notificationDropdown = document.getElementById('notificationDropdown');
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        const chatMessages = document.getElementById('chatMessages');

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
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                sidebarOverlay.classList.remove('show');
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
            
            const imgSrc = isSent 
                ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
                : 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face';
            
            messageDiv.innerHTML = `
                <img src="${imgSrc}" alt="${isSent ? 'You' : 'Sarah'}">
                <div class="message-content">${content}</div>
            `;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
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
                        "Absolutely, I agree."
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

        // Chat item selection
        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelector('.chat-item.active').classList.remove('active');
                item.classList.add('active');
                
                // Update chat header
                const name = item.querySelector('h4').textContent;
                const img = item.querySelector('img').src;
                document.querySelector('.chat-user-info h3').textContent = name;
                document.querySelector('.chat-user-info img').src = img;
            });
        });

        // Initialize smooth scrolling for chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
