<?php
session_start();

// @TODO: hw5, you may want to move this.
juice_database_connect();

if ( 'index.php' == juice_get_script() && 'POST' == $_SERVER['REQUEST_METHOD'] )
{
	$error = FALSE;

	// sign up
	if ( isset( $_POST['password_confirm'] ) )
	{
		$result = juice_sign_up( $_POST['email'], $_POST['password'], $_POST['password_confirm'] );
	}// end if
	else // sign in
	{
		$result = juice_authenticate( $_POST['email'], $_POST['password'] );
	}// end else

	// successful, redirect
	if ( TRUE === $result )
	{
		header( 'Location: game.php' );
		exit;
	}//end if

	$error = $result;
}// end if
elseif ( isset( $_GET['logout'] ) )
{
	juice_logout();
	header( 'Location: index.php' );
	exit;
}// end elseif
elseif ( 'index.php' != juice_get_script() )
{
	if ( ! $_SESSION['user_id'] )
	{
		header( 'Location: index.php' );
		exit;
	}//end if
}// end if
