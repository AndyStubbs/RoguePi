"use strict";
// File: util.js

window.g_util = ( function () {
	return {
		randomRange,
		properName
	};

	function randomRange( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}

	function properName( name ) {
		return name.split( " " ).map(
			part => part.substring( 0, 1 ).toUpperCase() + part.substring( 1 )
		).join( " " );
	}
} )();
