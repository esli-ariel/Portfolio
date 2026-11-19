document.documentElement.classList.add('js');

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* Thème clair / sombre (mémorisé si possible) */
const root = document.documentElement;
const themeBtn = $('#theme-toggle');
function applyTheme(t) {
    root.dataset.theme = t;
    themeBtn.innerHTML = t === 'dark' ? '<i class="bx bx-sun"></i>' : '<i class="bx bx-moon"></i>';
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
applyTheme(saved || 'dark');
themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
});

/* Progression du défilement, bouton retour, frise */
const progress = $('#progress');
const timeline = $('#timeline');
const fill = $('#timeline-fill');
function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (timeline) {
        const r = timeline.getBoundingClientRect();
        const p = Math.min(Math.max((innerHeight * 0.6 - r.top) / r.height, 0), 1);
        fill.style.height = `${p * 100}%`;
    }
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* Lien actif */
const navLinks = $$('.navbar a');
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* Apparition au défilement (avec décalage en cascade) + compteurs */
function countUp(el) {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = now => {
        const k = Math.min((now - t0) / 1200, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        $$('.count', e.target).forEach(countUp);
        obs.unobserve(e.target);
    });
}, { threshold: 0.12 });
$$('.reveal').forEach((el, i) => {
    el.style.setProperty('--d', `${(i % 4) * 0.08}s`);
    io.observe(el);
});

/* Machine à écrire */
const roles = ['étudiante en Master 1 MBDS', 'développeuse web', 'passionnée de Big Data', 'curieuse d\'IA'];
const typed = $('#typed');
if (reduceMotion) {
    typed.textContent = roles[0];
} else {
    let r = 0, c = 0, del = false;
    (function tick() {
        const word = roles[r];
        typed.textContent = word.slice(0, c);
        let wait = del ? 35 : 80;
        if (!del && c === word.length) { del = true; wait = 1600; }
        else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
        else c += del ? -1 : 1;
        setTimeout(tick, wait);
    })();
}

/* Compétences : onglets */
const skills = {
    web: { icon: 'bx-code-alt', title: 'Développement web', text: 'Conception de sites et d\'applications web, du back-end à l\'interface.', tags: ['HTML', 'CSS', 'JavaScript', 'Laravel'] },
    ia: { icon: 'bx-brain', title: 'IA & données', text: 'Modèles de machine learning, analyse de données et reconnaissance.', tags: ['Python', 'Machine learning', 'Pandas'] },
    bigdata: { icon: 'bx-data', title: 'Big Data & systèmes', text: 'Analyse de données à grande échelle, architectures distribuées, cloud et administration des systèmes d\'information.', tags: ['Big Data', 'Cloud', 'Data Lake', 'DevOps'], learning: true },
    mobile: { icon: 'bx-mobile-alt', title: 'Applications mobiles & IoT', text: 'Conception d\'applications web et mobiles connectées, dans l\'esprit de la mobiquité.', tags: ['Mobile', 'IoT', 'API'], learning: true },
    robot: { icon: 'bx-bot', title: 'Robotique', text: 'Réalisation de mini-projets et de projets de taille moyenne en robotique.', tags: ['Électronique', 'Prototypage'] }
};
const panel = $('#skill-panel');
function showSkill(key) {
    const s = skills[key];
    $('#skill-icon').className = 'bx ' + s.icon;
    $('#skill-title').textContent = s.title;
    $('#skill-text').textContent = s.text;
    $('#skill-status').hidden = !s.learning;
    const ul = $('#skill-tags');
    ul.replaceChildren(...s.tags.map(t => Object.assign(document.createElement('li'), { textContent: t })));
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
}
$$('.node-skill').forEach(b => b.addEventListener('click', () => {
    $$('.node-skill').forEach(x => x.classList.toggle('active', x === b));
    showSkill(b.dataset.skill);
}));
showSkill('web');

/* À propos : réponse tapée dans la fenêtre */
const about = $('#about-typed');
if (about && !reduceMotion && 'IntersectionObserver' in window) {
    const full = about.textContent.trim();
    // Le texte complet reste invisible pour réserver la hauteur ; le texte tapé est superposé.
    const ghost = document.createElement('span');
    const live = document.createElement('span');
    ghost.textContent = full; ghost.style.visibility = 'hidden';
    ghost.style.gridArea = live.style.gridArea = '1 / 1';
    about.style.display = 'grid';
    about.replaceChildren(ghost, live);
    const aio = new IntersectionObserver(([e], obs) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        about.classList.add('typing-now');
        let i = 0;
        const t = setInterval(() => {
            live.textContent = full.slice(0, ++i);
            if (i >= full.length) { clearInterval(t); about.classList.remove('typing-now'); }
        }, 14);
    }, { threshold: 0.4 });
    aio.observe($('#about-window'));
}

/* Assistant de questions */
const answers = {
    formation: ['Quelle est sa formation ?', "Esli est en Master 1 Mobiquité, Big Data et Systèmes à l'ESATIC, en double diplomation avec l'Université Côte d'Azur. Elle a auparavant suivi une Licence en informatique, option génie logiciel."],
    projets: ['Quels projets a-t-elle réalisés ?', "Zéphyr (application web avec assistant IA), un système de reconnaissance faciale pour les présences, une détection de transactions frauduleuses et un assistant IA en dioula et baoulé, réalisé en équipe. Tout est sur son GitHub."],
    apprend: ['Que apprend-elle en ce moment ?', "En Master 1, elle se forme au Big Data, au cloud, au DevOps, aux applications mobiles et à l'IoT."],
    loisirs: ['Que fait-elle en dehors des cours ?', "De la pâtisserie et beaucoup de lecture. Elle aime apprendre de nouvelles choses."],
    contact: ['Comment la contacter ?', "Le plus simple : LinkedIn ou GitHub, avec les boutons de la section Contact. Son CV est aussi téléchargeable."]
};
const log = $('#chat-log');
const suggest = $$('#chat-suggest button');
function addMsg(kind, text) {
    const d = document.createElement('div');
    d.className = 'msg ' + kind;
    if (kind === 'bot') {
        const av = document.createElement('span'); av.className = 'av'; av.innerHTML = '<i class="bx bx-bot"></i>';
        d.append(av);
    }
    const p = document.createElement('p'); p.textContent = text; d.append(p);
    log.append(d); log.scrollTop = log.scrollHeight;
    return p;
}
suggest.forEach(btn => btn.addEventListener('click', () => {
    const [q, a] = answers[btn.dataset.q];
    suggest.forEach(b => b.disabled = true);
    addMsg('user', q);
    const p = addMsg('bot', '');
    p.innerHTML = '<span class="dots-typing"><b></b><b></b><b></b></span>';
    setTimeout(() => {
        if (reduceMotion) { p.textContent = a; suggest.forEach(b => b.disabled = false); return; }
        p.textContent = '';
        let i = 0;
        const t = setInterval(() => {
            p.textContent = a.slice(0, ++i); log.scrollTop = log.scrollHeight;
            if (i >= a.length) { clearInterval(t); suggest.forEach(b => b.disabled = false); }
        }, 16);
    }, 700);
}));

/* Filtre des projets */
$$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(x => x.classList.toggle('active', x === btn));
    const f = btn.dataset.filter;
    $$('#project-grid .card').forEach(card => {
        const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
        card.classList.toggle('hide', !show);
        if (show) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
    });
}));

if (finePointer && !reduceMotion) {
    /* Halo qui suit la souris */
    const glow = $('#cursor-glow');
    addEventListener('mousemove', e => {
        glow.style.opacity = 1;
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    /* Inclinaison 3D + reflet */
    $$('.tilt').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            el.style.setProperty('--mx', `${x * 100}%`);
            el.style.setProperty('--my', `${y * 100}%`);
            el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    /* Boutons magnétiques */
    $$('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

$('#year').textContent = new Date().getFullYear();
