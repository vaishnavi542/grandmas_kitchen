// 🎬 Play video overlay once per session
window.addEventListener("load", () => {
    const introVideo = document.getElementById("introVideo");
    const videoOverlay = document.getElementById("video-overlay");

    if (introVideo && !sessionStorage.getItem("introPlayed")) {
        introVideo.play();

        const hideOverlay = () => {
            videoOverlay.classList.add("hide");
            setTimeout(() => {
                videoOverlay.style.display = "none";
                sessionStorage.setItem("introPlayed", "true");
            }, 1000);
        };

        introVideo.addEventListener("ended", hideOverlay);
        setTimeout(hideOverlay, 10000); // fallback
    } else if (videoOverlay) {
        videoOverlay.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 🍔 Navbar toggle
    const menuToggle = document.querySelector(".menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            document.querySelector(".nav-links").classList.toggle("active");
        });
    }

    // 💫 Slide-In Animations for food images and feature cards
    const foodImages = document.querySelectorAll(".food-image");
    const slideElements = document.querySelectorAll(".animate-slide");
    const floatingFoods = document.querySelectorAll(".floating-food");
    const phoneContainer = document.querySelector(".phone-container");

    const isInView = (el, offset = 50) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight - offset;
    };

    const checkSlideIn = () => {
        // Slide-in for homepage food images
        foodImages.forEach(img => {
            if (isInView(img)) {
                img.classList.add("visible");
            }
        });

        // Slide-in for animate-slide elements (feature cards)
        slideElements.forEach(card => {
            if (isInView(card)) {
                card.classList.add("visible");
            }
        });

        // Floating food animation
        floatingFoods.forEach(img => {
            if (isInView(img, 0)) {
                img.classList.add("animate");
            }
        });

        // Phone visibility
        if (phoneContainer && isInView(phoneContainer, 0)) {
            phoneContainer.classList.add("visible");
        }
    };

    // Run on load and scroll
    checkSlideIn();
    window.addEventListener("scroll", checkSlideIn);
});
