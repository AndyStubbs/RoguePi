"use strict";
// File: rogue.js

$.screen( "640m350" );

const level = g_dungeonMap.createMap( $.getCols(), $.getRows(), 1 );
g_dungeonMap.renderMap( level.map );