document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registration-form");

    function showErrorMessage(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = 'inline';
    }

    function hideErrorMessage(id) {
        const errorElement = document.getElementById(id);
        errorElement.style.display = 'none';
    }

    registrationForm.addEventListener("submit", (event) => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const email = document.getElementById("email").value;
        const ageConfirmation = document.getElementById("age-confirmation").checked;
        const tosConfirmation = document.getElementById("tos-confirmation").checked;

        let isValid = true;

        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
        if (!usernameRegex.test(username)) {
            isValid = false;
            showErrorMessage('username-error', 'Invalid username');
        } else {
            hideErrorMessage('username-error');
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~[\]])[A-Za-z\d/*\-+!@#$^&~[\]]{8,}$/;
        if (!passwordRegex.test(password)) {
            isValid = false;
            showErrorMessage('password-error', 'Invalid password');
        } else {
            hideErrorMessage('password-error');
        }

        if (password !== confirmPassword) {
            isValid = false;
            showErrorMessage('confirm-password-error', 'Confirm password does not match password');
        } else {
            hideErrorMessage('confirm-password-error');
        }

        if (!ageConfirmation) {
            isValid = false;
            showErrorMessage('age-confirmation-error', 'User is not 13+ years old');
        } else {
            hideErrorMessage('age-confirmation-error');
        }

        if (!tosConfirmation) {
            isValid = false;
            showErrorMessage('tos-confirmation-error', 'User did not accept TOS and Privacy rules');
        } else {
            hideErrorMessage('tos-confirmation-error');
        }

        if (isValid) {
            console.log("Form is valid");
            // Form will be submitted as normal.
        } else {
            console.log("Form is invalid");
            alert("Please correct the errors in the form.");
            event.preventDefault(); // Prevent form submission if the form is invalid.
        }
    });
});
