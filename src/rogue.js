"use strict";
// File: rogue.js
/*
	global g_player;
*/

const OFFSET_X = 17;
//const END_TURN_ENEMY_SPAWN_CHANCE = 0.01;
const END_TURN_ENEMY_SPAWN_CHANCE = 0;
const SHOP_CHANCE = 0.3;

const g_mainScreen = $.screen( "640m350" );
const g_messageScreen = $.screen( "320x192", null, true );

window.g_mainScreen = g_mainScreen;

g_mainScreen.setFont( 2 );
g_messageScreen.setFont( 2 );
$.setScreen( g_mainScreen );

let g_level;

function startLevel() {
	g_level = g_dungeonMap.createMap( $.getCols() - OFFSET_X, $.getRows(), g_player.depth );
	g_player.fn.resetMap( $.getCols() - OFFSET_X, $.getRows() );
	//g_player.fn.revealMap( g_level );
	g_player.x = g_level.startLocation.x;
	g_player.y = g_level.startLocation.y;
	addGameKeys();
	render();
}

function render() {
	$.cls();

	// Render map
	const litTiles = getLitTiles();
	for( const tileId in litTiles ) {
		const tile = litTiles[ tileId ];
		g_player.map[ tile.y ][ tile.x ] = g_level.map[ tile.y ][ tile.x ];
	}
	g_dungeonMap.renderMap( g_player.map, litTiles, g_player.depth - 1 );

	// Render Items
	for( const item of g_level.items ) {
		const tileId = `${item.x},${item.y}`;
		if( !litTiles[ tileId ] ) {
			continue;
		}
		$.setColor( item.color );
		$.setPos( item.x + OFFSET_X, item.y );
		$.print( item.symbol );
	}

	// Render exit
	const exitTileId = `${g_level.exitLocation.x},${g_level.exitLocation.y}`;
	if( litTiles[ exitTileId ] ) {
		$.setPos( g_level.exitLocation.x + OFFSET_X, g_level.exitLocation.y );
		$.setColor( 7 );
		$.print( TILE_EXIT, true );
	}

	// Render enemies
	for( const enemy of g_level.enemies ) {
		const tileId = `${enemy.x},${enemy.y}`;
		if( !litTiles[ tileId ] ) {
			continue;
		}
		$.setColor( enemy.color );
		$.setPos( enemy.x + OFFSET_X, enemy.y );
		$.print( enemy.symbol );
	}
	
	// Render Player
	$.cls( ( OFFSET_X + g_player.x ) * 8, g_player.y * 8, 8, 8 );
	$.setColor( g_player.color );
	$.setPos( OFFSET_X + g_player.x, g_player.y );
	$.print( g_player.symbol, true );

	// Render Stats
	renderStats();

	// Render Messages
	if( g_player.messages.length > 0 ) {
		let message = g_player.messages.join( "\n" );
		printMessage( message );
	}
	g_player.messages = [];

	// Check player game over
	if( g_player.hitPoints <= 0 ) {
		$.clearEvents();
		setTimeout( () => {
			showGameOverAnimation();
		}, 1000 );
		return;
	}

	// Check if player has found the exit
	if( g_player.x === g_level.exitLocation.x && g_player.y === g_level.exitLocation.y ) {
		printMessage( "You decend lower into the dungeon." );
		$.clearEvents();
		setTimeout( () => {
			$.cls( OFFSET_X * 8, 0, $.width(), $.height() );
			g_dungeonMap.renderMap( g_player.map, litTiles, g_player.depth - 1 );
			showLevelClearedAnimation();
		}, 1000 );
	}
}

function getLitTiles() {

	// Clear previous lit tiles
	const litTiles = {};

	const radius = Math.ceil( g_player.lightRadius );
	const px = g_player.x;
	const py = g_player.y;
	const playerTile = g_level.map[ py ][ px ];

	// Determine if we're in a path context (on path or door adjacent to path)
	let isOnPath = playerTile === TILE_PATH;
	if( playerTile === TILE_DOOR ) {

		// Check adjacent tiles to see if we're connected to a path
		const dirs = [ [ -1, 0 ], [ 1, 0 ], [ 0, -1 ], [ 0, 1 ] ];
		for( const [ dx, dy ] of dirs ) {
			const ax = px + dx;
			const ay = py + dy;
			if( ax >= 0 && ax < g_level.width && ay >= 0 && ay < g_level.height ) {
				const adjTile = g_level.map[ ay ][ ax ];
				if( adjTile === TILE_PATH ) {
					isOnPath = true;
					break;
				}
			}
		}
	}

	// Player always sees their own position
	const playerKey = `${px},${py}`;
	litTiles[ playerKey ] = { "x": px, "y": py };

	// BFS queue: [x, y, distance]
	const queue = [ [ px, py, 0 ] ];
	const visited = {};
	visited[ playerKey ] = true;

	// 8-directional movement (including diagonals)
	const directions = [
		[ -1, -1 ], [ 0, -1 ], [ 1, -1 ],
		[ -1,  0 ],            [ 1,  0 ],
		[ -1,  1 ], [ 0,  1 ], [ 1,  1 ]
	];

	while( queue.length > 0 ) {
		const [ x, y, dist ] = queue.shift();

		// Check all adjacent tiles
		for( const [ dx, dy ] of directions ) {
			const nx = x + dx;
			const ny = y + dy;
			const nKey = `${nx},${ny}`;

			// Skip if already visited
			if( visited[ nKey ] ) {
				continue;
			}

			// Check bounds
			if( nx < 0 || nx >= g_level.width || ny < 0 || ny >= g_level.height ) {
				continue;
			}

			// Calculate distance from player
			const pdx = nx - px;
			const pdy = ny - py;
			const distance = Math.sqrt( pdx * pdx + pdy * pdy );

			// Check if within light radius
			if( distance > radius ) {
				continue;
			}

			const tile = g_level.map[ ny ][ nx ];

			// Empty spaces always block vision
			if( tile === TILE_BLANK ) {
				continue;
			}

			// If player is on a path, only see walkable tiles
			if( isOnPath && !TILE_WALKABLE.includes( tile ) ) {
				continue;
			}

			// Check line of sight from player to this tile
			if( !hasLineOfSight( px, py, nx, ny ) ) {
				continue;
			}

			// For paths: prevent jumping around corners
			// When moving diagonally, both cardinal directions must be walkable
			if( isOnPath && dx !== 0 && dy !== 0 ) {
				const card1 = g_level.map[ y ][ nx ];
				const card2 = g_level.map[ ny ][ x ];

				// Can't see diagonally if either cardinal neighbor blocks vision (walls, doors, or empty spaces)
				if( TILE_BLOCKING.includes( card1 ) || TILE_BLOCKING.includes( card2 ) || 
					card1 === TILE_BLANK || card2 === TILE_BLANK ) {
					continue;
				}
			}

			// Mark as visited and lit
			visited[ nKey ] = true;
			litTiles[ nKey ] = { "x": nx, "y": ny };

			// Add to queue if we can continue exploring from here
			// Empty spaces always block BFS continuation
			if( tile === TILE_BLANK ) {
				continue;
			}

			// When on path, only continue from walkable tiles
			if( isOnPath ) {
				if( TILE_WALKABLE.includes( tile ) ) {
					queue.push( [ nx, ny, dist + 1 ] );
				}
			} else {

				// In rooms, can see walls but can't see through them
				if( !TILE_BLOCKING.includes( tile ) ) {
					queue.push( [ nx, ny, dist + 1 ] );
				}
			}
		}
	}

	return litTiles;
}

function hasLineOfSight( x1, y1, x2, y2 ) {

	// Player always sees their own position
	if( x1 === x2 && y1 === y2 ) {
		return true;
	}

	const dx = Math.abs( x2 - x1 );
	const dy = Math.abs( y2 - y1 );
	const sx = x1 < x2 ? 1 : -1;
	const sy = y1 < y2 ? 1 : -1;
	let err = dx - dy;
	let x = x1;
	let y = y1;
	let steps = 0;

	// Prevent infinite loops
	const maxSteps = dx + dy + 1;

	while( steps < maxSteps ) {
		
		// Move to next position
		const e2 = 2 * err;
		if( e2 > -dy ) {
			err -= dy;
			x += sx;
		}
		if( e2 < dx ) {
			err += dx;
			y += sy;
		}

		// Check if we've reached the target
		// Can see the target (even if it's a wall)
		if( x === x2 && y === y2 ) {
			return true;
		}

		// Check if current tile blocks vision (walls/doors/empty spaces block line of sight)
		// We check tiles along the path, but not the start position
		if( !( x === x1 && y === y1 ) ) {
			const tile = g_level.map[ y ][ x ];

			// Vision blocked by walls, doors, or empty spaces
			if( TILE_BLOCKING.includes( tile ) || tile === TILE_BLANK ) {
				return false;
			}
		}

		steps += 1;
	}

	// Shouldn't reach here, but safety check
	return false;
}

function addGameKeys() {
	$.setActionKeys( [ "F1" ] );

	// Help
	$.onkey( "F1", "down", () => g_help.showHelp(), false, false );

	// Up
	$.onkey( "w", "down", () => move( 0, -1 ), false, true );
	$.onkey( "ArrowUp", "down", () => move(  0, -1 ), false, true );

	// Left
	$.onkey( "a", "down", () => move( -1,  0 ), false, true );
	$.onkey( "ArrowLeft", "down", () => move( -1,  0 ), false, true );

	// Down
	$.onkey( "s", "down", () => move(  0,  1 ), false, true );
	$.onkey( "ArrowDown", "down", () => move(  0,  1 ), false, true );

	// Right
	$.onkey( "d", "down", () => move(  1,  0 ), false, true );
	$.onkey( "ArrowRight", "down", () => move(  1,  0 ), false, true );

	// Up-Left
	$.onkey( "q", "down", () => move( -1, -1 ), false, true );
	$.onkey( "Home", "down", () => move( -1, -1 ), false, true );

	// Up-Right
	$.onkey( "e", "down", () => move( 1, -1 ), false, true );
	$.onkey( "PageUp", "down", () => move( 1, -1 ), false, true );
	
	// Down-Right
	$.onkey( "c", "down", () => move( 1, 1 ), false, true );
	$.onkey( "PageDown", "down", () => move( 1, 1 ), false, true );

	// Down-Right
	$.onkey( "z", "down", () => move( -1, 1 ), false, true );
	$.onkey( "End", "down", () => move( -1, 1 ), false, true );

	// Use Item
	$.onkey( "i", "down", () => useItem( null ), false, false );
	let keys = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	keys.forEach( key => {
		$.onkey( `${key}`, "down", () => useItem( key ), false, false );
	} );
	
	// Drop Item
	$.onkey( "j", "down", () => dropItem(), false, false );

	// Ranged attack
	$.onkey( "k", "down", () => rangeAttack(), false, false );

	// Search
	$.onkey( "l", "down", () => search(), false, false );

	// Rest
	$.onkey( "r", "down", () => {
		endTurn();
		render();
	}, false, true );
}

function move( dx, dy ) {
	g_player.fn.move( dx, dy, g_level );
	const victory = pickupItems();
	if( victory ) {
		$.clearEvents();
		render();
		printMessage(
			"Victory! You have retrieved the Pi Amulet. You are being teleported to the surface..."
		);
		setTimeout( () => {
			showVictorySequence();
		}, 2500 );
		return;
	}
	render();
	endTurn();
}

function renderStats() {
	
	// Compute attack
	g_player.attack = g_player.level;
	if( g_player.weapons.melee ) {
		g_player.attack += g_player.weapons.melee.attack;
	}
	g_player.range = 0;
	if( g_player.weapons.range ) {

		// Add attack value of missile
		if( g_player.weapons.missile ) {
			g_player.range += g_player.level + g_player.weapons.range.attack +
				g_player.weapons.missile.attack;
		} else {
			g_player.range += g_player.level + g_player.weapons.range.attack;
		}
	}

	// Compute Defense
	g_player.defense = g_player.level;
	for( const itemId in g_player.armor ) {
		const item = g_player.armor[ itemId ];
		if( item ) {
			g_player.defense += item.defense;
		}
	}
	
	$.setPos( 0, 0 );
	$.setColor( 8 );
	$.print();
	printTitle( "Depth " + g_player.depth );
	$.print();
	$.setColor( 14 );
	$.print();
	printTitle( g_player.name );
	$.print();
	$.setColor( 3 );
	printStat( "RNK", g_player.rank );
	printStat( "EXP", g_player.experience );
	printStat( "GLD", g_player.gold, 90 );
	printStat( "ATT", g_player.attack, 2 );
	printStat( "RNG", g_player.range, 2 );
	printStat( "DEF", g_player.defense, 2 );
	printStat( "HIT", Math.round( g_player.hitPoints ), 3 );
	printStat( "HUN", Math.round( g_player.hunger ), 3 );
	printStat( "THR", Math.round( g_player.thirst ), 3 );

	$.print( "\n" );
	$.setColor( 10 );
	printTitle( "Items" );
	$.print();
	for( let i = 0; i < g_player.items.length; i += 1 ) {
		const item = g_player.items[ i ];
		let itemText = g_util.properName( item.name );
		if( item.quantity > 1 ) {
			itemText += ` (${item.quantity})`;
		}
		if( item.equipped ) {
			printStat( i, itemText, 10, 2 );
		} else {
			printStat( i, itemText, 10 );
		}
	}

	$.setPos( 0, 31 );
	$.setColor( 3 );
	printTitle( "Commands" );
	$.print();
	printStat( "I", "Use item", 3 );
	printStat( "J", "Drop item", 3 );
	printStat( "K", "Ranged attack", 3 );
	printStat( "L", "Search", 3 );
	printStat( "R", "Rest", 3 );
	$.print();
	printStat( "F1", "Help", 4 );
}

function printTitle( title ) {
	const leftPadding = Math.floor( ( OFFSET_X - title.length ) / 2 );
	const rightPadding = OFFSET_X - leftPadding - title.length;

	const posPx = $.getPosPx();
	$.setPosPx( 7, posPx.y );
	$.print( "".padEnd( leftPadding, " " ) + title +  "".padStart( rightPadding, " " ), true );
	$.rect( 4, posPx.y - 4, OFFSET_X * 8 - 4, 16 );
	$.print();
}

function printStat( title, val, c1 = 14, c2 = 7 ) {
	$.setColor( c1 );
	$.print( " " + title + ": ", true );
	$.setColor( c2 );
	$.print( val );
}

function pickupItems() {
	const itemsToRemove = [];
	let victory = false;
	for( const item of g_level.items ) {
		if( item.x === g_player.x && item.y === g_player.y ) {
			let isAdded = pickupItem( item );
			if( isAdded ) {
				itemsToRemove.push( item );
				if( item.name === "Pi Amulet" ) {
					victory = true;
				}
			}

			// Print the pickup message (skip for Pi Amulet; victory message shown instead)
			if( item.name !== "Pi Amulet" ) {
				let pickupMsg = "";
				if( item.quantity === 1 ) {
					pickupMsg = `You have found ${item.article} ${item.name} `;
				} else {
					pickupMsg = `You have found ${item.quantity} ${item.plural} `;
				}
				if( isAdded ) {
					pickupMsg += "and have added it to your inventory.";
				} else {
					let article = "it";
					if( item.quantity > 1 ) {
						article = "them";
					}
					pickupMsg += `but you cannot pick ${article} up because you are holding too ` +
						`many items.`;
				}
				g_player.messages.push( pickupMsg );
			}
		}
	}
	g_level.items = g_level.items.filter( item => !itemsToRemove.includes( item ) );
	return victory;
}

function pickupItem( item ) {
	let isAdded = false;

	// If item is gold add to player gold
	if( item.name === ITEM_GOLD ) {
		g_player.gold += item.quantity;
		isAdded = true;
	}

	// For stackable items then they can be added to the quantity of items found.
	else if( item.stackable ) {
		for( const playerItem of g_player.items ) {
			if( playerItem.name === item.name ) {
				playerItem.quantity += item.quantity;
				isAdded = true;
				break;
			}
		}
	}

	// Add item to players inventory
	if( !isAdded ) {
		if( g_player.items.length < 10 ) {
			g_player.items.push( item );
			isAdded = true;
		}
	}

	return isAdded;
}

function getMessagePosition( height ) {
	const x = OFFSET_X * 4 + Math.floor( ( $.width() - g_messageScreen.width() ) / 2 );
	let y = Math.floor( ( $.height() - height ) / 2 );
	let py = g_player.y * 8;
	if( py >= y - 16 && py < y - 16 + height + 24 ) {
		y = py - height - 16;
	}
	return { x, y };
}

async function promptMessage( msg, isImmediate = false ) {
	$.clearEvents();
	render();
	const height = 8;
	const { x, y } = getMessagePosition( height );
	drawMessageBorder( x, y, height );
	$.setPosPx( x, y );
	$.setColor( 7 );
	$.print( msg, true );
	if( isImmediate ) {
		const itemIndex = await new Promise( resolve => {
			setTimeout( () => {
				$.onkey( "any", "down", ( key ) => {
					resolve( key );
				}, false, true );
			}, 0 );
		} );
		addGameKeys();
		return itemIndex
	}
	const itemIndex = await $.input( ": ", null, null, true, true, false, 1 );
	addGameKeys();
	return itemIndex;
}

function printMessage( msg ) {
	g_messageScreen.cls();

	// Print a blank message to get the screen height
	g_messageScreen.setColor( 0 );
	g_messageScreen.print( msg );
	const height = g_messageScreen.getPosPx().y;
	g_messageScreen.setColor( 7 );
	g_messageScreen.setPos( 0, 0 );
	g_messageScreen.print( msg );
	const { x, y } = getMessagePosition( height );
	drawMessageBorder( x, y, height );
	$.drawImage( g_messageScreen, x, y );
}

function drawMessageBorder( x, y, height ) {
	$.setColor( 15 );
	$.rect( x - 8, y - 8, g_messageScreen.width() + 16, height + 16, 16 );
}

async function useItem( itemIndex ) {
	if( g_player.items.length === 0 ) {
		$.setColor( 4 );
		g_player.messages.push( "You have no items to use." );
		render();
		return;
	}

	if( itemIndex === null ) {
		itemIndex = await promptMessage( `Use which item (0-${g_player.items.length - 1})` );
	}
	
	if( itemIndex !== null && itemIndex < g_player.items.length ) {
		let item = g_player.items[ itemIndex ];
		if( item.weapon ) {

			let itemDescription = `${item.article} ${item.name}`;
			if( item.quantity > 1 ) {
				itemDescription = `the ${item.plural}`;
			}

			// Make sure you cannot equip a non-compatible missile type
			if(
				item.weapon === "missile" &&
				g_player.weapons.range &&
				g_player.weapons.range.missileType !== item.missileType
			) {
				g_player.messages.push(
					`You cannot equip ${itemDescription} because it is not compatible your ` +
					`ranged weapon.`
				);
				render();
				return;
			}
			if( g_player.weapons[ item.weapon ] ) {
				g_player.weapons[ item.weapon ].equipped = false;
			}
			if( g_player.weapons[ item.weapon ] === item ) {
				g_player.weapons[ item.weapon ] = null;
				g_player.messages.push( `You unequip ${itemDescription}.` );
			} else {
				item.equipped = true;
				g_player.weapons[ item.weapon ] = item;
				g_player.messages.push( `You equip ${itemDescription}.` );
			}

			// Make sure range and missile type matches
			if(
				item.weapon === "range" &&
				g_player.weapons.missile !== null &&
				g_player.weapons.range.missileType !== g_player.weapons.missile.name
			) {
				g_player.weapons.missile.equipped = false;
				g_player.weapons.missile = null;
			}
		} else if( item.armor ) {
			if( g_player.armor[ item.armor ] ) {
				g_player.armor[ item.armor ].equipped = false;
			}
			if( g_player.armor[ item.armor ] === item ) {
				g_player.armor[ item.armor ] = null;
				g_player.messages.push( `You unequip ${item.article} ${item.name}.` );
			} else {
				item.equipped = true;
				g_player.armor[ item.armor ] = item;
				g_player.messages.push( `You equip ${item.article} ${item.name}.` );
			}
		} else if( item.lightRadius ) {
			g_player.lightRadius = item.lightRadius;
			g_player.lightFade = item.lightFade;
			g_player.messages.push( `You use ${item.article} ${item.name} to light your way.` );
			item.quantity -= 1;
			if( item.quantity === 0 ) {
				g_player.items.splice( itemIndex, 1 );
			}
		} else if( item.thirst ) {
			g_player.thirst = Math.max( g_player.thirst - item.thirst, 0 );
			g_player.messages.push( `You drink from ${item.article} ${item.name}.` );
			item.quantity -= 1;
			if( item.quantity === 0 ) {
				g_player.items.splice( itemIndex, 1 );
			}
		} else if( item.hunger ) {
			g_player.hunger = Math.max( g_player.hunger - item.hunger, 0 );
			g_player.messages.push( `You eat ${item.article} ${item.name}.` );
			item.quantity -= 1;
			if( item.quantity === 0 ) {
				g_player.items.splice( itemIndex, 1 );
			}
		} else if( item.healing_power ) {
			g_player.hitPoints = Math.min( g_player.hitPoints + item.healing_power, g_player.maxHitPoints );
			g_player.messages.push( `You drink ${item.article} ${item.name}.` );
			item.quantity -= 1;
			if( item.quantity === 0 ) {
				g_player.items.splice( itemIndex, 1 );
			}
		}
		endTurn();
		render();
	} else {
		if( typeof itemIndex === "number" ) {
			g_player.messages.push( `There is no item at index ${itemIndex}.` );
		} else {
			g_player.messages.push( "Use item cancelled." );
		}
		render();
	}
}

async function dropItem() {
	if( g_player.items.length === 0 ) {
		$.setColor( 4 );
		g_player.messages.push( "You have no items to drop." );
		render();
		return;
	}

	const height = 8;
	const { x, y } = getMessagePosition( height );
	$.setPosPx( x + 8, y + 8 );
	const itemIndex = await promptMessage( `Drop which item (0-${g_player.items.length - 1})` );
	if( itemIndex !== null && itemIndex < g_player.items.length ) {
		let item = g_player.items[ itemIndex ];

		// First unequip the item
		if( item.equipped ) {
			if( item.weapon && g_player.weapons[ item.weapon ] ) {
				g_player.weapons[ item.weapon ] = null;
			} else if( item.armor && g_player.armor[ item.armor ] ) {
				g_player.armor[ item.armor ] = null;
			}
			item.equipped = false;
		}

		g_player.items.splice( itemIndex, 1 );
		item.x = g_player.x;
		item.y = g_player.y;
		g_level.items.push( item );
		g_player.messages.push( `You drop ${item.article} ${item.name}.` );
		endTurn();
	} else {
		if( typeof itemIndex === "number" ) {
			g_player.messages.push( `There is no item at index ${itemIndex}.` );
		} else {
			g_player.messages.push( "Drop item cancelled." );
		}
	}
	render();
}

async function rangeAttack() {	
	if( g_player.weapons.range === null ) {
		$.setColor( 4 );
		g_player.messages.push( "You don't have a ranged weapon equipped." );
		render();
		return;
	}
	if( g_player.weapons.range.missileType && g_player.weapons.missile === null ) {
		$.setColor( 4 );
		g_player.messages.push( "You don't have any missiles equipped." );
		render();
		return;
	}

	const direction = ( await promptMessage( "Enter direction (movement key):", true ) ).key;
	if( direction === "Escape" ) {
		g_player.messages.push( "Range attack cancelled." );
		render();
		return;
	}

	const MOVEMENT_KEYS = [
		"w", "a", "s", "d", "q", "e", "c", "z", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight",
		"Home", "PageUp", "PageDown", "End"
	];
	if( !MOVEMENT_KEYS.includes( direction ) ) {
		g_player.messages.push( "Direction is not valid" );
		render();
		return;
	}

	let distance = g_player.weapons.range.distance;
	if( g_player.weapons.range.missileType ) {
		distance += g_player.weapons.missile.distance;
	}

	await fireMissile( g_player.x, g_player.y, direction, distance, g_player );
	
	// Reduce missile quantity and remove it from inventory when gone
	let missileIndex = null;
	if( g_player.weapons.range.missileType ) {
		missileIndex = g_player.items.findIndex( item => item === g_player.weapons.missile );
	} else {
		missileIndex = g_player.items.findIndex( item => item === g_player.weapons.range );
	}
	
	const missile = g_player.items[ missileIndex ];
	missile.quantity -= 1;
	if( missile.quantity === 0 ) {
		if( g_player.weapons.range.missileType ) {
			g_player.weapons.missile = null;
		} else {
			g_player.weapons.range = null;
		}
		g_player.items.splice( missileIndex, 1 );
	}
	endTurn();
	render();
}

async function fireMissile( x, y, direction, distance, self ) {
	let dx = 0;
	let dy = 0;
	let symbol = "";
	if( direction === "w" || direction === "ArrowUp" ) {
		dy = -1;
		symbol = String.fromCharCode( 24 );
	} else if( direction === "a" || direction === "ArrowLeft" ) {
		dx = -1;
		symbol = String.fromCharCode( 27 );
	} else if( direction === "s" || direction === "ArrowDown" ) {
		dy = 1;
		symbol = String.fromCharCode( 25 );
	} else if( direction === "d" || direction === "ArrowRight" ) {
		dx = 1;
		symbol = String.fromCharCode( 26 );
	} else if( direction === "q" || direction === "Home" ) {
		dx = -1;
		dy = -1;
		symbol = "\\";
	} else if ( direction === "e" || direction === "PageUp" ) {
		dx = 1;
		dy = -1;
		symbol = "/";
	} else if( direction === "c" || direction === "PageDown" ) {
		dx = 1;
		dy = 1;
		symbol = "\\";
	} else if( direction === "z" || direction === "End" ) {
		dx = -1;
		dy = 1;
		symbol = "/";
	}
	const d = Math.sqrt( dx * dx + dy * dy );

	$.clearEvents();
	let missileName = "";
	if( self.weapons.range.missileType ) {
		missileName = self.weapons.missile.name;
	} else {
		missileName = self.weapons.range.name;
	}
	let isCollided = false;
	while( distance > 0 && !isCollided ) {
		distance -= d;
		x += dx;
		y += dy;
		render();
		$.setPos( x + OFFSET_X, y );
		$.setColor( 15 );
		$.print( symbol, true );
		if( TILE_BLOCKING.includes( g_level.map[ y ][ x ] ) ) {
			isCollided = true;
		}
		if( self === g_player ) {
			const enemyHit = g_level.enemies.find( enemy2 => enemy2.x === x && enemy2.y === y );
			if( enemyHit ) {
				isCollided = true;
				combatStrike( g_player, enemyHit, true, missileName );
			}
		} else {
			if( x === g_player.x && y === g_player.y ) {
				isCollided = true;
				combatStrike( self, g_player, true, missileName );
			}
		}
		await new Promise( ( resolve ) => {
			setTimeout( resolve, 100 );
		} );
	}
	addGameKeys();
}

function search() {
	const searches = [
		[ -1, -1 ], [ 0, -1 ], [ 1, -1 ],
		[ -1,  0 ],            [ 1,  0 ],
		[ -1,  1 ], [ 0,  1 ], [ 1,  1 ]
	];
	
	g_player.messages.push( "You search the area..." );

	let hasDiscovery = false;

	// Search 3 areas
	for( let i = 0; i < 3; i += 1 ) {
		const search = searches[ Math.floor( Math.random() * searches.length ) ];
		const tile = g_level.map[ g_player.y + search[ 1 ] ][ g_player.x + search[ 0 ] ];
		if( tile === TILE_HIDDEN_DOOR ) {
			g_player.messages.push( "\tand find a hidden door" );
			hasDiscovery = true;
			g_level.map[ g_player.y + search[ 1 ] ][ g_player.x + search[ 0 ] ] = TILE_DOOR;
		} else if( tile === TILE_HIDDEN_PATH ) {
			g_player.messages.push( "\tand find a hidden path" );
			hasDiscovery = true;
			g_level.map[ g_player.y + search[ 1 ] ][ g_player.x + search[ 0 ] ] = TILE_PATH;
		} 
	}
	if( !hasDiscovery ) {
		g_player.messages.push( "\tand find nothing." );
	}
	endTurn();
	render();
}

function endTurn() {

	// Update player hunger, thirst, and light radius
	const lastHunger = g_player.hunger;
	const lastThirst = g_player.thirst;
	const lastLightRadius = g_player.lightRadius;

	g_player.hunger += 0.05;
	g_player.thirst += 0.15;
	g_player.lightRadius = Math.max( g_player.lightRadius - g_player.lightFade, 0 );

	// Warn player if hunger or thirst is too high
	if( g_player.hunger >= 100 ) {
		g_player.messages.push( "You are starving! You lose 1 hit point." );
		g_player.hitPoints -= 1;
	} else if( lastHunger < 80 && g_player.hunger >= 80 ) {
		g_player.messages.push( "You are getting hungry." );
	}
	if( g_player.thirst >= 100 ) {
		g_player.messages.push( "You are thirsty! You lose 1 hit point." );
		g_player.hitPoints -= 1;
	} else if( lastThirst < 80 && g_player.thirst >= 80 ) {
		g_player.messages.push( "You are getting thirsty." );
	}

	if( g_player.hitPoints <= 0 ) {
		g_player.messages.push( `You have died.` );
		if( g_player.hunger >= 100 ) {
			g_player.killedBy = "starvation";
		} else if( g_player.thirst >= 100 ) {
			g_player.killedBy = "thirst";
		} else {
			g_player.killedBy = "something";
		}
		return;
	}

	// Warn player if torch is fading
	if( 
		( lastLightRadius > 3 && g_player.lightRadius < 3 ) ||
		( lastLightRadius > 2 && g_player.lightRadius < 2 ) ||
		( lastLightRadius > 1 && g_player.lightRadius < 1 )
	) {
		g_player.messages.push( "Your torch flickers and dims." );
	} else if( lastLightRadius > 0 && g_player.lightRadius <= 0 ) {
		g_player.messages.push( "Your torch has gone out." );
	}

	// Move enemies
	for( const enemy of g_level.enemies ) {
		const lastPosition = { "x": enemy.x, "y": enemy.y };

		// Get possible move directions
		const possibleMoves = [
			{ "x": 0, "y": -1 },
			{ "x": 0, "y": 1 },
			{ "x": -1, "y": 0 },
			{ "x": 1, "y": 0 },
			{ "x": -1, "y": -1 },
			{ "x": 1, "y": -1 },
			{ "x": -1, "y": 1 },
			{ "x": 1, "y": 1 },
			{ "x": 0, "y": 0 },
			{ "x": 0, "y": 0 },
			{ "x": 0, "y": 0 },
			{ "x": 0, "y": 0 },
			{ "x": 0, "y": 0 }
		];
		const validMoves = [];
		for( const move of possibleMoves ) {
			const x = enemy.x + move.x;
			const y = enemy.y + move.y;
			const isOccupied = g_level.enemies.find( enemy2 => enemy2.x === x && enemy2.y === y );
			if(
				x >= 0 && x < g_level.width &&
				y >= 0 && y < g_level.height &&
				TILE_WALKABLE.includes( g_level.map[ y ][ x ] ) &&
				!isOccupied
			) {
				validMoves.push( move );
			}
		}

		// Is player in range?
		const dx = enemy.x - g_player.x;
		const dy = enemy.y - g_player.y;
		const d = Math.sqrt( dx * dx + dy * dy );
		if( d < enemy.vision && hasLineOfSight( enemy.x, enemy.y, g_player.x, g_player.y ) ) {

			// Move enemy towards player
			const dx = g_player.x - enemy.x;
			const dy = g_player.y - enemy.y;

			if(
				validMoves.find( move => move.x === Math.sign( dx ) && move.y === Math.sign( dy ) )
			) {
				enemy.x += Math.sign( dx );
				enemy.y += Math.sign( dy );
			} else if( validMoves.length > 0 ) {
				const move = validMoves[ Math.floor( Math.random() * validMoves.length ) ];
				enemy.x += move.x;
				enemy.y += move.y;
			}
		} else if( validMoves.length > 0 ) {

			// Move enemy randomly
			const move = validMoves[ Math.floor( Math.random() * validMoves.length ) ];
			enemy.x += move.x;
			enemy.y += move.y;
		}

		// Check if enemy hits player
		if( enemy.x === g_player.x && enemy.y === g_player.y ) {
			combatStrike( enemy, g_player );
			enemy.x = lastPosition.x;
			enemy.y = lastPosition.y;

			// Stop all other enemy movements if player is dead
			if( g_player.hitPoints <= 0 ) {
				return;
			}
		}
	}

	// Spawn enemies
	if( Math.random() < END_TURN_ENEMY_SPAWN_CHANCE ) {
		spawnEnemy();
	}

	// Heal player over time
	g_player.fn.heal();
}

function combatStrike( entity, target, isRange, missleName ) {
	let entityName = entity.name.toLowerCase();
	let targetName = target.name.toLowerCase();
	let attack = entity.attack;
	if( isRange ) {
		attack = entity.range;
	}
	const attackRoll = Math.round( Math.random() * attack );
	const defenseRoll = Math.round( Math.random() * target.defense );
	if( attackRoll > defenseRoll ) {
		const damage = attackRoll - defenseRoll;
		target.hitPoints -= damage;
		if( entity === g_player ) {
			g_player.messages.push( `You hit the ${targetName} for ${damage} damage.` );	
		} else {
			if( isRange ) {
				g_player.messages.push( `You have been hit by a ${missleName} for ${damage} damage.` );
			} else {
				g_player.messages.push( `The ${entityName} hits you for ${damage} damage.` );
			}
		}
	} else {
		if( entity === g_player ) {
			if( isRange ) {
				g_player.messages.push( `Your ${missleName} misses the ${targetName}.` );
			} else {
				g_player.messages.push( `You attempt to attack the ${targetName} but miss.` );
			}
		} else {
			g_player.messages.push( `The ${entityName} attempts to attack you but misses.` );
		}
	}

	if( target.hitPoints <= 0 ) {
		target.hitPoints = 0;
		if( target === g_player ) {
			g_player.killedBy = entity.name || "something";
			g_player.messages.push( `You have been killed.` );
		} else {
			g_player.messages.push( `The ${targetName} is killed.` );
			g_player.fn.addExperience( target.experience );
		}
		g_level.enemies = g_level.enemies.filter( e => e !== target );
	}
}

function spawnEnemy() {
	const enemy = getEnemy( g_player.level );
	const room = g_level.rooms[ Math.floor( Math.random() * g_level.rooms.length ) ];
	enemy.x = room.x + Math.floor( Math.random() * ( room.w - 2 ) ) + 1;
	enemy.y = room.y + Math.floor( Math.random() * ( room.h - 2 ) ) + 1;

	// Make sure enemy does not spawn on top of another enemy
	if( g_level.enemies.find( e => e.x === enemy.x && e.y === enemy.y ) ) {
		return;
	}

	// Make sure enemy is on a valid tile
	if( !TILE_WALKABLE.includes( g_level.map[ enemy.y ][ enemy.x ] ) ) {
		return;
	}

	// Make sure enemy only spawns in a dark room
	if( m_litTiles[ `${enemy.y},${enemy.x}` ] ) {
		return;
	}
	g_level.enemies.push( enemy );
}

async function showLevelClearedAnimation() {
	let x = OFFSET_X * 8;
	let y = 0;
	let width = $.width() - x;
	let height = $.height();
	while( width > 0 && height > 0 ) {

		// Erase outer rect
		$.setColor( 0 );
		$.rect( x, y, width, height );
		width -= 2;
		height -= 2;
		x += 1;
		y += 1;

		// Draw inner rect
		$.setColor( 7 );
		$.rect( x, y, width, height );

		// Wait before next frame
		await new Promise( resolve => setTimeout( resolve, 8 ) );
	}

	g_player.depth += 1;

	// Randomly generate a shop
	if( g_player.depth > g_player.lastShop + 2 ) {
		if( Math.random() < SHOP_CHANCE ) {
			g_player.lastShop = g_player.depth;
			g_shop.runShop();
			return;
		}
	}
	startLevel();
}

async function showVictorySequence() {

	// Same shrinking-rect animation as when reaching the exit
	let x = 0;
	let y = 0;
	let width = $.width();
	let height = $.height();
	while( width > 0 && height > 0 ) {

		// Erase outer rect
		$.setColor( 0 );
		$.rect( x, y, width, height );
		width -= 2;
		height -= 2;
		x += 1;
		y += 1;

		// Draw inner rect
		$.setColor( 7 );
		$.rect( x, y, width, height );

		// Wait before next frame
		await new Promise( resolve => setTimeout( resolve, 8 ) );
	}
	$.cls();
	g_gameOver.showGameOverScreen( true );
}

async function showGameOverAnimation() {
	let x = 0;
	let y = 0;
	let width = $.width();
	let height = $.height();
	while( width > 0 && height > 0 ) {

		// Erase outer rect
		$.setColor( 0 );
		$.rect( x, y, width, height );
		width -= 2;
		height -= 2;
		x += 1;
		y += 1;

		// Draw inner rect
		$.setColor( 7 );
		$.rect( x, y, width, height );

		// Wait before next frame
		await new Promise( resolve => setTimeout( resolve, 8 ) );
	}
	$.cls();
	g_gameOver.showGameOverScreen( false, g_player.killedBy );
}
