$( function() {

	$( document ).on( "click", "#sign-up-link", function( e ) {
		e.preventDefault();

		$("#sign-up-form").show();
		$("#sign-in-form").hide();
	});

	$( document ).on( "click", "#sign-in-link", function( e ) {
		e.preventDefault();

		$("#sign-up-form").hide();
		$("#sign-in-form").show();
	});

} );