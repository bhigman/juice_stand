$( function() {
	game = {};

	game.init = function() {
		game.clock_reset();
		game.clock.interval = window.setInterval( game.clock_update, game.clock.delay );
	};

	game.clock_reset = function() {
		game.clock = {
			hour: 8,
			minute: 0,
			meridiem: 'AM',
			pad: '00', // use to build minute padding
			delay: 500,
			count: 0, // incremented on each clock update
			speed: 2, // how many clock updates before incrementing the clock
			increment: 1 // how many minutes to increment on each tick
		};
	};

	game.clock_update = function() {
		// flash the #separator
		if(game.clock.count % game.clock.speed == 0){
			$('#separator').text(":");
		}
		else{
			$('#separator').text(" ");
		}
		// update #hour, #minute, #meridiem
		if(game.clock.count % game.clock.speed == 0){
			game.clock.minute += game.clock.increment;
			if(game.clock.minute == 60){
				game.clock.minute = 0;
				game.clock.hour += 1;
				if(game.clock.hour == 12){
					game.clock.meridiem = "PM";
				}
				else if(game.clock.hour == 13){
					game.clock.hour = 1;
				}
				else if(game.clock.hour == 5){
					window.clearInterval(game.clock.interval);
					console.log("Closing time");
				}
			}
		}
		$('#hour').text(game.clock.hour);
		$('#minute').text(game.clock_padded_minute);
		$('#meridiem').text(game.clock.meridiem);
		game.clock.count += 1;
	};

	game.clock_padded_minute = function() {
		var minute_string = "" + game.clock.minute;
		return game.clock.pad.substring( 0, game.clock.pad.length - minute_string.length ) + minute_string;
	};

	game.init();
});