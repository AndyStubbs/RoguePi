"use strict";
// File: rogue.js
/*
	global g_player;
*/

const OFFSET_X = 17;
//const END_TURN_ENEMY_SPAWN_CHANCE = 0.01;
const END_TURN_ENEMY_SPAWN_CHANCE = 0;

const g_mainScreen = $.screen( "640x350" );
const g_messageScreen = $.screen( "320x192", null, true );
g_mainScreen.setFont( 2 );
g_messageScreen.setFont( 2 );
$.setScreen( g_mainScreen );

let m_level;
let m_player;

startLevel();

function startLevel() {
	m_level = g_dungeonMap.createMap( $.getCols()- OFFSET_X, $.getRows(), 1 );
	m_player = g_player.createPlayer( m_level.width, m_level.height );
	m_player.x = m_level.startLocation.x;
	m_player.y = m_level.startLocation.y;
	addGameKeys();
	render();
}

function render() {
	$.cls();

	// Render map
	const litTiles = getLitTiles();
	for( const tileId in litTiles ) {
		const tile = litTiles[ tileId ];
		m_player.map[ tile.y ][ tile.x ] = m_level.map[ tile.y ][ tile.x ];
	}
	g_dungeonMap.renderMap( m_player.map, litTiles, m_player.depth - 1 );

	// Render Items
	for( const item of m_level.items ) {
		const tileId = `${item.x},${item.y}`;
		if( !litTiles[ tileId ] ) {
			continue;
		}
		$.setColor( item.color );
		$.setPos( item.x + OFFSET_X, item.y );
		$.print( item.symbol );
	}

	// Render exit
	const exitTileId = `${m_level.exitLocation.x},${m_level.exitLocation.y}`;
	if( litTiles[ exitTileId ] ) {
		$.setPos( m_level.exitLocation.x + OFFSET_X, m_level.exitLocation.y );
		$.setColor( 7 );
		$.print( TILE_EXIT, true );
	}

	// Render enemies
	for( const enemy of m_level.enemies ) {
		const tileId = `${enemy.x},${enemy.y}`;
		if( !litTiles[ tileId ] ) {
			continue;
		}
		$.setColor( enemy.color );
		$.setPos( enemy.x + OFFSET_X, enemy.y );
		$.print( enemy.symbol );
	}
	
	
	// Render Player
	$.cls( ( OFFSET_X + m_player.x ) * 8, m_player.y * 8, 8, 8 );
	$.setColor( m_player.color );
	$.setPos( OFFSET_X + m_player.x, m_player.y );
	$.print( m_player.symbol, true );

	// Render Stats
	renderStats();

	// Render Messages
	if( m_player.messages.length > 0 ) {
		let message = m_player.messages.join( "\n" );
		printMessage( message );
	}
	m_player.messages = [];

	// Check player game over
	if( m_player.hitPoints === 0 ) {
		$.clearEvents();
		setTimeout( () => {
			showGameOverAnimation();
		}, 1000 );
		return;	
	}

	// Check if player has found the exit
	if( m_player.x === m_level.exitLocation.x && m_player.y === m_level.exitLocation.y ) {
		printMessage( "You decend lower into the dungeon." );
		$.clearEvents();
		setTimeout( () => {
			$.cls( OFFSET_X * 8, 0, $.width(), $.height() );
			g_dungeonMap.renderMap( m_player.map, litTiles, m_player.depth - 1 );
			showLevelClearedAnimation();
		}, 1000 );
	}
}

function getLitTiles() {

	// Clear previous lit tiles
	const litTiles = {};

	const radius = Math.ceil( m_player.lightRadius );
	const px = m_player.x;
	const py = m_player.y;
	const playerTile = m_level.map[ py ][ px ];

	// Determine if we're in a path context (on path or door adjacent to path)
	let isOnPath = playerTile === TILE_PATH;
	if( playerTile === TILE_DOOR ) {

		// Check adjacent tiles to see if we're connected to a path
		const dirs = [ [ -1, 0 ], [ 1, 0 ], [ 0, -1 ], [ 0, 1 ] ];
		for( const [ dx, dy ] of dirs ) {
			const ax = px + dx;
			const ay = py + dy;
			if( ax >= 0 && ax < m_level.width && ay >= 0 && ay < m_level.height ) {
				const adjTile = m_level.map[ ay ][ ax ];
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
			if( nx < 0 || nx >= m_level.width || ny < 0 || ny >= m_level.height ) {
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

			const tile = m_level.map[ ny ][ nx ];

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
				const card1 = m_level.map[ y ][ nx ];
				const card2 = m_level.map[ ny ][ x ];

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
			const tile = m_level.map[ y ][ x ];

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
	g_player.move( dx, dy, m_player, m_level );
	pickupItems();
	render();
	endTurn();
}

function renderStats() {
	
	// Compute attack
	m_player.attack = m_player.level;
	if( m_player.weapons.melee ) {
		m_player.attack += m_player.weapons.melee.attack;
	}
	m_player.range = 0;
	if( m_player.weapons.range ) {

		// Add attack value of missile
		if( m_player.weapons.missile ) {
			m_player.range += m_player.level + m_player.weapons.range.attack +
				m_player.weapons.missile.attack;
		} else {
			m_player.range += m_player.level + m_player.weapons.range.attack;
		}
	}

	// Compute Defense
	m_player.defense = m_player.level;
	for( const itemId in m_player.armor ) {
		const item = m_player.armor[ itemId ];
		if( item ) {
			m_player.defense += item.defense;
		}
	}
	
	$.setPos( 0, 0 );
	$.setColor( 8 );
	$.print();
	printTitle( "Depth " + m_player.depth );
	$.print();
	$.setColor( 14 );
	$.print();
	printTitle( m_player.name );
	$.print();
	$.setColor( 3 );
	printStat( "RNK", m_player.rank );
	printStat( "EXP", m_player.experience );
	printStat( "GLD", m_player.gold, 90 );
	printStat( "ATT", m_player.attack, 2 );
	printStat( "RNG", m_player.range, 2 );
	printStat( "DEF", m_player.defense, 2 );
	printStat( "HIT", Math.round( m_player.hitPoints ), 3 );
	printStat( "HUN", Math.round( m_player.hunger ), 3 );
	printStat( "THR", Math.round( m_player.thirst ), 3 );

	$.print( "\n" );
	$.setColor( 10 );
	printTitle( "Items" );
	$.print();
	for( let i = 0; i < m_player.items.length; i += 1 ) {
		const item = m_player.items[ i ];
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
	$.print( "".padEnd( leftPadding, " " ) + title +  "".padStart( rightPadding, " " ), true );
	const posPx = $.getPosPx();
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
	for( const item of m_level.items ) {
		if( item.x === m_player.x && item.y === m_player.y ) {
			let isAdded = pickupItem( item );
			if( isAdded ) {
				itemsToRemove.push( item );
			}

			// Print the pickup message
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

			m_player.messages.push( pickupMsg );
		}
	}
	m_level.items = m_level.items.filter( item => !itemsToRemove.includes( item ) );
}

function pickupItem( item ) {
	let isAdded = false;

	// If item is gold add to player gold
	if( item.name === ITEM_GOLD ) {
		m_player.gold += item.quantity;
		isAdded = true;
	}

	// For stackable items then they can be added to the quantity of items found.
	else if( item.stackable ) {
		for( const playerItem of m_player.items ) {
			if( playerItem.name === item.name ) {
				playerItem.quantity += item.quantity;
				isAdded = true;
				break;
			}
		}
	}

	// Add item to players inventory
	if( !isAdded ) {
		if( m_player.items.length < 10 ) {
			m_player.items.push( item );
			isAdded = true;
		}
	}

	return isAdded;
}

function getMessagePosition( height ) {
	const x = OFFSET_X * 4 + Math.floor( ( $.width() - g_messageScreen.width() ) / 2 );
	let y = Math.floor( ( $.height() - height ) / 2 );
	let py = m_player.y * 8;
	if( py >= y - 16 && py < y - 16 + height + 24 ) {
		y = py - height - 16;
	}
	return { x, y };
}

async function promptMessage( msg, isImmediate = false ) {
	$.clearEvents();
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
	if( m_player.items.length === 0 ) {
		$.setColor( 4 );
		m_player.messages.push( "You have no items to use." );
		render();
		return;
	}

	if( itemIndex === null ) {
		itemIndex = await promptMessage( `Use which item (0-${m_player.items.length - 1})` );
	}
	
	if( itemIndex !== null && itemIndex < m_player.items.length ) {
		let item = m_player.items[ itemIndex ];
		if( item.weapon ) {

			let itemDescription = `${item.article} ${item.name}`;
			if( item.quantity > 1 ) {
				itemDescription = `the ${item.plural}`;
			}

			// Make sure you cannot equip a non-compatible missile type
			if(
				item.weapon === "missile" &&
				m_player.weapons.range &&
				m_player.weapons.range.missileType !== item.missileType
			) {
				m_player.messages.push(
					`You cannot equip ${itemDescription} because it is not compatible your ` +
					`ranged weapon.`
				);
				render();
				return;
			}
			if( m_player.weapons[ item.weapon ] ) {
				m_player.weapons[ item.weapon ].equipped = false;
			}
			if( m_player.weapons[ item.weapon ] === item ) {
				m_player.weapons[ item.weapon ] = null;
				m_player.messages.push( `You unequip ${itemDescription}.` );
			} else {
				item.equipped = true;
				m_player.weapons[ item.weapon ] = item;
				m_player.messages.push( `You equip ${itemDescription}.` );
			}

			// Make sure range and missile type matches
			if(
				item.weapon === "range" &&
				m_player.weapons.missile !== null &&
				m_player.weapons.range.missileType !== m_player.weapons.missile.name
			) {
				m_player.weapons.missile.equipped = false;
				m_player.weapons.missile = null;
			}
		} else if( item.armor ) {
			if( m_player.armor[ item.armor ] ) {
				m_player.armor[ item.armor ].equipped = false;
			}
			if( m_player.armor[ item.armor ] === item ) {
				m_player.armor[ item.armor ] = null;
				m_player.messages.push( `You unequip ${item.article} ${item.name}.` );
			} else {
				item.equipped = true;
				m_player.armor[ item.armor ] = item;
				m_player.messages.push( `You equip ${item.article} ${item.name}.` );
			}
		} else if( item.lightRadius ) {
			m_player.lightRadius = item.lightRadius;
			m_player.lightFade = item.lightFade;
			m_player.messages.push( `You use ${item.article} ${item.name} to light your way.` );
			item.quantity -= 1;
			if( item.quantity === 0 ) {
				m_player.items.splice( itemIndex, 1 );
			}
		} else if( item.thirst ) {
			m_player.thirst = Math.max( m_player.thirst - item.thirst, 0 );
			m_player.messages.push( `You drink from ${item.article} ${item.name}.` );
			item.quantity -= 1;
			if( item.quantity === 0 ) {
				m_player.items.splice( itemIndex, 1 );
			}
		} else if( item.hunger ) {
			m_player.hunger = Math.max( m_player.hunger - item.hunger, 0 );
			m_player.messages.push( `You eat ${item.article} ${item.name}.` );
			item.quantity -= 1;
			if( item.quantity === 0 ) {
				m_player.items.splice( itemIndex, 1 );
			}
		}
		endTurn();
		render();
	} else {
		if( typeof itemIndex === "number" ) {
			m_player.messages.push( `There is no item at index ${itemIndex}.` );
		} else {
			m_player.messages.push( "Use item cancelled." );
		}
		render();
	}
}

async function dropItem() {
	if( m_player.items.length === 0 ) {
		$.setColor( 4 );
		m_player.messages.push( "You have no items to drop." );
		render();
		return;
	}

	const height = 8;
	const { x, y } = getMessagePosition( height );
	$.setPosPx( x + 8, y + 8 );
	const itemIndex = await promptMessage( `Drop which item (0-${m_player.items.length - 1})` );
	if( itemIndex !== null && itemIndex < m_player.items.length ) {
		let item = m_player.items[ itemIndex ];

		// First unequip the item
		if( item.equipped ) {
			if( item.weapon && m_player.weapons[ item.weapon ] ) {
				m_player.weapons[ item.weapon ] = null;
			} else if( item.armor && m_player.armor[ item.armor ] ) {
				m_player.armor[ item.armor ] = null;
			}
			item.equipped = false;
		}

		m_player.items.splice( itemIndex, 1 );
		item.x = m_player.x;
		item.y = m_player.y;
		m_level.items.push( item );
		m_player.messages.push( `You drop ${item.article} ${item.name}.` );
		endTurn();
	} else {
		if( typeof itemIndex === "number" ) {
			m_player.messages.push( `There is no item at index ${itemIndex}.` );
		} else {
			m_player.messages.push( "Drop item cancelled." );
		}
	}
	render();
}

async function rangeAttack() {	
	if( m_player.weapons.range === null ) {
		$.setColor( 4 );
		m_player.messages.push( "You don't have a ranged weapon equipped." );
		render();
		return;
	}
	if( m_player.weapons.range.missileType && m_player.weapons.missile === null ) {
		$.setColor( 4 );
		m_player.messages.push( "You don't have any missiles equipped." );
		render();
		return;
	}

	const direction = ( await promptMessage( "Enter direction (movement key):", true ) ).key;
	if( direction === "Escape" ) {
		m_player.messages.push( "Range attack cancelled." );
		render();
		return;
	}

	const MOVEMENT_KEYS = [
		"w", "a", "s", "d", "q", "e", "c", "z", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight",
		"Home", "PageUp", "PageDown", "End"
	];
	if( !MOVEMENT_KEYS.includes( direction ) ) {
		m_player.messages.push( "Direction is not valid" );
		render();
		return;
	}

	let distance = m_player.weapons.range.distance;
	if( m_player.weapons.range.missileType ) {
		distance += m_player.weapons.missile.distance;
	}

	await fireMissile( m_player.x, m_player.y, direction, distance, m_player );
	
	// Reduce missile quantity and remove it from inventory when gone
	let missileIndex = null;
	if( m_player.weapons.range.missileType ) {
		missileIndex = m_player.items.findIndex( item => item === m_player.weapons.missile );
	} else {
		missileIndex = m_player.items.findIndex( item => item === m_player.weapons.range );
	}
	
	const missile = m_player.items[ missileIndex ];
	missile.quantity -= 1;
	if( missile.quantity === 0 ) {
		if( m_player.weapons.range.missileType ) {
			m_player.weapons.missile = null;
		} else {
			m_player.weapons.range = null;
		}
		m_player.items.splice( missileIndex, 1 );
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
		if( TILE_BLOCKING.includes( m_level.map[ y ][ x ] ) ) {
			isCollided = true;
		}
		if( self === m_player ) {
			const enemyHit = m_level.enemies.find( enemy2 => enemy2.x === x && enemy2.y === y );
			if( enemyHit ) {
				isCollided = true;
				combatStrike( m_player, enemyHit, true, missileName );
			}
		} else {
			if( x === m_player.x && y === m_player.y ) {
				isCollided = true;
				combatStrike( self, m_player, true, missileName );
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
	
	m_player.messages.push( "You search the area..." );

	let hasDiscovery = false;

	// Search 3 areas
	for( let i = 0; i < 3; i += 1 ) {
		const search = searches[ Math.floor( Math.random() * searches.length ) ];
		const tile = m_level.map[ m_player.y + search[ 1 ] ][ m_player.x + search[ 0 ] ];
		if( tile === TILE_HIDDEN_DOOR ) {
			m_player.messages.push( "\tand find a hidden door" );
			hasDiscovery = true;
			m_level.map[ m_player.y + search[ 1 ] ][ m_player.x + search[ 0 ] ] = TILE_DOOR;
		} else if( tile === TILE_HIDDEN_PATH ) {
			m_player.messages.push( "\tand find a hidden path" );
			hasDiscovery = true;
			m_level.map[ m_player.y + search[ 1 ] ][ m_player.x + search[ 0 ] ] = TILE_PATH;
		} 
	}
	if( !hasDiscovery ) {
		m_player.messages.push( "\tand find nothing." );
	}
	endTurn();
	render();
}

function endTurn() {
	m_player.hunger += 0.05;
	m_player.thirst += 0.15;
	m_player.lightRadius = Math.max( m_player.lightRadius - m_player.lightFade, 0 );

	// Move enemies
	for( const enemy of m_level.enemies ) {
		
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
			const isOccupied = m_level.enemies.find( enemy2 => enemy2.x === x && enemy2.y === y );
			if(
				x >= 0 && x < m_level.width &&
				y >= 0 && y < m_level.height &&
				TILE_WALKABLE.includes( m_level.map[ y ][ x ] ) &&
				!isOccupied
			) {
				validMoves.push( move );
			}
		}

		// Is player in range?
		const dx = enemy.x - m_player.x;
		const dy = enemy.y - m_player.y;
		const d = Math.sqrt( dx * dx + dy * dy );
		if( d < enemy.vision && hasLineOfSight( enemy.x, enemy.y, m_player.x, m_player.y ) ) {

			// Move enemy towards player
			const dx = m_player.x - enemy.x;
			const dy = m_player.y - enemy.y;

			if(
				validMoves.find( move => move.x === Math.sign( dx ) && move.y === Math.sign( dy ) )
			) {
				enemy.x += Math.sign( dx );
				enemy.y += Math.sign( dy );
			} else {
				const move = validMoves[ Math.floor( Math.random() * validMoves.length ) ];
				enemy.x += move.x;
				enemy.y += move.y;
			}
		} else {

			// Move enemy randomly
			const move = validMoves[ Math.floor( Math.random() * validMoves.length ) ];
			enemy.x += move.x;
			enemy.y += move.y;
		}

		// Check if enemy hits player
		if( enemy.x === m_player.x && enemy.y === m_player.y ) {
			combatStrike( enemy, m_player );
			enemy.x = lastPosition.x;
			enemy.y = lastPosition.y;

			// Stop all other enemy movements if player is dead
			if( m_player.hitPoints === 0 ) {
				return;
			}
		}
	}

	// Spawn enemies
	if( Math.random() < END_TURN_ENEMY_SPAWN_CHANCE ) {
		spawnEnemy();
	}

	// Heal player over time
	g_player.heal( m_player );
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
		if( entity === m_player ) {
			m_player.messages.push( `You hit the ${targetName} for ${damage} damage.` );	
		} else {
			if( isRange ) {
				m_player.messages.push( `You have been hit by a ${missleName} for ${damage} damage.` );
			} else {
				m_player.messages.push( `The ${entityName} hits you for ${damage} damage.` );
			}
		}
	} else {
		if( entity === m_player ) {
			if( isRange ) {
				m_player.messages.push( `Your ${missleName} misses the ${targetName}.` );
			} else {
				m_player.messages.push( `You attempt to attack the ${targetName} but miss.` );
			}
		} else {
			m_player.messages.push( `The ${entityName} attempts to attack you but misses.` );
		}
	}

	if( target.hitPoints <= 0 ) {
		target.hitPoints = 0;
		if( target === m_player ) {
			m_player.messages.push( `You have been killed.` );
		} else {
			m_player.messages.push( `The ${targetName} is killed.` );
			g_player.addExperience( m_player, target.experience );
		}
		m_level.enemies = m_level.enemies.filter( e => e !== target );
	}
}

function spawnEnemy() {
	const enemy = getEnemy( m_player.level );
	const room = m_level.rooms[ Math.floor( Math.random() * m_level.rooms.length ) ];
	enemy.x = room.x + Math.floor( Math.random() * ( room.w - 2 ) ) + 1;
	enemy.y = room.y + Math.floor( Math.random() * ( room.h - 2 ) ) + 1;

	// Make sure enemy does not spawn on top of another enemy
	if( m_level.enemies.find( e => e.x === enemy.x && e.y === enemy.y ) ) {
		return;
	}

	// Make sure enemy only spawns in a dark room
	if( m_litTiles[ `${enemy.y},${enemy.x}` ] ) {
		return;
	}
	m_level.enemies.push( enemy );
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

	m_player.depth += 1;

	// Randomly generate a shop
	if( m_player.depth > m_player.lastShop + 2 ) {
		if( Math.random() < SHOP_CHANCE ) {
			m_player.lastShop = m_player.depth;
			runShop();
			return;
		}
	}
	startLevel();
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
	$.print( "Game Over" );
}
