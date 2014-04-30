<?php

function juice_database_connect( $fail = FALSE )
{
	global $db;

	$db = new mysqli( 'localhost', 'bchigman', 'tidyquai', 'bchigman' );
	if ( $db->connect_errno > 0 )
	{
		if ( $fail )
		{
			die( 'Unable to connect to database [' . $db->connect_error . ']' );
		}

		$GLOBALS['offline_mode'] = TRUE;
		return FALSE;
	}// end if

	$GLOBALS['offline_mode'] = FALSE;
	return TRUE;
}//end juice_database_connect

function juice_get_script()
{
	$arr = explode( '/', $_SERVER['SCRIPT_NAME'] );
	return array_pop( $arr );
}//end juice_get_script

function juice_load_game()
{
	if ( TRUE == $GLOBALS['offline_mode'] )
	{
		return FALSE;
	}//end if

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
	if ( TRUE == $GLOBALS['offline_mode'] )
	{
		return FALSE;
	}//end if

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

function juice_sign_up( $email, $name, $website, $twitter, $password, $password_confirm )
{
	//echo "$email $website $twitter $password $password_confirm";
	if ( TRUE == $GLOBALS['offline_mode'] )
	{
		return 'Unable to take new sign ups at this time.';
	}//end if

	global $db;

	if ( '' == $email || '' == $password )
	{
		return 'Email and password are required.';
	}

	if ( $password_confirm !== $password )
	{
		return 'Passwords do not match.';
	}// end if

	// first check if the user already exists
	$sql = 'SELECT 1 FROM user WHERE email = ?';
	$stmt = $db->prepare( $sql );
	$stmt->bind_param( 's', $email );

	$stmt->execute();
	$stmt->bind_result( $ok );
	if ( $stmt->fetch() )
	{
		return 'Duplicate account detected.';
	}//end if

	// not a duplicate...
	// @TOOD: homework #6 - add new fields
	$sql = 'INSERT INTO user ( email, password, name, url, twitter ) VALUES ( ?, ?, ?, ?, ? )';
	$stmt = $db->prepare( $sql );
	$stmt->bind_param( 'sssss',
		$email,
		password_hash( $password, PASSWORD_DEFAULT ),
		$name,
		$website,
		$twitter
	);
	$stmt->execute();

	return TRUE;
}//end juice_sign_up

function juice_authenticate( $email, $password )
{
	if ( TRUE == $GLOBALS['offline_mode'] )
	{
		return FALSE;
	}//end if

	global $db;

	if ( '' == $email || '' == $password )
	{
		return 'Both fields are required.';
	}

	$sql = 'SELECT id, password FROM user WHERE email = ?';
	$stmt = $db->prepare( $sql );
	$stmt->bind_param( 's', $email );

	$stmt->execute();
	$stmt->bind_result( $id, $password_hash );
	if ( ! $stmt->fetch() )
	{
		return 'Email not found.';
	}//end if

	if ( ! password_verify( $password, $password_hash ) )
	{
		return 'Bad password';
	}// end if

	$_SESSION['user_id'] = $id;

	return TRUE;
}//end juice_authenticate

function juice_logout()
{
	$_SESSION = array();
	session_destroy();
}//end juice_logout

// @TOOD: homework #6 - add juice_profile function
function juice_profile(){

	if ( TRUE == $GLOBALS['offline_mode'] )
	{
		return FALSE;
	}//end if

	global $db;
	
	// Get user id to search on
	if( !isset($_GET['user_id'])){
		$user_id = $_SESSION['user_id'];
	}
	else{
		$user_id = $_GET['user_id'];
	}
	
	$sql = 'SELECT email, name, url, twitter FROM user WHERE id = ?';
	$stmt = $db->prepare( $sql );
	$stmt->bind_param( 'i', $user_id);
	$stmt->execute();
	$stmt->bind_result( $email, $name, $url, $twitter );
	if ( ! $stmt->fetch() )
	{
		return 'Id not found.';
	}//end if
	$twitter = explode("@", $twitter);
	$twitter = $twitter[1];
	
	$_POST['email'] = $email;
	$_POST['name'] = $name;
	$_POST['url'] = $url;
	$_POST['twitter'] = $twitter;
	
}