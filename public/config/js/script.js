// JavaScript Document

$(document).ready(function() {
	/* ScrollIt Start */
	$.scrollIt({
		upKey: 38, // key code to navigate to the next section
		downKey: 40, // key code to navigate to the previous section
		easing: 'linear', // the easing function for animation
		scrollTime: 600, // how long (in ms) the animation takes
		activeClass: 'active', // class given to the active nav element
		onPageChange: null, // function(pageIndex) that is called when page is changed
		topOffset: -109 // offste (in px) for fixed top navigation
	});
	/* ScrollIt End */

	// Sticky Header
	$(window).scroll(function () {
		var scroll = $(window).scrollTop();

		if (scroll >= 100) {
			$(".header").addClass("header-stick");
		} else {
			$(".header").removeClass("header-stick");
		}
	});

	$('.navbar-toggler .navbar-toggler-icon').click(function () {
		$(this).toggleClass('open');
		// $('.nav').toggleClass('open');
	});
	// var scroll = $(window).scrollTop();

	// if (scroll >= 100) {
	// 	$(".header").addClass("header-stick");
	// } else {
	// 	$(".header").removeClass("header-stick");
	// }

	/* CounterDown Timer Start */
	// Nov 1st, 11 am ET
	$('.custom_timer').countdown({until: new Date(1635768000 * 1000), format: 'DHMS', padZeroes: true, compact: true});
	/* CounterDown Timer End */

	/* Skywalker Carousel */
	$(".skywalker-carousel").slick({
		dots: false,
		arrows: false,
		infinite: true,
		autoplay: true,
		speed: 10000,
  		autoplaySpeed: 0,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
		{
			breakpoint: 1199,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 576,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
			// You can unslick at a given breakpoint now by adding:
			// settings: "unslick"
			// instead of a settings object
		]
	  });
	/* Skywalker Carousel */
	// OFI Browser
	objectFitImages();
});
