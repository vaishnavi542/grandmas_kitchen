document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
    const usernameField = document.getElementById("id_username");
    const passwordField = document.getElementById("id_password");

    // Field validation on form submit
    form.addEventListener("submit", function (event) {
        const username = usernameField.value.trim();
        const password = passwordField.value.trim();

        if (username === "" || password === "") {
            event.preventDefault();  // Prevent form submission
            alert("Please fill in all fields.");
        }
        // Else, form submits normally; Django handles login validation
    });

    // Show/Hide Password Toggle
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "toggle-password";
    toggleBtn.innerText = "👁";
    passwordField.parentNode.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            toggleBtn.innerText = "🙈";
        } else {
            passwordField.type = "password";
            toggleBtn.innerText = "👁";
        }
    });

    // OPTIONAL: Animate Django success message (if any)
    const djangoMessages = document.querySelectorAll(".message.success");
    if (djangoMessages.length > 0) {
        const popup = document.createElement("div");
        popup.className = "success-popup";
        popup.innerText = djangoMessages[0].innerText;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = "0";
            setTimeout(() => popup.remove(), 500);
        }, 2000);
    }
});
