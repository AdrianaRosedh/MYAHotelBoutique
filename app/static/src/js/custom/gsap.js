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
                xPercent: 100 * i,
                scale: i === 0 ? 1 : 0.8,
                opacity: i === 0 ? 1 : 0.8,
                zIndex: i === 0 ? 100 : 50,
                willChange: 'transform, opacity'
            });
        });
    }

    function updateCardsLayout() {
        cards.forEach((card, i) => {
            gsap.to(card, {
                xPercent: 100 * (i - currentIndex),
                duration: 0.5,
                ease: "power3",
                scale: i === currentIndex ? 1 : 0.8,
                opacity: i === currentIndex ? 1 : 0.8,
                zIndex: i === currentIndex ? 100 : 50
            });
        });
    }

    function scrollToCard(index) {
        currentIndex = index;
        gsap.to(window, {
            scrollTo: { y: cards[index].offsetTop },
            duration: 1,
            ease: "power1.inOut"
        });
        updateCardsLayout();
    }

    initializeCards();

    const seamlessLoop = gsap.timeline({
        paused: true,
        repeat: -1,
        onRepeat() {
            this._time === this._dur && (this._tTime += this._dur - 0.01);
        }
    });

    gsap.to(seamlessLoop, {
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
        pinSpacing: false,
        snap: {
            snapTo: (value) => Math.round(value * (totalCards - 1)) / (totalCards - 1),
            duration: 0.5,
            ease: "power1.inOut"
        },
        onUpdate(self) {
            seamlessLoop.vars.totalTime = self.progress * seamlessLoop.duration();
            seamlessLoop.invalidate().restart();
        }
    });

    window.addEventListener('resize', debounce(updateCardsLayout, 100));

    const hammer = new Hammer(document.querySelector('.section-restaurant'));
    hammer.on('swipeleft', () => {
        scrollToCard((currentIndex + 1) % totalCards);
    });

    hammer.on('swiperight', () => {
        scrollToCard((currentIndex - 1 + totalCards) % totalCards);
    });

    ScrollTrigger.create({
        trigger: ".cards li:nth-child(1)",
        start: "center top",
        end: "top top",
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

    updateCardsLayout();

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
