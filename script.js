
/* =========================================
   1. MOBILE NAVIGATION MENU
========================================= */

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Open and close the mobile menu
menuButton?.addEventListener('click', () => {

    const open = navLinks.classList.toggle('open');

    menuButton.setAttribute('aria-expanded', String(open));

    menuButton.textContent = open ? '✕' : '☰';

});

// Close the menu when a navigation link is clicked
navLinks?.querySelectorAll('a').forEach(a => {

    a.addEventListener('click', () => {

        navLinks.classList.remove('open');

        menuButton.setAttribute('aria-expanded', 'false');

        menuButton.textContent = '☰';

    });

});


/* =========================================
   2. REDUCED MOTION SETTINGS
========================================= */

const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;


/* =========================================
   3. SCROLL REVEAL ANIMATIONS
========================================= */

if (!reducedMotion && 'IntersectionObserver' in window) {

    const observer = new IntersectionObserver(

        entries => entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('visible');

                observer.unobserve(entry.target);

            }

        }),

        {
            threshold: .08
        }

    );

    document.querySelectorAll(
        '.section h2, .section-description, .card, .team-member, .dashboard, .contact-form'
    ).forEach(el => {

        el.classList.add('reveal');

        observer.observe(el);

    });

}


/* =========================================
   4. INTERACTIVE 3D HOVER EFFECT
========================================= */

if (
    !reducedMotion &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
) {

    document.querySelectorAll('.tilt').forEach(el => {

        // Rotate element based on mouse position
        el.addEventListener('pointermove', e => {

            const r = el.getBoundingClientRect();

            const x = (e.clientX - r.left) / r.width - .5;

            const y = (e.clientY - r.top) / r.height - .5;

            el.style.transform = `
                perspective(900px)
                rotateY(${x * 6}deg)
                rotateX(${-y * 6}deg)
                translateY(-3px)
            `;

        });

        // Reset element when mouse leaves
        el.addEventListener('pointerleave', () => {

            el.style.transform = '';

        });

    });

}


/* =========================================
   5. INTERACTIVE FITNESS DASHBOARD
========================================= */

let running = false;

document.querySelector('#demo-toggle')?.addEventListener('click', () => {

    // Switch between walking and running
    running = !running;

    // Update distance
    document.querySelector('#distance').innerHTML = running
        ? '5.0 <em>km</em>'
        : '3.2 <em>km</em>';

    // Update duration
    document.querySelector('#duration').innerHTML = running
        ? '32 <em>min</em>'
        : '28 <em>min</em>';

    // Update pace
    document.querySelector('#pace').innerHTML = running
        ? '6:24 <em>/km</em>'
        : '8:45 <em>/km</em>';

    // Update dashboard description
    document.querySelector('#demo-label').textContent = running
        ? 'Showing running pace'
        : 'Showing walking pace';

    // Update button text
    document.querySelector('#demo-toggle').textContent = running
        ? 'Switch to walking'
        : 'Switch to running';

});


/* =========================================
   6. CONTACT FORM
========================================= */

document.querySelector('#contact-form')?.addEventListener('submit', e => {

    // Prevent the form from refreshing the page
    e.preventDefault();

    // Display demo message
    document.querySelector('.form-feedback').textContent =
        'This is a demo form. No message was sent. Please connect a backend to enable inquiries.';

});
/* Interactive hero glow */

const hero = document.querySelector(".hero");
const heroGlow = document.querySelector(".hero-glow");

if (
    hero &&
    heroGlow &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches
) {
    hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        heroGlow.style.marginLeft = `${x * 35}px`;
        heroGlow.style.marginTop = `${y * 35}px`;
    });

    hero.addEventListener("pointerleave", () => {
        heroGlow.style.marginLeft = "0px";
        heroGlow.style.marginTop = "0px";
    });
}

/* =========================================
   MOVEO ANIMATED GRAPH
========================================= */

const activityChart = document.querySelector("#activity-chart");
const chartLine = document.querySelector("#chart-line");
const chartGlow = document.querySelector("#chart-glow");
const chartFill = document.querySelector("#chart-fill");
const chartDot = document.querySelector("#chart-dot");


/* Realistic sample pace patterns */

const walkingPath =
    "M0 125 " +
    "L35 120 L70 127 L105 115 L140 118 " +
    "L175 110 L210 122 L245 117 L280 105 " +
    "L315 112 L350 120 L385 109 L420 115 " +
    "L455 100 L490 108 L525 113 L560 105 " +
    "L595 115 L630 110 L665 100 L700 108 " +
    "L735 95 L770 105 L805 98 L840 100 " +
    "L875 92 L900 95";

const runningPath =
    "M0 145 " +
    "L35 130 L70 115 L105 105 L140 110 " +
    "L175 95 L210 102 L245 90 L280 100 " +
    "L315 85 L350 95 L385 78 L420 90 " +
    "L455 75 L490 85 L525 70 L560 82 " +
    "L595 68 L630 80 L665 65 L700 75 " +
    "L735 60 L770 72 L805 58 L840 65 " +
    "L875 55 L900 60";


let graphFrame = null;

const graphReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function animateActivityChart(mode = "walking") {

    if (!activityChart || !chartLine || !chartGlow ||
        !chartFill || !chartDot) {
        return;
    }

    if (graphFrame !== null) {
        cancelAnimationFrame(graphFrame);
        graphFrame = null;
    }

    const path = mode === "running" ? runningPath : walkingPath;

    chartLine.setAttribute("d", path);
    chartGlow.setAttribute("d", path);
   chartFill.setAttribute("d", path + " L900 220 L0 220 Z");

    const length = chartLine.getTotalLength();

    [chartLine, chartGlow].forEach(element => {
        element.classList.remove("animate");
        element.style.strokeDasharray = length;
        element.style.strokeDashoffset = length;
    });

    chartFill.classList.remove("animate");
    chartFill.style.opacity = "";
    chartDot.style.opacity = "0";

    if (graphReducedMotion) {
        chartLine.style.strokeDashoffset = "0";
        chartGlow.style.strokeDashoffset = "0";
        chartFill.style.opacity = "1";

        const endPoint = chartLine.getPointAtLength(length);
        chartDot.setAttribute("cx", endPoint.x);
        chartDot.setAttribute("cy", endPoint.y);
        chartDot.style.opacity = "1";
        return;
    }

    void chartLine.getBoundingClientRect();

    chartLine.classList.add("animate");
    chartGlow.classList.add("animate");
    chartFill.classList.add("animate");

    const duration = 3000;
    const start = performance.now();

    function moveDot(now) {

        const progress = Math.min((now - start) / duration, 1);

        const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const point = chartLine.getPointAtLength(length * eased);

        chartDot.setAttribute("cx", point.x);
        chartDot.setAttribute("cy", point.y);
        chartDot.style.opacity = "1";

        if (progress < 1) {
            graphFrame = requestAnimationFrame(moveDot);
        } else {
            graphFrame = null;
        }
    }

    graphFrame = requestAnimationFrame(moveDot);
}

/* Animate when the graph enters the screen */

if (activityChart && "IntersectionObserver" in window) {

    const graphObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                animateActivityChart("walking");
                graphObserver.unobserve(entry.target);
            }

        });

    }, { threshold: 0.3 });

    graphObserver.observe(activityChart);

} else if (activityChart) {
    animateActivityChart("walking");
}

/* Replay animation when switching activity */

document.querySelector("#demo-toggle")?.addEventListener(
    "click",
    () => {

        const label = document.querySelector("#demo-label");
        const mode = label?.textContent.includes("running")
            ? "running"
            : "walking";

        animateActivityChart(mode);
    }
);

/* =========================================
   MOVEO BACKGROUND MUSIC
========================================= */

const backgroundMusic = document.querySelector(
    "#background-music"
);

const musicToggle = document.querySelector(
    "#music-toggle"
);

if (backgroundMusic && musicToggle) {

    backgroundMusic.volume = 0.25;

    musicToggle.addEventListener("click", async () => {

        if (backgroundMusic.paused) {

            try {
                await backgroundMusic.play();

                musicToggle.textContent = "♫ Pause Music";
                musicToggle.setAttribute(
                    "aria-label",
                    "Pause background music"
                );
                musicToggle.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } catch (error) {
                console.error(
                    "Background music could not play:",
                    error
                );
            }

        } else {

            backgroundMusic.pause();

            musicToggle.textContent = "♫ Play Music";
            musicToggle.setAttribute(
                "aria-label",
                "Play background music"
            );
            musicToggle.setAttribute(
                "aria-pressed",
                "false"
            );
        }

    });
}



/* MOVEO ASSISTIVE ARROW CURSOR */

const arrowCursor = document.getElementById("running-cursor");

if (arrowCursor) {

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        arrowCursor.style.opacity = "1";
    });

    document.addEventListener("mouseout", (event) => {
        if (!event.relatedTarget) {
            arrowCursor.style.opacity = "0";
        }
    });

    function moveArrowCursor() {
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;

        arrowCursor.style.transform =
            `translate3d(${cursorX + 15}px, ${cursorY + 15}px, 0)`;

        requestAnimationFrame(moveArrowCursor);
    }

    moveArrowCursor();
}
