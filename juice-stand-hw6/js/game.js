$( function() {
	game = {
		paused: false,
		max_occupancy: 14,
		customer_num: 1,
		serving_size: 0.150,
		customer_patience: 30,
		juice_per_fruit: 0.210,
		storage_save_key: 'juice_save_state'
	};

	game.init = function() {

		game.$stand_name = $( '#stand p' );
		game.$account = $( '#account-value' );
		game.$price = $( '#price-value' );

		game.$u_date = $( '#date' );
		game.$date = $( '#date h2' );
		game.$hour = $( '#hour' )
		game.$minute = $( '#minute' );
		game.$meridiem = $( '#meridiem' )

		game.$fruit = $( '#inventory p' );
		game.$juice = $( '#product-value' );
		game.$customers = $( '#customers p');

		found = game.offline_data();

		if ( offline_mode && ! found ) {
			$.colorbox( {
				html: '<header>You are not currently connected to the internet and do not have a locally saved game.</header>',
				height: '150px',
				width: '320px',
				closeButton: false,
				overlayClose: false,
				escKey: false,
			});
			return;
		}

		game.clock_init();
		game.customers_init();

		game.fruit = parseInt( game.$fruit.text() );
		game.juice = parseFloat( game.$juice.text() );
		game.price = parseFloat( game.$price.text() );
		game.account = parseFloat( game.$account.text() );

		$( document ).on( "keyup", game.check_keys );
		$( document ).on( "click", "#pause", game.pause );
		$( document ).on( "click", "#save", game.save );
		$( document ).on( "click", "#reset", game.reset );
		$( document ).on( "click", "#logout", game.logout );

		$( document ).on( "mouseover", "#inventory", game.fruit_options );
		$( document ).on( "mouseout", "#inventory", game.fruit_options_hide );
		$( document ).on( "click", "#inventory button", function( e ) {
			game.fruit_buy( $(this).data('amount') );
		} );

		$( document ).on( "mouseover", "#product", game.juice_options );
		$( document ).on( "mouseout", "#product", game.juice_options_hide );
		$( document ).on( "click", "#product button", function( e ) {
			var amount = $(this).data('amount');

			if ( amount == 'all' ) {
				amount = game.fruit;
			}
			game.juice_make( amount );
		} );

		$( document ).on( "closing-time", game.juice_expire );
		$( document ).on( "closing-time", game.fruit_expire );
	};

	game.check_keys = function( e ) {
		if ( e.keyCode == 27 && ! game.paused ) {
			game.pause();
		}
	};

	game.save = function() {
		$( '#form_name').val( game.$stand_name.text() );

		$( '#form_balance').val( game.account );
		$( '#form_price').val( game.price );
		$( '#form_customers').val( game.customers.length );
		$( '#form_juice').val( game.juice );
		$( '#form_fruit').val( game.fruit );

		$( '#form_u_date').val( game.$u_date.data( 'date' ) );
		$( '#form_date').val( game.$date.text() );
		$( '#form_time').val( game.$hour.text() + ':' + game.$minute.text() + ' ' + game.$meridiem.text() );

		game.$save_form = $( '#save_form' );

		localStorage.setItem( game.storage_save_key, JSON.stringify( game.$save_form.serializeObject() ) );

		game.$save_form.submit();
	};

	game.offline_data = function() {
		saved_state = localStorage.getItem( game.storage_save_key )

		if ( ! saved_state || '{}' == saved_state ) {
			return false;
		}

		game.saved_state_obj = JSON.parse( saved_state );

		if ( game.saved_state_obj.u_date <= game.u_date ) {
			return false; // offline data is the same age or older than DB data
		}

		game.$stand_name.html( game.saved_state_obj.name );
		game.$account.html( parseFloat( game.saved_state_obj.balance ).toFixed(2) );
		game.$price.html( parseFloat( game.saved_state_obj.price ).toFixed(2) );
		game.$fruit.html( game.saved_state_obj.fruit );
		game.$juice.html( parseFloat( game.saved_state_obj.juice ).toFixed(3) );
		game.$customers.html( game.saved_state_obj.customers );

		game.$u_date.data( 'date', game.saved_state_obj.u_date );
		game.$date.html( game.saved_state_obj.date );

		time = game.saved_state_obj.time.split( ':' );
		game.$hour.html( time[0] );
		time = time[1].split( ' ' );
		game.$minute.html( time[0] );
		game.$meridiem.html( time[1] );

		return true;
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
		// add a pause button to the header
		$('header').append( '<i class="fa fa-pause" id="pause"></i>' );

		game.u_date = game.$u_date.data( 'date' );
		game.clock_reset();

		// on initial load, override the clock variables with what was loaded onto the page
		game.clock.hour = parseInt( game.$hour.text() );
		game.clock.minute = parseInt( game.$minute.text() );
		game.clock.meridiem = game.$meridiem.text();

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
			game.u_date += 60;

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

			game.$u_date.data( 'date', game.u_date );
			game.$hour.html( game.clock.hour );
			game.$minute.html( game.clock_padded_minute() );
			game.$meridiem.html( game.clock.meridiem );
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

	game.juice_options = function() {
		$('#product div').show();
	};

	game.juice_options_hide = function() {
		$('#product div').hide();
	};

	game.juice_set = function( amount ) {
		game.juice = amount;
		game.$juice.html( game.juice.toFixed( 3 ) );
	};

	game.juice_sell = function() {

		amount = game.juice - game.serving_size;
		if ( amount < 0 ) {
			return false;
		}// end if

		game.juice_set( amount );

		game.account_change( game.price );

		return true;
	};

	game.juice_make = function ( amount ) {

		if ( game.fruit - amount < 0 ){
			return false;
		}// end if

		game.fruit_change( -amount );

		amount = game.juice + ( amount * game.juice_per_fruit );
		game.juice_set( amount );

		return true;
	};

	game.juice_expire = function() {
		game.juice_set( 0 );
	};

	game.account_change = function ( amount ) {
		game.account += amount;
		game.$account.html( game.account.toFixed( 2 ) );
	};

	game.fruit_options = function() {
		$('#inventory div').show();
		$('#inventory p').css( 'text-align', 'left' );
	};

	game.fruit_options_hide = function() {
		$('#inventory div').hide();
		$('#inventory p').css( 'text-align', 'center' );
	};

	game.fruit_expire = function() {
		game.fruit_change( Math.ceil( game.fruit / 2 ) );
	};

	game.fruit_change = function ( amount ) {
		game.fruit += amount;
		game.$fruit.html( game.fruit );
	};

	game.fruit_buy = function ( amount ) {
		/*
		$21.00 => 140 lemons ($0.15/ea)
		$6.00  => 30 lemons ($0.20/ea)
		$1.00  => 4 lemons ($0.25/ea)
		$0.30  => 1 lemon ($0.30/ea)
		*/

		switch ( amount ) {
			case 140:
				cost = 21;
				break;
			case 30:
				cost = 6;
				break
			case 4:
				cost = 1;
				break;
			case 1:
				cost = 0.30;
				break;
			default:
				return false;
		}

		if ( cost > game.account ) {
			return false;
		}

		game.account_change( - cost );
		game.fruit_change( amount );

		return true;
	};

	game.price_set = function ( amount ) {
		game.price = amount;
		game.$price.html( game.price.toFixed( 2 ) );
	};

	game.init();
});