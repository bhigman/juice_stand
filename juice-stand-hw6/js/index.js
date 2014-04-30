$( function() {
	
	// disable buttons for RegEx check
	$('#sign-up-form button').prop('disabled', true);
	
	$( document ).on( "click", "#sign-up-link, #sign-in-link", function( e ) {
		e.preventDefault();

		$("#sign-up-form").toggle();
		$("#sign-in-form").toggle();
	} );

	// @TOOD: homework #6 - validate the submitted form data here

	$( document ).on( "change", "input", function(){
		
		// Email My Try /^(.*)[@]{1}([A-z]*)[.]{1}$/;
		var email_regexp = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; 
		//RegExp from http://www.dotnet-tricks.com/Tutorial/javascript/UNDS040712-JavaScript-Email-Address-validation-using-Regular-Expression.html
		var email = $('#sign-up-email').val();
		var email_r = email_regexp.test(email);
		
		// Name
		var name_regexp = /^\w+( \w+)?$/;
		var name = $('#sign-up-name').val();
		var name_r = name_regexp.test(name);
		
		// Website
		var url_regexp = /^(http|https):\/\/([a-zA-Z]+\.)?[a-zA-Z0-9_-]+\.[a-z]+(\/?[A-Za-z0-9_\-\/\.\+\?=#~]+)?$/;
		var url = $('#sign-up-website').val();
		var url_r = url_regexp.test(url);
		
		// Twitter  my try /^[@]{1}[A-z0-9_]+$/;
		var twitter_regexp = /^[@]{1}[A-z0-9_]{1,15}$/;
		// RegExp from http://stackoverflow.com/questions/4424179/how-to-validate-a-twitter-username-using-regex
		var twitter = $('#sign-up-twitter').val();
		var twitter_r = twitter_regexp.test(twitter);
		
		// Set password vars
		var pass = $('#sign-up-password').val();
		var pass_conf = $('#sign-up-password_confirm').val();
		
		if(email_r && name_r && url_r && twitter_r && pass == pass_conf){
			console.log("valid user");
			$('#sign-up-form button').prop('disabled', false);
		}
		else{
			console.log('invalid');
		}
	});
} );