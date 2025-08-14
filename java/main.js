const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');

menuBtn.addEventListener('click', () => {
    menuOverlay.classList.toggle('open');
    menuBtn.classList.toggle('active'); // triggers animation
});
