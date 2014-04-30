<?php
session_start();

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

function juice_database_connect()
{
	global $db;

	$db = new mysqli( 'localhost', 'bchigman', 'tidyquai', 'bchigman' );
	if ( $db->connect_errno > 0 )
	{
		die( 'Unable to connect to database [' . $db->connect_error . ']' );
	}// end if
}//end juice_database_connect

function juice_get_script()
{
	$arr = explode( '/', $_SERVER['SCRIPT_NAME'] );
	return array_pop( $arr );
}//end juice_get_script

function juice_load_game()
{
	global $db;

	$sql = 'SELECT * FROM game WHERE id = 1';
	if ( ! $result = $db->query( $sql ) )
	{
		die( 'There was an error running the query [' . $db->error . ']' );
	}// end if
	return $result->fetch_assoc();
}//end juice_load_game

function juice_save_game( $state )
{
	global $db;

	$state['date'] = date( 'Y-m-d', strtotime( $state['date'] ) );
	$state['time'] = date( 'H:i:s', strtotime( $state['time'] ) );

	$stmt = $db->prepare(
		'UPDATE game SET
			stand_name = ?,
			balance = ?,
			price = ?,
			game_date = ?,
			game_time = ?,
			fruit = ?,
			juice = ?,
			customers = ?
		WHERE id = 1' );

	$stmt->bind_param( 'sddssidi',
		$state['name'],
		$state['balance'],
		$state['price'],
		$state['date'],
		$state['time'],
		$state['fruit'],
		$state['juice'],
		$state['customers']
	);
	$ok = $stmt->execute();
	$stmt->close();

	return TRUE;
}//end juice_save_game

function juice_sign_up( $email, $password, $password_confirm )
{
	global $db;

	if ( $password_confirm !== $password )
	{
		return 'Password do not match.';
	}// end if

	// first check if the user already exists
	$sql = 'SELECT * FROM user WHERE email = ?';
	$stmt = $db->prepare( $sql );
	$stmt->bind_param( 's', $email );
	$stmt->execute();
	$stmt->bind_result($id, $email, $hash);
	$stmt->fetch();
	if ( $email != '' )
	{
		return 'Duplicate account detected.';
	}//end if

	// not a duplicate...
	$sql = 'INSERT INTO user ( email, password ) VALUES ( ?, ? )';
	$stmt = $db->prepare( $sql );
	$stmt->bind_param( 'ss',
		$email,
		password_hash( $password, PASSWORD_DEFAULT )
	);
	$stmt->execute();

	return TRUE;
}//end juice_sign_up

function juice_authenticate( $email, $password )
{
	global $db;

	$sql = 'SELECT * FROM user WHERE email = ?';
	$stmt = $db->prepare( $sql );
	$stmt->bind_param( 's', $email );
	$stmt->execute();
	$stmt->bind_result($id, $email, $hash);
	$stmt->fetch();
	if ( $email = '' )
	{
		return 'Email not found.';
	}//end if

	if ( ! password_verify( $password, $hash ) )
	{
		return 'Bad password';
	}// end if

	$_SESSION['user_id'] = $id;

	return TRUE;
}//end juice_authenticate

function juice_logout()
{
	$_SESSION['user_id'] = FALSE;
	unset( $_SESSION['user_id'] );
	session_destroy();
}//end juice_logout
