<?php
class JuiceStand 
{
	//Class Variables
	private $db;
	public $offline_mode = FALSE;
	public $offline_support = TRUE;
	
	private function db()
	{
	
		if( ! $this->db )
		{
	
			$this->db = new mysqli( 'localhost', 'bchigman', 'tidyquai', 'bchigman' );
			
			if ( $this->db->connect_errno > 0 )
			{
				if ( ! $this->offline_support )
				{
					die( 'Unable to connect to database [' . $this->db()->connect_error . ']' );
				}
				
				$this->offline_mode = TRUE;
				return FALSE;
			}// end if
			else
			{
				$this->offline_mode = FALSE;
			}			
		}
		
		return $this->db;
	}//end db
	
	// Function to report logged in or out
	public function logged_in()
	{
		return isset($_SESSION['user_id']);
	}
	
	// function to toggle $offline_support to false
	public function disable_offline_support()
	{
		$offline_support = FALSE;
	}

	public function get_script()
	{
		$arr = explode( '/', $_SERVER['SCRIPT_NAME'] );
		return array_pop( $arr );
	}//end get_script

	public function load_game()
	{
		$this->db();
		if ( TRUE == $this->offline_mode )
		{
			return FALSE;
		}//end if

		$sql = 'SELECT * FROM game WHERE id = 1';
		if ( ! $result = $this->db()->query( $sql ) )
		{
			die( 'There was an error running the query [' . db()->error . ']' );
		}// end if
		return $result->fetch_assoc();
	}//end load_game

	public function save_game( $state )
	{
		if ( TRUE == $this->offline_mode )
		{
			return FALSE;
		}//end if

		$state['date'] = date( 'Y-m-d', strtotime( $state['date'] ) );
		$state['time'] = date( 'H:i:s', strtotime( $state['time'] ) );

		$stmt = $this->db()->prepare(
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
	}//end save_game

	public function sign_up( $email, $password, $password_confirm, $name, $url, $twitter )
	{
		
		if ( TRUE == $this->offline_mode )
		{
			return 'Unable to take new sign ups at this time.';
		}//end if

		if ( '' == $email || '' == $password )
		{
			return 'Email and password are required.';
		}

		if ( $password_confirm !== $password )
		{
			return 'Passwords do not match.';
		}// end if

		// first check if the user already exists
		$sql = 'SELECT id FROM user WHERE email = ?';
		$stmt = $this->db()->prepare( $sql );
		$stmt->bind_param( 's', $email );
		$stmt->execute();
		$stmt->bind_result( $ok );
		if ( $stmt->fetch() )
		{
			return 'Duplicate account detected.';
		}//end if

		// not a duplicate...
		$sql = 'INSERT INTO user ( email, password, name, url, twitter ) VALUES ( ?, ?, ?, ?, ? )';
		$stmt = $this->db()->prepare( $sql );
		$stmt->bind_param( 'sssss',
			$email,
			password_hash( $password, PASSWORD_DEFAULT ),
			$name,
			$url,
			$twitter
		);
		$stmt->execute();

		return TRUE;
	}//end sign_up

	public function authenticate( $email, $password )
	{

		if ( TRUE == $this->offline_mode )
		{
			return FALSE;
		}//end if

		if ( '' == $email || '' == $password )
		{
			return 'Both fields are required.';
		}

		$sql = 'SELECT id, password FROM user WHERE email = ?';
		$stmt = $this->db()->prepare( $sql );
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
	}//end authenticate

	public function logout()
	{
		unset($_SESSION['user_id']);
		session_destroy();
	}//end logout

	// Fetches a user profile based on id
	public function profile( $user_id )
	{
		if ( ! $user_id )
		{
			return FALSE;
		}// end if
		
		$sql = 'SELECT email FROM user WHERE id = ?';

		$stmt = $this->db()->prepare( $sql );

		$stmt->bind_param( 'i', $user_id );
		$stmt->execute();
		$stmt->bind_result( $email );
		if ( ! $stmt->fetch() )
		{
			return FALSE;
		}//end if

		$image = 'http://www.gravatar.com/avatar/' . md5( $email );

		return $image;
	}// end profile
}

// Create singleton for function execution
function juice_stand()
{
	global $juice_stand;
	
	if( !$juice_stand )
	{
		$juice_stand = new JuiceStand;
	}// end if
	
	return $juice_stand;
}//end juice_stand