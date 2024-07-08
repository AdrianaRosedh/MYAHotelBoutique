/* main.js */
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
document.getElementById('menuButton').addEventListener('click', function() {
  this.classList.toggle('menu-open');
  document.querySelector('.lh-sidebar-overlay').classList.toggle('lh-menu-open');
  document.querySelector('.lh-mobile-menu').classList.toggle('lh-menu-open');
  $('.lh-sidebar-overlay').fadeIn();
});

document.querySelector('.lh-sidebar-overlay').addEventListener('click', function() {
  this.classList.remove('lh-menu-open');
  document.querySelector('.lh-mobile-menu').classList.remove('lh-menu-open');
  document.getElementById('menuButton').classList.remove('menu-open');
  $('.lh-sidebar-overlay').fadeOut();
});

document.querySelector('.lh-close').addEventListener('click', function() {
  document.querySelector('.lh-sidebar-overlay').classList.remove('lh-menu-open');
  document.querySelector('.lh-mobile-menu').classList.remove('lh-menu-open');
  document.getElementById('menuButton').classList.remove('menu-open');
  $('.lh-sidebar-overlay').fadeOut();
});

  /* Zoom Hero image */
  document.addEventListener("scroll", function() {
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
      const scrollPosition = window.scrollY;
      const maxZoom = 1.5;
      const zoomFactor = scrollPosition / (document.body.scrollHeight - window.innerHeight) * (maxZoom - 1) + 1;
      heroImage.style.transform = `scale(${zoomFactor})`;
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

  /* Custom select */
  $(document).ready(function() {
    $('select.language-form').each(function () {
      var $this = $(this), selectOptions = $(this).children('option').length;
      $this.addClass('hide-select').wrap('<div class="select"></div>').after('<div class="custom-select active"></div>');
      var $customSelect = $this.next('div.custom-select.active');
      $customSelect.text($this.children('option:selected').text());
      var $optionlist = $('<ul />', { 'class': 'select-options' }).insertAfter($customSelect);
      for (var i = 0; i < selectOptions; i++) {
        $('<li />', { text: $this.children('option').eq(i).text(), rel: $this.children('option').eq(i).val() }).appendTo($optionlist);
      }
      var $optionlistItems = $optionlist.children('li');
      $customSelect.click(function (e) {
        e.stopPropagation();
        $('div.custom-select.active').not(this).each(function () {
          $(this).removeClass('active').next('ul.select-options').hide();
        });
        $(this).toggleClass('active').next('ul.select-options').slideToggle();
      });
      $optionlistItems.click(function (e) {
        e.stopPropagation();
        $customSelect.text($(this).text()).removeClass('active');
        $this.val($(this).attr('rel')).trigger('change');
        $optionlist.hide();
      });
      $(document).click(function () {
        $customSelect.removeClass('active');
        $optionlist.hide();
      });
    });
  });

  
  /* Tap to top */
  window.addEventListener('scroll', function() {
    const tapToTop = document.getElementById('tapToTop');
    if (window.scrollY > 50) {
      tapToTop.classList.remove('hidden');
    } else {
      tapToTop.classList.add('hidden');
    }
  });

  /* Slider room details */
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: '.slider-for',
    focusOnSelect: true,
    responsive: [
      { breakpoint: 575, settings: { slidesToShow: 3 } },
      { breakpoint: 420, settings: { slidesToShow: 2 } }
    ]
  });

  /* Input date */
  $('#date_1').calendar({ type: 'date' });
  $('#date_2').calendar({ type: 'date' });

  /* Replace all SVG images with inline SVG */
  $(document).ready(function () {
    $('img.svg-img[src$=".svg"]').each(function () {
      var $img = $(this);
      var imgURL = $img.attr('src');
      var attributes = $img.prop("attributes");
      $.get(imgURL, function (data) {
        var $svg = $(data).find('svg').removeAttr('xmlns:a');
        $.each(attributes, function () {
          $svg.attr(this.name, this.value);
        });
        $img.replaceWith($svg);
      }, 'xml');
    });
  });

  /* Blog Slider */
  $(".blog-slider").slick({
    slidesToShow: 4,
    infinite: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    prevArrow: false,
    nextArrow: false,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  });

  /* Copyright year */
  var date = new Date().getFullYear();
  document.getElementById("copyright_year").innerHTML = date;

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

/* Tap To Top */
document.addEventListener('DOMContentLoaded', function() {
  var tapToTopButton = document.getElementById('tapToTop');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      tapToTopButton.style.opacity = '1';
    } else {
      tapToTopButton.style.opacity = '0';
    }
  });
  tapToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* Removing fade from arrow */
document.addEventListener('DOMContentLoaded', () => {
  const fadeInElement = document.querySelector('.opacity-0');
  if (fadeInElement) {
    fadeInElement.classList.remove('opacity-0');
    fadeInElement.classList.add('opacity-100');
  }
});


document.addEventListener('DOMContentLoaded', function() {
  // Language Form
  const selectElement = document.querySelector('.language-form select');
  if (selectElement) {
      selectElement.addEventListener('change', function() {
          this.form.submit();
      });
  }

  // Toggle Language Functionality
  function toggleLanguage() {
      const toggle = document.getElementById('language-toggle');
      const languageInput = document.getElementById('language-input');
      if (toggle && languageInput) {
          if (toggle.checked) {
              languageInput.value = 'en';
          } else {
              languageInput.value = 'es';
          }
          toggle.closest('form').submit();
      }
  }

  const toggleButton = document.getElementById('language-toggle');
  if (toggleButton) {
      toggleButton.addEventListener('click', toggleLanguage);
  }

  // OpenTable Reservation Form
  const reservationDateInput = document.querySelector('#reservation_date');
  const reservationDateDiv = document.querySelector('#reservation_date_div');
  const timeInput = document.querySelector('#time');
  const timeDiv = document.querySelector('#time_div');

  const today = "{{ today }}"; // Ensure this is a valid date string in YYYY-MM-DD format
  const defaultTime = "19:00"; // Default time

  let reservationDateCalendar, timeCalendar;

  function toggleCalendar(calendar) {
      if (calendar.isOpen) {
          calendar.close();
      } else {
          calendar.open();
      }
  }

  if (reservationDateInput) {
      reservationDateCalendar = flatpickr(reservationDateInput, {
          dateFormat: "Y-m-d",
          defaultDate: today,
      });

      reservationDateDiv.addEventListener('click', function(event) {
          event.stopPropagation();  // Prevent the click event from bubbling up
          reservationDateInput._flatpickr.open();
      });
  }

  if (timeInput) {
      timeCalendar = flatpickr(timeInput, {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          defaultDate: defaultTime,
          time_24hr: true
      });

      timeDiv.addEventListener('click', function(event) {
          event.stopPropagation();  // Prevent the click event from bubbling up
          timeInput._flatpickr.open();
      });
  }
});