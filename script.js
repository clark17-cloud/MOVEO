
/* =========================================
   MOVEO | INTERACTIVE WEBSITE
========================================= */

const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;

/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');

menuButton?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');

    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute(
        'aria-label',
        open ? 'Close menu' : 'Open menu'
    );
    menuButton.textContent = open ? '✕' : '☰';
});

navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '☰';
    });
});

/* =========================================
   2. SCROLL REVEAL ANIMATIONS
========================================= */

const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('visible'));
} else {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(el => observer.observe(el));
}

/* =========================================
   3. INTERACTIVE FITNESS DASHBOARD
========================================= */

const paths = {
    walking:
        'M0 140 L35 131 L70 145 L105 120 L140 129 ' +
        'L175 114 L210 132 L245 124 L280 109 ' +
        'L315 119 L350 130 L385 111 L420 124 ' +
        'L455 104 L490 113 L525 119 L560 100 ' +
        'L595 115 L630 108 L665 94 L700 106 ' +
        'L735 91 L770 104 L805 87 L840 99 ' +
        'L875 85 L900 91',

    running:
        'M0 170 L35 145 L70 154 L105 116 L140 135 ' +
        'L175 104 L210 121 L245 88 L280 112 ' +
        'L315 79 L350 100 L385 74 L420 98 ' +
        'L455 67 L490 90 L525 60 L560 84 ' +
        'L595 54 L630 78 L665 48 L700 72 ' +
        'L735 42 L770 62 L805 35 L840 58 ' +
        'L875 28 L900 43'
};

let running = false;
let graphFrame = null;

const chart = document.querySelector('#chart-line');
const glow = document.querySelector('#chart-glow');
const fill = document.querySelector('#chart-fill');
const dot = document.querySelector('#chart-dot');

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
}

function updateChart() {
    if (!chart || !glow || !fill || !dot) return;

    if (graphFrame !== null) {
        cancelAnimationFrame(graphFrame);
    }

    graphFrame = null;

    const path = running ? paths.running : paths.walking;

    chart.setAttribute('d', path);
    glow.setAttribute('d', path);
    fill.setAttribute('d', `${path} L900 220 L0 220 Z`);

    const length = chart.getTotalLength();

    if (reduceMotion) {
        chart.style.strokeDasharray = 'none';
        glow.style.strokeDasharray = 'none';

        const end = chart.getPointAtLength(length);
        dot.setAttribute('cx', end.x);
        dot.setAttribute('cy', end.y);
        dot.style.opacity = '1';
        return;
    }

    [chart, glow].forEach(line => {
        line.style.strokeDasharray = String(length);
        line.style.strokeDashoffset = String(length);
    });

    dot.style.opacity = '0';

    const duration = 2600;
    const start = performance.now();

    function frame(now) {
        const progress = Math.min(
            (now - start) / duration,
            1
        );

        const eased = 1 - Math.pow(1 - progress, 3);

        [chart, glow].forEach(line => {
            line.style.strokeDashoffset =
                String(length * (1 - eased));
        });

        const point = chart.getPointAtLength(length * eased);

        dot.setAttribute('cx', point.x);
        dot.setAttribute('cy', point.y);
        dot.style.opacity = '1';

        if (progress < 1) {
            graphFrame = requestAnimationFrame(frame);
        } else {
            graphFrame = null;
        }
    }

    graphFrame = requestAnimationFrame(frame);
}

function updateDashboard() {
    const distance = document.querySelector('#distance');
    const pace = document.querySelector('#pace');
    const duration = document.querySelector('#duration');

    if (distance) {
        distance.innerHTML = running
            ? '5.0 <em>km</em>'
            : '3.2 <em>km</em>';
    }

    if (pace) {
        pace.innerHTML = running
            ? '6:24 <em>/km</em>'
            : '8:45 <em>/km</em>';
    }

    if (duration) {
        duration.innerHTML = running
            ? '32 <em>min</em>'
            : '28 <em>min</em>';
    }

    setText('#chart-distance', running ? '5.0 km' : '3.2 km');
    setText('#activity-type', running ? 'Running' : 'Walking');
    setText('#demo-label',
        running ? 'Showing running sample' : 'Showing walking sample'
    );
    setText('#demo-toggle',
        running ? 'Switch to walking ↗' : 'Switch to running ↗'
    );

    updateChart();
}

document.querySelector('#demo-toggle')?.addEventListener(
    'click',
    () => {
        running = !running;
        updateDashboard();
    }
);

/* Start graph animation when visible */

const chartContainer = document.querySelector('#activity-chart');

if (
    chartContainer &&
    'IntersectionObserver' in window &&
    !reduceMotion
) {
    const chartObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
            updateChart();
            chartObserver.disconnect();
        }
    }, { threshold: 0.2 });

    chartObserver.observe(chartContainer);
} else {
    updateChart();
}

/* =========================================
   4. CONTACT FORM
========================================= */

const contactForm = document.querySelector('#contact-form');

contactForm?.addEventListener('submit', event => {
    event.preventDefault();

    const feedback = contactForm.querySelector('.form-feedback');

    if (feedback) {
        feedback.textContent =
            'This is a demo form. No message was sent. ' +
            'Connect a backend to receive inquiries.';
    }
});


/* =========================================
   5. MOVEO BACKGROUND MUSIC
========================================= */

const music = document.getElementById('background-music');
const musicButton = document.getElementById('music-toggle');

if (music && musicButton) {

    const musicLabel = musicButton.querySelector('span');

    // Background music volume: 25%
    music.volume = 0.25;

    // Repeat music continuously
    music.loop = true;

    function updateMusicButton() {
        const isPlaying = !music.paused;

        if (musicLabel) {
            musicLabel.textContent = isPlaying
                ? 'Music on'
                : 'Music off';
        }

        musicButton.setAttribute(
            'aria-pressed',
            String(isPlaying)
        );

        musicButton.setAttribute(
            'aria-label',
            isPlaying
                ? 'Pause background music'
                : 'Play background music'
        );
    }

    musicButton.addEventListener('click', async () => {

        if (music.paused) {
            try {
                await music.play();
            } catch (error) {
                console.error(
                    'Unable to play background music:',
                    error
                );
            }
        } else {
            music.pause();
        }

        updateMusicButton();
    });

    music.addEventListener('play', updateMusicButton);
    music.addEventListener('pause', updateMusicButton);

    updateMusicButton();
}


/* =========================================
   6. SMALL MOVEO ANIMATED ARROW CURSOR
========================================= */

const arrowCursor = document.querySelector('#running-cursor');

if (
    arrowCursor &&
    !reduceMotion &&
    window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    ).matches
) {
    let mouseX = -100;
    let mouseY = -100;

    let cursorX = -100;
    let cursorY = -100;

    document.addEventListener('pointermove', event => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        arrowCursor.style.opacity = '1';
    });

    document.addEventListener('pointerout', event => {
        if (!event.relatedTarget) {
            arrowCursor.style.opacity = '0';
        }
    });

    function moveArrow() {
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;

        arrowCursor.style.transform =
            `translate3d(${cursorX + 8}px, ${cursorY + 8}px, 0)`;

        requestAnimationFrame(moveArrow);
    }

    requestAnimationFrame(moveArrow);
}

/* =========================================
   MOVEO INTRO CONTROLLER
========================================= */

const moveoIntro = document.getElementById("moveo-intro");

if (moveoIntro) {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        moveoIntro.remove();
    } else {
        moveoIntro.addEventListener(
            "animationend",
            function (event) {
                if (event.target === moveoIntro &&
                    event.animationName === "introExit") {
                    moveoIntro.remove();
                }
            }
        );
    }
}
