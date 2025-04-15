document.addEventListener("DOMContentLoaded", function () {
    function showPopup(message) {
        let popup = document.getElementById("popup-message");
        popup.innerText = message;
        popup.style.display = "block";
        setTimeout(() => {
            popup.style.display = "none";
        }, 3000);
    }

    // Handle increment/decrement
    document.querySelectorAll(".quantity-wrapper").forEach(wrapper => {
        const productId = wrapper.getAttribute("data-product-id");
        const minusBtn = wrapper.querySelector(".minus");
        const plusBtn = wrapper.querySelector(".plus");
        const qtyDisplay = wrapper.querySelector(".qty-display");

        minusBtn.addEventListener("click", () => {
            let quantity = parseInt(qtyDisplay.innerText);
            if (quantity > 1) {
                quantity -= 1;
                updateQuantity(productId, quantity, qtyDisplay);
            }
        });

        plusBtn.addEventListener("click", () => {
            let quantity = parseInt(qtyDisplay.innerText);
            quantity += 1;
            updateQuantity(productId, quantity, qtyDisplay);
        });
    });

    function updateQuantity(productId, quantity, qtyDisplay) {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch(`/update-cart/${productId}/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
            },
            body: new URLSearchParams({ quantity: quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                qtyDisplay.innerText = quantity;
                showPopup("Cart updated!");
                setTimeout(() => location.reload(), 300);
            } else {
                showPopup("Failed to update cart!");
            }
        })
        .catch(error => {
            console.log(error);
            showPopup("Error updating cart.");
        });
    }

    // Remove Button
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            let url = this.href;
            fetch(url, { method: "GET" })
                .then(response => {
                    if (response.ok) {
                        this.closest("tr").remove();
                        showPopup("Item removed from cart!");
                        setTimeout(() => location.reload(), 1000);
                    }
                })
                .catch(error => console.log(error));
        });
    });

    // Checkout Button
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            showPopup("Proceeding to checkout...");
            setTimeout(() => {
                window.location.href = this.href;
            }, 1000);
        });
    }
});
