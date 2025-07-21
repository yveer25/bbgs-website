(function ($) {
    "use strict";
    
    /*--
        Commons Variables
    -----------------------------------*/
    var $window = $(window);
    var $body = $('body');
    var $mainWrapper = $('.main-wrapper');
    
    /*-- 
        1: Sticky Header
    ----------------------------------------------------*/
    var $header = $('.header'),
        $headerSticky = $('.header-sticky');
    $window.on('scroll', function(){
        var $headerHeight = $header.height();
        if ($window.scrollTop() >= 200) {
            $headerSticky.addClass('is-sticky');
            $mainWrapper.css('padding-top', $headerHeight);
        } else {
            $headerSticky.removeClass('is-sticky');
            $mainWrapper.css('padding-top', 0);
        }
    });
    
    /*--
        2: Header Search & Off Canvas Toggle
    ----------------------------------------------------*/
    /*Search & Off Canvas Open*/
    var $headerToggle = $('.header-toggle');
    $headerToggle.on('click', '.toggle', function(e){
        e.preventDefault();
        var $this = $(this),
            $target = $this.data('target');
        $('#'+$target).addClass($target+'-open');
    });
    /*Search & Off Canvas Close*/
    var $searchClose = $('.search-close');
    $searchClose.on('click', function(e){
        e.preventDefault();
        var $this = $(this);
        $this.closest('.search-overlay').removeClass('search-overlay-open');
    });
    var $offCanvasClose = $('.off-canvas-close');
    $offCanvasClose.on('click', function(e){
        e.preventDefault();
        var $this = $(this);
        $this.closest('.off-canvas').removeClass('off-canvas-open');
    });
    
    /*--
        3: Off Canvas Menu
    ----------------------------------------------------*/
    var $offCanvasNav = $('.off-canvas-nav, .sidebar-collapse-nav'),
        $offCanvasNavSubMenu = $offCanvasNav.find('.sub-menu');
    
    /*Add Toggle Button With Off Canvas Sub Menu*/
    $offCanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i></i></span>');
    
    /*Close Off Canvas Sub Menu*/
    $offCanvasNavSubMenu.slideUp();
    
    /*Category Sub Menu Toggle*/
    $offCanvasNav.on('click', 'li a, li .menu-expand', function(e) {
        var $this = $(this);
        if ( $this.parent().attr('class').match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/) && ($this.attr('href') === '#' || $this.hasClass('menu-expand')) ) {
            e.preventDefault();
            if ($this.siblings('ul:visible').length){
                $this.parent('li').removeClass('active');
                $this.siblings('ul').slideUp();
                $this.parent('li').find('li').removeClass('active');
                $this.parent('li').find('ul:visible').slideUp();
            } else {
                $this.parent('li').addClass('active');
                $this.closest('li').siblings('li').removeClass('active').find('li').removeClass('active');
                $this.closest('li').siblings('li').find('ul:visible').slideUp();
                $this.siblings('ul').slideDown();
            }
        }
    });
    
    
    /*--
        4: Slider/Carousel Activation
    ----------------------------------------------------*/
    
    /*Hero Slider*/
    var $heroSlider = $('.hero-slider');
    $heroSlider.slick({
        arrows: false,
        fade: true,
        prevArrow: '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',
        autoplay: true,
        autoplaySpeed: 5000
    });
    
    /*Brand Slider*/
    $('.brand-slider').slick({
        arrows: true,
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        appendArrows: $('.software-section'),
        prevArrow: '<button class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fa fa-chevron-right"></i></button>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
    
    /*Testimonial Slider*/
    var $testimonialSlider = $('.testimonial-slider');
    $testimonialSlider.slick({
        slidesToShow: 1,
        arrows: false,
        prevArrow: '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',
        autoplay: true,
        autoplaySpeed: 5000,
    });
    
    /*Testimonial Slider 2*/
    var $testimonialSlider2 = $('.testimonial-slider-2');
    $testimonialSlider2.slick({
        slidesToShow: 2,
        arrows: false,
        prevArrow: '<button class="slick-prev"><i class="fa fa-angle-left"></i></button>',
        nextArrow: '<button class="slick-next"><i class="fa fa-angle-right"></i></button>',
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    
    /*--
        5: Accordion Function (Add or Remove 
           Open Class to Accordion Card)
    ----------------------------------------------------*/
    $('[data-bs-toggle="collapse"]').closest('.card').addClass('open');
    $('.collapsed[data-bs-toggle="collapse"]').closest('.card').removeClass('open');
    $('[data-bs-toggle="collapse"]').on('click', function(){
        var $this = $(this),
            $thisCard = $this.closest('.card');
        if( $this.hasClass('collapsed') && $thisCard.parent().hasClass('collapsable')) {
            $thisCard.addClass('open');
        }else if($this.hasClass('collapsed') && !$thisCard.parent().hasClass('collapsable')) {
            $thisCard.siblings().removeClass('open');
            $thisCard.addClass('open');
        } else {
            $thisCard.removeClass('open');
        }
    });
    
    /*--
        6: MailChimp
    -----------------------------------*/
    $('#mc-form').ajaxChimp({
        language: 'en',
        callback: mailChimpResponse,
        // ADD YOUR MAILCHIMP URL BELOW HERE!
        url: 'http://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef'

    });
    function mailChimpResponse(resp) {
        $('.mailchimp-alerts').addClass('open');
        if (resp.result === 'success') {
            $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
            $('.mailchimp-error').fadeOut(400);
        } else if(resp.result === 'error') {
            $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
        }  
    }
    
    /*--
        7: Sticky Sidebar Activation
    -----------------------------------*/
    
    /*Case Details Sidebar*/
    $('.case-details-sidebar').stickySidebar({
        containerSelector: '.case-details-wrap',
        innerWrapperSelector: '.case-details-info',
        topSpacing: 120,
        bottomSpacing: 60,
        minWidth: 992
    });
    
    /*--
        8: Scroll To Top
    ----------------------------------------------------*/
    $body.append('<a class="scroll-to-top" href=#top><i class="fa fa-angle-up"></i></a>');
    var $scrollToTop = $(".scroll-to-top");
    $window.on('scroll', function(){
        if ($window.scrollTop() >= $window.height()) {
            $scrollToTop.addClass('show');
        } else {
            $scrollToTop.removeClass('show');
        }
    });
    $scrollToTop.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
    
    
    /*--
        9: Ajax Contact Form JS
    ------------------------*/
    $(function () {
        // Get the form.
        var form = $('#contact-form');
        // Get the messages div.
        var formMessages = $('.form-message');
        // Set up an event listener for the contact form.
        $(form).submit(function (e) {
            // Stop the browser from submitting the form.
            e.preventDefault();
            // Serialize the form data.
            var formData = $(form).serialize();
            // Submit the form using AJAX.
            $.ajax({
                type: 'POST',
                url: $(form).attr('action'),
                data: formData,
            })
            .done(function (response) {
            // Make sure that the formMessages div has the 'success' class.
            $(formMessages).removeClass('error');
            $(formMessages).addClass('success');

            // Set the message text.
            $(formMessages).text(response);

            // Clear the form.
            $('#contact-form input,#contact-form textarea').val('');
            })
            .fail(function (data) {
            // Make sure that the formMessages div has the 'error' class.
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');

            // Set the message text.
            if (data.responseText !== '') {
                $(formMessages).text(data.responseText);
            } else {
                $(formMessages).text(
                    'Oops! An error occured and your message could not be sent.'
                );
            }
            });
        });
    });
    
})(jQuery);

