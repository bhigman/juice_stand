<?php

class JuiceStand
{
	public $offline_mode = FALSE;

	private $db;
	private $offline_support = TRUE;

	public function __construct()
	{
	}//end __construct

	public function game()
	{
		$row = $this->load_game();

		?>
		<section>
			<div id="stand">
				<i class="fa fa-home"></i>
				<p><?php echo $row['stand_name']; ?></p>
			</div>
			<div id="account">
				<i class="fa fa-money"></i>
				<h2>Bank Account</h2>
				<img src="">
				<p>$<span id="account-value"><?php echo number_format( $row['balance'], 2 ); ?></span></p>
			</div>
			<div id="price">
				<i class="fa fa-credit-card"></i>
				<h2>Price</h2>
				<p>$<span id="price-value"><?php echo number_format( $row['price'], 2 ); ?></span></p>
			</div>
			<div id="updates">
				<i class="fa fa-bullhorn"></i>
				<p>
				+ $0.50 satisfied customer<br />
				- $100 fine (food poisoning)<br />
				</p>
			</div>
		</section>

		<section>
			<?php $u_game_time = ( juice_stand()->offline_mode ) ? 0 : strtotime( $row['game_date'] . ' ' . $row['game_time'] ); ?>
			<div id="date" data-date="<?php echo $u_game_time; ?>">
				<i class="fa fa-calendar"></i>
				<h2><?php echo date( 'M dS', $u_game_time ); ?></h2>
				<p><span id="hour"><?php echo date( 'g', $u_game_time ); ?></span><span id="separator">:</span><span id="minute"><?php echo date( 'i', $u_game_time ); ?></span> <span id="meridiem"><?php echo date( 'A', $u_game_time ); ?></span></p>
			</div>
			<div id="inventory">
				<i class="fa fa-lemon-o"></i>
				<h2>Fruit</h2>
				<p><?php echo $row['fruit']; ?></p>
				<div>
					<button data-amount="1">Buy 1 @ $0.30</button>
					<button data-amount="4">Buy 4 @ $1.00</button>
					<button data-amount="30">Buy 30 @ $6.00</button>
					<button data-amount="140">Buy 140 @ $21.00</button>
				</div>
			</div>
			<div id="product">
				<i class="fa fa-tint"></i>
				<h2>Juice</h2>
				<p><span id="product-value"><?php echo number_format( $row['juice'], 3 ); ?></span> L</p>
				<div>
					<strong>Make:</strong>
					<button data-amount="1">1</button>
					<button data-amount="10">10</button>
					<button data-amount="all">All</button>
				</div>
			</div>
			<div id="customers">
				<i class="fa fa-users"></i>
				<h2>Customers</h2>
				<p><?php echo $row['customers']; ?></p>
			</div>
		</section>
		<?php
	}//end game

	public function disable_offline_support()
	{
		$this->offline_support = FALSE;
	}//end disable_offline_support

	private function db()
	{
		if ( ! isset( $this->db ) )
		{
			@$this->db = new mysqli( 'localhost', 'bchigman', 'tidyquai', 'bchigman' );
			if ( $this->db->connect_errno > 0 )
			{
				if ( ! $this->offline_support )
				{
					die( 'Unable to connect to database [' . $this->db->connect_error . ']' );
				}//end if

				$this->offline_mode = TRUE;
				$this->db = FALSE;
			}// end if
		}//end if

		return $this->db;
	}//end db

	public function get_script()
	{
		$arr = explode( '/', $_SERVER['SCRIPT_NAME'] );
		return array_pop( $arr );
	}//end get_script

	public function load_game()
	{
		if ( TRUE == $this->offline_mode )
		{
			return FALSE;
		}//end if

		$sql = 'SELECT * FROM game WHERE id = 1';
		if ( ! $result = $this->db()->query( $sql ) )
		{
			die( 'There was an error running the query [' . $this->db()->error . ']' );
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

	public function sign_up( $email, $password, $password_confirm, $name, $twitter, $url )
	{
		if ( TRUE == $this->offline_mode )
		{
			return 'Unable to take new sign ups at this time.';
		}//end if

		if ( '' == $email || '' == $password )
		{
			return 'Email and password are required.';
		}//end if

		if ( $password_confirm !== $password )
		{
			return 'Passwords do not match.';
		}// end if

		// first check if the user already exists
		$sql = 'SELECT * FROM user WHERE email = ?';
		$stmt = $this->db()->prepare( $sql );
		$stmt->bind_param( 's', $email );
		$stmt->execute();
		$stmt->bind_result($ok);
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
			$twitter,
			$url
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
		}//end if

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
		$_SESSION = array();
		session_destroy();
	}//end logout

	public function logged_in()
	{
		return isset( $_SESSION['user_id'] ) && $_SESSION['user_id'];
	}// end logged_in

	public function logged_in_user()
	{
		return isset( $_SESSION['user_id'] ) ? $_SESSION['user_id'] : FALSE;
	}// end logged_in

	public function profile( $user_id )
	{
		if ( ! $user_id )
		{
			return FALSE;
		}// end if

		$sql = 'SELECT * FROM user WHERE id = ?';

		$stmt = $this->db()->prepare( $sql );

		$stmt->bind_param( 'i', $user_id );
		$stmt->execute();
		$res = $stmt->bind_result();
		if ( ! $row = $res->fetch_assoc() )
		{
			return FALSE;
		}//end if

		$row['image'] = 'http://www.gravatar.com/avatar/' . md5( $row['email'] );

		return $row;
	}// end profile
}//end class

/**
 * Singleton
 */
function juice_stand()
{
	global $juice_stand;

	if ( ! $juice_stand )
	{
		$juice_stand = new JuiceStand;
	}//end if

	return $juice_stand;
}//end juice_stand