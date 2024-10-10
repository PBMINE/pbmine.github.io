window.addEventListener('load', () => {
    // Elements to animate on load (staggered fade-in)
    const fadeElements = document.querySelectorAll('.fade-in');

    // Add 'show' class after a slight delay for load animations
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('show');
        }, index * 300); // Delay for each element (staggered effect)
    });

    // Elements to animate on scroll (fade-in on scroll)
    const scrollElements = document.querySelectorAll(".header-content h1, .header-content p, .cta-button");

    // Function to check if an element is in the viewport
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    // Function to add class 'show' when an element is in view
    const displayScrollElement = (element) => {
        element.classList.add('show');
    };

    // Function to handle scrolling animation
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    // Listen to the scroll event and run the animation handler
    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });
});
