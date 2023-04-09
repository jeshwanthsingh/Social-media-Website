document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registration-form");
  
registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const email = document.getElementById("email").value;
        const ageConfirmation = document.getElementById("age-confirmation").checked;
        const tosConfirmation = document.getElementById("tos-confirmation").checked;

        let isValid = true;

        // Validate username
        const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
        if (!usernameRegex.test(username)) {
          isValid = false;
          console.log("Username is invalid");
          // Show error message
        }
    
        // Validate password
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~[\]])[A-Za-z\d/*\-+!@#$^&~[\]]{8,}$/;
        if (!passwordRegex.test(password)) {
          isValid = false;
          console.log("Password is invalid");
          // Show error message
        }

        // Validate confirm password
    if (password !== confirmPassword) {
        isValid = false;
        console.log("Confirm password does not match password");
        // Show error message
      }
  
      // Validate age confirmation
      if (!ageConfirmation) {
        isValid = false;
        console.log("User is not 13+ years old");
        // Show error message
      }
  
      // Validate TOS confirmation
      if (!tosConfirmation) {
        isValid = false;
        console.log("User did not accept TOS and Privacy rules");
        // Show error message
      }
  
      if (isValid) {
        console.log("Form is valid");
        // Submit the form or show a success message
        alert("Registration form submitted successfully!");
        registrationForm.reset();
      } else {
        console.log("Form is invalid");
        // Show a generic error message
        alert("Please correct the errors in the form.");
    }
 });
});
  
  
  
  