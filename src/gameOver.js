"use strict";
// File: gameOver.js

window.g_gameOver = ( function () {
	const HIGH_SCORES_KEY = "RoguePiHighScores";
	const MAX_HIGH_SCORES = 10;
	const RANK_COL_W = 2;      // numeric ranking (#)
	const NAME_COL_W = 16;     // player name
	const TITLE_COL_W = 10;     // level rank title (Novice, Adventurer, etc.)
	const SCORE_COL_W = 8;
	const SYMBOL_COL_W = 1;
	const RESULT_COL_W = 22;
	const PI_SYMBOL = String.fromCharCode( 227 );

	return {
		"showGameOverScreen": showGameOverScreen
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
				"name": entry.name != null ? String( entry.name ) : "Adventurer",
				"killedBy": entry.killedBy != null ? String( entry.killedBy ) : "",
				"scoreId": entry.scoreId != null ? entry.scoreId : null,
				"rank": entry.rank != null ? String( entry.rank ) : ""
			} ) );
		} catch ( e ) {
			return [];
		}
	}

	function saveHighScore( score, survived, name, killedBy, scoreId, rank ) {
		const list = getHighScores();
		list.push( {
			"score": score,
			"survived": survived,
			"name": name != null ? String( name ).trim() || "Adventurer" : "Adventurer",
			"killedBy": killedBy != null ? String( killedBy ).trim() : "",
			"scoreId": scoreId != null ? scoreId : Date.now(),
			"rank": rank != null ? String( rank ).trim() : ""
		} );
		list.sort( ( a, b ) => b.score - a.score );
		const trimmed = list.slice( 0, MAX_HIGH_SCORES );
		try {
			localStorage.setItem( HIGH_SCORES_KEY, JSON.stringify( trimmed ) );
		} catch ( e ) {}
	}

	function showGameOverScreen( survived, killedBy ) {
		const breakdown = getScoreBreakdown();
		const score = breakdown.total;
		const playerName = g_player.name != null ? String( g_player.name ).trim() || "Adventurer" : "Adventurer";
		const deathCause = ( killedBy != null ? String( killedBy ).trim() : "" ) || ( g_player.killedBy != null ? String( g_player.killedBy ).trim() : "" );
		const currentScoreId = Date.now();
		const playerRank = g_player.rank != null ? String( g_player.rank ).trim() : "";
		saveHighScore( score, survived, playerName, deathCause, currentScoreId, playerRank );

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
		$.setPos( 50, row );
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
		$.print( "  ----------------------------------", true );
		row += 1;
		$.setPos( breakdownLeft, row );
		$.setColor( colorBreakdownLabel );
		$.print( "  Total: ", true );
		$.setPos( 50, row );
		$.setColor( colorScore );
		$.print( breakdown.total.toString().padStart( valueW ), true );
		row += 3;

		$.setColor( colorHeader );
		$.setPos( 0, row );
		$.print( "--- HIGH SCORES (top 10) ---", true, true );
		row += 2;

		const highScores = getHighScores();
		const headerStr = " #".padEnd( RANK_COL_W ) + " " +
			"Name".padEnd( NAME_COL_W ) + " " +
			"Rank".padEnd( TITLE_COL_W ) + " " +
			"Score".padStart( SCORE_COL_W ) + " " +
			PI_SYMBOL.padEnd( SYMBOL_COL_W ) + " " +
			"Result".padEnd( RESULT_COL_W );

		const tableLines = [ headerStr ];
		for( let i = 0; i < highScores.length; i++ ) {
			const entry = highScores[ i ];
			tableLines.push( createScoreLine( entry, i ) );
		}

		const longestLineLen = Math.max( ...tableLines.map( line => line.length ) );
		const leftPad = Math.max( 0, Math.floor( ( cols - longestLineLen ) / 2 ) ) + 1;

		let isCurrentScoreInTop10 = false;
		for( let i = 0; i < tableLines.length; i++ ) {
			const isCurrentRow = i > 0 && highScores[ i - 1 ].scoreId === currentScoreId;
			if( isCurrentRow ) {
				isCurrentScoreInTop10 = true;
				$.setColor( colorCurrentRow );
			} else if( i === 0 ) {
				$.setColor( colorHeader );
			} else {
				$.setColor( colorHint );
			}
			$.setPos( leftPad + 5, row );
			$.print( tableLines[ i ], true );
			row += 1;
		}

		if( !isCurrentScoreInTop10 ) {
			row += 1;
			const newLine = createScoreLine( {
				"name": playerName,
				"rank": playerRank,
				"score": score,
				"survived": survived,
				"killedBy": deathCause
			}, null );
			$.setColor( colorCurrentRow );
			$.setPos( leftPad + 5, row );
			$.print( newLine, true );
			row += 2;
		}
		row = rows - 2;
		$.setColor( colorHint );
		$.setPos( 0, row );
		$.print( "Press F5 to play again", true, true );
	}

	function createScoreLine( entry, index ) {
		let rankStr = "";
		if( index != null ) {
			rankStr = ( index + 1 ).toString().padStart( RANK_COL_W );
		} else {
			rankStr = "  ".padStart( RANK_COL_W );
		}
		const nameStr = entry.name.length > NAME_COL_W
			? entry.name.substring( 0, NAME_COL_W - 1 ) + "."
			: entry.name.padEnd( NAME_COL_W );
		const rankTitleRaw = entry.rank || "";
		const rankTitleStr = rankTitleRaw.length > TITLE_COL_W
			? rankTitleRaw.substring( 0, TITLE_COL_W - 1 ) + "."
			: rankTitleRaw.padEnd( TITLE_COL_W );
		const scoreStr = entry.score.toString().padStart( SCORE_COL_W );
		const symbolStr = entry.survived ? PI_SYMBOL : "-";
		const resultText = entry.survived
			? "Survived"
			: ( "Killed by " + ( entry.killedBy || "?" ) );
		const resultStr = resultText.length > RESULT_COL_W
			? resultText.substring( 0, RESULT_COL_W - 1 ) + "."
			: resultText.padEnd( RESULT_COL_W );
		return rankStr + " " + nameStr + " " + rankTitleStr + " " + scoreStr + " " + symbolStr + " " + resultStr;
	}

} )();
