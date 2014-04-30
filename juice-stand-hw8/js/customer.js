function Customer( gender ) {
	this.gender = gender;

	this.init = function() {
		this.id = 'customer-' + game.customer_num;
		this.patience = game.customer_patience;

		game.customer_num++;
		game.customers.push( this );

		game.$customers.append( this.icon() );
		$( document ).on( "click", '#' + this.id, this.serve );
	};

	this.serve = function() {
		game.juice_sell();
		game.customer_find( this.id ).leave( 'satisfied' );
	};

	this.icon = function () {
		return '<i class="fa fa-' + this.gender + ' customer" id="' + this.id + '"></i>';
	};

	this.wait = function() {
		this.patience--;

		if ( 0 >= this.patience ) {
			this.leave( 'pissed' );
			return false;
		}//end if
		else {
			patience_ratio = this.patience / game.customer_patience;
			if ( 0.1001 > patience_ratio ) {
				$( '#' + this.id ).css( "color", "#e74276" );
			}
			else if ( 0.5001 > patience_ratio ) {
				$( '#' + this.id ).css( "color", "#ff7a49" );
			}
		}// end else

		return true;
	};

	this.leave = function( state ) {
		index = game.customers.indexOf( this );
		game.customers.splice( index, 1 );

		$( '#' + this.id ).remove();
	}

	this.init();
};

Customer.prototype.kind = 'customer';