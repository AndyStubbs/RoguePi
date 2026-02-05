"use strict";
// File: intro.js

let g_attackBuff = 1.0;
let g_defenseBuff = 1.0;
let g_difficulty = "normal";
let g_itemBuff = 1.0;

window.g_intro = ( function () {
	return {
		"runIntro": runIntro
	};

	async function runIntro( isInvalidDifficulty = false ) {
		const screen = window.g_mainScreen;
		if( screen ) {
			$.setScreen( screen );
		}
		$.cls();

		const colorTitle = 14;
		const colorStory = 7;
		const colorPrompt = 11;

		const rows = $.getRows();

		// Title
		$.setColor( colorTitle );
		$.setPos( 0, 2 );
		$.print( "THE DUNGEON OF " + ITEMS.pi_amulet.symbol, true, true );
		$.setPos( 0, 4 );
		$.print( "───────────────", true, true );

		// Introduction story
		const story = [
			"",
			"You have wandered for days through the dark.",
			"Torch in hand, you descended past level after",
			"level, past rats and worse, with one purpose:",
			"",
			"Somewhere in the depths, the Pi Amulet is said",
			"to lie in a chamber of ancient stone. Those who",
			"claim it are said to find their way back to the",
			"surface, freed from the labyrinth.",
			"",
			"Your supplies are low. Your map is blank.",
			"The only way out is down, then back with the",
			"amulet, or not at all.",
		];

		$.setColor( colorStory );
		let row = 6;
		for( const line of story ) {
			$.setPos( 17, row );
			$.print( line, true );
			row += 1;
		}

		$.setColor( 2 );
		$.rect( 1, 1, $.width() - 2, $.height() - 2 );
		$.rect( 3, 3, $.width() - 6, $.height() - 6 );

		row += 2;

		// If invalid difficulty, show error message and try again
		if( isInvalidDifficulty ) {
			row += 6;
			$.setColor( 4 );
			$.setPos( 22, row );
			$.print( "Invalid difficulty. Please enter a valid difficulty.", true );
			row -= 6;
		}

		// Set difficulty
		$.setColor( colorPrompt );
		$.setPos( 22, row );
		$.print( "Difficulty", true );
		$.setColor( 7 );
		$.setPos( 22, row + 1 );
		$.print( "1) Easy" );
		$.setPos( 22, row + 2 );
		$.print( "2) Normal" );
		$.setPos( 22, row + 3 );
		$.print( "3) Hard" );
		row += 5;
		$.setPos( 22, row );
		const difficulty = await $.input( "Enter (1-3): ", null, null, null, null, null, 1 );
		if( difficulty === "1" ) {
			g_attackBuff = 1.5;
			g_defenseBuff = 1.5;
			g_itemBuff = 1.5;
			g_difficulty = "easy";
		} else if( difficulty === "2" ) {
			g_attackBuff = 1.15;
			g_defenseBuff = 1.15;
			g_itemBuff = 1.15;
			g_difficulty = "normal";
		} else if( difficulty === "3" ) {
			g_attackBuff = 0.85;
			g_defenseBuff = 0.85;
			g_itemBuff = 0.85;
			g_difficulty = "hard";
		} else {
			return runIntro( true );
		}

		row += 2;

		if( isInvalidDifficulty ) {
			row += 2;
		}

		// Name prompt at bottom
		$.setPos( 22, row );
		$.setColor( colorPrompt );
		$.print( "Name", true );
		$.setColor( 7 );
		$.setPos( 22, row + 1 );
		const name = await $.input( "Enter: ", null, null, null, null, null, 16 );
		const playerName = ( name != null && String( name ).trim() !== "" )
			? String( name ).trim()
			: "The Rogue";
		g_player.name = playerName;

		g_player.fn.init();
		startLevel();
	}
} )();
