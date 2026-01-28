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
				m_rooms.push( newRoom );
				carveRoom( newRoom );
			}
		}
	}
	return m_rooms;
}

function isRoomOverlapping( room1, room2 ) {
	return !(
		room1.x + room1.w + 1 < room2.x ||
		room1.x > room2.x + room2.w + 1 ||
		room1.y + room1.h + 1 < room2.y ||
		room1.y > room2.y + room2.h + 1
	);
}

function carveRoom( room ) {
	for( let y = room.y; y < room.y + room.h; y++ ) {
		for ( let x = room.x; x < room.x + room.w; x++ ) {
			m_map[ y ][ x ] = TILE_FLOOR;
		}
	}
};

function connectRooms( room1, room2 ) {

}

function carveH( map, x1, x2, y ) {
	for( let x = Math.min( x1, x2 ); x <= Math.max( x1, x2 ); x++ ) {
		if( map[ y ][ x ] === TILE_BLANK ) {
			map[ y ][ x ] = TILE_PATH;
		}
	}
}

function carveV( map, y1, y2, x ) {
	for( let y = Math.min( y1, y2 ); y <= Math.max( y1, y2 ); y++ ) {
		if( map[ y ][ x ] === TILE_BLANK ) {
			map[ y ][ x ] = TILE_PATH;
		}
	}
}

function randomRange( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}