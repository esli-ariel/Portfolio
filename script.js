document.documentElement.classList.add('js');

const header = document.getElementById('header');
const menuBtn = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.navbar a');
const sections = document.querySelectorAll('main section[id]');

// Menu mobile
function setMenu(open) {
    navbar.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
}
menuBtn.addEventListener('click', () => setMenu(!navbar.classList.contains('open')));
navLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));

// Ombre du header au défilement
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Lien actif selon la section visible
const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// Apparition progressive
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
} else {
    reveals.forEach(el => el.classList.add('visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();
