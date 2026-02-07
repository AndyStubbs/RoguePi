"use strict";
// File: items.js

const ITEM_GOLD = "gold coin";
const ITEM_TORCH = "torch";

const ITEMS = {

	// Misc
	"gold": {
		"name": ITEM_GOLD,
		"symbol": "*",
		"cost": 1,
		"dropValue": 100,
		"levels": [ 0, 99 ],
		"color": 14
	},
	"torch": {
		"name": ITEM_TORCH,
		"symbol": "!",
		"cost": 3,
		"dropValue": 70,
		"levels": [ 0, 99 ],
		"color": 40,
		"stackable": true,
		"plural": "torches",
		"lightRadius": 3,
		"lightFade": 0.005
	},
	"ration": {
		"name": "ration",
		"symbol": "%",
		"cost": 5,
		"dropValue": 35,
		"levels": [ 0, 99 ],
		"color": 42,
		"stackable": true,
		"plural": "rations",
		"hunger": 50
	},
	"water": {
		"name": "water",
		"symbol": "~",
		"cost": 2,
		"dropValue": 60,
		"levels": [ 0, 99 ],
		"color": 9,
		"stackable": true,
		"plural": "waters",
		"article": "a bottle of",
		"thirst": 65
	},
	
	// Potions
	"healing_potion": {
		"name": "health potion",
		"shortName": "heal",
		"symbol": String.fromCharCode( 6 ),
		"healing_power": 20,
		"cost": 50,
		"dropValue": 20,
		"levels": [ 0, 99 ],
		"stackable": true,
		"plural": "potions of healing",
		"color": 45,
		"article": "a"
	},
	
	// Gems
	"ruby": {
		"name": "ruby",
		"symbol": String.fromCharCode( 3 ),
		"cost": 250,
		"dropValue": 5,
		"levels": [ 0, 99 ],
		"stackable": true,
		"color": 4,
		"article": "a"
	},
	"sapphire": {
		"name": "sapphire",
		"symbol": String.fromCharCode( 15 ),
		"cost": 175,
		"dropValue": 5,
		"levels": [ 0, 99 ],
		"stackable": true,
		"color": 13,
		"article": "a"
	},
	"emerald": {
		"name": "emerald",
		"symbol": String.fromCharCode( 6 ),
		"cost": 125,
		"dropValue": 5,
		"levels": [ 0, 99 ],
		"stackable": true,
		"color": 11,
		"article": "a"
	},
	"diamond": {
		"name": "diamond",
		"symbol": String.fromCharCode( 4 ),
		"cost": 300,
		"dropValue": 3,
		"levels": [ 0, 99 ],
		"stackable": true,
		"color": 10,
		"article": "a"
	},

	// Weapons
	"wooden_club": {
		"name": "wooden club",
		"symbol": String.fromCharCode( 28 ),
		"weapon": "melee",
		"cost": 10,
		"attack": 2,
		"dropValue": 10,
		"levels": [ 0, 5 ],
		"color": 42
	},
	"bronze_dagger": {
		"name": "bronze dagger",
		"symbol": String.fromCharCode( 170 ),
		"weapon": "melee",
		"cost": 20,
		"attack": 3,
		"dropValue": 20,
		"levels": [ 0, 5 ],
		"color": 38,
		"article": "an"
	},
	"bronze_spear": {
		"name": "bronze spear",
		"symbol": String.fromCharCode( 24 ),
		"weapon": "melee",
		"cost": 30,
		"attack": 5,
		"dropValue": 20,
		"levels": [ 1, 6 ],
		"color": 38,
		"article": "an"
	},
	"bronze_mace": {
		"name": "bronze mace",
		"symbol": String.fromCharCode( 23 ),
		"weapon": "melee",
		"cost": 35,
		"attack": 6,
		"dropValue": 20,
		"levels": [ 2, 7 ],
		"color": 38,
		"article": "an"
	},
	"bronze_sword": {
		"name": "bronze sword",
		"symbol": "/",
		"weapon": "melee",
		"cost": 40,
		"attack": 7,
		"dropValue": 10,
		"levels": [ 3, 8 ],
		"color": 38,
		"article": "an"
	},
	"iron_spear": {
		"name": "iron spear",
		"symbol": String.fromCharCode( 24 ),
		"weapon": "melee",
		"cost": 50,
		"attack": 8,
		"dropValue": 10,
		"levels": [ 4, 10 ],
		"color": 7,
		"article": "an"
	},
	"iron_mace": {
		"name": "iron mace",
		"symbol": "@",
		"weapon": "melee",
		"cost": 55,
		"attack": 9,
		"dropValue": 10,
		"levels": [ 5, 11 ],
		"color": 7,
		"article": "an"
	},
	"iron_sword": {
		"name": "iron sword",
		"symbol": "/",
		"weapon": "melee",
		"cost": 75,
		"attack": 12,
		"dropValue": 5,
		"levels": [ 6, 12 ],
		"color": 7,
		"article": "an"
	},
	"iron_axe": {
		"name": "iron axe",
		"symbol": String.fromCharCode( 225 ),
		"weapon": "melee",
		"cost": 100,
		"attack": 15,
		"dropValue": 5,
		"levels": [ 7, 13 ],
		"color": 7,
		"article": "an"
	},
	"iron_hammer": {
		"name": "iron hammer",
		"symbol": String.fromCharCode( 226 ),
		"weapon": "melee",
		"cost": 110,
		"attack": 16,
		"dropValue": 5,
		"levels": [ 8, 14 ],
		"color": 7,
		"article": "an"
	},
	"warhammer": {
		"name": "warhammer",
		"symbol": String.fromCharCode( 226 ),
		"weapon": "melee",
		"cost": 120,
		"attack": 17,
		"dropValue": 5,
		"levels": [ 9, 15 ],
		"color": 89,
		"article": "an"
	},
	"waraxe": {
		"name": "waraxe",
		"symbol": String.fromCharCode( 225 ),
		"weapon": "melee",
		"cost": 130,
		"attack": 18,
		"dropValue": 5,
		"levels": [ 10, 16 ],
		"color": 89,
		"article": "an"
	},
	"greatsword": {
		"name": "greatsword",
		"symbol": "/",
		"weapon": "melee",
		"cost": 150,
		"attack": 20,
		"dropValue": 5,
		"levels": [ 11, 17 ],
		"color": 31,
		"article": "an"
	},
	"greataxe": {
		"name": "greataxe",
		"symbol": String.fromCharCode( 225 ),
		"weapon": "melee",
		"cost": 160,
		"attack": 21,
		"dropValue": 5,
		"levels": [ 12, 99 ],
		"color": 31,
		"article": "an"
	},
	"silver_sword": {
		"name": "silver sword",
		"symbol": "/",
		"weapon": "melee",
		"cost": 350,
		"attack": 25,
		"dropValue": 5,
		"levels": [ 13, 99 ],
		"color": 15,
		"article": "an"
	},
	"sword_of_matt": {
		"name": "sword of matt",
		"shortName": "mattsword",
		"symbol": "/",
		"weapon": "melee",
		"cost": 1000,
		"attack": 30,
		"dropValue": 1,
		"levels": [ 14, 99 ],
		"color": 31,
		"article": "the"
	},

	// Ranged Weapons
	"bow": {
		"name": "bow",
		"symbol": ")",
		"weapon": "range",
		"missileType": "arrow",
		"cost": 10,
		"attack": 2,
		"dropValue": 35,
		"levels": [ 0, 6 ],
		"color": 5,
		"distance": 5
	},
	"warbow": {
		"name": "warbow",
		"symbol": ")",
		"weapon": "range",
		"missileType": "arrow",
		"cost": 150,
		"attack": 5,
		"dropValue": 25,
		"levels": [ 5, 12 ],
		"color": 89,
		"distance": 7
	},
	"greatbow": {
		"name": "greatbow",
		"symbol": ")",
		"weapon": "range",
		"missileType": "arrow",
		"cost": 200,
		"attack": 7,
		"dropValue": 20,
		"levels": [ 11, 99 ],
		"color": 31,
		"distance": 9
	},
	"silver_bow": {
		"name": "silver bow",
		"symbol": ")",
		"weapon": "range",
		"missileType": "arrow",
		"cost": 350,
		"attack": 10,
		"dropValue": 20,
		"levels": [ 13, 99 ],
		"color": 15,
		"distance": 11
	},

	// Darts
	"dart": {
		"name": "dart",
		"symbol": "`",
		"weapon": "range",
		"cost": 5,
		"attack": 3,
		"dropValue": 35,
		"levels": [ 0, 10 ],
		"color": 5,
		"stackable": true,
		"article": "a",
		"distance": 4
	},
	"javelin": {
		"name": "javelin",
		"symbol": String.fromCharCode( 92 ),
		"weapon": "range",
		"cost": 50,
		"attack": 3,
		"dropValue": 25,
		"levels": [ 5, 15 ],
		"stackable": true,
		"color": 89,
		"distance": 4
	},
	"great_javelin": {
		"name": "great javelin",
		"shortName": "g javelin",
		"symbol": String.fromCharCode( 92 ),
		"weapon": "range",
		"cost": 100,
		"attack": 4,
		"dropValue": 20,
		"levels": [ 11, 99 ],
		"stackable": true,
		"color": 31,
		"distance": 6
	},
	"silver_javelin": {
		"name": "silver javelin",
		"symbol": String.fromCharCode( 92 ),
		"weapon": "range",
		"cost": 150,
		"attack": 5,
		"dropValue": 5,
		"levels": [ 13, 99 ],
		"stackable": true,
		"color": 15,
		"distance": 7
	},

	// Missiles
	"arrow": {
		"name": "arrow",
		"missileType": "arrow",
		"symbol": String.fromCharCode( 27 ),
		"weapon": "missile",
		"cost": 5,
		"attack": 1,
		"dropValue": 35,
		"levels": [ 0, 99 ],
		"color": 5,
		"stackable": true,
		"article": "an",
		"distance": 1
	},
	"war_arrow": {
		"name": "war arrow",
		"missileType": "arrow",
		"symbol": String.fromCharCode( 27 ),
		"weapon": "missile",
		"cost": 25,
		"attack": 2,
		"dropValue": 25,
		"levels": [ 9, 99 ],
		"stackable": true,
		"color": 89,
		"distance": 1
	},
	"silver_arrow": {
		"name": "silver arrow",
		"missileType": "arrow",
		"symbol": String.fromCharCode( 27 ),
		"weapon": "missile",
		"cost": 50,
		"attack": 3,
		"dropValue": 10,
		"levels": [ 13, 99 ],
		"stackable": true,
		"color": 31,
		"distance": 2
	},

	// Armor
	"cloth_armor": {
		"name": "cloth armor",
		"symbol": "&",
		"armor": "body",
		"cost": 2,
		"defense": 1,
		"dropValue": 10,
		"levels": [ 0, 5 ],
		"color": 13
	},
	"leather_armor": {
		"name": "leather armor",
		"symbol": "&",
		"armor": "body",
		"cost": 20,
		"defense": 5,
		"dropValue": 15,
		"levels": [ 0, 8 ],
		"color": 114
	},
	"bronze_armor": {
		"name": "bronze armor",
		"symbol": "&",
		"armor": "body",
		"cost": 40,
		"defense": 8,
		"dropValue": 15,
		"levels": [ 2, 10 ],
		"color": 42
	},
	"brigandine_armor": {
		"name": "brigandine armor",
		"symbol": "&",
		"armor": "body",
		"cost": 60,
		"defense": 10,
		"dropValue": 15,
		"levels": [ 4, 15 ],
		"color": 85
	},
	"iron_armor": {
		"name": "iron armor",
		"symbol": "&",
		"armor": "body",
		"cost": 100,
		"defense": 15,
		"dropValue": 15,
		"levels": [ 10, 99 ],
		"color": 7
	},
	"silver_armor": {
		"name": "silver armor",
		"symbol": "&",
		"armor": "body",
		"cost": 200,
		"defense": 22,
		"dropValue": 5,
		"levels": [ 13, 99 ],
		"color": 15
	},
	"pi_amulet": {
		"name": "Pi Amulet",
		"symbol": String.fromCharCode( 227 ),
		"levels": [ 20, 99 ],
		"dropValue": 0,
		"cost": 2500,
		"color": 14,
		"article": "the"
	}
};

const ALL_ITEMS = Object.values( ITEMS ).map( item => {
	if( !item.plural ) {
		item.plural = item.name + "s";
	}
	if( !item.article ) {
		item.article = "a";
	}
	return item;
} );

window.g_items = ( function () {
	return {
		"getItemDrop": getItemDrop
	};

	function getItemDrop( level, allowGold ) {
		const availableItems = [];
		let maxItemDropValue = 0;

		for( const item of ALL_ITEMS ) {
			if( level >= item.levels[ 0 ] && level <= item.levels[ 1 ] ) {
				if( !allowGold && item.name === ITEM_GOLD ) {
					continue;
				}
				availableItems.push( item );
				maxItemDropValue += item.dropValue;
			}
		}

		if( maxItemDropValue === 0 ) {
			return null;
		}

		let randomItemDropValue = Math.floor(
			Math.random() * maxItemDropValue
		);
		let currentDropValue = 0;

		for( const item of availableItems ) {
			if( randomItemDropValue < currentDropValue + item.dropValue ) {
				const dropItem = structuredClone( item );
				if( dropItem.name === ITEM_GOLD ) {
					dropItem.quantity = Math.ceil(
						Math.random() * 10
					) * level;
				} else {
					dropItem.quantity = 1;
				}
				return dropItem;
			}
			currentDropValue += item.dropValue;
		}

		return null;
	}

} )();
