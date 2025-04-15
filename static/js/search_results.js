document.addEventListener("DOMContentLoaded", function () {
    const addToCartForms = document.querySelectorAll(".add-to-cart-form");

    addToCartForms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            showPopup("Item added to cart!");

            form.submit(); // Send via hidden iframe

            setTimeout(() => {
                window.location.reload(); // Ensure the Go to Cart button shows up
            }, 1500);
        });
    });

    // Wishlist add
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.dataset.productId;

            fetch(`/wishlist/add/${productId}/`, { method: "GET" })
                .then(res => res.json())
                .then(data => {
                    showWishlistPopup(data.message || "Added to wishlist!");
                })
                .catch(() => {
                    showWishlistPopup("Failed to add to wishlist.");
                });
        });
    });
});

// Cart popup
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

// Wishlist popup
function showWishlistPopup(message) {
    const popup = document.getElementById("wishlist-popup");
    popup.textContent = message;
    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
        popup.classList.add("hidden");
    }, 2500);
}
document.addEventListener("DOMContentLoaded", function () {
    const addToCartForms = document.querySelectorAll(".add-to-cart-form");
    const wishlistButtons = document.querySelectorAll(".wishlist-btn");
    const popup = document.getElementById("popup-message");
    const wishlistPopup = document.getElementById("wishlist-popup");

    function showPopup(element) {
        element.classList.add("show");
        setTimeout(() => {
            element.classList.remove("show");
        }, 2000);
    }

    addToCartForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const productId = form.dataset.productId;
            const card = document.getElementById(`product-${productId}`);

            showPopup(popup);

            // Submit to hidden iframe
            form.submit();

            // Replace Add to Cart button with Go to Cart button
            setTimeout(() => {
                form.outerHTML = `
                    <a href="/cart/?source=search" class="btn go-to-cart">Go to Cart</a>
                `;
            }, 800);
        });
    });

    wishlistButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.dataset.productId;

            // Submit to hidden iframe
            const form = document.createElement("form");
            form.method = "POST";
            form.action = `/wishlist/add/${productId}/`;
            form.target = "hidden_iframe";

            const csrfToken = document.querySelector("input[name='csrfmiddlewaretoken']").cloneNode();
            form.appendChild(csrfToken);
            document.body.appendChild(form);
            form.submit();
            form.remove();

            showPopup(wishlistPopup);
        });
    });
});
