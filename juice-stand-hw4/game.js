$( function() {
	game = {
		paused: false,
		max_occupancy: 14,
		customer_num: 1,
		serving_size: 0.150,
		customer_patience: 30,
		juice_per_fruit: 0.210
	};

	game.init = function() {

		game.$fruit = $( '#inventory p' );
		game.fruit = parseInt( game.$fruit.text() );

		game.$juice = $( '#product-value' );
		game.juice = parseFloat( game.$juice.text() );

		game.$price = $( '#price-value' );
		game.price = parseFloat( game.$price.text() );

		game.$account = $( '#account-value' );
		game.account = parseFloat( game.$account.text() );

		$( document ).on( "keyup", game.check_keys );
		$( document ).on( "click", "#pause", game.pause );
		$( document ).on( "click", "#save", game.save );
		$( document ).on( "click", "#reset", game.reset );
		$( document ).on( "click", "#logout", game.logout );

		// @TODO: homework 4 - attach additional bindings here
		$( document ).on( "mouseenter", "#inventory", game.show_inventory);
		$( document ).on( "mouseleave", "#inventory", game.hide_inventory);
		$( document ).on( "mouseenter", "#product", game.show_product);
		$( document ).on( "mouseleave", "#product", game.hide_product);
		$( document ).on( "click", "#product button", game.juice_make);
		$( document ).on( "click", "#inventory button", game.fruit_buy);
		$( document ).on( "closing-time", function(e){
			game.juice_expire();
			game.fruit_expire();
		});

		game.clock_init();
		game.customers_init();
	};
	
	game.show_inventory = function(){
			$('#inventory > div').show();
	};
	
	game.hide_inventory = function(){
			$('#inventory > div').hide();
	};
	
	game.show_product = function(){
			$('#product > div').show();
	};
	
	game.hide_product = function(){
			$('#product > div').hide();
	};
	
	game.check_keys = function( e ) {
		if ( e.keyCode == 27 && ! game.paused ) {
			game.pause();
		}
	};

	game.save = function() {
		$('#form_name').val($('#stand p').text() );

		$('#form_balance').val(game.account);
		$('#form_price').val(game.price);
		$('#form_customers').val(game.customers.length);
		$('#form_juice').val(game.juice);
		$('#form_fruit').val(game.fruit);

		$('#form_date').val($('#date h2').text());
		$('#form_time').val( $('#hour').text() + ':' + $('#minute').text() + ' ' + $('#meridiem').text());

		$('#save_form').submit();
	};

	game.reset = function() {
		game.clock_reset();
		game.clock_update();

		game.account = 20;
		game.account_change( 0 );

		game.price_set( 0.5 );

		game.fruit = 0;
		game.fruit_change( 0 )

		game.juice_set( 0 );

		game.customers = [];
		game.$customers.html( '' );
	};

	game.logout = function() {
		window.location += '?logout';
	};

	game.pause = function() {
		game.clock_stop();
		game.paused = true;

		$.colorbox( {
			href: "pause.php",
			onClosed: game.unpause,
			title: "Game is paused"
		} );
	};

	game.unpause = function() {
		if ( ! game.paused ) {
			return false;
		}

		game.clock_start();
		game.paused = false;
	};

	game.clock_init = function() {
		game.clock_reset();

		// on initial load, override the clock variables with what was loaded onto the page
		game.clock.hour = parseInt( $( '#hour' ).text() );
		game.clock.minute = parseInt( $( '#minute' ).text() );
		game.clock.meridiem = $( '#meridiem' ).text();

		game.clock_start();
	};

	game.clock_start = function() {
		if ( game.clock.interval ) {
			return false;
		}

		game.clock.interval = window.setInterval( game.clock_update, game.clock.delay );
	};

	game.clock_stop = function() {
		clearInterval( game.clock.interval );
		game.clock.interval = false;
	};

	game.clock_reset = function() {
		game.clock = {
			hour: 8,
			minute: 0,
			meridiem: 'AM',
			count: 0,
			pad: '00',
			delay: 500,
			speed: 2,
			increment: 1,
			interval: false
		};
	};

	game.clock_update = function() {
		game.clock.count += game.clock.delay;

		$( document ).trigger( 'tick' );

		if ( game.clock.count % ( game.clock.delay * game.clock.speed ) ) {
			$( '#separator' ).html( '&nbsp;' );

			game.clock.minute += game.clock.increment;
			if ( 60 <= game.clock.minute ) {
				game.clock.minute = 0;
				game.clock.hour++;

				if ( 12 == game.clock.hour ) {
					if ( 'AM' == game.clock.meridiem ) {
						game.clock.meridiem = 'PM';
					}
					else {
						game.clock.meridiem = 'AM';
					}
				}// end if
				else if ( 13 <= game.clock.hour ) {
					game.clock.hour = 1;
				}// end else if
				else if ( 5 == game.clock.hour && 'PM' == game.clock.meridiem ) {
					$( document ).trigger( "closing-time" );
					game.clock_stop();
				}// end else if
			}

			$( '#hour' ).html( game.clock.hour );
			$( '#minute' ).html( game.clock_padded_minute() );
			$( '#meridiem' ).html( game.clock.meridiem );
		}
		else {
			$( '#separator' ).html( ':' );
		}
	};

	game.clock_padded_minute = function() {
		var minute_string = "" + game.clock.minute;
		return game.clock.pad.substring( 0, game.clock.pad.length - minute_string.length ) + minute_string;
	};

	game.clock_time = function() {
		return game.clock.hour + ':' +game.clock_padded_minute() + ' ' + game.clock.meridiem;
	};

	game.customers_init = function() {
		game.customers = [];
		game.$customers = $( '#customers p');

		customer_count = parseInt( game.$customers.text() );
		game.$customers.html('');
		for ( i = 0; i < customer_count; i++ ) {
			gender = Math.floor( Math.random() * 2 ) == 1 ? 'male' : 'female';
			game.customers_add( gender );
		}

		$( document ).on( "tick", game.customers_handle );
	};

	game.customers_handle = function() {

		game.customers_waiting();

		if ( game.customers.length >= game.max_occupancy ) {
			return;
		}// end if

		var event = Math.floor( ( Math.random() * 100 ) );
		if ( event < 89 ) { // 88%
			// do nothing!
		}//end if
		else if ( event < 93 ) { // 4%
			// 1 male customer arrives
			game.customers_add( 'male' );
		}// end else if
		else if ( event < 97 ) { // 4%
			// 1 female customer arrives
			game.customers_add( 'female' );
		}// end else if
		else if ( event < 98 ) { // 1%
			// 2 male customers arrive
			game.customers_add( 'male' );
			game.customers_add( 'male' );
		}// end else if
		else if ( event < 99 ) { // 1%
			// 2 female customers arrive
			game.customers_add( 'female' );
			game.customers_add( 'female' );
		}// end else if
		else if ( event < 100 ) { // 1%
			// 1 male, 1 female arrive
			game.customers_add( 'female' );
			game.customers_add( 'male' );
		}// end else if
	};

	game.customers_add = function( type ) {
		var person = new Customer( type );
	};

	game.customers_waiting = function() {
		// going through the loop backward so if a customer removes itself from the array,
		// the indexes are still intact
		for ( i = game.customers.length - 1; i >= 0; i-- ) {
			game.customers[i].wait();
		}
	};

	game.customer_find = function( id ) {
		for ( i = game.customers.length - 1; i >= 0; i-- ) {
			if ( game.customers[i].id == id ) {
				return game.customers[i];
			}
		}
	};

	game.juice_set = function( amount ) {
		// Set juice amount
		game.juice += amount;
		game.$juice.text(game.juice.toFixed( 3 ));
		
	};

	game.juice_sell = function() {
		// @TODO: homework 4 - define and use this function
	};

	game.juice_make = function ( amount ) {
		// Check amount value
		var amount = $(this).data("amount");
		if(amount == "all"){
			amount = game.fruit;
		}
		if(amount > game.fruit){
			return false;
		}
		// Set fruit amount
		game.fruit_change(-amount);
		// Calulate added juice
		juice = game.juice_per_fruit * amount;
		// Set juice amount
		game.juice_set(juice);
		// Return true
		return true;
	};

	game.juice_expire = function() {
		// juice expires at the end of the day
		game.juice_set(-game.juice);
	};

	game.account_change = function ( amount ) {
		// set money to new value after sales and purchases
		var check = game.account + amount;
		if( check < 0 ){
			return false;
		}
		game.account += amount;
		game.$account.text(game.account.toFixed( 2 ));
		return true;
	};

	game.fruit_expire = function() {
		// half of the fruit inventory goes bad every day at close
		game.fruit_change(-parseInt(game.fruit/2));
	};

	game.fruit_change = function ( amount ) {
		// Set fruit amount
		game.fruit += amount;
		game.$fruit.text(game.fruit);
	};

	game.fruit_buy = function ( amount ) {
		/*
		$21.00 => 140 lemons ($0.15/ea)
		$6.00  => 30 lemons ($0.20/ea)
		$1.00  => 4 lemons ($0.25/ea)
		$0.30  => 1 lemon ($0.30/ea)
		*/
		var amount = $(this).data("amount");
		var check = true;
		
		switch(amount){
			case 1:
				check = game.account_change(-0.30);
				break;
			case 4:
				check = game.account_change(-1.00);
				break;
			case 30:
				check = game.account_change(-6.00);
				break;
			case 140:
				check = game.account_change(-21.00);
				break;
		}
		if(check){
			game.fruit_change(amount);
		}
		
	};

	game.price_set = function ( amount ) {
		game.price = amount;
		game.$price.html( game.price.toFixed( 2 ) );
	};

	function Customer( gender ) {
		this.gender = gender;

		this.init = function() {
			this.id = 'customer-' + game.customer_num;
			this.patience = game.customer_patience;

			game.customer_num++;
			game.customers.push( this );

			// @TODO: homework 4 - stuff here
			if(this.gender == 'female'){
				$('#customers p').append("<i class='fa fa-female'></i>");
			}
			else{
				$('#customers p').append("<i class='fa fa-male'></i>")
			}
		};

		this.serve = function() {
			// @TODO: homework 4 - define and use this function
		};

		this.icon = function () {
			// @TODO: homework 4 - define and use this function
		};

		this.wait = function() {
			// @TODO: homework 4 - define and use this function
		};

		this.leave = function( state ) {
			// @TODO: homework 4 - define and use this function
		};

		this.init();
	};

	Customer.prototype.kind = 'customer';

	game.init();
});