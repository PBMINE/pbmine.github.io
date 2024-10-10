window.addEventListener('load', () => {
    // Get all the elements that should be animated
    const fadeElements = document.querySelectorAll('.fade-in');

    // Add 'show' class after a slight delay
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('show');
        }, index * 300); // Delay for each element (e.g., staggered effect)
    });
});
