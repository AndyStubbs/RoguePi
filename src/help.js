"use strict";
// File: help.js

window.g_help = ( function () {
	return {
		"showHelp": showHelp
	};

	function centerLine( text, row ) {
		$.setPos( 0, row );
		$.print( text, true, true );
	}

	async function showHelp() {
		$.clearEvents();
		$.cls();

		const cols = $.getCols();
		const rows = $.getRows();

		const colorTitle = 14;
		const colorSection = 11;
		const colorKey = 10;
		const colorDesc = 7;
		const colorHint = 8;

		let row = 1;

		// Title
		$.setColor( colorTitle );
		centerLine( "HELP", row );
		row += 1;
		centerLine( "────", row );
		row += 2;

		// Movement — two columns: keys only (WASD layout + Arrow layout)
		$.setColor( colorSection );
		centerLine( "MOVEMENT", row );
		row += 2;
		$.setColor( colorDesc );
		const halfCols = Math.floor( cols / 2 );
		function centerInLeft( text, r ) {
			const pad = Math.max( 0, Math.floor( ( halfCols - text.length ) / 2 ) );
			$.setPos( pad, r );
			$.print( text, true );
		}
		function centerInRight( text, r ) {
			const pad = halfCols + Math.max( 0, Math.floor( ( halfCols - text.length ) / 2 ) );
			$.setPos( pad, r );
			$.print( text, true );
		}
		const up = String.fromCharCode( 24 );
		const down = String.fromCharCode( 25 );
		const left = String.fromCharCode( 27 );
		const right = String.fromCharCode( 26 );
		// Row 1: Q W E  |  Home Up PgUp (top row: up-left, up, up-right)
		centerInLeft( "Q  W  E", row );
		centerInRight( "Home  " + up + "  PgUp", row );
		row += 1;
		// Row 2: A S D  |  Left Down Right
		centerInLeft( "A  S  D", row );
		centerInRight( left + "  " + down + "  " + right, row );
		row += 1;
		// Row 3: Z   C  |  End Down PgDn (bottom row: down-left, down, down-right)
		centerInLeft( "Z     C", row );
		centerInRight( "End  " + down + "  PgDn", row );
		row += 2;

		// Actions
		$.setColor( colorSection );
		centerLine( "ACTIONS", row );
		row += 2;
		$.setColor( colorDesc );
		$.setPos( 2, row );
		$.print( "I or 0-9", true );
		$.setPos( 14, row );
		$.print( "Use item (prompt or by number)", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "J", true );
		$.setPos( 14, row );
		$.print( "Drop item", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "K", true );
		$.setPos( 14, row );
		$.print( "Ranged attack (need bow/dart + missile)", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "L", true );
		$.setPos( 14, row );
		$.print( "Search for hidden doors and paths", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "R", true );
		$.setPos( 14, row );
		$.print( "Rest (end turn, heal slowly)", true );
		row += 3;

		// Melee (own section after ACTIONS)
		$.setColor( colorSection );
		centerLine( "MELEE", row );
		row += 2;
		$.setColor( colorDesc );
		$.setPos( 2, row );
		$.print( "Melee attack", true );
		row += 1;
		$.setColor( colorKey );
		$.setPos( 4, row );
		$.print( "Move into enemy", true );
		row += 2;

		// Torches, Thirst, Hunger
		$.setColor( colorSection );
		centerLine( "SURVIVAL", row );
		row += 2;
		$.setColor( colorDesc );
		$.setPos( 2, row );
		$.print( "Torches", true );
		$.setColor( colorKey );
		row += 1;
		$.setPos( 4, row );
		$.print( "Carry torches to see farther in the dark. Each torch increases your", true );
		row += 1;
		$.setPos( 4, row );
		$.print( "light radius. Use a torch from inventory to equip it; without light", true );
		row += 1;
		$.setPos( 4, row );
		$.print( "you can barely see and may miss doors and enemies.", true );
		$.setColor( colorDesc );
		row += 2;
		$.setPos( 2, row );
		$.print( "Thirst", true );
		$.setColor( colorKey );
		row += 1;
		$.setPos( 4, row );
		$.print( "Your thirst increases over time. Drink water (use from inventory) to", true );
		row += 1;
		$.setPos( 4, row );
		$.print( "reduce it. Let thirst rise too high and you will suffer.", true );
		$.setColor( colorDesc );
		row += 2;
		$.setPos( 2, row );
		$.print( "Hunger", true );
		$.setColor( colorKey );
		row += 1;
		$.setPos( 4, row );
		$.print( "You get hungry as you explore. Use rations from inventory to sate", true );
		row += 1;
		$.setPos( 4, row );
		$.print( "hunger. Keep rations and water stocked when you find them.", true );
		row += 2;

		// Press any key to continue at bottom
		row = rows - 2;
		$.setColor( colorHint );
		centerLine( "Press any key to continue", row );

		
		await new Promise( resolve => {
			setTimeout( () => {
				$.onkey( "any", "down", () => resolve(), false, true );
			}, 0 );
		} );

		addGameKeys();
		render();
	}
} )();
