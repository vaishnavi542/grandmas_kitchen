document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("register-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get all fields
        const username = document.getElementById("id_username").value.trim();
        const firstName = document.getElementById("id_first_name").value.trim();
        const lastName = document.getElementById("id_last_name").value.trim();
        const email = document.getElementById("id_email").value.trim();
        const phone = document.getElementById("id_phone").value.trim();
        const address = document.getElementById("id_address").value.trim();
        const password = document.getElementById("id_password").value.trim();

        // Basic validations
        if (!username || !firstName || !lastName || !email || !phone || !address || !password) {
            showErrorPopup("Please fill in all required fields.");
            return;
        }

        if (!validateEmail(email)) {
            showErrorPopup("Please enter a valid email address.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            showErrorPopup("Phone number must be 10 digits.");
            return;
        }

        if (password.length < 6) {
            showErrorPopup("Password must be at least 6 characters.");
            return;
        }

        // Show success popup and submit form
        showSuccessPopup();

        setTimeout(() => {
            form.submit();
        }, 1800);
    });

    // Email validation function
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    // Success popup
    function showSuccessPopup() {
        const popup = document.createElement("div");
        popup.className = "success-popup";
        popup.textContent = "Registration successful! Redirecting...";
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = "0";
            setTimeout(() => popup.remove(), 500);
        }, 1300);
    }

    // Error popup
    function showErrorPopup(message) {
        const existing = document.querySelector(".error-popup");
        if (existing) existing.remove();

        const popup = document.createElement("div");
        popup.className = "error-popup";
        popup.textContent = message;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = "0";
            setTimeout(() => popup.remove(), 500);
        }, 2000);
    }
});
