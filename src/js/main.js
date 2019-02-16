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

	$('.btn-order[data-toggle="modal"]').click(function(e){
		e.preventDefault();
		var orderId = $(this).parents('.order-wrap').data('order-id');
		$('.btn-result').attr('data-order-id', orderId);
	})

	$('.btn-cancellation').click(function(e) {
		e.preventDefault();
		var order_id = $(this).data().orderId;

		$.ajax({
			type: "POST",
			url: "/account/orders/cancel",
			data: {id: order_id},
			success: function () {
				window.location.reload(true); 
			}
		});
	})

	$('.btn-confirm-change').click(function(e) {
		e.preventDefault();
		var order_id = $(this).data().orderId;
		var order_date = $('.day.active').data('day').split('/').join('-');
		var order_time = $('.modal-date .btn-wrap .btn.active').data('name');

		$.ajax({
			type: "POST",
			url: "/account/orders/pickup",
			data: {id: order_id, date: order_date, time: order_time},
			success: function () {
				window.location.reload(true); 
			}
		});
	})

	$('.btn-confirm-pickup').click(function(e) {
		e.preventDefault();
		var order_id = $(this).data().orderId;
		var order_date = $('.day.active').data('day').split('/').join('-');
		var order_time = $('.modal-date .btn-wrap .btn.active').data('name');

		$.ajax({
			type: "POST",
			url: "/account/orders/return",
			data: {id: order_id, date: order_date, time: order_time},
			success: function () {
				window.location.reload(true); 
			}
		});
	})

	$('.btn-confirm-dropoff').click(function(e) {
		e.preventDefault();
		var order_id = $(this).data().orderId;
		var order_date = $('.day.active').data('day').split('/').join('-');
		var order_time = $('.modal-date .btn-wrap .btn.active').data('name');

		$.ajax({
			type: "POST",
			url: "/account/orders/dropoff",
			data: {id: order_id, date: order_date, time: order_time},
			success: function () {
				window.location.reload(true); 
			}
		});
	})



	$('.btn-add-card').click(function(e) {
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "/account/orders/stripe_token",
			success: function () {
				window.location.reload(true); 
			}
		});
	})

	$('.btn-add-address').click(function(e) {
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "/account/addresses",
			success: function () {
				window.location.reload(true); 
			}
		});
	})

	$('.delete-address').click(function(e) {
		e.preventDefault();
		var address_id = $(this).parent('.address-item').data('address-id');
		$.ajax({
			type: "POST",
			url: "/account/addresses",
			data: {id: address_id},
			success: function () {
				window.location.reload(true); 
			}
		});
	})
	
});