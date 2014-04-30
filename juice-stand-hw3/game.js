$( function() {
	game = {
		paused: false
	};

	game.init = function() {
		game.clock_reset();

		// on initial load, override the clock variables with what was loaded onto the page
		game.clock.hour = parseInt( $( '#hour' ).text() );
		game.clock.minute = parseInt( $( '#minute' ).text() );
		game.clock.meridiem = $( '#meridiem' ).text();

		game.clock_start();

		$(document).on( "keyup", game.check_keys );

		$(document).on( "click", "#pause", game.pause );
		$(document).on( "click", "#save", game.save );
		$(document).on( "click", "#reset", game.reset );
		$(document).on( "click", "#logout", game.logout );
	};

	game.check_keys = function( e ) {
		if ( e.keyCode == 27 && ! game.paused ) {
			game.pause();
		}
	};

	game.save = function() {
		$( '#form_name').val( $( '#stand p' ).text() );
		$( '#form_balance').val( $( '#account p' ).text() );
		$( '#form_price').val( $( '#price p' ).text() );
		$( '#form_customers').val( $( '#customers p' ).text() );
		$( '#form_date').val( $( '#date h2' ).text() );
		$( '#form_juice').val( $( '#product p' ).text() );
		$( '#form_fruit').val( $( '#inventory p' ).text() );
		$( '#form_time').val( $( '#hour' ).text() + ':' + $( '#minute' ).text() + ' ' + $( '#meridiem' ).text() );

		$( '#save_form' ).submit();
	};
	
	game.logout = function(){
		$( '#logout-form').submit();
	}

	game.reset = function() {
		game.clock_reset();
		game.clock_update();
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
	}

	game.clock_start = function() {
		if ( game.clock.interval ) {
			return false;
		}

		game.clock.interval = window.setInterval( game.clock_update, game.clock.delay );
	};

	game.clock_stop = function() {
		clearInterval( game.clock.interval );
		game.clock.interval = false;
	}

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
				}
				else if ( 13 <= game.clock.hour ) {
					game.clock.hour = 1;
				}
				else if ( 5 == game.clock.hour && 'PM' == game.clock.meridiem ) {
					console.log( 'Closing time!');
					game.clock_stop;
				}
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

	game.init();
});