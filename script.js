document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Check if the password field is empty
        if (passwordInput.value.trim() === '') {
            // Alert the user or provide feedback
            alert('Password cannot be empty!'); // Replace with a more sophisticated feedback mechanism if desired

            // Optionally, focus on the password input
            passwordInput.focus();

            // You might want to add a class to the input for styling invalid fields
            passwordInput.classList.add('input-error'); // Make sure to define .input-error in your CSS
        } else {
            // If password is not empty, remove error styling (if any)
            passwordInput.classList.remove('input-error');

            // Here you would typically proceed with the actual login process
            // For example, sending data to a server via fetch or XMLHttpRequest
            alert('Form submitted successfully (simulated)!');
            // loginForm.submit(); // Uncomment this if you want to allow normal form submission after validation
        }
    });

    // Optional: Remove error styling when the user starts typing in the password field again
    passwordInput.addEventListener('input', function() {
        if (passwordInput.classList.contains('input-error')) {
            passwordInput.classList.remove('input-error');
        }
    });
});
