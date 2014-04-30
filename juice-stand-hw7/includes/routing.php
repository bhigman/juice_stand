<?php
session_start();
require __DIR__ . '/JuiceStand.php';

if ( 'index.php' == juice_stand()->get_script() && 'POST' == $_SERVER['REQUEST_METHOD'] )
{
	 // fail if it cannot connect
	//$error = juice_stand()->db()->connect_error;

	// sign up
	if ( isset( $_POST['password_confirm'] ) )
	{
		$result = juice_stand()->sign_up( $_POST['email'], $_POST['password'], $_POST['password_confirm'], $_POST['name'], $_POST['url'], $_POST['twitter'] );
	}// end if
	else // sign in
	{
		$result = juice_stand()->authenticate( $_POST['email'], $_POST['password'] );
	}// end else

	// successful, redirect
	if ( TRUE === $result )
	{
		juice_stand()->logged_in = TRUE;
		header( 'Location: game.php' );
		exit;
	}//end if

	$error = $result;
}// end if
elseif ( isset( $_GET['logout'] ) )
{
	juice_stand()->logout();
	header( 'Location: index.php' );
	exit;
}// end elseif
elseif ( 'index.php' != juice_stand()->get_script() && ! juice_stand()->logged_in())
{
	header( 'Location: index.php' );
	exit;
}// end if
