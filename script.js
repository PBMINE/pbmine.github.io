// Select the button
const ctaButton = document.getElementById("cta-button");

// Add a click event listener to the button
ctaButton.addEventListener("click", () => {
    // Change the button text
    ctaButton.textContent = "Loading...";

    // Simulate a delay to show a "loading" effect
    setTimeout(() => {
        ctaButton.textContent = "Welcome!";
        // Dynamically change the hero message
        const heroContent = document.querySelector(".hero-content");
        heroContent.innerHTML = `
            <h1>You're all set!</h1>
            <p>Thank you for joining PBMINE. Start exploring now.</p>
        `;
    }, 2000); // Delay of 2 seconds
});

// Navbar hover effects
const navbarLinks = document.querySelectorAll(".navbar a");

navbarLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
        link.style.color = "#58a6ff";
    });
    link.addEventListener("mouseleave", () => {
        link.style.color = "#ffffff";
    });
});
