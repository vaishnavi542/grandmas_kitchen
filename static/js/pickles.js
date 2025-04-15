document.addEventListener("DOMContentLoaded", function () {
    const addToCartForms = document.querySelectorAll(".add-to-cart-form");

    addToCartForms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // prevent default redirect

            showPopup("Item added to cart!");

            // Submit the form to hidden iframe
            form.submit();

            // Wait then reload the page
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    });

    // Wishlist functionality
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.dataset.productId;

            fetch(`/wishlist/add/${productId}/`, { method: "GET" })
                .then(response => response.json())
                .then(data => {
                    showWishlistPopup(data.message);
                })
                .catch(error => console.error("Wishlist error:", error));
        });
    });

    // Category button navigation (optional)
    document.querySelectorAll(".nav-btn").forEach(button => {
        button.addEventListener("click", () => {
            const url = button.getAttribute("data-url");
            window.location.href = url;
        });
    });
});

// Show "Add to Cart" popup
function showPopup(message) {
    const popup = document.getElementById("popup-message");
    popup.textContent = message;
    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
        popup.classList.add("hidden");
    }, 1500);
}

// Show wishlist popup
function showWishlistPopup(message) {
    const popup = document.querySelector('.wishlist-popup');
    popup.textContent = message;
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}
