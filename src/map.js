"use strict";
// File: map.js

window.g_dungeonMap = ( function () {
	const HIDDEN_DOOR_CHANCE = 0.025;
	const HIDDEN_PATH_CHANCE = 0.0025;
	const ROOM_ITEM_DROP_CHANCE = 0.9;
	const ROOM_BEND_CHANCE = 0.5;
	//const ENEMY_SPAWN_CHANCE = 0.65;
	const ENEMY_SPAWN_CHANCE = 0;

	// Map Colors
	const MAP_COLORS = [];
	const level1 = {};
	level1[ TILE_FLOOR ] = [ 2, 191 ];
	level1[ TILE_PATH ] = [ 7, 8 ]
	level1.WALLS = [ 6, 186 ];
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );
	MAP_COLORS.push( level1 );

	let m_count = 1;
	return {
		"createMap": createMap,
		"getWallDirection": getWallDirection,
		"isInRoom": isInRoom,
		"renderMap": renderMap,
		"isWalkable": isWalkable
	};

	function createMap( width, height, level ) {
		console.log( `GENERATING MAP: ${m_count}` );
		m_count += 1;
		const map = createBlankMap( width, height );
		const rooms = generateRooms( map, width, height );
		if( rooms.length < 3 ) {
			return createMap( width, height, level );
		}

		addDeadEnds( map, rooms, width, height );
		addExtraConnection( map, rooms, width, height );
		const doorData = buildRoomWallsAndDoors( map, rooms, width, height );

		if( !doorData.isValid ) {
			return createMap( width, height, level );
		}

		hideRandomPaths( map, width, height );

		const itemData = generateItems( rooms, level );
		const startData = chooseStartLocation( rooms, itemData.itemLookup );
		const exitData = chooseExitLocation( rooms, startData.startingRoom, itemData.itemLookup );
		const enemies = spawnEnemies(
			rooms, level, startData.startLocation, exitData.exitLocation
		);

		return {
			"map": map,
			"rooms": rooms,
			"width": width,
			"height": height,
			"items": itemData.items,
			"enemies": enemies,
			"startLocation": startData.startLocation,
			"exitLocation": exitData.exitLocation
		};
	}

	function createBlankMap( width, height ) {
		const map = [];
		for( let y = 0; y < height; y++ ) {
			map[ y ] = [];
			for( let x = 0; x < width; x++ ) {
				map[ y ][ x ] = TILE_BLANK;
			}
		}
		return map;
	}

	function generateRooms( map, width, height ) {
		const rooms = [];
		const maxRooms = 10;
		const roomMinSize = 3;
		const roomMaxWidth = 12;
		const roomMaxHeight = 8;

		for( let i = 0; i < maxRooms; i++ ) {
			const newRoom = {};
			newRoom.w = g_util.randomRange( roomMinSize, roomMaxWidth );
			newRoom.h = g_util.randomRange( roomMinSize, roomMaxHeight );
			newRoom.x = g_util.randomRange( 1, width - newRoom.w - 1 );
			newRoom.y = g_util.randomRange( 1, height - newRoom.h - 1 );

			let failed = false;
			for( const r of rooms ) {
				if( roomsOverlap( newRoom, r ) ) {
					failed = true;
					break;
				}
			}

			if( !failed ) {
				carveRoom( map, newRoom );
				if( rooms.length > 0 ) {
					const previousRoom = rooms[ rooms.length - 1 ];
					connectRooms( map, newRoom, previousRoom, width, height );
				}
				rooms.push( newRoom );
			}
		}

		return rooms;
	}

	function addDeadEnds( map, rooms, width, height ) {
		const deadEnds = Math.floor( Math.random() * 3 );
		for( let i = 0; i < deadEnds; i += 1 ) {

			const room1 = rooms[ Math.floor( Math.random() * rooms.length ) ];
			const deadEnd = {
				"w": 1,
				"h": 1,
				"x": Math.floor( Math.random() * width ),
				"y": Math.floor( Math.random() * height )
			};

			connectRooms( map, room1, deadEnd, width, height );
		}
	}

	function addExtraConnection( map, rooms, width, height ) {
		if( rooms.length > 3 ) {
			const rooms2 = rooms.slice();
			const roomIndex1 = Math.floor( Math.random() * rooms2.length );
			const room1 = rooms2[ roomIndex1 ];
			rooms2.splice( roomIndex1, 1 );
			const room2 = rooms2[ Math.floor( Math.random() * rooms2.length ) ];
			connectRooms( map, room1, room2, width, height );
		}
	}

	function buildRoomWallsAndDoors( map, rooms, width, height ) {
		const doors = [];
		for( const room of rooms ) {
			room.x -= 1;
			room.y -= 1;
			room.w += 2;
			room.h += 2;
			room.doors = [];
			for( let y = room.y; y < room.y + room.h; y++ ) {
				for( let x = room.x; x < room.x + room.w; x++ ) {

					if( map[ y ][ x ] === TILE_PATH ) {
						if( Math.random() < HIDDEN_DOOR_CHANCE ) {
							map[ y ][ x ] = TILE_HIDDEN_DOOR;
						} else {
							map[ y ][ x ] = TILE_DOOR;
						}

						if(
							( y === room.y && x === room.x ) ||
							( y === room.y && x === room.x + room.w ) ||
							( y === room.y + room.h && x === room.x ) ||
							( y === room.y + room.h && x === room.x + room.w )
						) {
							return {
								"doors": [],
								"isValid": false
							};
						}

						const door = [ y, x ];
						room.doors.push( door );
						doors.push( door );

						continue;
					}

					map[ y ][ x ] = getWallDirection( room, x, y );
				}
			}
		}

		if( !validateDoors( map, doors, width, height ) ) {
			return {
				"doors": [],
				"isValid": false
			};
		}

		return {
			"doors": doors,
			"isValid": true
		};
	}

	function validateDoors( map, doors, width, height ) {
		for( const door of doors ) {
			const y = door[ 0 ];
			const x = door[ 1 ];
			const dirs = [ [ -1, 0 ], [ 0, -1 ], [ 1, 0 ], [ 0, 1 ] ];
			let isValid = false;
			for( const dir of dirs ) {
				const y2 = y + dir[ 0 ];
				const x2 = x + dir[ 1 ];
				if( y2 >= 0 && y2 < height && x2 >= 0 && x2 < width ) {
					if(
						map[ y2 ][ x2 ] === TILE_DOOR ||
						map[ y2 ][ x2 ] === TILE_HIDDEN_DOOR
					) {
						return false;
					}
					if( map[ y2 ][ x2 ] === TILE_PATH ) {
						isValid = true;
					}
				}
			}

			if( !isValid ) {
				return false;
			}
		}
		return true;
	}

	function hideRandomPaths( map, width, height ) {
		for( let y = 0; y < height; y++ ) {
			for( let x = 0; x < width; x++ ) {
				if(
					map[ y ][ x ] === TILE_PATH &&
					Math.random() < HIDDEN_PATH_CHANCE
				) {
					map[ y ][ x ] = TILE_HIDDEN_PATH;
				}
			}
		}
	}

	function generateItems( rooms, level ) {
		const itemLookup = {};
		const items = [];
		for( const room of rooms ) {
			let count = 0;
			while( Math.random() < ROOM_ITEM_DROP_CHANCE && count < 3 ) {
				count += 1;
			}
			for( let i = 0; i < count; i += 1 ) {
				const item = g_items.getItemDrop( level, true );
				item.x = room.x +
					Math.floor( Math.random() * ( room.w - 2 ) ) + 1;
				item.y = room.y +
					Math.floor( Math.random() * ( room.h - 2 ) ) + 1;

				if( !itemLookup[ `${item.x},${item.y}` ] ) {
					items.push( item );
					itemLookup[ `${item.x},${item.y}` ] = true;
				}
			}
		}
		return {
			"items": items,
			"itemLookup": itemLookup
		};
	}

	function chooseStartLocation( rooms, itemLookup ) {
		const startingRoom = rooms[ Math.floor( Math.random() * rooms.length ) ];
		let startLocation = null;

		while( startLocation === null ) {
			startLocation = {
				"x": startingRoom.x +
					Math.floor( Math.random() * ( startingRoom.w - 2 ) ) + 1,
				"y": startingRoom.y +
					Math.floor( Math.random() * ( startingRoom.h - 2 ) ) + 1
			};
			if( itemLookup[ `${startLocation.x},${startLocation.y}` ] ) {
				startLocation = null;
			}
		}
		return {
			"startingRoom": startingRoom,
			"startLocation": startLocation
		};
	}

	function chooseExitLocation( rooms, startingRoom, itemLookup ) {
		let exitRoom = rooms[ Math.floor( Math.random() * rooms.length ) ];
		while( exitRoom === startingRoom ) {
			exitRoom = rooms[ Math.floor( Math.random() * rooms.length ) ];
		}

		let exitLocation = null;
		while( exitLocation === null ) {
			exitLocation = {
				"x": exitRoom.x +
					Math.floor( Math.random() * ( exitRoom.w - 2 ) ) + 1,
				"y": exitRoom.y +
					Math.floor( Math.random() * ( exitRoom.h - 2 ) ) + 1
			};
			if( itemLookup[ `${exitLocation.x},${exitLocation.y}` ] ) {
				exitLocation = null;
			}
		}

		return {
			"exitRoom": exitRoom,
			"exitLocation": exitLocation
		};
	}

	function spawnEnemies( rooms, level, startLocation, exitLocation ) {
		const enemies = [];
		const enemyLookup = {};
		for( const room of rooms ) {
			let count = 0;
			let enemySpawnChance = ENEMY_SPAWN_CHANCE;

			while( Math.random() < enemySpawnChance && count < 3 ) {
				count += 1;
				enemySpawnChance *= 0.5;
			}

			for( let i = 0; i < count; i += 1 ) {
				const enemy = g_enemies.getEnemy( level );
				enemy.x = room.x +
					Math.floor( Math.random() * ( room.w - 2 ) ) + 1;
				enemy.y = room.y +
					Math.floor( Math.random() * ( room.h - 2 ) ) + 1;

				if(
					!enemyLookup[ `${enemy.x},${enemy.y}` ] &&
					startLocation.x !== enemy.x && startLocation.y !== enemy.y &&
					exitLocation.x !== enemy.x && exitLocation.y !== enemy.y
				) {
					enemies.push( enemy );
					enemyLookup[ `${enemy.x},${enemy.y}` ] = true;
				}
			}
		}

		return enemies;
	}

	function roomsOverlap( room1, room2 ) {
		if( room1.x + room1.w + 1 < room2.x ) {
			return false;
		}
		if( room1.x > room2.x + room2.w + 1 ) {
			return false;
		}
		if( room1.y + room1.h + 1 < room2.y ) {
			return false;
		}
		if( room1.y > room2.y + room2.h + 1 ) {
			return false;
		}

		return true;
	}

	function carveH( map, x1, x2, y ) {
		const min = Math.min( x1, x2 );
		const max = Math.max( x1, x2 );

		for( let x = min; x <= max; x++ ) {
			if( map[ y ][ x ] === TILE_BLANK ) {
				map[ y ][ x ] = TILE_PATH;
			}
		}
	}

	function carveV( map, y1, y2, x ) {
		const min = Math.min( y1, y2 );
		const max = Math.max( y1, y2 );

		for( let y = min; y <= max; y++ ) {
			if( map[ y ][ x ] === TILE_BLANK ) {
				map[ y ][ x ] = TILE_PATH;
			}
		}
	}

	function carveRoom( map, room ) {
		for( let y = room.y; y < room.y + room.h; y++ ) {
			for( let x = room.x; x < room.x + room.w; x++ ) {
				map[ y ][ x ] = TILE_FLOOR;
			}
		}
	}

	function connectRooms( map, room1, room2, width, height ) {
		const roomMid1 = {
			"x": Math.floor( room1.x + room1.w / 2 ),
			"y": Math.floor( room1.y + room1.h / 2 )
		};

		const roomMid2 = {
			"x": Math.floor( room2.x + room2.w / 2 ),
			"y": Math.floor( room2.y + room2.h / 2 )
		};

		let bends = 1;

		if( Math.random() < ROOM_BEND_CHANCE ) {
			bends = g_util.randomRange( 2, 3 );
		}

		let lastX = roomMid1.x;
		let lastY = roomMid1.y;

		for( let i = 0; i < bends; i++ ) {
			const ratio = ( i + 1 ) / ( bends + 1 );

			let targetX = Math.floor(
				roomMid1.x + ( roomMid2.x - roomMid1.x ) * ratio
			) + g_util.randomRange( -3, 3 );

			let targetY = Math.floor(
				roomMid1.y + ( roomMid2.y - roomMid1.y ) * ratio
			) + g_util.randomRange( -3, 3 );

			if( targetX < 1 ) {
				targetX = 1;
			}
			if( targetX > width - 2 ) {
				targetX = width - 2;
			}

			if( targetY < 1 ) {
				targetY = 1;
			}
			if( targetY > height - 2 ) {
				targetY = height - 2;
			}

			carveH( map, lastX, targetX, lastY );
			carveV( map, lastY, targetY, targetX );

			lastX = targetX;
			lastY = targetY;
		}

		carveH( map, lastX, roomMid2.x, lastY );
		carveV( map, lastY, roomMid2.y, roomMid2.x );
	}

	function getWallDirection( room, x, y ) {
		if( x === room.x && y === room.y ) {
			return TILE_WALL_NW;
		}
		if( x === room.x + room.w - 1 && y === room.y ) {
			return TILE_WALL_NE;
		}
		if( y === room.y ) {
			return TILE_WALL_N;
		}
		if( x === room.x && y === room.y + room.h - 1 ) {
			return TILE_WALL_SW;
		}
		if( x === room.x + room.w - 1 && y === room.y + room.h - 1 ) {
			return TILE_WALL_SE;
		}
		if( y === room.y + room.h - 1 ) {
			return TILE_WALL_S;
		}
		if( x === room.x ) {
			return TILE_WALL_W;
		}
		if( x === room.x + room.w - 1 ) {
			return TILE_WALL_E;
		}

		return TILE_FLOOR;
	}

	function getRoom( rooms, x, y ) {
		for( const room of rooms ) {
			if(
				x >= room.x && x < room.x + room.w &&
				y >= room.y && y < room.y + room.h
			) {
				return room;
			}
		}

		return null;
	}

	function isInRoom( rooms, x, y ) {
		return getRoom( rooms, x, y ) !== null;
	}

	function renderMap( map, litTiles, depth ) {
		const colors = MAP_COLORS[ depth ];
		for( let y = 0; y < map.length; y += 1 ) {
			for( let x = 0; x < map[ y ].length; x += 1 ) {
				const tile = map[ y ][ x ];
				if( tile === " " ) {
					continue;
				}
				$.setPos( OFFSET_X + x, y );
				let colorSet;
				if( colors[ tile ] ) {
					colorSet = colors[ tile ];
				} else {
					colorSet = colors[ "WALLS" ];
				}
				if( litTiles[ `${x},${y}` ] ) {
					$.setColor( colorSet[ 0 ] );
				} else {
					$.setColor( colorSet[ 1 ] );
				}
				$.print( tile, true );
			}
		}
	}

	function isWalkable( map, x, y ) {
		return map[ y ] && map[ y ][ x ] === TILE_FLOOR;
	}

} )();
