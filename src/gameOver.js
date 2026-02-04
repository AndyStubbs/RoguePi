"use strict";
// File: gameOver.js

window.g_gameOver = ( function () {
	const HIGH_SCORES_KEY = "RoguePiHighScores";
	const MAX_HIGH_SCORES = 10;

	return {
		"showGameOverScreen": showGameOverScreen,
		"getPlayerScore": getPlayerScore,
		"getScoreBreakdown": getScoreBreakdown
	};

	function getScoreBreakdown() {
		let gold = g_player.gold || 0;
		let itemsTotal = 0;
		function addItemValue( item ) {
			if( !item || item.name === "gold coin" ) {
				return;
			}
			const cost = item.cost != null ? item.cost : 0;
			const qty = item.quantity != null ? item.quantity : 1;
			itemsTotal += cost * qty;
		}
		for( const item of g_player.items || [] ) {
			addItemValue( item );
		}
		for( const slot in g_player.armor || {} ) {
			addItemValue( g_player.armor[ slot ] );
		}
		for( const slot in g_player.weapons || {} ) {
			addItemValue( g_player.weapons[ slot ] );
		}
		return {
			"gold": gold,
			"itemsTotal": itemsTotal,
			"total": gold + itemsTotal
		};
	}

	function getPlayerScore() {
		const b = getScoreBreakdown();
		return b.total;
	}

	function getHighScores() {
		try {
			const raw = localStorage.getItem( HIGH_SCORES_KEY );
			if( !raw ) {
				return [];
			}
			const list = JSON.parse( raw );
			if( !Array.isArray( list ) ) {
				return [];
			}
			return list.map( entry => ( {
				"score": entry.score,
				"survived": entry.survived === true,
				"name": entry.name != null ? String( entry.name ) : "Adventurer"
			} ) );
		} catch ( e ) {
			return [];
		}
	}

	function saveHighScore( score, survived, name ) {
		const list = getHighScores();
		list.push( {
			"score": score,
			"survived": survived,
			"name": name != null ? String( name ).trim() || "Adventurer" : "Adventurer"
		} );
		list.sort( ( a, b ) => b.score - a.score );
		const trimmed = list.slice( 0, MAX_HIGH_SCORES );
		try {
			localStorage.setItem( HIGH_SCORES_KEY, JSON.stringify( trimmed ) );
		} catch ( e ) {}
	}

	function showGameOverScreen( survived ) {
		const breakdown = getScoreBreakdown();
		const score = breakdown.total;
		const playerName = g_player.name != null ? String( g_player.name ).trim() || "Adventurer" : "Adventurer";
		saveHighScore( score, survived, playerName );

		const cols = $.getCols();
		const rows = $.getRows();
		$.cls();

		// Colors: title gold, result red/green, score white, breakdown label/values, table header cyan, table rows dim, current row highlight, F5 hint gray, border
		const colorTitle = 14;
		const colorDied = 4;
		const colorSurvived = 2;
		const colorScore = 15;
		const colorBreakdownLabel = 11;
		const colorBreakdownValue = 7;
		const colorHeader = 11;
		const colorRow = 7;
		const colorCurrentRow = 14;
		const colorHint = 8;
		const colorBorder = 6;

		// Top border
		$.setColor( colorBorder );
		$.rect( 1, 1, $.width() - 2, $.height() - 2 );
		$.rect( 3, 3, $.width() - 6, $.height() - 6 );

		let row = 3;

		$.setColor( colorTitle );
		$.setPos( 0, row );
		$.print( "* * *   GAME OVER   * * *", true, true );
		row += 2;

		if( survived ) {
			$.setColor( colorSurvived );
			$.setPos( 0, row );
			$.print( "You survived!", true, true );
		} else {
			$.setColor( colorDied );
			$.setPos( 0, row );
			$.print( "You died.", true, true );
		}
		row += 2;

		$.setColor( colorScore );
		$.setPos( 0, row );
		$.print( "Score: " + score, true, true );
		row += 2;

		// Score breakdown: Gold, then each item in inventory, then total
		const breakdownWidth = 36;
		const breakdownLeft = Math.max( 0, Math.floor( ( cols - breakdownWidth ) / 2 ) );
		const valueW = 8;
		$.setPos( breakdownLeft, row );
		$.setColor( colorBreakdownLabel );
		$.print( "  Gold: ", true );
		$.setColor( colorBreakdownValue );
		$.print( breakdown.gold.toString().padStart( valueW ), true );
		row += 1;
		$.setPos( breakdownLeft, row );
		$.setColor( colorBreakdownLabel );
		$.print( "  Inventory:", true );
		row += 1;
		const itemNameW = breakdownWidth - 4 - valueW - 2;
		for( const item of g_player.items || [] ) {
			if( !item || item.name === "gold coin" ) {
				continue;
			}
			const cost = item.cost != null ? item.cost : 0;
			const qty = item.quantity != null ? item.quantity : 1;
			const value = cost * qty;
			let nameStr = ( item.name && g_util.properName( item.name ) ) || "?";
			if( qty > 1 ) {
				nameStr += " (x" + qty + ")";
			}
			if( nameStr.length > itemNameW ) {
				nameStr = nameStr.substring( 0, itemNameW - 1 ) + ".";
			} else {
				nameStr = nameStr.padEnd( itemNameW );
			}
			$.setPos( breakdownLeft, row );
			$.setColor( colorBreakdownValue );
			$.print( "    " + nameStr + "  ", true );
			$.print( value.toString().padStart( valueW ), true );
			row += 1;
		}
		$.setPos( breakdownLeft, row );
		$.setColor( colorBreakdownLabel );
		$.print( "  -------", true );
		row += 1;
		$.setPos( breakdownLeft, row );
		$.setColor( colorBreakdownLabel );
		$.print( "  Total: ", true );
		$.setColor( colorScore );
		$.print( breakdown.total.toString().padStart( valueW ), true );
		row += 2;

		$.setColor( colorHeader );
		$.setPos( 0, row );
		$.print( "--- HIGH SCORES (top 10) ---", true, true );
		row += 2;

		const highScores = getHighScores();
		const rankColW = 3;
		const nameColW = 18;
		const scoreColW = 10;
		const resultColW = 8;
		const tableWidth = rankColW + 1 + nameColW + 1 + scoreColW + 1 + resultColW;
		const leftPad = Math.max( 0, Math.floor( ( cols - tableWidth ) / 2 ) );

		const headerStr = "  #".padEnd( rankColW ) + " " +
			"Name".padEnd( nameColW ) + " " +
			"Score".padStart( scoreColW ) + " " +
			"Result".padEnd( resultColW );

		$.setPos( leftPad, row );
		$.setColor( colorHeader );
		$.print( headerStr, true );
		row += 1;

		for( let i = 0; i < highScores.length; i++ ) {
			const entry = highScores[ i ];
			const isCurrent = entry.score === score && entry.name === playerName && entry.survived === survived;
			$.setColor( isCurrent ? colorCurrentRow : colorRow );
			const rankStr = ( " " + ( i + 1 ).toString().padStart( 2 ) ).padStart( rankColW );
			const nameStr = entry.name.length > nameColW
				? entry.name.substring( 0, nameColW - 1 ) + "."
				: entry.name.padEnd( nameColW );
			const scoreStr = entry.score.toString().padStart( scoreColW );
			const resultStr = ( entry.survived ? "Survived" : "Died" ).padEnd( resultColW );
			const line = rankStr + " " + nameStr + " " + scoreStr + " " + resultStr;
			$.setPos( leftPad, row );
			$.print( line, true );
			row += 1;
		}

		row = rows - 2;
		$.setColor( colorHint );
		$.setPos( 0, row );
		$.print( "Press F5 to play again", true, true );
	}
} )();
