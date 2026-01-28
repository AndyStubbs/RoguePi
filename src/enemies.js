"use strict";
// File: enemies.js

window.g_enemies = ( function () {

	const ENEMIES = [
		{
			"name": "Bat",
			"symbol": "b",
			"color": 11,
			"hitPoints": 1,
			"attack": 2,
			"defense": 4,
			"vision": 2,
			"levels": [ 0, 99 ],
			"spawnValue": 10,
			"experience": 1,
			"loot": []
		},
		{
			"name": "Rat",
			"symbol": "r",
			"color": 12,
			"hitPoints": 2,
			"attack": 3,
			"defense": 2,
			"vision": 3,
			"levels": [ 0, 99 ],
			"spawnValue": 10,
			"experience": 2,
			"loot": []
		},
		{
			"name": "Spider",
			"symbol": "s",
			"color": 13,
			"hitPoints": 1,
			"attack": 3,
			"defense": 8,
			"venom": 0.1,
			"venomChance": 0.5,
			"vision": 3,
			"levels": [ 0, 99 ],
			"spawnValue": 10,
			"experience": 5,
			"loot": []
		},
		{
			"name": "Wolf",
			"symbol": "w",
			"color": 14,
			"hitPoints": 10,
			"attack": 7,
			"defense": 12,
			"vision": 5,
			"levels": [ 0, 99 ],
			"spawnValue": 10,
			"experience": 5,
			"loot": []
		},
		{
			"name": "Bear",
			"symbol": "B",
			"color": 15,
			"hitPoints": 75,
			"attack": 15,
			"defense": 15,
			"vision": 15,
			"levels": [ 0, 99 ],
			"spawnValue": 10,
			"experience": 50,
			"loot": []
		}
	];

	return {
		"getEnemy": getEnemy,
		"getEnemiesForLevel": getEnemiesForLevel
	};

	function getEnemiesForLevel( level ) {

		const availableEnemies = [];

		for( const enemy of ENEMIES ) {
			if( level >= enemy.levels[ 0 ] && level <= enemy.levels[ 1 ] ) {
				availableEnemies.push( structuredClone( enemy ) );
			}
		}

		return availableEnemies;
	}

	function getEnemy( level ) {

		const availableEnemies = getEnemiesForLevel( level );
		let maxEnemySpawnValue = 0;

		for( const enemy of availableEnemies ) {
			maxEnemySpawnValue += enemy.spawnValue;
		}

		if( maxEnemySpawnValue === 0 ) {
			return null;
		}

		let randomEnemySpawnValue = Math.floor(
			Math.random() * maxEnemySpawnValue
		);
		let currentEnemySpawnValue = 0;

		for( const enemy of availableEnemies ) {
			if(
				randomEnemySpawnValue <
				currentEnemySpawnValue + enemy.spawnValue
			) {
				return enemy;
			}
			currentEnemySpawnValue += enemy.spawnValue;
		}

		return null;
	}

} )();
