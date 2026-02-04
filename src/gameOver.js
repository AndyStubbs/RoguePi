"use strict";
// File: gameOver.js

window.g_gameOver = ( function () {
	const HIGH_SCORES_KEY = "RoguePiHighScores";
	const MAX_HIGH_SCORES = 10;

	return {
		"showGameOverScreen": showGameOverScreen,
		"getPlayerScore": getPlayerScore
	};

	function getPlayerScore() {
		let total = g_player.gold || 0;
		function addItemValue( item ) {
			if( !item || item.name === "gold coin" ) {
				return;
			}
			const cost = item.cost != null ? item.cost : 0;
			const qty = item.quantity != null ? item.quantity : 1;
			total += cost * qty;
		}
		for( const item of g_player.items || [] ) {
			addItemValue( item );
		}
		return total;
	}

	function getHighScores() {
		try {
			const raw = localStorage.getItem( HIGH_SCORES_KEY );
			if( !raw ) {
				return [];
			}
			const list = JSON.parse( raw );
			return Array.isArray( list ) ? list : [];
		} catch ( e ) {
			return [];
		}
	}

	function saveHighScore( score, survived ) {
		const list = getHighScores();
		list.push( { "score": score, "survived": survived } );
		list.sort( ( a, b ) => b.score - a.score );
		const trimmed = list.slice( 0, MAX_HIGH_SCORES );
		try {
			localStorage.setItem( HIGH_SCORES_KEY, JSON.stringify( trimmed ) );
		} catch ( e ) {}
	}

	function centerText( text, row ) {
		const cols = $.getCols();
		const leftPad = Math.max( 0, Math.floor( ( cols - text.length ) / 2 ) );
		$.setPos( leftPad, row );
		$.print( text, true );
	}

	function showGameOverScreen( survived ) {
		const score = getPlayerScore();
		saveHighScore( score, survived );

		const cols = $.getCols();
		const rows = $.getRows();
		console.log( rows );
		$.cls();

		// Colors: title gold, result red/green, score white, table header cyan, table rows dim, F5 hint gray, border
		const colorTitle = 14;
		const colorDied = 4;
		const colorSurvived = 2;
		const colorScore = 15;
		const colorHeader = 11;
		const colorRow = 7;
		const colorHint = 8;
		const colorBorder = 6;

		// Top border
		$.setColor( colorBorder );
		$.rect( 1, 1, $.width() - 2, $.height() - 2 );
		$.rect( 3, 3, $.width() - 6, $.height() - 6 );

		let row = 3;

		$.setColor( colorTitle );
		centerText( "* * *   GAME OVER   * * *", row );
		row += 2;

		if( survived ) {
			$.setColor( colorSurvived );
			centerText( "You survived!", row );
		} else {
			$.setColor( colorDied );
			centerText( "You died.", row );
		}
		row += 2;

		$.setColor( colorScore );
		centerText( "Score: " + score, row );
		row += 2;

		$.setColor( colorHeader );
		centerText( "--- HIGH SCORES ---", row );
		row += 1;

		const highScores = getHighScores();
		const tableWidth = 28;
		const rankW = 4;
		const scoreW = 10;
		const resultW = 10;
		const headerStr = " #   Score      Result  ";
		const leftPad = Math.max( 0, Math.floor( ( cols - tableWidth ) / 2 ) );

		$.setPos( leftPad, row );
		$.setColor( colorHeader );
		$.print( headerStr, true );
		row += 1;

		$.setColor( colorRow );
		for( let i = 0; i < highScores.length; i++ ) {
			const entry = highScores[ i ];
			const rank = ( i + 1 ).toString().padStart( 2 );
			const scoreStr = entry.score.toString().padStart( scoreW );
			const resultStr = entry.survived ? "Survived" : "Died";
			const line = " " + rank + "   " + scoreStr + "   " + resultStr.padEnd( resultW );
			$.setPos( leftPad, row );
			$.print( line, true );
			row += 1;
		}

		row = rows - 2;
		$.setColor( colorHint );
		centerText( "Press F5 to play again", row );
	}
} )();
