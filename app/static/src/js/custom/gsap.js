// Temporarily disable ScrollTrigger to debug
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const cards = gsap.utils.toArray('.cards li');
    const totalCards = cards.length;
    let currentIndex = 0;

    function initializeCards() {
        cards.forEach((card, i) => {
            gsap.set(card, {
                xPercent: 100 * (i - currentIndex),
                scale: 0.8,
                opacity: i < 2 ? 0 : 0.8,
                zIndex: 50
            });
        });

        gsap.set(".fade-out-on-scroll", { opacity: 1 });
    }

    function updateCardsLayout() {
        cards.forEach((card, i) => {
            gsap.to(card, {
                xPercent: 100 * (i - currentIndex),
                duration: 0.5,
                ease: "power3",
                scale: i === currentIndex ? 1 : 0.8,
                opacity: i < 2 ? 0 : (i === currentIndex ? 1 : 0.8),
                zIndex: i === currentIndex ? 100 : 50
            });
        });
    }

    function scrollToCard(index) {
        currentIndex = index;
        updateCardsLayout();
    }

    const hammer = new Hammer(document.querySelector('.section-restaurant'));
    hammer.on('swipeleft', () => {
        scrollToCard(Math.min(currentIndex + 1, totalCards - 1));
    });

    hammer.on('swiperight', () => {
        scrollToCard(Math.max(currentIndex - 1, 0));
    });

    ScrollTrigger.create({
        trigger: ".section-restaurant",
        start: "top top",
        end: () => `+=${window.innerHeight * (totalCards - 1)}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
            const progressIndex = Math.round(self.progress * (totalCards - 1));
            if (progressIndex !== currentIndex) {
                scrollToCard(progressIndex);
            }
        }
    });

    ScrollTrigger.create({
        trigger: ".cards li:nth-child(1)",
        start: "bottom -40",
        end: "top 10",
        scrub: true,
        onEnter: () => {
            gsap.to(".fade-out-on-scroll", {
                opacity: 0,
                duration: 2
            });
        },
        onLeaveBack: () => {
            gsap.to(".fade-out-on-scroll", {
                opacity: 1,
                duration: 0.5
            });
        }
    });

    function handleResize() {
        if (window.innerWidth <= 768) {
            console.log('Mobile resize detected');
        }
    }

    window.addEventListener('resize', handleResize);

    initializeCards();
    updateCardsLayout();
    handleResize();
});
