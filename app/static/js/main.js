/* main js */
(function ($) {
    "use strict";
  
    /* Aos animation on scroll */
    AOS.init({
      once: true
    });
  
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
  
    /* Mobaile menu slider */
    $('.navbar-toggler').on("click", function () {
      $('.lh-sidebar-overlay').fadeIn();
      $('.lh-mobile-menu').addClass("lh-menu-open");
    });
    $('.lh-sidebar-overlay, .lh-close').on("click", function () {
      $('.lh-sidebar-overlay').fadeOut();
      $('.lh-mobile-menu').removeClass("lh-menu-open");
    });
  
  /* Zoom Hero image */
  document.addEventListener("scroll", function() {
      const heroImage = document.querySelector(".hero-image");
      const scrollPosition = window.scrollY;
      const maxZoom = 1.5; // Maximum zoom level
      const zoomFactor = scrollPosition / (document.body.scrollHeight - window.innerHeight) * (maxZoom - 1) + 1;
      heroImage.style.transform = `scale(${zoomFactor})`;
  });
  
    function ResponsiveMobilemsMenu() {
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
  
    ResponsiveMobilemsMenu();
  
    /* Testimonials */
    $('.lh-slider').slick({
      rows: 1,
      dots: false,
      arrows: true,
      infinite: true,
      speed: 1500,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            dots: false,
            arrows: false,
          }
        }
      ]
    });
  
    $(window).on('load resize', function () {
      setTimeout(function () {
        $('.lh-slider .slick-prev').prepend('<div class="prev-slick-arrow arrow-icon"><span>&#60;</span></div><div class="prev-slick-img slick-thumb-nav"><img src="/prev.jpg" class="img-responsive"></div>');
        $('.lh-slider .slick-next').append('<div class="next-slick-arrow arrow-icon"><span>&#62;</span></div><div class="next-slick-img slick-thumb-nav"><img src="/next.jpg" class="img-responsive"></div>');
        get_prev_slick_img();
        get_next_slick_img();
      }, 100);
    });
  
    $('.lh-slider').on('click', '.slick-prev', function () {
      get_prev_slick_img();
    });
    $('.lh-slider').on('click', '.slick-next', function () {
      get_next_slick_img();
    });
    $('.lh-slider').on('swipe', function (event, slick, direction) {
      if (direction == 'left') {
        get_prev_slick_img();
      }
      else {
        get_next_slick_img();
      }
    });
    $('.slick-dots').on('click', 'li button', function () {
      var li_no = $(this).parent('li').index();
      if ($(this).parent('li').index() > li_no) {
        get_prev_slick_img()
      }
      else {
        get_next_slick_img()
      }
    });
    function get_prev_slick_img() {
      var prev_slick_img = $('.lh-slider .slick-current').prev().find('img').attr('src');
      $('.lh-slider .prev-slick-img img').attr('src', prev_slick_img);
      $('.lh-slider .prev-slick-img').css('background-image', 'url(' + prev_slick_img + ')');
      var prev_next_slick_img = $('.lh-slider .slick-current').next().find('img').attr('src');
      $('.lh-slider .next-slick-img img').attr('src', prev_next_slick_img);
      $('.lh-slider .next-slick-img').css('background-image', 'url(' + prev_next_slick_img + ')');
    }
    function get_next_slick_img() {
      var next_slick_img = $('.lh-slider .slick-current').next('').find('img').attr('src');
      $('.lh-slider .next-slick-img img').attr('src', next_slick_img);
      $('.lh-slider .next-slick-img').css('background-image', 'url(' + next_slick_img + ')');
      var next_prev_slick_img = $('.lh-slider .slick-current').prev('').find('img').attr('src');
      $('.lh-slider .prev-slick-img img').attr('src', next_prev_slick_img);
      $('.lh-slider .prev-slick-img').css('background-image', 'url(' + next_prev_slick_img + ')');
    }
  
    /* Gallery */
    $(document).ready(function () {
      $('.gallery-img').magnificPopup({
        type: 'image',
        mainClass: 'mfp-with-zoom',
        gallery: {
          enabled: true
        },
        zoom: {
          enabled: true,
          duration: 300,
          easing: 'ease-close-tool',
          opener: function (openerElement) {
            return openerElement.is('img') ? openerElement : openerElement.find('img');
          }
        }
      });
    });
  
    /* Custom select */
    $(document).ready(function() {
      $('select.language-form').each(function () {
        var $this = $(this), selectOptions = $(this).children('option').length;
    
        $this.addClass('hide-select');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="custom-select active"></div>');
    
        var $customSelect = $this.next('div.custom-select.active');
        $customSelect.text($this.children('option:selected').text()); // Set initial text to the selected option
    
        var $optionlist = $('<ul />', {
          'class': 'select-options'
        }).insertAfter($customSelect);
    
        for (var i = 0; i < selectOptions; i++) {
          $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
          }).appendTo($optionlist);
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
          $this.val($(this).attr('rel')).trigger('change'); // Update the original select value and trigger change
          $optionlist.hide();
        });
    
        $(document).click(function () {
          $customSelect.removeClass('active');
          $optionlist.hide();
        });
      });
    });
    
  
    /* Tap to top */
    $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
        $(".back-to-top").fadeIn();
      } else {
        $(".back-to-top").fadeOut();
      }
    });
  
    /* Side tool */
    $(".btn-lh-tool").on("click", function (e) {
      e.preventDefault();
      if ($(this).hasClass("close-tool")) {
        $(".lh-tool").addClass("lh-tool-active");
        $(".tool-overlay").fadeIn();
        if ($(".btn-lh-tool").not("close-tool")) {
          $(".lh-tool").removeClass("lh-tool-active");
          $(".btn-lh-tool").addClass("close-tool");
        }
        if ($(".btn-lh-tool").not("close-tool")) {
          $(".lh-tool").addClass("lh-tool-active");
          $(".btn-lh-tool").addClass("close-tool");
          $(".tool-overlay").fadeIn();
        }
      } else {
        $(".lh-tool").removeClass("lh-tool-active");
        $(".tool-overlay").fadeOut();
      }
  
      $(this).toggleClass("close-tool");
      return false;
  
    });
  
    $(".tool-overlay").on("click", function (e) {
      $(".btn-lh-tool").addClass("close-tool");
      $(".lh-tool").removeClass("lh-tool-active");
      $(".tool-overlay").fadeOut();
    });
  
    $(".lh-color li").click(function () {
      $("li").removeClass("active-colors");
      $(this).addClass("active-colors");
    });
  
    /* Color show */
    $(".c1").click(function () {
      $("#add_class").remove();
    });
    $(".c2").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-1.css" id="add_class">'
      );
    });
    $(".c3").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-2.css" id="add_class">'
      );
    });
    $(".c4").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-3.css" id="add_class">'
      );
    });
    $(".c5").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-4.css" id="add_class">'
      );
    });
    $(".c6").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-5.css" id="add_class">'
      );
    });
    $(".c7").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-6.css" id="add_class">'
      );
    });
    $(".c8").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-7.css" id="add_class">'
      );
    });
    $(".c9").click(function () {
      $("#add_class").remove();
      $("head").append(
        '<link rel="stylesheet" href="assets/css/color-8.css" id="add_class">'
      );
    });
  
    /* Dark mode */
    $(".dark-mode li").click(function () {
      $("li").removeClass("active-dark-mode");
      $(this).addClass("active-dark-mode");
    });
  
    $(".dark").click(function () {
      $("#add_dark_mode").remove();
      $("head").append('<link rel="stylesheet" class="dark-link-mode" href="assets/css/dark.css" id="add_dark_mode">');
    });
    $(".white").click(function () {
      $("#add_dark_mode").remove();
    });
  
    /* Skin mode */
    $(".skin-1").click(function () {
      $("#add_skin").remove();
      $("head").append('<link rel="stylesheet" href="assets/css/shape-1.css" id="add_skin">');
      $(".skin-mode li").removeClass("active");
      $(this).addClass("active");
    });
    $(".skin-2").click(function () {
      $("#add_skin").remove();
      $("head").append('<link rel="stylesheet" href="assets/css/shape-2.css" id="add_skin">');
      $(".skin-mode li").removeClass("active");
      $(this).addClass("active");
    });
    $(".skin-3").click(function () {
      $("#add_skin").remove();
      $(".skin-mode li").removeClass("active");
      $(this).addClass("active");
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
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 3,
          }
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 2,
          }
        }
      ]
    });
  
    /* Input date */
    $('#date_1').calendar({
      type: 'date'
    });
    $('#date_2').calendar({
      type: 'date'
    });
  
    /* Replace all SVG images with inline SVG */
    $(document).ready(function () {
      $('img.svg-img[src$=".svg"]').each(function () {
        var $img = $(this);
        var imgURL = $img.attr('src');
        var attributes = $img.prop("attributes");
  
        $.get(imgURL, function (data) {
          // Get the SVG tag, ignore the rest
          var $svg = $(data).find('svg');
  
          // Remove any invalid XML tags
          $svg = $svg.removeAttr('xmlns:a');
  
          // Loop through IMG attributes and apply on SVG
          $.each(attributes, function () {
            $svg.attr(this.name, this.value);
          });
  
          // Replace IMG with SVG
          $img.replaceWith($svg);
        }, 'xml');
      });
    });
  
    /* Blog Sider */
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
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 3,
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          }
        }
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

// Language Form: ensure the language form submits correctly via JavaScript:
document.querySelector('.language-form select').addEventListener('change', function() {
  this.form.submit();
});

// Tap To Top :
document.addEventListener('DOMContentLoaded', function() {
  var tapToTopButton = document.getElementById('tapToTop');

  // Show or hide the button based on scroll position
  window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
          tapToTopButton.style.opacity = '1';
      } else {
          tapToTopButton.style.opacity = '0';
      }
  });

  // Scroll to top when the button is clicked
  tapToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// For Search Engine
document.getElementById('reservationForm').addEventListener('submit', function(event) {
  var checkin = new Date(document.getElementById('checkin').value);
  var checkout = new Date(document.getElementById('checkout').value);
  var today = new Date();

  // Ensure check-in date is not in the past
  if (checkin < today) {
      alert('Check-in date cannot be in the past.');
      event.preventDefault();
      return false;
  }

  // Ensure check-out date is after check-in date
  if (checkout <= checkin) {
      alert('Check-out date must be after check-in date.');
      event.preventDefault();
      return false;
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const checkinInput = document.querySelector('#checkin');
  const checkoutInput = document.querySelector('#checkout');
  const checkinIcon = document.querySelector('#checkin-icon');
  const checkoutIcon = document.querySelector('#checkout-icon');

  // State tracking variables
  let checkinOpen = false;
  let checkoutOpen = false;

  // Initialize Flatpickr for check-in input
  const checkinCalendar = flatpickr(checkinInput, {
      dateFormat: "Y-m-d",
      defaultDate: "{{ today }}",
      onClose: function() {
          checkinOpen = false;
      },
      onOpen: function() {
          checkinOpen = true;
      }
  });

  // Initialize Flatpickr for check-out input
  const checkoutCalendar = flatpickr(checkoutInput, {
      dateFormat: "Y-m-d",
      defaultDate: "{{ tomorrow }}",
      onClose: function() {
          checkoutOpen = false;
      },
      onOpen: function() {
          checkoutOpen = true;
      }
  });

  // Toggle check-in calendar visibility
  checkinIcon.addEventListener('click', function() {
      if (checkinOpen) {
          checkinCalendar.close();
      } else {
          checkinCalendar.open();
      }
  });

  // Toggle check-out calendar visibility
  checkoutIcon.addEventListener('click', function() {
      if (checkoutOpen) {
          checkoutCalendar.close();
      } else {
          checkoutCalendar.open();
      }
  });

  // Additional input click handlers to close the calendar if it is open
  checkinInput.addEventListener('click', function() {
      if (checkinOpen) {
          checkinCalendar.close();
      } else {
          checkinCalendar.open();
      }
  });

  checkoutInput.addEventListener('click', function() {
      if (checkoutOpen) {
          checkoutCalendar.close();
      } else {
          checkoutCalendar.open();
      }
  });
});