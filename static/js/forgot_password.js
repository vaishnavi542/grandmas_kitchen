document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");

  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const resetPasswordBtn = document.getElementById("resetPasswordBtn");

  const usernameOrEmail = document.getElementById("usernameOrEmail");
  const otpInput = document.getElementById("otpInput");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  const otpMessage = document.getElementById("otp-message");
  const verifyMessage = document.getElementById("verify-message");
  const resetMessage = document.getElementById("reset-message");

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  // Toast Notification
  const showToast = (msg, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Step 1: Send OTP
  sendOtpBtn?.addEventListener("click", () => {
    const identifier = usernameOrEmail.value.trim();
    if (!identifier) return showToast("Please enter a username or email", "error");

    otpMessage.innerHTML = `<span class="spinner"></span> Sending OTP...`;

    fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrfToken,
      },
      body: new URLSearchParams({
        action: "send_otp",
        identifier: identifier,
      }),
    })
      .then(res => res.text())
      .then(html => document.documentElement.innerHTML = html)
      .catch(() => showToast("Failed to send OTP", "error"));
  });

  // Step 2: Verify OTP
  verifyOtpBtn?.addEventListener("click", () => {
    const otp = otpInput.value.trim();
    const identifier = usernameOrEmail.value.trim();
    if (!otp) return showToast("Please enter the OTP", "error");

    verifyMessage.innerHTML = `<span class="spinner"></span> Verifying...`;

    fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrfToken,
      },
      body: new URLSearchParams({
        action: "verify_otp",
        otp: otp,
        identifier: identifier,
      }),
    })
      .then(res => res.text())
      .then(html => document.documentElement.innerHTML = html)
      .catch(() => showToast("OTP verification failed", "error"));
  });

  // Step 3: Reset Password
  resetPasswordBtn?.addEventListener("click", () => {
    const password = newPassword.value.trim();
    const confirm = confirmPassword.value.trim();
    const identifier = usernameOrEmail.value.trim();

    if (!password || !confirm) return showToast("Please fill both fields", "error");
    if (password !== confirm) return showToast("Passwords do not match", "error");

    resetMessage.innerHTML = `<span class="spinner"></span> Resetting...`;

    fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": csrfToken,
      },
      body: new URLSearchParams({
        action: "reset_password",
        new_password: password,
        confirm_password: confirm,
        identifier: identifier,
      }),
    })
      .then(res => res.text())
      .then(html => document.documentElement.innerHTML = html)
      .catch(() => showToast("Failed to reset password", "error"));
  });

  // Toggle Password Visibility
  function togglePassword(id, icon) {
    const input = document.getElementById(id);
    if (input.type === "password") {
      input.type = "text";
      icon.textContent = "🙈";
    } else {
      input.type = "password";
      icon.textContent = "👁️";
    }
  }

  // Setup Password Toggle Icons
  function setupPasswordToggles() {
    const toggles = document.querySelectorAll(".toggle-password");
    toggles.forEach(icon => {
      const inputId = icon.previousElementSibling.id;
      icon.addEventListener("click", () => togglePassword(inputId, icon));
    });
  }

  setupPasswordToggles();
});
