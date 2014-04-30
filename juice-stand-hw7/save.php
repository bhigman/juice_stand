<?php
require 'includes/routing.php';
$result = $juice_stand->save_game( $_POST );

if ( TRUE !== $result && ! $juice_stand->offline_mode )
{
	echo $result;
	exit;
}// end if

header( 'Location: game.php' );
exit;