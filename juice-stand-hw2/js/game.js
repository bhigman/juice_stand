$( function() {
	game = {
		paused: false
	};

	game.init = function() {
		game.clock_reset();
		// start the clock...
		game.clock.interval = window.setInterval( game.clock_update, game.clock.delay );
	};

	game.save = function() {
		//alert("Here");
		$('#subId').val(1);
		$('#subName').val($('#stand').text().trim());
		$('#subBalance').val($('#account p').text().replace('$',''));
		$('#subPrice').val($('#price p').text().replace('$',''));
		$('#subDate').val(gameDate);
		$('#subTime').val($('#hour').text()+":"+$('#minute').text()+":00");
		$('#subFruit').val($('#inventory p').text().trim());
		$('#subJuice').val($('#product p').text().replace(' mL',''));
		$('#subCust').val($('#customers p').text().trim());
		$('#hiddenForm').submit();
	};

	game.reset = function() {
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
		//game.clock_update;
		$.colorbox.close();
	};
	
	game.pause = function() {
		game.paused = true;
		game.clock_stop();
		$.colorbox({
			href:"./pause.php",
			title:"The game is paused.",
			onClosed: game.unpause
		});
	};

	game.unpause = function() {
		game.paused = false;
		game.clock_update();
		game.clock_start();
	}

	game.clock_start = function() {
		game.clock.interval = window.setInterval( game.clock_update, game.clock.delay );
	};

	game.clock_stop = function() {
		clearInterval( game.clock.interval );
	}

	game.clock_reset = function() {
		game.clock = {
			hour: time.hour,
			minute: time.minute,
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
				else if ( 13 >= game.clock.hour ) {
					game.clock.hour = 1;
					game.clock.meridiem = 'PM';
				}
				else if ( 5 == game.clock.hour && 'PM' == game.clock.meridiem ) {
					console.log( 'Closing time!');
					clearInterval( game.clock.interval );
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
	
	$('#pauseIcon').on('click', function(){
		game.pause();
	});
	
	$(document).on('keyup', function(e){
		if (e.keyCode == 27 && game.paused != true){
			game.pause();
		}
	});
	
	$(document).on('click', '#saveButton', game.save);
	
	$(document).on('click', '#resetButton', game.reset);
	
	game.init();
});