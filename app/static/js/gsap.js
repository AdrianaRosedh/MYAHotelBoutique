document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const spacing = 0.1,
        cards = gsap.utils.toArray('.cards li'),
        totalCards = cards.length,
        totalDuration = totalCards * spacing;

    let currentIndex = 0;

    function initializeCards() {
        cards.forEach((card, i) => {
            gsap.set(card, {
                xPercent: i * 100,
                scale: i === 0 ? 1 : 0.8,
                opacity: i === 0 ? 1 : 0.8,
                zIndex: i === 0 ? 100 : 50
            });
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
        snap: {
            snapTo: (value) => Math.round(value * (totalCards - 1)) / (totalCards - 1),
            duration: 0.5,
            ease: "power1.inOut"
        },
        onUpdate(self) {
            scrub.vars.totalTime = self.progress * seamlessLoop.duration();
            scrub.invalidate().restart();
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

    document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalCards;
        scrollToCard(currentIndex);
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        scrollToCard(currentIndex);
    });

    function scrollToCard(index) {
        const card = cards[index];
        gsap.to(window, {
            scrollTo: { y: card.offsetTop },
            duration: 1,
            ease: "power1.inOut"
        });
    }

    function updateCardsLayout() {
        if (window.matchMedia("(max-width: 767px)").matches) {
            cards.forEach((card, i) => {
                gsap.set(card, {
                    xPercent: i * 100,
                    scale: i === currentIndex ? 1 : 0.8,
                    opacity: i === currentIndex ? 1 : 0.8,
                    zIndex: i === currentIndex ? 100 : 50
                });
            });
        } else {
            cards.forEach((card, i) => {
                gsap.set(card, {
                    xPercent: i * 100,
                    scale: 1,
                    opacity: 1,
                    zIndex: 100
                });
            });
        }
    }

    updateCardsLayout();

    window.addEventListener('resize', updateCardsLayout);

    const hammer = new Hammer(document.querySelector('.section-restaurant'));
    hammer.on('swipeleft', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCardsLayout();
        scrollToCard(currentIndex);
    });

    hammer.on('swiperight', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCardsLayout();
        scrollToCard(currentIndex);
    });

    // Ensure fade-out only activates when a specific .cards li element is scrolled into view
    ScrollTrigger.create({
        trigger: ".cards li:nth-child(1)",
        start: "top 20%",
        end: "top 10%",
        scrub: true,
        onEnter: () => {
            gsap.to(".fade-out-on-scroll", {
                opacity: 0,
                duration: 0.5
            });
        },
        onLeaveBack: () => {
            gsap.to(".fade-out-on-scroll", {
                opacity: 1,
                duration: 0.5
            });
        }
    });
});
