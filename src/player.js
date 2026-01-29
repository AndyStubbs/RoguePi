"use strict";
// File: items.js

window.g_player = ( function () {
	return {
		createPlayer,
		move
	};

	function createPlayer() {
		return {
			"x": 0,
			"y": 0,
			"color": 14,
			"symbol": String.fromCharCode( 1 )
		};
	}

	function move( dx, dy, player, level ) {
		const lastPos = { "x": player.x, "y": player.y };
		player.x += dx;
		player.y += dy;

		if(
			player.x < 0 || player.x > level.width -1 ||
			player.y < 0 || player.y > level.height - 1
		) {
			player.x = lastPos.x;
			player.y = lastPos.y;
		}

		if( !TILE_WALKABLE.includes( level.map[ player.y ][ player.x ] ) ) {
			player.x = lastPos.x;
			player.y = lastPos.y;
		}

		// Check if player hits an enemy
		//for( const enemy of level.enemies ) {
		//	if( enemy.x === player.x && enemy.y === player.y ) {
		//		combatStrike( player, enemy );
		//		player.x = lastPos.x;
		//		player.y = lastPos.y;
		//	}
		//}
	}

} )();
