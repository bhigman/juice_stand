$( function() {
	// handle the toggling between the two forms
	$(document).on('click', '#sign-up-link', function(){
		$('#sign-in-form').hide();
		$('#sign-up-form').show();
	});
	
	$(document).on('click', '#sign-in-link', function(){
		//alert("Alive");
		$('#sign-up-form').hide();
		$('#sign-in-form').show();
	});
	
	// handle clicks on the sign in and sign out buttons.
	$(document).on('click', '#sign-in', function(){
		$('#sign-in-form').submit();
	});
	
	$(document).on('click', '#sign-up', function(){
		$('#sign-up-form').submit();
	});
	
} );