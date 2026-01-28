"use strict";
// File: tiles.js

const TILE_BLANK = " ";
const TILE_FLOOR = ".";
const TILE_DOOR = String.fromCharCode( 240 );
const TILE_WALL_NW = String.fromCharCode( 201 );
const TILE_WALL_N = String.fromCharCode( 205 );
const TILE_WALL_NE = String.fromCharCode( 187 );
const TILE_WALL_W = String.fromCharCode( 186 );
const TILE_WALL_E = String.fromCharCode( 186 );
const TILE_WALL_SW = String.fromCharCode( 200 );
const TILE_WALL_S = String.fromCharCode( 205 );
const TILE_WALL_SE = String.fromCharCode( 188 );
const TILE_PATH = String.fromCharCode( 176 );
const WALKABLE = [
	TILE_FLOOR, TILE_DOOR, TILE_PATH
];
