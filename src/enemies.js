"use strict";
// File: enemies.js

window.g_enemies = ( function () {

	const ENEMIES = [
		{
			"name": "Bat",
			"symbol": "b",
			"color": 25,
			"hitPoints": 1,
			"attack": 2,
			"defense": 4,
			"vision": 2,
			"levels": [ 0, 10 ],
			"spawnValue": 20,
			"experience": 1,
			"loot": []
		},
		{
			"name": "Rat",
			"symbol": "r",
			"color": 114,
			"hitPoints": 2,
			"attack": 3,
			"defense": 2,
			"vision": 3,
			"levels": [ 0, 10 ],
			"spawnValue": 15,
			"experience": 2,
			"loot": []
		},
		{
			"name": "Spider",
			"symbol": "s",
			"color": 28,
			"hitPoints": 1,
			"attack": 3,
			"defense": 8,
			"venom": 0.1,
			"venomChance": 0.5,
			"vision": 3,
			"levels": [ 0, 10 ],
			"spawnValue": 15,
			"experience": 3,
			"loot": []
		},
		{
			"name": "Wolf",
			"symbol": "w",
			"color": 65,
			"hitPoints": 8,
			"attack": 5,
			"defense": 5,
			"vision": 10,
			"levels": [ 2, 10 ],
			"spawnValue": 5,
			"experience": 8,
			"loot": []
		},
		{
			"name": "Goblin",
			"symbol": "g",
			"color": 120,
			"hitPoints": 8,
			"attack": 6,
			"defense": 7,
			"vision": 3,
			"levels": [ 3, 10 ],
			"spawnValue": 10,
			"experience": 9,
			"loot": []
		},
		{
			"name": "Skeleton",
			"symbol": "S",
			"color": 31,
			"hitPoints": 10,
			"attack": 7,
			"defense": 5,
			"vision": 5,
			"levels": [ 5, 15 ],
			"spawnValue": 10,
			"experience": 12,
			"loot": []
		},
		{
			"name": "Zombie",
			"symbol": "Z",
			"color": 120,
			"hitPoints": 12,
			"attack": 8,
			"defense": 6,
			"vision": 5,
			"levels": [ 5, 15 ],
			"spawnValue": 15,
			"experience": 15,
			"loot": []
		},
		{
			"name": "Orc",
			"symbol": "O",
			"color": 48,
			"hitPoints": 15,
			"attack": 10,
			"defense": 8,
			"vision": 5,
			"levels": [ 7, 15 ],
			"spawnValue": 15,
			"experience": 18,
			"loot": []
		},
		{
			"name": "Bear",
			"symbol": "B",
			"color": 15,
			"hitPoints": 20,
			"attack": 10,
			"defense": 15,
			"vision": 11,
			"levels": [ 7, 15 ],
			"spawnValue": 5,
			"experience": 25,
			"loot": []
		},
		{
			"name": "Troll",
			"symbol": "T",
			"color": 120,
			"hitPoints": 25,
			"attack": 15,
			"defense": 12,
			"vision": 5,
			"levels": [ 8, 15 ],
			"spawnValue": 10,
			"experience": 30,
			"loot": []
		}, 
		{
			"name": "Ogre",
			"symbol": "O",
			"color": 120,
			"hitPoints": 30,
			"attack": 15,
			"defense": 10,
			"vision": 5,
			"levels": [ 9, 15 ],
			"spawnValue": 5,
			"experience": 45,
			"loot": []
		},
		{
			"name": "Vampire",
			"symbol": "V",
			"color": 120,
			"hitPoints": 25,
			"attack": 15,
			"defense": 12,
			"vision": 5,
			"levels": [ 10, 99 ],
			"spawnValue": 10,
			"experience": 50,
			"loot": []
		},
		{
			"name": "Minotaur",
			"symbol": "M",
			"color": 120,
			"hitPoints": 30,
			"attack": 15,
			"defense": 20,
			"vision": 5,
			"levels": [ 10, 99 ],
			"spawnValue": 10,
			"experience": 60,
			"loot": []
		},
		{
			"name": "Fire Elemental",
			"symbol": "F",
			"color": 120,
			"hitPoints": 40,
			"attack": 30,
			"defense": 5,
			"vision": 5,
			"levels": [ 19, 99 ],
			"spawnValue": 10,
			"experience": 75,
			"loot": []
		},
		{
			"name": "Dragon",
			"symbol": "D",
			"color": 120,
			"hitPoints": 60,
			"attack": 35,
			"defense": 40,
			"vision": 10,
			"levels": [ 19, 99 ],
			"spawnValue": 5,
			"experience": 150,
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
