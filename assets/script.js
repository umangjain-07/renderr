const roleCards = document.querySelectorAll('.role-card');
const continueBtn = document.getElementById('continueBtn');
const selectedRoleSpan = document.getElementById('selectedRole');
let selectedRole = null;
let loadingTimeout = null; // Track the loading timeout

roleCards.forEach(card => {
    card.addEventListener('click', () => {
        roleCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedRole = card.dataset.role;
        selectedRoleSpan.textContent = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
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
        continueBtn.innerHTML = `Continue as <span id="selectedRole">${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>`;
        continueBtn.classList.add('active');
        // Re-assign the selectedRoleSpan reference since we recreated the element
        const newSelectedRoleSpan = document.getElementById('selectedRole');
    }
}

continueBtn.addEventListener('click', () => {
    if (selectedRole) {
        // Clear any existing timeout
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
        }

        continueBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 10px;">
                <span style="width: 20px; height: 20px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                Loading...
            </span>
        `;

        // Set a timer to reset the button after 5 seconds (adjustable)
        loadingTimeout = setTimeout(() => {
            resetContinueButton();
            // Optional: Show a message or alert that the operation timed out
            console.log('Loading timed out, button reset');
        }, 5000); // 5 seconds - you can adjust this value

        setTimeout(() => {
            // Clear the reset timeout if navigation succeeds
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }

            // Trigger Dart side navigation to ClientRegistration
            if (window.flutter_inappwebview) {
                if (selectedRole === 'client') {
                    window.flutter_inappwebview.callHandler('navigateToClient');
                } else if (selectedRole === 'admin') {
                    window.flutter_inappwebview.callHandler('navigateToAdmin');
                }
            } else {
                alert('Navigation not supported in this environment.');
                // Reset the button since navigation failed
                resetContinueButton();
            }
        }, 1500);
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