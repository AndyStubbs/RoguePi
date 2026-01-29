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
		"dropValue": 80,
		"levels": [ 0, 99 ],
		"color": 14
	},
	"torch": {
		"name": ITEM_TORCH,
		"symbol": "!",
		"cost": 3,
		"dropValue": 30,
		"levels": [ 0, 99 ],
		"color": 40,
		"stackable": true,
		"plural": "torches",
		"lightRadius": 3,
		"lightFade": 0.01
	},
	"ration": {
		"name": "ration",
		"symbol": "%",
		"cost": 5,
		"dropValue": 20,
		"levels": [ 0, 99 ],
		"color": 2,
		"stackable": true,
		"plural": "rations",
		"hunger": 50
	},
	"water": {
		"name": "water",
		"symbol": "~",
		"cost": 2,
		"dropValue": 20,
		"levels": [ 0, 99 ],
		"color": 9,
		"stackable": true,
		"plural": "waters",
		"article": "a bottle of",
		"thirst": 50
	},

	// Weapons
	"wooden_club": {
		"name": "wooden club",
		"symbol": "/",
		"weapon": "melee",
		"cost": 10,
		"attack": 20,
		"dropValue": 50,
		"levels": [ 0, 99 ],
		"color": 42
	},
	"iron_mace": {
		"name": "iron mace",
		"symbol": "@",
		"weapon": "melee",
		"cost": 30,
		"attack": 3,
		"dropValue": 10,
		"levels": [ 0, 99 ],
		"color": 7,
		"article": "an"
	},
	"iron_sword": {
		"name": "iron sword",
		"symbol": "|",
		"weapon": "melee",
		"cost": 80,
		"attack": 4,
		"dropValue": 5,
		"levels": [ 0, 99 ],
		"color": 7,
		"article": "an"
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
		"levels": [ 0, 99 ],
		"color": 5,
		"distance": 5
	},
	"dart": {
		"name": "dart",
		"symbol": "`",
		"weapon": "range",
		"cost": 5,
		"attack": 3,
		"dropValue": 35,
		"levels": [ 0, 99 ],
		"color": 5,
		"stackable": true,
		"article": "a",
		"distance": 4
	},

	// Missiles
	"arrow": {
		"name": "arrow",
		"symbol": "-",
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

	// Armor
	"cloth_armor": {
		"name": "cloth armor",
		"symbol": "&",
		"armor": "body",
		"cost": 10,
		"defense": 15,
		"dropValue": 50,
		"levels": [ 0, 99 ],
		"color": 42
	},
	"leather_armor": {
		"name": "leather armor",
		"symbol": "&",
		"armor": "body",
		"cost": 20,
		"defense": 2,
		"dropValue": 15,
		"levels": [ 0, 99 ],
		"color": 42
	},
	"iron_armor": {
		"name": "iron armor",
		"symbol": "&",
		"armor": "body",
		"cost": 100,
		"defense": 5,
		"dropValue": 10,
		"levels": [ 0, 99 ],
		"color": 42,
		"article": "an"
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
		"getItemDrop": getItemDrop,
		"getAllItems": getAllItems,
		"getItemByKey": getItemByKey
	};

	function normalizeItems( items ) {

		const allItems = Object.values( items );

		for( const item of allItems ) {
			if( !item.plural ) {
				item.plural = item.name + "s";
			}
			if( !item.article ) {
				item.article = "a";
			}
		}

		return allItems;
	}

	function getAllItems() {

		return ALL_ITEMS;
	}

	function getItemByKey( key ) {

		const item = ITEMS[ key ];

		if( !item ) {
			return null;
		}

		return structuredClone( item );
	}

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
