"use strict";

$.screen( "640x350" );

const m_map = [];
const m_rooms = [];
const m_width = $.getCols();
const m_height = $.getRows();

// Create an empty map
for( let y = 0; y < m_height; y++ ) {
	m_map[ y ] = [];
	for( let x = 0; x < m_width; x++ ) {
		m_map[ y ][ x ] = TILE_BLANK;
	}
}

createRooms();
createConnections();

// Render the map
for( let y = 0; y < m_map.length; y += 1 ) {
	for( let x = 0; x < m_map[ y ].length; x += 1 ) {
		const tile = m_map[ y ][ x ];
		$.setPos( x, y );
		$.print( tile, true );
	}
}

function createRooms() {
	const roomMinSize = 3;
	const roomMaxWidth = 12;
	const roomMaxHeight = 8;
	const count = randomRange( 3, 10 );
	for( let i = 0; i < count; i += 1 ) {
		let isRoomPlaced = false;
		while( !isRoomPlaced ) {
			const newRoom = {};
			newRoom.w = randomRange( roomMinSize, roomMaxWidth );
			newRoom.h = randomRange( roomMinSize, roomMaxHeight );
			newRoom.x = randomRange( 1, m_width - newRoom.w - 1 );
			newRoom.y = randomRange( 1, m_height - newRoom.h - 1 );
			isRoomPlaced = !m_rooms.some( room => isRoomOverlapping( newRoom, room ) );
			if( isRoomPlaced ) {
				carveRoom( newRoom );
				m_rooms.push( newRoom );
			}
		}
	}
}

function createConnections() {
	for( let i = 1; i < m_rooms.length; i += 1 ) {
		connectRooms( m_rooms[ i ], m_rooms[ i - 1 ] );
	}
	connectRooms( m_rooms[ 0 ], m_rooms[ m_rooms.length - 1 ] );
}

function isRoomOverlapping( room1, room2 ) {
	return !(
		room1.x + room1.w + 2 < room2.x ||
		room1.x > room2.x + room2.w + 2 ||
		room1.y + room1.h + 2 < room2.y ||
		room1.y > room2.y + room2.h + 2
	);
}

function carveRoom( room ) {

	// Carve tile walls
	m_map[ room.y - 1 ][ room.x - 1 ] = TILE_WALL_NW;
	m_map[ room.y - 1 ][ room.x + room.w ] = TILE_WALL_NE;
	for( let x = room.x; x < room.x + room.w; x += 1 ) {
		m_map[ room.y - 1 ][ x ] = TILE_WALL_N;
		m_map[ room.y + room.h ][ x ] = TILE_WALL_S;
	}
	m_map[ room.y + room.h ][ room.x - 1 ] = TILE_WALL_SW;
	m_map[ room.y + room.h ][ room.x + room.w ] = TILE_WALL_SE;
	for( let y = room.y; y < room.y + room.h; y += 1 ) {
		m_map[ y ][ room.x - 1 ] = TILE_WALL_E;
		m_map[ y ][ room.x + room.w ] = TILE_WALL_W;
	}

	// Carve floor
	for( let y = room.y; y < room.y + room.h; y++ ) {
		for ( let x = room.x; x < room.x + room.w; x++ ) {
			m_map[ y ][ x ] = TILE_FLOOR;
		}
	}
};

function connectRooms( room1, room2 ) {
	const startX = randomRange( room1.x + 1, room1.x + room1.w - 1 );
	const startY = randomRange( room1.y + 1, room1.y + room1.h - 1 );
	const midX = randomRange(
		Math.min( room1.x + 1, room2.x + 1 ),
		Math.max( room1.x + room1.w - 2, room2.x + room2.w - 1 )
	);
	const midY = randomRange(
		Math.min( room1.y + 1, room2.y + 1 ),
		Math.max( room1.y + room1.h - 2, room2.y + room2.h - 1 )
	);
	const endX = randomRange( room2.x + 1, room2.x + room2.w - 1 );
	const endY = randomRange( room2.y + 1, room2.y + room2.h - 1 );

	// Carve from start to mid point
	carveH( startX, midX, startY );
	carveV( startY, midY, midX );

	// Carve from mid point to end
	carveH( midX, endX, midY );
	carveV( midY, endY, endX );
}

function carveH( x1, x2, y ) {
	const startX = Math.min( x1, x2 );
	const endX = Math.max( x1, x2 );
	for( let x = startX; x <= endX; x++ ) {
		if( m_map[ y ][ x ] === TILE_BLANK ) {
			m_map[ y ][ x ] = TILE_PATH;
		}
	}
}

function carveV( y1, y2, x ) {
	const startY = Math.min( y1, y2 );
	const endY = Math.max( y1, y2 );
	for( let y = startY; y <= endY; y++ ) {
		if( m_map[ y ][ x ] === TILE_BLANK ) {
			m_map[ y ][ x ] = TILE_PATH;
		}
	}
}

function randomRange( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}