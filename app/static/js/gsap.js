console.log("gsap.js loaded");

gsap.registerPlugin(ScrollTrigger);

const spacing = 0.1,
      cards = gsap.utils.toArray('.cards li'),
      totalCards = cards.length,
      totalDuration = totalCards * spacing;

// Set initial positions and visibility of the cards to create the carousel effect
function initializeCards() {
    cards.forEach((card, i) => {
        gsap.set(card, { 
            xPercent: (i - 1) * 100,
            scale: i === 0 ? 1 : 0.8,
            opacity: i === 0 ? 1 : 0.8,
            zIndex: i === 0 ? 100 : 50
        });
    });

    // Special handling for the first, last, and second cards
    gsap.set(cards[totalCards - 1], { 
        xPercent: -100,
        scale: 0.8,
        opacity: 0.8,
        zIndex: 50
    });

    gsap.set(cards[1], { 
        xPercent: 100,
        scale: 0.8,
        opacity: 0.8,
        zIndex: 50
    });
}

initializeCards();

const seamlessLoop = buildSeamlessLoop(cards, spacing);

const scrub = gsap.to(seamlessLoop, {
    totalTime: 0,
    duration: 0.5,
    ease: "power3",
    paused: true
});

ScrollTrigger.create({
    trigger: ".section-restaurant",
    start: "top top",
    end: `+=${totalDuration * 1000}`,
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    onEnter: () => {
        scrub.play();
    },
    onUpdate(self) {
        scrub.vars.totalTime = self.progress * seamlessLoop.duration();
        scrub.invalidate().restart();
    },
    onLeave: () => {
        gsap.to(window, { scrollTo: ".next-section", duration: 1 });
    }
});

function buildSeamlessLoop(items, spacing) {
    const overlap = Math.ceil(1 / spacing),
          loopTime = (items.length + overlap) * spacing,
          rawSequence = gsap.timeline({ paused: true }),
          seamlessLoop = gsap.timeline({
              paused: true,
              repeat: -1,
              onRepeat() {
                  this._time === this._dur && (this._tTime += this._dur - 0.01);
              }
          }),
          l = items.length + overlap * 2;
    let time = 0;

    gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

    for (let i = 0; i < l; i++) {
        const index = i % items.length,
              item = items[index];
        time = i * spacing;
        rawSequence.fromTo(item, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }, time)
                   .fromTo(item, { xPercent: 400 }, { xPercent: -400, duration: 1, ease: "none", immediateRender: false }, time);
    }

    rawSequence.time(0);
    seamlessLoop.to(rawSequence, {
        time: loopTime,
        duration: loopTime,
        ease: "none"
    });

    return seamlessLoop;
}

document.querySelector(".next").addEventListener("click", () => scrubTo(scrub.vars.totalTime + spacing));
document.querySelector(".prev").addEventListener("click", () => scrubTo(scrub.vars.totalTime - spacing));

function scrubTo(totalTime) {
    const progress = totalTime / seamlessLoop.duration();
    scrub.vars.totalTime = totalTime;
    scrub.invalidate().restart();
    gsap.to(window, { scrollTo: (progress * document.body.scrollHeight), duration: 0.5 });
}
