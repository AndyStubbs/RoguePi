"use strict";
// File: items.js

const g_player = ( function () {
	const RANKS = [
		"Novice",
		"Adventurer",
		"Fighter",
		"Warrior",
		"Champion",
		"Hero",
		"Legend"
	];
	const LEVELS =     [ 0,  10, 30, 60, 150, 500, 1500, 999999 ];
	const HIT_POINTS = [ 15, 20, 35, 50,  65,  85, 100,  150 ];
	const HEALING_RATE = 0.01;

	return {
		"name": "Player 1 Huzzaah",
		"level": 1,
		"rank": RANKS[ 0 ],
		"depth": 1,
		"lastShop": 1,
		"experience": 0,
		"gold": 10,
		"attack": 1,
		"range": 0,
		"defense": 1,
		"hitPoints": 15,
		"maxHitPoints": 15,
		"hunger": 0,
		"thirst": 0,
		"lightRadius": 3,
		"lightFade": 0.01,
		"map": [],
		"messages": [],
		"archivedMessages": [],
		"items": [],
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
		"symbol": String.fromCharCode( 1 ),
		"fn": {
			init,
			resetMap,
			revealMap,
			move,
			addExperience,
			heal
		}
	};

	function init() {

		// Give the player some starting items
		const club = structuredClone( ITEMS.wooden_club );
		club.quantity = 1;
		club.equipped = true;
		g_player.items.push( club );
		g_player.weapons.melee = club;
		const clothes = structuredClone( ITEMS.cloth_armor );
		clothes.quantity = 1;
		clothes.equipped = true;
		g_player.items.push( clothes );
		g_player.armor.body = clothes;
		const torches = structuredClone( ITEMS.torch );
		torches.quantity = 3;
		g_player.items.push( torches );
		const water = structuredClone( ITEMS.water );
		water.quantity = 2;
		g_player.items.push( water );
		const rations = structuredClone( ITEMS.ration );
		rations.quantity = 1;
		g_player.items.push( rations );
	}

	function resetMap( width, height ) {
		g_player.map = [];
		for( let y = 0; y < height; y += 1 ) {
			g_player.map.push( [] );
			for( let x = 0; x < width; x += 1 ) {
				g_player.map[ y ].push( TILE_BLANK );
			}
		}
	}

	function revealMap( level ) {
		g_player.map = [];
		for( let y = 0; y < level.height; y += 1 ) {
			g_player.map.push( [] );
			for( let x = 0; x < level.width; x += 1 ) {
				g_player.map[ y ].push( level.map[ y ][ x ] );
			}
		}
	}

	function move( dx, dy, level ) {
		const lastPos = { "x": g_player.x, "y": g_player.y };
		g_player.x += dx;
		g_player.y += dy;

		if(
			g_player.x < 0 || g_player.x > level.width -1 ||
			g_player.y < 0 || g_player.y > level.height - 1
		) {
			g_player.x = lastPos.x;
			g_player.y = lastPos.y;
		}

		if( !TILE_WALKABLE.includes( level.map[ g_player.y ][ g_player.x ] ) ) {
			g_player.x = lastPos.x;
			g_player.y = lastPos.y;
		}

		// Check if player hits an enemy
		for( const enemy of level.enemies ) {
			if( enemy.x === g_player.x && enemy.y === g_player.y ) {
				combatStrike( g_player, enemy );
				g_player.x = lastPos.x;
				g_player.y = lastPos.y;
			}
		}
	}

	function addExperience( amount ) {
		g_player.experience += amount;
		
		// Advance player level
		const previousLevel = g_player.level;
		g_player.level = Math.max(
			LEVELS.findLastIndex( level => level <= g_player.experience ) + 1, 1
		);
		if( previousLevel < g_player.level ) {
			g_player.rank = RANKS[ g_player.level - 1 ];
			g_player.maxHitPoints = HIT_POINTS[ g_player.level - 1 ];
			g_player.messages.push( `You have advanced to the rank of ${g_player.rank}` );
		}
	}

	function heal() {
		let healingRate = HEALING_RATE;
		if( g_player.thirst >= 100 || g_player.hunger >= 100 ) {
			healingRate *= 0.5;
		}
		const healing = g_player.maxHitPoints * healingRate;
		g_player.hitPoints = Math.min( g_player.hitPoints + healing, g_player.maxHitPoints );
	}

} )();
