$( function() {

	game = {
		paused: false,
		max_occupancy: 14,
		customer_num: 1,
		serving_size: 0.150,
		customer_patience: 30,
		juice_per_fruit: 0.210
	};

	$.fn.serializeObject = function(){
		var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	    	if (o[this.name]) {
	    		if (!o[this.name].push) {
	            	o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } 
	        else {
	           o[this.name] = this.value || '';
	        }
	    });
	    return o;
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

		if(offline_mode == true){
			game.offline_data();
		}

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

		game.clock_init();
		game.customers_init();
	};

	game.check_keys = function( e ) {
		if ( e.keyCode == 27 && ! game.paused ) {
			game.pause();
		}
	};

	game.save = function() {
		$( '#form_name' ).val( $( '#stand p' ).text() );

		$( '#form_balance' ).val( game.account );
		$( '#form_price' ).val( game.price );
		$( '#form_customers' ).val( game.customers.length );
		$( '#form_juice' ).val( game.juice );
		$( '#form_fruit' ).val( game.fruit );

		$( '#form_date' ).val( $( '#date h2' ).text() );
		$( '#form_time' ).val( $( '#hour' ).text() + ':' + $( '#minute' ).text() + ' ' + $( '#meridiem' ).text() );
		$( '#form_time_stamp' ).text((new Date).getTime());

		$( '#save_form' ).submit();
		localStorage.setItem('stuffs', JSON.stringify($('#save_form').serializeObject()));
	};
	
	game.offline_data = function(){
		offline_save = JSON.parse(localStorage.getItem('stuffs'));
		console.log(offline_save);
		$time = offline_save.time.split(':');
		$time[1] = $time[1].split(' ');
		$('#stand p').text(offline_save.name);
		$('#hour').text($time[0]);
		$('#minute').text($time[1][0]);
		$('#meridiem').text($time[1][1]);
		$('#account p').text("$"+parseFloat(offline_save.balance).toFixed(2));
		$('#inventory p').text(offline_save.fruit);
		$('#date h2').text(offline_save.date);
		$('#price-value').text(parseFloat(offline_save.price).toFixed(2));
		$('#product-value').text(parseFloat(offline_save.juice).toFixed(3));

	}

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

	game.juice_options = function() {
		$('#product div').show();
	}

	game.juice_options_hide = function() {
		$('#product div').hide();
	}

	game.juice_set = function( amount ) {
		game.juice = amount;
		game.$juice.html( game.juice.toFixed( 3 ) );
	}

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
	}

	game.fruit_options_hide = function() {
		$('#inventory div').hide();
		$('#inventory p').css( 'text-align', 'center' );
	}

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

	function Customer( gender ) {
		this.gender = gender;

		this.init = function() {
			this.id = 'customer-' + game.customer_num;
			this.patience = game.customer_patience;

			game.customer_num++;
			game.customers.push( this );

			game.$customers.append( this.icon() );
			$( document ).on( "click", '#' + this.id, this.serve );
		};

		this.serve = function() {
			game.juice_sell();
			game.customer_find( this.id ).leave( 'satisfied' );
		};

		this.icon = function () {
			return '<i class="fa fa-' + this.gender + ' customer" id="' + this.id + '"></i>';
		};

		this.wait = function() {
			this.patience--;

			if ( 0 >= this.patience ) {
				this.leave( 'pissed' );
				return false;
			}//end if
			else {
				patience_ratio = this.patience / game.customer_patience;
				if ( 0.1001 > patience_ratio ) {
					$( '#' + this.id ).css( "color", "#e74276" );
				}
				else if ( 0.5001 > patience_ratio ) {
					$( '#' + this.id ).css( "color", "#ff7a49" );
				}
			}// end else

			return true;
		};

		this.leave = function( state ) {
			index = game.customers.indexOf( this );
			game.customers.splice( index, 1 );

			$( '#' + this.id ).remove();
		}

		this.init();
	};

	Customer.prototype.kind = 'customer';

	game.init();
});