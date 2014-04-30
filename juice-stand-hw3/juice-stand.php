<?php
session_start();

juice_database_connect();

if ( 'index.php' == juice_get_script() && 'POST' == $_SERVER['REQUEST_METHOD'] )
{
	$email = $_POST['email'];
	$password = $POST['password'];
	$password_confirm = $_POST['password_confirm'];
	// do authentication stuff
	if(!isset($_POST['password_confirm'])){
		juice_authenticate($email, $password);
	}
	else{
		if($password == $password_confirm){
			juice_sign_up($email, $password, $password_confirm);
		}
		else{
			header("Location: index.php");
			die();
		}
	}
}// end if
elseif ( isset( $_GET['logout'] ) )
{
	// do logout stuff
}// end elseif
elseif ( 'index.php' != juice_get_script() )
{
	// if they aren't logged in, redirect them to the login page
	header("Location: index.php");
	die();
}// end if

function juice_database_connect()
{
	global $db;
	
	$db = new mysqli('localhost', 'bchigman', 'tidyquai', 'bchigman');
	
	if($db->connect_errno > 0){
		die('Unable to connect to database ['. $db->connect_error . ']');
	}
	
	// move existing database connection code here
}//end juice_database_connect

function juice_get_script()
{
	$arr = explode( '/', $_SERVER['SCRIPT_NAME'] );
	return array_pop( $arr );
	
}//end juice_get_script

function juice_load_game()
{
	global $db;
	
	// move game loading code here
	$sql = "SELECT * FROM user WHERE id = $id";
	
	if(!$result = $db->query($sql)){
		die('There was an error running the query [' . $db->error . ']');
	}

	$row = $result->fetch_assoc();
	
}//end juice_load_game

function juice_save_game( $state )
{
	global $db;
	
	// move save game code here
	$prep = $db->prepare("UPDATE game SET
		stand_name = ?,
		balance = ?,
		price = ?,
		game_date = ?,
		game_time = ?,
		fruit = ?,
		juice = ?,
		customers = ?
		WHERE id = $id");
	$prep->bind_param('sddssidi',
		$_POST['name'],
		$_POST['balance'],
		$_POST['price'],
		$_POST['date'],
		$_POST['time'],
		$_POST['fruit'],
		$_POST['juice'],
		$_POST['customers']);
	$prep->execute();
	$prep->close();

	return TRUE;
}//end juice_save_game

function juice_sign_up( $email, $password, $password_confirm )
{
	// create an account for the user
	$hash = password_hash($password, PASSWORD_DEFAULT);
	$prep = $db->prepare("INSERT INTO user(email,password) VALUES (?,?)");
	$prep->bind_param('ss', $_POST['email'], $_POST['password']);
	$prep->execute();
	$newId = $prep->insert_id;
	$prep->close();
	
	return TRUE;
}//end juice_sign_up

function juice_authenticate( $email, $password )
{
	// check username and password; setup session
	
}//end juice_authenticate

function juice_logout()
{
	// log them out
}//end juice_logout