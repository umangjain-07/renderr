const roleCards = document.querySelectorAll('.role-card');
const continueBtn = document.getElementById('continueBtn');
const selectedRoleSpan = document.getElementById('selectedRole');
let selectedRole = null;

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

continueBtn.addEventListener('click', () => {
    if (selectedRole) {
        continueBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 10px;">
                <span style="width: 20px; height: 20px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                Loading...
            </span>
        `;

        setTimeout(() => {
            // Trigger Dart side navigation to ClientRegistration
            if (window.flutter_inappwebview) {
    if (selectedRole === 'client') {
        window.flutter_inappwebview.callHandler('navigateToClient');
    } else if (selectedRole === 'admin') {
        window.flutter_inappwebview.callHandler('navigateToAdmin');
    }
}
 
            else {
                alert('Navigation not supported in this environment.');
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
