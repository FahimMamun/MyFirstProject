document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageArea = document.getElementById('messageArea');

    const formTitle = document.getElementById('formTitle');
    const submitButton = document.getElementById('submitButton');
    const toggleToRegisterLink = document.getElementById('toggleToRegisterLink');
    const toggleToLoginLink = document.getElementById('toggleToLoginLink');

    let currentMode = 'login'; // Initial mode

    // Base classes for the submit button (excluding color-specific ones)
    const submitButtonBaseClass = 'w-full text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150';

    function updateFormUI(mode) {
        // Clear previous messages and input errors first
        messageArea.textContent = '';
        messageArea.className = 'mb-4 text-sm'; // Reset message area class
        emailInput.classList.remove('border-red-500'); // Tailwind error class
        passwordInput.classList.remove('border-red-500'); // Tailwind error class

        if (mode === 'login') {
            formTitle.textContent = 'Login';
            submitButton.textContent = 'Login';
            submitButton.className = `${submitButtonBaseClass} bg-blue-600 hover:bg-blue-700`; // Apply all classes
            toggleToRegisterLink.classList.remove('hidden');
            toggleToLoginLink.classList.add('hidden');
        } else { // register mode
            formTitle.textContent = 'Register';
            submitButton.textContent = 'Register';
            submitButton.className = `${submitButtonBaseClass} bg-green-600 hover:bg-green-700`; // Apply all classes
            toggleToRegisterLink.classList.add('hidden');
            toggleToLoginLink.classList.remove('hidden');
        }
    }

    if (toggleToRegisterLink) {
        toggleToRegisterLink.addEventListener('click', function(event) {
            event.preventDefault();
            if (currentMode !== 'register') { // Only update if mode actually changes
                currentMode = 'register';
                updateFormUI(currentMode);
            }
        });
    }

    if (toggleToLoginLink) {
        toggleToLoginLink.addEventListener('click', function(event) {
            event.preventDefault();
            if (currentMode !== 'login') { // Only update if mode actually changes
                currentMode = 'login';
                updateFormUI(currentMode);
            }
        });
    }

    function showMessage(message, isSuccess) {
        messageArea.textContent = message;
        if (isSuccess) {
            messageArea.className = 'mb-4 text-sm text-green-600';
        } else {
            messageArea.className = 'mb-4 text-sm text-red-600';
        }
    }

    async function handleAuthSubmit(event) {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showMessage('Email and Password are required.', false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            showMessage('Please enter a valid email address.', false);
            return;
        }

        // Clear message area before new submission attempt, but not input error classes yet
        messageArea.textContent = '';
        messageArea.className = 'mb-4 text-sm';


        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        let url = '';
        if (currentMode === 'login') {
            url = 'login.php';
        } else if (currentMode === 'register') {
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
                showMessage(`Error: ${response.status} ${response.statusText}`, false);
                return;
            }

            const result = await response.json();

            if (result.success) {
                showMessage(result.message, true);
                if (currentMode === 'login' && result.redirectUrl) {
                    setTimeout(() => {
                        window.location.href = result.redirectUrl;
                    }, 1500);
                } else if (currentMode === 'register') {
                    authForm.reset();
                    // After successful registration, switch to login mode automatically
                    currentMode = 'login';
                    updateFormUI(currentMode);
                }
            } else {
                showMessage(result.message || 'An unknown error occurred.', false);
                if (result.message) { // Check specific error messages to highlight fields
                    const lowerCaseMessage = result.message.toLowerCase();
                    if (lowerCaseMessage.includes('email') || lowerCaseMessage.includes('user not found')) {
                         emailInput.classList.add('border-red-500');
                    }
                    if (lowerCaseMessage.includes('password') || lowerCaseMessage.includes('incorrect password')) {
                         passwordInput.classList.add('border-red-500');
                    }
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showMessage('An error occurred while connecting to the server. Please try again.', false);
        }
    }

    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }

    emailInput.addEventListener('input', () => {
        emailInput.classList.remove('border-red-500');
        if(messageArea.className.includes('text-red-600')) {
            messageArea.textContent = '';
            messageArea.className = 'mb-4 text-sm';
        }
    });
    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('border-red-500');
         if(messageArea.className.includes('text-red-600')) {
            messageArea.textContent = '';
            messageArea.className = 'mb-4 text-sm';
        }
    });

    // Initialize UI based on default mode
    updateFormUI(currentMode);
});
