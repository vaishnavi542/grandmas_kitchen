document.addEventListener("DOMContentLoaded", function () {
    const addToCartForms = document.querySelectorAll("form[action*='add_to_cart']");
    const wishlistButtons = document.querySelectorAll(".wishlist-btn");

    // Create popup container if not exists
    let popupContainer = document.querySelector(".popup-container");
    if (!popupContainer) {
        popupContainer = document.createElement("div");
        popupContainer.className = "popup-container";
        document.body.appendChild(popupContainer);
    }

    // Show popup message
    function showPopup(message) {
        const popup = document.createElement("div");
        popup.className = "popup-msg";
        popup.innerText = message;

        popupContainer.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 2500);
    }

    // ADD TO CART FUNCTIONALITY
    addToCartForms.forEach(form => {
        const button = form.querySelector("button");
        button.addEventListener("click", function (event) {
            event.preventDefault();

            showPopup("Item added to cart! 🛒");

            // First submit the form to hidden iframe
            form.submit();

            // Then wait for backend to update cart before reload
            setTimeout(() => {
                location.reload(); // Reload after backend processes the add
            }, 2000); // Increased delay to ensure backend update is complete
        });
    });

    // ADD TO WISHLIST FUNCTIONALITY
    wishlistButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.dataset.productId;

            fetch(`/wishlist/add/${productId}/`, {
                method: "GET",
                headers: { "X-Requested-With": "XMLHttpRequest" }
            })
                .then(response => response.json())
                .then(data => {
                    showPopup(data.message || "Added to wishlist ❤️");
                })
                .catch(() => {
                    showPopup("Error adding to wishlist.");
                });
        });
    });
});
