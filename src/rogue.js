$.screen( "640x350" );
const rooms = createRooms();
for( const room of rooms ) {
	for( let y = room.y; y < room.y + room.h; y += 1 ) {
		for( let x = room.x; x < room.x + room.w; x += 1 ) {
			$.setPos( x, y );
			$.print( "X", true );
		}
	}
}

function createRooms() {
	const rooms = [];
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
			newRoom.x = randomRange( 1, $.getCols() - newRoom.w - 1 );
			newRoom.y = randomRange( 1, $.getRows() - newRoom.h - 1 );
			isRoomPlaced = !rooms.some( room => isRoomOverlapping( newRoom, room ) );
			if( isRoomPlaced ) {
				rooms.push( newRoom );
			}
		}
	}
	return rooms;
}

function isRoomOverlapping( room1, room2 ) {
	return !(
		room1.x + room1.w + 1 < room2.x ||
		room1.x > room2.x + room2.w + 1 ||
		room1.y + room1.h + 1 < room2.y ||
		room1.y > room2.y + room2.h + 1
	);
}

function randomRange( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}