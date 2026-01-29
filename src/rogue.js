"use strict";
// File: rogue.js

$.screen( "640x350" );
$.setFont( 2 );

let m_level;
let m_player;

startGame();

function startGame() {
	m_level = g_dungeonMap.createMap( $.getCols(), $.getRows(), 1 );
	m_player = g_player.createPlayer( m_level.width, m_level.height );
	m_player.x = m_level.startLocation.x;
	m_player.y = m_level.startLocation.y;
	addGameKeys();
	render();
}

function render() {
	$.cls();
	const litTiles = getLitTiles();
	for( const tileIndex in litTiles ) {
		const tile = litTiles[ tileIndex ];
		m_player.map[ tile.y ][ tile.x ] = m_level.map[ tile.y ][ tile.x ];
	}
	g_dungeonMap.renderMap( m_player.map, litTiles );
	$.setColor( m_player.color );
	$.setPos( m_player.x, m_player.y );
	$.print( m_player.symbol, true );
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
	const playerKey = `${py},${px}`;
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
			const nKey = `${ny},${nx}`;

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
		run();
	}, false, true );
}

function move( dx, dy ) {
	g_player.move( dx, dy, m_player, m_level );
	render();
}


