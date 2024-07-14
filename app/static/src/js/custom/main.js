document.addEventListener('DOMContentLoaded', function () {

  (function ($) {
    "use strict";

    /* Aos animation on scroll */
    AOS.init({ once: true });

    /* Scroll to fixed navigation bar */
    $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
        $('.lh-header').addClass('header-fixed');
      } else {
        $('.lh-header').removeClass('header-fixed');
      }
    });

    /* Loader */
    $(window).on("load", function () {
      $(".lh-loader").fadeOut("slow");
    });

    // Mobile menu slider
    const menuButton = document.getElementById('menuButton');
    if (menuButton) {
      menuButton.addEventListener('click', function() {
        this.classList.toggle('menu-open');
        document.querySelector('.lh-sidebar-overlay').classList.toggle('lh-menu-open');
        document.querySelector('.lh-mobile-menu').classList.toggle('lh-menu-open');
        $('.lh-sidebar-overlay').fadeIn();
      });
    } else {
      console.error('Menu button element not found');
    }

    const sidebarOverlay = document.querySelector('.lh-sidebar-overlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', function() {
        this.classList.remove('lh-menu-open');
        document.querySelector('.lh-mobile-menu').classList.remove('lh-menu-open');
        document.getElementById('menuButton').classList.remove('menu-open');
        $('.lh-sidebar-overlay').fadeOut();
      });
    } else {
      console.error('Sidebar overlay element not found');
    }

    const closeButton = document.querySelector('.lh-close');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        document.querySelector('.lh-sidebar-overlay').classList.remove('lh-menu-open');
        document.querySelector('.lh-mobile-menu').classList.remove('lh-menu-open');
        document.getElementById('menuButton').classList.remove('menu-open');
        $('.lh-sidebar-overlay').fadeOut();
      });
    } else {
      console.error('Close button element not found');
    }

    /* Zoom Hero image */
    document.addEventListener("scroll", function() {
      const heroImage = document.querySelector(".hero-image");
      if (heroImage) {
        const scrollPosition = window.scrollY;
        const maxZoom = 1.5;
        const zoomFactor = scrollPosition / (document.body.scrollHeight - window.innerHeight) * (maxZoom - 1) + 1;
        heroImage.style.transform = `scale(${zoomFactor})`;
      } else {
        console.error('Hero image element not found');
      }
    });

    /* Responsive Mobile Menu */
    function ResponsiveMobileMenu() {
      var $msNav = $(".lh-menu-content"),
          $msNavSubMenu = $msNav.find(".sub-menu");
      $msNavSubMenu.parent().prepend('<span class="menu-toggle"></span>');

      $msNav.on("click", "li a, .menu-toggle", function (e) {
        var $this = $(this);
        if ($this.attr("href") === "#" || $this.hasClass("menu-toggle")) {
          e.preventDefault();
          if ($this.siblings("ul:visible").length) {
            $this.parent("li").removeClass("active");
            $this.siblings("ul").slideUp();
            $this.parent("li").find("li").removeClass("active");
            $this.parent("li").find("ul:visible").slideUp();
          } else {
            $this.parent("li").addClass("active");
            $this.closest("li").siblings("li").removeClass("active").find("li").removeClass("active");
            $this.closest("li").siblings("li").find("ul:visible").slideUp();
            $this.siblings("ul").slideDown();
          }
        }
      });
    }
    ResponsiveMobileMenu();

    /* Gallery */
    $(document).ready(function () {
      $('.gallery-img').magnificPopup({
        type: 'image',
        mainClass: 'mfp-with-zoom',
        gallery: { enabled: true },
        zoom: {
          enabled: true,
          duration: 300,
          easing: 'ease-close-tool',
          opener: function (openerElement) { return openerElement.is('img') ? openerElement : openerElement.find('img'); }
        }
      });
    });

    /* Story */
    $(document).ready(function() {
      $('.unique-popup-image').magnificPopup({
        delegate: 'a', // child item selector, by clicking on it popup will open
        type: 'image',
        gallery: {
          enabled: true // set to true to enable gallery mode
        }
      });
    });

    /* Copyright year */
    var date = new Date().getFullYear();
    const copyrightYear = document.getElementById("copyright_year");
    if (copyrightYear) {
      copyrightYear.innerHTML = date;
    } else {
      console.error('Copyright year element not found');
    }

    /* For Directly Run */
    $(window).on("load", function () {
      setTimeout(function () {
        switch (window.location.protocol) {
          case 'file:':
            console.log(
              '%c🚫 Please try to run using local server instead of Directly click or run for better experience. 🔥',
              'font-size: 20px; background-color: black; color:white; margin-left: 15px; padding: 15px'
            );
            break;
          default:
        }
      }, 100);
    });

  })(jQuery);

  /* Tap to top */
  window.addEventListener('scroll', function() {
    const tapToTop = document.getElementById('tapToTop');
    if (tapToTop) {
      if (window.scrollY > 50) {
        tapToTop.classList.remove('hidden');
      } else {
        tapToTop.classList.add('hidden');
      }
    } else {
      console.error('Tap to top button element not found');
    }
  });

  // Gallery
  const tabs = document.querySelectorAll('[data-tab-target]');
  const tabContents = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = document.querySelector(tab.dataset.tabTarget);
      tabContents.forEach(tc => {
        tc.classList.remove('active', 'show');
        tc.classList.add('fade');
      });
      target.classList.add('active', 'show');

      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
    });
  });
});
