<?php
require 'includes/routing.php';

$result = juice_stand()->save_game( $_POST );
//sleep(5);
if ( TRUE !== $result && ! $GLOBALS['offline'] )
{
	echo $result;
	exit;
}// end if

//header( 'Location: game.php' );
exit;