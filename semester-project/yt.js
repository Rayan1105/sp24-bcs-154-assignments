
console.log("FINALLY BHAI YEH KAAM KARRAHA");
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    console.log("Menu is now active:", navMenu.classList.contains('active'));
});


const navLinks = document.querySelectorAll('.right-section a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});