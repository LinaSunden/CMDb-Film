document.addEventListener("DOMContentLoaded", function () {
    // Your code here
    function hambergmenuToggle() {
        const navs = document.querySelectorAll('.navigation');

        navs.forEach(nav => nav.classList.toggle('nav-toggle'));
    }

    document.querySelector('.hamburger').addEventListener('click', hambergmenuToggle);
});