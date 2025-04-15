document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');

    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    document.body.appendChild(popupContainer);

    function showPopup(message, type = 'success') {
        const popup = document.createElement('div');
        popup.classList.add('popup-msg', type === 'success' ? 'popup-success' : 'popup-error');
        popup.innerText = message;

        popupContainer.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 3000);
    }

    // ✅ Handle Add to Cart with hidden iframe
    cartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const form = this.closest('form');

            showPopup('Item added to cart! 🛒');

            setTimeout(() => {
                form.submit();  // submit to hidden iframe
                setTimeout(() => {
                    location.reload(); // auto reload to reflect Go to Cart
                }, 1000);
            }, 1000); // delay for popup
        });
    });

    // ✅ Wishlist AJAX
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.dataset.productId;

            fetch(`/wishlist/add/${productId}/`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(res => res.json())
            .then(data => {
                const message = data.message || 'Item added to wishlist!';
                showPopup(message, 'success');
            })
            .catch(() => {
                showPopup('Failed to add to wishlist.', 'error');
            });
        });
    });
});
