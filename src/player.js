"use strict";
// File: items.js

window.g_player = ( function () {
	const RANKS = [
		"Novice",
		"Adventurer",
		"Fighter",
		"Warrior",
		"Champion",
		"Hero",
		"Legend"
	];
	const LEVELS =     [ 10, 25, 60, 100, 150, 500, 1000 ];
	const HIT_POINTS = [ 15, 20, 35, 50,  65,  85,  100 ];
	const HEALING_RATE = 0.01;

	return {
		createPlayer,
		move,
		addExperience,
		heal
	};

	function createPlayer( width, height ) {
		const map = [];

		// Create a blank map for the level size
		for( let y = 0; y < height; y += 1 ) {
			map.push( [] );
			for( let x = 0; x < width; x += 1 ) {
				map[ y ].push( TILE_BLANK );
			}
		}

		const items = [];

		// Give the player some starting items
		const club = structuredClone( ITEMS.wooden_club );
		club.quantity = 1;
		items.push( club );
		const clothes = structuredClone( ITEMS.cloth_armor );
		clothes.quantity = 1;
		items.push( clothes );
		const torches = structuredClone( ITEMS.torch );
		torches.quantity = 3;
		items.push( torches );

		// Give ranged items
		const bow = structuredClone( ITEMS.bow );
		bow.quantity = 1;
		items.push( bow );
		const arrow = structuredClone( ITEMS.arrow );
		arrow.quantity = 5;
		items.push( arrow );
		const dart = structuredClone( ITEMS.dart );
		dart.quantity = 5;
		items.push( dart );

		return {
			"name": "Player 1",
			"level": 1,
			"rank": RANKS[ 0 ],
			"depth": 1,
			"lastShop": 1,
			"experience": 0,
			"gold": 100,
			"attack": 1,
			"range": 0,
			"defense": 1,
			"hitPoints": 15,
			"maxHitPoints": 15,
			"hunger": 0,
			"thirst": 0,
			"lightRadius": 3,
			"lightFade": 0.01,
			"map": map,
			"messages": [],
			"items": items,
			"armor": {
				"head": null,
				"body": null,
				"hands": null,
				"legs": null,
				"feet": null,
				"shield": null
			},
			"weapons": {
				"melee": null,
				"range": null,
				"missile": null
			},
			"x": 0,
			"y": 0,
			"color": 14,
			"symbol": String.fromCharCode( 1 )
		};
	}

	function move( dx, dy, player, level ) {
		const lastPos = { "x": player.x, "y": player.y };
		player.x += dx;
		player.y += dy;

		if(
			player.x < 0 || player.x > level.width -1 ||
			player.y < 0 || player.y > level.height - 1
		) {
			player.x = lastPos.x;
			player.y = lastPos.y;
		}

		if( !TILE_WALKABLE.includes( level.map[ player.y ][ player.x ] ) ) {
			player.x = lastPos.x;
			player.y = lastPos.y;
		}

		// Check if player hits an enemy
		//for( const enemy of level.enemies ) {
		//	if( enemy.x === player.x && enemy.y === player.y ) {
		//		combatStrike( player, enemy );
		//		player.x = lastPos.x;
		//		player.y = lastPos.y;
		//	}
		//}
	}

	function addExperience( player, amount ) {
		player.experience += amount;
		
		// Advance player level
		const previousLevel = player.level;
		player.level = Math.max(
			LEVELS.findLastIndex( level => level <= player.experience ) + 1, 1
		);
		if( previousLevel < player.level ) {
			player.rank = RANKS[ player.level - 1 ];
			player.maxHitPoints = HIT_POINTS[ player.level - 1 ];
			player.messages.push( `You have advanced to the rank of ${player.rank}` );
		}
	}

	function heal( player ) {
		player.hitPoints = Math.min(
			player.hitPoints + player.maxHitPoints * HEALING_RATE, player.maxHitPoints
		);
	}

} )();
