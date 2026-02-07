"use strict";
// File: tiles.js

const TILE_BLANK = " ";
const TILE_FLOOR = ".";
const TILE_DOOR = String.fromCharCode( 206 );
const TILE_EXIT = String.fromCharCode( 240 );
const TILE_HIDDEN_DOOR = String.fromCharCode( 3 );
const TILE_HIDDEN_PATH = String.fromCharCode( 4 );
const TILE_WALL_NW = String.fromCharCode( 201 );
const TILE_WALL_N = String.fromCharCode( 205 );
const TILE_WALL_NE = String.fromCharCode( 187 );
const TILE_WALL_W = String.fromCharCode( 186 );
const TILE_WALL_E = String.fromCharCode( 186 );
const TILE_WALL_SW = String.fromCharCode( 200 );
const TILE_WALL_S = String.fromCharCode( 205 );
const TILE_WALL_SE = String.fromCharCode( 188 );
const TILE_PATH = String.fromCharCode( 176 );
const TILE_PATH_DARK = String.fromCharCode( 249 );
const TILE_WALKABLE = [
	TILE_FLOOR, TILE_DOOR, TILE_PATH
];
const TILE_WALLS = [
	TILE_WALL_NW, TILE_WALL_N, TILE_WALL_NE,
	TILE_WALL_W, TILE_WALL_E,
	TILE_WALL_SW, TILE_WALL_S, TILE_WALL_SE
];
const TILE_BLOCKING = [
	...TILE_WALLS,
	TILE_DOOR,
	TILE_HIDDEN_DOOR
];
const TILE_FLOORS = [
	TILE_FLOOR, TILE_PATH
];
const TILE_DOORS = [ TILE_DOOR ];
const TILE_HIDDEN = [ TILE_HIDDEN_DOOR, TILE_HIDDEN_PATH ];
const TILE_TRAVERSABLE = [
	TILE_FLOOR, TILE_DOOR, TILE_PATH, TILE_HIDDEN_PATH
];

const g_tiles ={
	"init": () => {
		$.setChar( 249, "0022000800220000" );
	}
};
