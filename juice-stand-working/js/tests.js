// override colorbox to not do anything
$.colorbox = function(){};

// Test price set
test( "Price set", function() {
	expect( 4 );

	game.price_set( 1 );
	equal( game.$price.text(), '1.00', "Integer price set with decimal" );

	game.price_set( 2.25 );
	equal( game.$price.text(), '2.25', "Integer price set with double" );

	game.price_set( 3.251 );
	equal( game.$price.text(), '3.25', "Integer price set with double, rounded down on partial cents" );

	game.price_set( 4.256 );
	equal( game.$price.text(), '4.26', "Integer price set with double, rounded up on partial cents" );
} );

// Test pause
asyncTest( "Pause", function() {
	expect( 3 );

	game.pause();
	ok( game.paused == true, "Passed, pause state." );
	ok( game.clock.interval == false, "Passed, clock stop state." );

	var minute = game.$minute.text();
	setTimeout( function() {
		var new_minute = game.$minute.text();

		ok( new_minute == minute, "Passed, clock is not changing." );
		start();
		game.unpause();
	}, 1100 );
});

// Test fruit purchase
test( "Fruit buy", function() 
{
	var cash = game.account;
	
	game.fruit_set ( 0 );
	equal( game.$fruit.text(), '0', "Fruit text set to zero successfully." );
	equal( game.fruit, 0, "Fruit value set to zero successfully." );
	
	game.fruit_buy( 1 );
	equal( game.$fruit.text(), '1', "Fruit text shows a single piece of fruit." );
	equal( game.fruit, 1, "Fruit value shows a single piece of fruit." );
	equal( game.account, cash-.30, "Wallet reflects fruit change." );
	
});

// Test juice making
test( "Juice make", function()
{
	var fruit = game.fruit;
	var juice = game.juice;
	
	game.juice_make( 1 );
	fruit--;
	juice += ( 1 * game.juice_per_fruit );
	equal( game.$fruit.text(), String( fruit ) , "Fruit text quantity properly reduced.");
	equal( game.fruit, fruit, "Fruit value properly decremented." );
	equal( game.$juice.text(), String( juice.toFixed( 3 ) ), "Juice text incremented properly." );
	equal( game.juice, juice, "Juice value incremented properly." );
	
});

// Test juice selling
test( "Juice sell", function() {
	var juice = game.juice;
	var cash = game.account;
	
	game.juice_sell();
	juice -= game.serving_size
	cash += game.price
	equal( game.$juice.text(), String( juice.toFixed( 3 ) ), "Juice text properly updated." );
	equal( game.juice, juice, "Juice value is correct." );
	equal( game.$account.text(), String( cash.toFixed( 2 ) ), "Account text properly incremented." );
	equal( game.account, cash, "Account value properly incremented." );
});

// Test clock
asyncTest( "Clock", function() {
	expect( 6 );
	
	game.$hour.text( "11" );
	game.clock.hour = 11;
	game.$minute.text( "59" );
	game.clock.minute = 59;
	var meridiem = game.clock.meridiem;
	var meridiemText = game.$meridiem.text();
	var hour = game.clock.hour;
	var hourText = game.$hour.text();
	var minute = game.clock.minute;
	var minText = game.$minute.text();
	
	setTimeout( function() {
		var new_meridiem = game.clock.meridiem;
		var new_meridiemText = game.$meridiem.text();
		var new_hour = game.clock.hour;
		var new_hourText = game.$hour.text();
		var new_minute = game.clock.minute;
		var new_minText = game.$minute.text();
		
		ok( new_meridiem != meridiem, "Passed, meridiem text works." );
		ok( new_meridiemText != meridiemText, "Passed, meridiem value works." );
		ok( new_hour == 12, "Passed, hour changed correctly." );
		ok( new_hourText == "12", "Passed, hour text changed correctly." );
		ok( new_minute == 0, "Passed, minute value changed correctly." );
		ok( new_minText == "00", "Passed, minute text changed correctly." );
		start();
	}, 1100 );
});

// Test closing time
asyncTest( "Closing Time", function() {
	expect( 4 );
	
	game.$hour.text( "4" );
	game.clock.hour = 4;
	game.$minute.text( "59" );
	game.clock.minute = 59;
	game.$meridiem.text( "PM" );
	game.clock.meridiem = "PM";
	var fruit = game.fruit;
	
	setTimeout( function(){
		var new_hour = game.clock.hour;
		ok( new_hour == 5, "Clock shows 5." );
		start();
	}, 1100 );
	stop();
	
	setTimeout( function() {
		var new_minute = game.clock.minute;
		var juice = game.juice;
		var new_fruit = game.fruit;
		ok( new_minute == 0, "Clock doesn't move after five." );
		ok( juice == 0, "Juice is properly set to zero." );
		ok( new_fruit == ( Math.ceil( fruit / 2 ) ), "Fruit is properly halved after close." );
		start();
	}, 1100 );
});

