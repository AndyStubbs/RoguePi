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

		// Movement
		$.setColor( colorSection );
		centerLine( "MOVEMENT", row );
		row += 2;
		$.setColor( colorDesc );
		$.setPos( 2, row );
		$.print( "W / " + String.fromCharCode( 24 ), true );
		$.setPos( 12, row );
		$.print( "Move up", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "S / " + String.fromCharCode( 25 ), true );
		$.setPos( 12, row );
		$.print( "Move down", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "A / " + String.fromCharCode( 27 ), true );
		$.setPos( 12, row );
		$.print( "Move left", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "D / " + String.fromCharCode( 26 ), true );
		$.setPos( 12, row );
		$.print( "Move right", true );
		row += 1;
		$.setPos( 2, row );
		$.print( "Q E Z C / Home PgUp PgDn End", true );
		row += 1;
		$.setPos( 12, row );
		$.print( "Diagonal movement", true );
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
