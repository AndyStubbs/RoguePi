"use strict";
// File: util.js

window.g_util = ( function () {
	return {
		randomRange
	};

	function randomRange( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}
} )();
