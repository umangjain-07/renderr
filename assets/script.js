const roleCards = document.querySelectorAll('.role-card');
const continueBtn = document.getElementById('continueBtn');
let selectedRoleSpan = document.getElementById('selectedRole'); // Remove const so we can reassign
let selectedRole = null;
let loadingTimeout = null;
let isLoading = false; // Track loading state

roleCards.forEach(card => {
    card.addEventListener('click', () => {
        roleCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedRole = card.dataset.role;
        
        // Get fresh reference to selectedRole span (in case button was reset)
        selectedRoleSpan = document.getElementById('selectedRole');
        if (selectedRoleSpan) {
            selectedRoleSpan.textContent = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
        }
        
        continueBtn.classList.add('active');
        continueBtn.classList.add('pulse');
        setTimeout(() => {
            continueBtn.classList.remove('pulse');
        }, 2000);
    });

    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('selected')) {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('selected')) {
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Function to reset the continue button to its original state
function resetContinueButton() {
    if (selectedRole) {
        isLoading = false;
        continueBtn.innerHTML = `Continue as <span id="selectedRole">${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>`;
        continueBtn.classList.add('active');
        
        // Update the reference to the new selectedRole span
        selectedRoleSpan = document.getElementById('selectedRole');
        
        // Clear any existing timeout
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }
        
        console.log('Button reset to normal state');
    }
}

continueBtn.addEventListener('click', () => {
    if (selectedRole && !isLoading) {
        isLoading = true;
        
        // Clear any existing timeout
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }

        // Show loading state
        continueBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 10px;">
                <span style="width: 20px; height: 20px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                Loading...
            </span>
        `;

        // Set a timer to ALWAYS reset the button after 3 seconds
        loadingTimeout = setTimeout(() => {
            resetContinueButton();
            console.log('Auto-reset after 3 seconds');
        }, 3000); // 3 seconds - shorter for better UX

        // Try Flutter navigation after a brief delay
        setTimeout(() => {
            try {
                if (window.flutter_inappwebview) {
                    if (selectedRole === 'client') {
                        window.flutter_inappwebview.callHandler('navigateToClient');
                    } else if (selectedRole === 'admin') {
                        window.flutter_inappwebview.callHandler('navigateToAdmin');
                    }
                    console.log('Flutter navigation called');
                } else {
                    console.log('Flutter InAppWebView not available');
                }
            } catch (error) {
                console.log('Error calling Flutter navigation:', error);
            }
            
            // Note: We don't clear the timeout here anymore
            // The button will always reset after 3 seconds regardless
        }, 500); // Small delay before trying navigation
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

setTimeout(() => {
    roleCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}, 500);