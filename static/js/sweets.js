document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            // Show popup notification
            showPopup("Item added to cart! 🛒");

            // Submit the form using a hidden iframe
            const form = this.closest("form");

            // Submit and reload the page after a delay
            setTimeout(() => {
                form.submit();

                // Reload the page after form submission
                setTimeout(() => {
                    window.location.reload();
                }, 500); // Give iframe time to submit before reloading
            }, 800);
        });
    });

    // Wishlist functionality (still using fetch/json)
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.dataset.productId;

            fetch(`/wishlist/add/${productId}/`, { method: "GET" })
                .then(response => response.json())
                .then(data => {
                    showWishlistPopup(data.message || "Added to wishlist ❤️");
                })
                .catch(() => {
                    showWishlistPopup("Failed to add to wishlist.");
                });
        });
    });
});

// Popup function for cart
function showPopup(message) {
    const popup = document.getElementById("popup-message");
    popup.textContent = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}

// Popup function for wishlist
function showWishlistPopup(message) {
    const popup = document.getElementById("wishlist-popup");
    popup.textContent = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}
