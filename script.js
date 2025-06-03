document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const messageArea = document.getElementById('messageArea');
    // const forgotPasswordLink = document.getElementById('forgotPasswordLink'); // If we need to add functionality later

    // Function to display messages
    function showMessage(message, isSuccess) {
        messageArea.textContent = message;
        if (isSuccess) {
            messageArea.className = 'mb-4 text-sm text-green-600';
        } else {
            messageArea.className = 'mb-4 text-sm text-red-600';
        }
    }

    // Function to handle form submission
    async function handleAuth(event, action) {
        event.preventDefault(); // Prevent default form submission

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic client-side validation (can be more extensive)
        if (!email || !password) {
            showMessage('Email and Password are required.', false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            showMessage('Please enter a valid email address.', false);
            return;
        }

        // Clear previous messages
        messageArea.textContent = '';
        emailInput.classList.remove('border-red-500'); // Tailwind class for error
        passwordInput.classList.remove('border-red-500');

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        let url = '';
        if (action === 'login') {
            url = 'login.php';
        } else if (action === 'register') {
            url = 'register.php';
        } else {
            showMessage('Invalid action.', false);
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                // Handle HTTP errors like 404, 500 etc.
                showMessage(`Error: ${response.status} ${response.statusText}`, false);
                return;
            }

            const result = await response.json();

            if (result.success) {
                showMessage(result.message, true);
                if (action === 'login' && result.redirectUrl) {
                    // Wait a bit for the user to see the success message before redirecting
                    setTimeout(() => {
                        window.location.href = result.redirectUrl;
                    }, 1500);
                } else if (action === 'register') {
                    // Optionally clear form or give specific instructions
                    authForm.reset(); // Clear form after successful registration
                }
            } else {
                showMessage(result.message || 'An unknown error occurred.', false);
                // Highlight fields if specific errors are known (more advanced)
                if (result.message && result.message.toLowerCase().includes('email')) {
                     emailInput.classList.add('border-red-500');
                }
                if (result.message && result.message.toLowerCase().includes('password')) {
                     passwordInput.classList.add('border-red-500');
                }
            }

        } catch (error) {
            console.error('Fetch error:', error);
            showMessage('An error occurred while connecting to the server. Please try again.', false);
        }
    }

    // Attach event listeners
    if (loginButton) {
        loginButton.addEventListener('click', (event) => handleAuth(event, 'login'));
    }
    if (registerButton) {
        registerButton.addEventListener('click', (event) => handleAuth(event, 'register'));
    }

    // Optional: Remove error styling when the user starts typing again
    emailInput.addEventListener('input', () => {
        emailInput.classList.remove('border-red-500');
        messageArea.textContent = ''; // Clear message on new input
    });
    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('border-red-500');
        messageArea.textContent = ''; // Clear message on new input
    });

    // Note: The original password validation (if (passwordInput.value.trim() === ''))
    // and associated alert/focus/class manipulation from the old script.js
    // are now handled within handleAuth or can be enhanced there.
    // The social login button functionality from the old script is not included here yet,
    // as they are just UI elements for now.
});
