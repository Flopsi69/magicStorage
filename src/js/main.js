$(document).ready(function(){
	// Slider
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

	// Slider
	$('.advantages-slider').slick({
		infinite: true,
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 4000
	});

	// Slider
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

	$('*[data-toggle="modal"]').click(function(e){
		e.preventDefault();
		var orderId = $(this).parents('.order-wrap').data('order-id');
		$('.btn-result').attr('data-order-id', orderId);
	})


	/* Cancellation order */
	$('.btn[data-target=".modal-cancel-order"]').click(function(){
		var typeVal = $(this).parents('.order').find('.type-value').html();
		var numVal = $(this).parents('.order').find('.num-value').html();
		var statusVal = $(this).parents('.order').find('.status-value').html();
		var issueVal = $(this).parents('.order').find('.issue-value').html();
		var itemsVal = $(this).parents('.order').find('.items-value').html();
		$('.modal-cancel-order .type-value').html(typeVal);
		$('.modal-cancel-order .num-value').html(numVal);
		$('.modal-cancel-order .status-value').html(statusVal);
		$('.modal-cancel-order .issue-value').html(issueVal);
		$('.modal-cancel-order .items-value').html(itemsVal);
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
	/* /Cancellation order */


	/* Calendar picker */
	// init
	if (	$('.datetimepicker').length ) {
		$('.datetimepicker').datetimepicker({
			inline: true,
			format: 'YYYY-MM-DD',
			minDate: new Date()
		});
	} 

	// vars
	var vars = {};

	vars.timeRanges = [
	{
		name: "10to13",
		title: "10am to 1pm"
	},
	{
		name: "13to16",
		title: "1pm to 4pm"
	},
	{
		name: "16to19",
		title: "4pm to 7pm"
	}];

	vars.timeRangesBusy = {
		"2019-02-16": {
			"10to13": true,
			"13to16": false,
			"16to19": false
		},
		"2019-02-17": {
			"10to13": false,
			"13to16": true,
			"16to19": false
		}
	};

	vars.items = [
	{
		id: 1,
		img: 'img/bespoke-1.png',
		price: '22',
		name: "Extra-Bulky Item"
	},
	{
		id: 2,
		img: 'img/bespoke-2.png',
		price: '11',
		name: "Extra-Bulky Item 2"
	},
	{
		id: 3,
		img: 'img/bespoke-3.png',
		price: '34',
		name: "Extra-Bulky Item 3"
	}
	]

	// show btn choose time
	if($('.block-date').length) {
		vars.timeRanges.forEach(item => {
			$('.block-date .btn-wrap').append('<button class="btn btn-green" data-name=' + item.name + '>' + item.title + '</button>')
		})

		$('.block-date .btn-wrap .btn').on('click', function(e){
			e.preventDefault();
			$(this).toggleClass('active').siblings().removeClass('active');
			$('#pick_up_time').val($('.block-date-pickup .btn-wrap .btn.active').data('name'));
			$('#drop_off_time').val($('.block-date-dropoff .btn-wrap .btn.active').data('name'));
		})

		checkTimeAvailable();
	}


	// Day check
	$('.datepicker-days').on('click', '.day', function(){
		$('.block-date.active').removeClass('active');
		$(this).parents('.block-date').addClass('active');
		setTimeout(checkTimeAvailable, 0);
	})


	function checkTimeAvailable(){
		if($('.block-date.active').length) {
			var order_date_split = $('.block-date.active .day.active').data('day').split('/');
		} else {
			var order_date_split = $('.day.active').data('day').split('/');
		}
		var order_date = order_date_split[2] + '-' + order_date_split[0] + '-' + order_date_split[1];

		if ($('.block-date.active').hasClass('block-date-pickup')) {
			$('#pick_up_date').val(order_date);
		} else {
			$('#drop_off_date').val(order_date);
		}

		if($('.block-date.active').length) {
			for (var key in vars.timeRangesBusy[order_date]) {
				console.log(order_date + 'key:' + key );
				if(vars.timeRangesBusy[order_date][key]) {
					$('.block-date.active .btn[data-name='+ key +']').addClass('disabled');
				} else {
					$('.block-date.active .btn[data-name='+ key +']').removeClass('disabled');
				}
			}
		} else {
			for (var key in vars.timeRangesBusy[order_date]) {
				console.log(order_date + 'key:' + key );
				if(vars.timeRangesBusy[order_date][key]) {
					$('.block-date .btn[data-name='+ key +']').addClass('disabled');
				} else {
					$('.block-date .btn[data-name='+ key +']').removeClass('disabled');
				}
			}
		}
	}


	// events
	$('.btn-confirm-change').click(function(e) {
		e.preventDefault();
		if( $('.modal-date .btn-wrap .btn.active').length && $('.day.active').length) {
			var order_id = $(this).data().orderId;
			var order_date_split = $('.day.active').data('day').split('/');
			var order_date = order_date_split[2] + '-' + order_date_split[0] + '-' + order_date_split[1];
			var order_time = $('.modal-date .btn-wrap .btn.active').data('name');

			$.ajax({
				type: "POST",
				url: "/account/orders/pickup",
				data: {id: order_id, date: order_date, time: order_time},
				success: function () {
					window.location.reload(true); 
				}
			});
		}
	})

	$('.btn-confirm-pickup').click(function(e) {
		e.preventDefault();
		if( $('.modal-date .btn-wrap .btn.active').length || $('.day.active').length) {
			var order_id = $(this).data().orderId;
			var order_date_split = $('.day.active').data('day').split('/');
			var order_date = order_date_split[2] + '-' + order_date_split[0] + '-' + order_date_split[1];
			var order_time = $('.modal-date .btn-wrap .btn.active').data('name');

			$.ajax({
				type: "POST",
				url: "/account/orders/return",
				data: {id: order_id, date: order_date, time: order_time},
				success: function () {
					window.location.reload(true); 
				}
			});
		}
	})

	$('.btn-confirm-dropoff').click(function(e) {
		e.preventDefault();
		if( $('.modal-date .btn-wrap .btn.active').length || $('.day.active').length) {
			var order_id = $(this).data().orderId;
			var order_date_split = $('.day.active').data('day').split('/');
			var order_date = order_date_split[2] + '-' + order_date_split[0] + '-' + order_date_split[1];
			var order_time = $('.modal-date .btn-wrap .btn.active').data('name');

			$.ajax({
				type: "POST",
				url: "/account/orders/dropoff",
				data: {id: order_id, date: order_date, time: order_time},
				success: function () {
					window.location.reload(true); 
				}
			});
		}
	})
	/* / Calendar picker */


	/* Address */
	$('.form-add-address').submit(function(e){
		e.preventDefault();
		$.ajax({
			type: "POST",
			url: "/account/addresses",
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
	/* Address */


	// Summary
	vars.items.forEach(function(item) {
		var orderHtml = '<div class="row order" data-order-id=' + item.id + '> <div class="col-lg-7 col-sm-6 col-xs-8 item-wrap"> <div class="item"> <div class="icon"><img src="' + item.img + '" alt=""></div> <div class="descr"> <div class="name">' + item.name + '</div> <div class="unit-price">Unit Price: $18.00</div> </div> </div> </div> <div class="col-sm-3 quantity-num">Quantity: 1</div> <div class="col-lg-2 col-sm-3 price">' + item.price + '$</div> </div>';
		$('.summary-order .order-list').append(orderHtml);
	})

	// Steps select
	$('.fixed-footer .btn-next').click(function(e){
		e.preventDefault();
		if (!$(this).hasClass('form-submit')) {
			$('.header-steps .steps .active').removeClass('active').addClass('done').next().addClass('active');
			$('.select-page .section.active').removeClass('active').next().addClass('active');
			if ($('.select-review.active').length) {
				$(this).addClass('form-submit').text('Confirm');
			}
		} else {
			$('#form-full-order').submit();
		}
	})


	/*<!-- Popover -->*/
	$(function () {
		$('[data-toggle="popover"]').popover({
			trigger: 'focus hover', 
			placepent: 'bottom'
		});
	})

	/*<!-- Quantity -->*/
	$('.quantity .btn').click(function(e){
		e.preventDefault();
		var input = $(this).siblings('input');
		var currentVal = parseInt(input.val());
		if (!isNaN(currentVal)) {
			if( $(this).hasClass('btn-minus') ){
				if(currentVal >= input.attr('min')) {
					input.val(currentVal - 1).change();
				} 
				if(parseInt(input.val()) == input.attr('min')) {
					$(this).attr('disabled', true);
				}
			} else if( $(this).hasClass('btn-plus') ){
				if(currentVal <= input.attr('max')) {
					input.val(currentVal + 1).change();
				}
				if(parseInt(input.val()) == input.attr('max')) {
					$(this).attr('disabled', true);
				}

			}
		} else {
			input.val(input.attr('min'));
		}
	});

	var pseudoPrice;
	$('.quantity input').change(function() {
		minValue =  parseInt($(this).attr('min'));
		maxValue =  parseInt($(this).attr('max'));
		valueCurrent = parseInt($(this).val());
		name = $(this).attr('name');
		price = $(this).parents('.item').data('price');
		var finalTotalValue = 0;
		var numTotalItems = 0;

		if(valueCurrent >= minValue) {
			$(this).siblings('.btn-minus').removeAttr('disabled');
		} else {
			$(this).val(minValue).siblings('.btn-minus').attr('disabled', true);
		} 
		if(valueCurrent <= maxValue) {
			$(this).siblings('.btn-plus').removeAttr('disabled');
		} else {
			$(this).val(maxValue).siblings('.btn-plus').attr('disabled', true);
		}

		var itemJson = '', packingSuppliesJson  = '';

		$('.quantity input').each(function(){
			finalTotalValue += $(this).val() * $(this).parents('.item').data('price');
			numTotalItems += +$(this).val();
			var quantity = $(this).val();
			var id;
			if ($(this).parents('.items-block').hasClass('supplies-block')) {
				id = $(this).parents('.item-supply').data('packing-supply-id');
				packingSuppliesJson += '{id:'+ id + ',quantity:'+ quantity+'},';
			} else {
				id = $(this).parents('.item').data('item-id');
				itemJson += '{id:'+ id + ',quantity:'+ quantity+'},';
			}
		});

		$('#items').val(itemJson);
		$('#packing_supplies').val(packingSuppliesJson);
		$('.subtotal .price').html('$' + finalTotalValue);
		$('.subtotal .num').html(numTotalItems)
	});



	// Appoint
	$('.plate .appoint').click(function(){
		$('.plate .appoint.active').removeClass('active');
		$(this).addClass('active');
		$('#address_id').val($(this).data('address-id'));
	})

	// Note
	$('#note-field').change(function(){
		$('#notes').val($(this).val());
	})

	// Accordion	
	$('a[data-toggle="collapse"]').click(function() {
		if ( !$(this).hasClass('active') ) {
			$('a[data-toggle="collapse"]:not(this)').removeClass('active');
		}
		$(this).toggleClass('active');
	})


	/*	<!-- Stripe -->*/
		// Create a Stripe client.
		var stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

		// Create an instance of Elements.
		var elements = stripe.elements();

		// Custom styling can be passed to options when creating an Element.
		// (Note that this demo uses a wider set of styles than the guide below.)
		var style = {
			base: {
				color: '#32325d',
				lineHeight: '18px',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4'
				}
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a'
			}
		};

		// Create an instance of the card Element.
		var card = elements.create('card', {style: style});

		// Add an instance of the card Element into the `card-element` <div>.
		card.mount('#card-element');

		// Handle real-time validation errors from the card Element.
		card.addEventListener('change', function(event) {
			var displayError = document.getElementById('card-errors');
			if (event.error) {
				displayError.textContent = event.error.message;
			} else {
				displayError.textContent = '';
			}
		});

		// Handle form submission.
		var form = document.getElementById('payment-form');
		form.addEventListener('submit', function(event) {
			event.preventDefault();

			stripe.createToken(card).then(function(result) {
				if (result.error) {
      		// Inform the user if there was an error.
      		var errorElement = document.getElementById('card-errors');
      		errorElement.textContent = result.error.message;
      	} else {
      		// Send the token to your server.
      		stripeTokenHandler(result.token);
      	}
      });
		});

		// Submit the form with the token ID.
		function stripeTokenHandler(token) {
  		// Insert the token ID into the form so it gets submitted to the server
  		var form = document.getElementById('payment-form');
  		var hiddenInput = document.createElement('input');
  		hiddenInput.setAttribute('type', 'hidden');
  		hiddenInput.setAttribute('name', 'stripeToken');
  		hiddenInput.setAttribute('value', token.id);
  		form.appendChild(hiddenInput);

  		// Submit the form
  		form.submit();
  	}

});