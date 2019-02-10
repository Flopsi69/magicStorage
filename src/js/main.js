$(document).ready(function(){
	$('.feedbacks-slider').slick({
		infinite: true,
		slidesToShow: 3,
		autoplay: true,
		autoplaySpeed: 10000,
		responsive: [
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 1
			}
		}
		]
	});

	$('.advantages-slider').slick({
		infinite: true,
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 4000
	});

	$('.jumbotron-slider').slick({
		dots: true,
		infinite: true,
		speed: 500,
		fade: true,
		cssEase: 'linear',
		arrows: false,
		autoplay: true,
		autoplaySpeed: 10000
	});

});