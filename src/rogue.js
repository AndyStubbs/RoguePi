"use strict";
// File: rogue.js

$.screen( "640x350" );
$.setFont( 2 );

const m_level = g_dungeonMap.createMap( $.getCols(), $.getRows(), 1 );
const m_player = g_player.createPlayer();
m_player.x = m_level.startLocation.x;
m_player.y = m_level.startLocation.y;
let m_frame = 1;

addGameKeys();
render();

function render() {
	console.log( "FRAME STARTED" );
	m_frame += 1;
	$.cls();
	g_dungeonMap.renderMap( m_level.map );
	$.setColor( m_player.color );
	$.setPos( m_player.x, m_player.y );
	$.print( m_player.symbol, true );
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
	console.log( "frame", m_frame );
	g_player.move( dx, dy, m_player, m_level );
	render();
}