$( function() {
	$( document ).on( "click", "#sign-up-link, #sign-in-link", function( e ) {
		e.preventDefault();

		$("#sign-up-form").toggle();
		$("#sign-in-form").toggle();
	} );

	var email_regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
	var url_regexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,7})([\/\w \.-]*)*\/?$/;
	var twitter_regexp = /^@([a-zA-Z0-9_]{1,15})$/;
	var name_regexp = /^[a-zA-Z]+$/;

	$( document ).on( "submit", "#sign-in-form", function( e ) {
		var error = false;

		if ( null == $('#sign-in-email').val().match( email_regexp ) )
		{
			error = 'Please provide a valid email';
		}
		else if ( '' == $('#sign-in-password').val() ) {
			error = 'Password must not be empty';
		}

		if ( error ) {
			e.preventDefault();
			$( '#sign-in-error' ).html( error );
		}
	} );

	$( document ).on( "submit", "#sign-up-form", function( e ) {
		var error = false;

		if ( null == $('#sign-up-email').val().match( email_regexp ) )
		{
			error = 'Please provide a valid email';
		}
		else if ( $('#sign-up-password').val() != $('#sign-up-password_confirm').val() ) {
			error = 'Passwords must match';
		}
		else if ( '' == $('#sign-up-password').val() ) {
			error = 'Password must not be empty';
		}
		else if ( null == $('#sign-up-url').val().match( url_regexp ) )
		{
			error = 'Bad URL';
		}
		else if ( null == $('#sign-up-twitter').val().match( twitter_regexp ) )
		{
			error = 'Bad Twitter handle';
		}

		if ( error ) {
			e.preventDefault();
			$( '#sign-up-error' ).html( error );
		}
	} );
} );