"use strict";
// File: intro.js

window.g_intro = ( function () {
	return {
		"runIntro": runIntro
	};

	async function runIntro() {
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

		// Name prompt at bottom
		row = rows - 10;
		$.setPos( 22, row );
		$.setColor( colorPrompt );

		const name = await $.input( "Enter your name: ", null, null, null, null, null, 16 );
		const playerName = ( name != null && String( name ).trim() !== "" )
			? String( name ).trim()
			: "The Rogue";
		g_player.name = playerName;

		g_player.fn.init();
		startLevel();
	}
} )();

g_intro.runIntro();
