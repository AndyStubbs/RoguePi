/*
               /<---><---><---><---><---><---><--->\          
             /  |   |    |    |    |    |    |    |  \        
            |   <---><---><---><---><---><---><--->   |       
           <--->                ______             <--->      
          |   |   +-----+      / ==== \             |   |     
         <--->    |     |     |  o  o  |             <--->    
        |   |     +-----+   /-\  /--\  /-\            |   |   
        <--->     |     |  {  }\-\__/-/{  }           <--->   
       |   |      +-----+  |  |        |  |           |   |   
       <--->      ---------\  \--------/  /----       <--->   
       |   |     / o  o     \  ^-[||]-^  /     \      |   |   
       <--->    /    o o     \---[||]---/       \     <--->   
       |   |   ----------------------------------     |   |   
       <--->   |                                |<=======>    
       |   |   ---------------------------------|         |   
       <--->    |   |   |   |   |   |   |   |   |--_____--|   
       |   |    |   |   |   |   |   |   |   |   |         |   
       <--->    |   |   |   |   |   |   |   |   |--_____--|   
       |   |    |   |   |   |   |   |   |   |   |         |   
       __________________________________________--_____--____


               /<---><---><---><---><---><---><--->\          
             /  |   |    |    |    |    |    |    |  \        
            |   <---><---><---><---><---><---><--->   |       
           <--->                                   <--->      
          |   |                                     |   |     
         <--->                                       <--->    
        |   |                                         |   |   
        <--->                                         <--->   
       |   |                                          |   |   
       <--->                                          <--->   
       |   |                                          |   |   
       <--->                                          <--->   
       |   |                                          |   |   
       <--->                                                  
       |   |                                                  
       <--->                                                  
       |   |                                                  
       <--->                                                  
       |   |                                                  
       _______________________________________________________


	                                                  
                                                              
                                                              
                                                              
                  +-----+                                     
                  |     |                                     
                  +-----+                                     
                  |     |                                     
                  +-----+                                     
                  ---------    --------    ----               
                 /                             \              
                /                               \             
               ----------------------------------             
               |                                |<=======>    
               ---------------------------------|         |   
                |   |   |   |   |   |   |   |   |--_____--|   
                |   |   |   |   |   |   |   |   |         |   
                |   |   |   |   |   |   |   |   |--_____--|   
                |   |   |   |   |   |   |   |   |         |   
                                                 --_____--    

                                                              
                                                              
                                                              
                                ______                        
                               / ==== \                       
                              |  o  o  |                      
                            /-\  /--\  /-\                    
                           {  }\-\__/-/{  }                   
                           |  |        |  |                   
                           \  \        /  /                   
                            \  ^-[||]-^  /                    
                             \---[||]---/                     
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              

                                                              
                                                              
                                                              
                                                              
                                                              
                                 o  o                         
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              

                                                              
                                                              
                                                              
                                ______                        
                               /      \                       
                              |        |                      
                            /-\        /-\                    
                           {  }\-    -/{  }                   
                           |  |        |  |                   
                           \  \        /  /                   
                            \  ^-    -^  /                    
                             \---    ---/                     
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              

                                                              
                                                              
                                                              
                                                              
                                 ====                         
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              

                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                 /--\                         
                                 \__/                         
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              

                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                   o  o                                       
                     o o                                      
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              

*/

const g_shop = ( function () {

	const SHOP = `
               /<---><---><---><---><---><---><--->\\          
             /  |   |    |    |    |    |    |    |  \\        
            |   <---><---><---><---><---><---><--->   |       
           <--->                ______             <--->      
          |   |   +-----+      / ==== \\             |   |     
         <--->    |     |     |  o  o  |             <--->    
        |   |     +-----+   /-\\  /--\\  /-\\            |   |   
        <--->     |     |  {  }\\-\\__/-/{  }           <--->   
       |   |      +-----+  |  |        |  |           |   |   
       <--->      ---------\\  \\--------/  /----       <--->   
       |   |     / o  o     \\  ^-[||]-^  /     \\      |   |   
       <--->    /    o o     \\---[||]---/       \\     <--->   
       |   |   ----------------------------------     |   |   
       <--->   |                                |<=======>    
       |   |   ---------------------------------|         |   
       <--->    |   |   |   |   |   |   |   |   |--_____--|   
       |   |    |   |   |   |   |   |   |   |   |         |   
       <--->    |   |   |   |   |   |   |   |   |--_____--|   
       |   |    |   |   |   |   |   |   |   |   |         |   
       __________________________________________--_____--____`.split( "\n" );

	const SHOP_LAYER_0 = `
               /<---><---><---><---><---><---><--->\\          
             /  |   |    |    |    |    |    |    |  \\        
            |   <---><---><---><---><---><---><--->   |       
           <--->                                   <--->      
          |   |                                     |   |     
         <--->                                       <--->    
        |   |                                         |   |   
        <--->                                         <--->   
       |   |                                          |   |   
       <--->                                          <--->   
       |   |                                          |   |   
       <--->                                          <--->   
       |   |                                          |   |   
       <--->                                                  
       |   |                                                  
       <--->                                                  
       |   |                                                  
       <--->                                                  
       |   |                                                  
       _______________________________________________________`.split( "\n" );

	const SHOP_LAYER_1 = `
                                                  
                                                              
                                                              
                                                              
                  +-----+                                     
                  |     |                                     
                  +-----+                                     
                  |     |                                     
                  +-----+                                     
                  ---------    --------    ----               
                 /                             \\              
                /                               \\             
               ----------------------------------             
               |                                |<=======>    
               ---------------------------------|         |   
                |   |   |   |   |   |   |   |   |--_____--|   
                |   |   |   |   |   |   |   |   |         |   
                |   |   |   |   |   |   |   |   |--_____--|   
                |   |   |   |   |   |   |   |   |         |   
                                                 --_____--    `.split( "\n" );


	const SHOP_LAYER_2 = `
                                                              
                                                              
                                                              
                                ______                        
                               /      \\                       
                              |        |                      
                            /-\\        /-\\                    
                           {  }\\-    -/{  }                   
                           |  |        |  |                   
                           \\  \\        /  /                   
                            \\  ^-    -^  /                    
                             \\---    ---/                     
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              `.split( "\n" );

const SHOP_LAYER_3 = `
                                                              
                                                              
                                                              
                                                              
                                                              
                                 o  o                         
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              `.split( "\n" );

const SHOP_LAYER_4 = `
                                                              
                                                              
                                                              
                                                              
                                 ====                         
                                                              
                                                              
                                                              
                                                              
                                                              
                                 [||]                         
                                 [||]                         
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              `.split( "\n" );

const SHOP_LAYER_5 = `
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                 /--\\                         
                                 \\__/                         
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              `.split( "\n" );

const SHOP_LAYER_6 = `
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                   o  o                                       
                     o o                                      
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              
                                                              `.split( "\n" );

	return {
		runShop
	};
	
	function renderShopArt() {
		$.setColor( 8 );
		renderShopLayer( SHOP_LAYER_0 );
		$.setColor( 186 );
		renderShopLayer( SHOP_LAYER_1 );
		$.setColor( 137 );
		renderShopLayer( SHOP_LAYER_2 );
		$.setColor( 79 );
		renderShopLayer( SHOP_LAYER_3 );
		$.setColor( 6 );
		renderShopLayer( SHOP_LAYER_4 );
		$.setColor( 27 );
		renderShopLayer( SHOP_LAYER_5 );
		$.setColor( 140 );
		renderShopLayer( SHOP_LAYER_6 );
	}

	function renderShopLayer( layer ) {
		for( let y = 0; y < layer.length; y += 1 ) {
			$.setPos( OFFSET_X + 1, y );
			$.print( layer[ y ], true );
		}
	}

	function runShop() {
		const itemCount = Math.floor( Math.random() * 2 ) + 3;
		const shopData = {
			"items": [],
			"saleItems": [],
			"action": "buy"
		};

		// Generate items in the shop for purchase
		for( let i = 0; i < itemCount; i += 1 ) {
			let item = null;
			while( item === null ) {
				item = g_items.getItemDrop( g_player.depth + 1, false );
				if( shopData.items.some( i => i.name === item.name ) ) {
					item = null;
				}
			}

			// Randomly adjust cost
			const costAdjustment = ( Math.random() * 0.3 ) - 0.15;
			item.cost = Math.floor( item.cost + ( item.cost * costAdjustment ) );
			if( item.stackable || item.name === ITEM_TORCH ) {
				item.quantity += Math.floor( Math.random() * 5 );
			}
			shopData.items.push( item );
		}

		shopData.items.sort( ( a, b ) => {
			return a.cost - b.cost;
		} );

		generateShopSaleItems( shopData )
		renderShop( shopData );
	}

	function generateShopSaleItems( shopData ) {

		// Generate prices of items to sell
		for( const item of g_player.items ) {
			const saleItem = structuredClone( item );
			const costAdjustment = Math.random() * 0.25 + 0.25;
			saleItem.cost = saleItem.cost - Math.floor( saleItem.cost * costAdjustment );
			saleItem.playerItem = item;
			shopData.saleItems.push( saleItem );
		}
		shopData.saleItems.sort( ( a, b ) => {
			return a.cost - b.cost;
		} );

		// Shop will buy a max of 5 items
		let overage = shopData.saleItems.length - 5;
		while( overage > 0 ) {
			
			// Randomly remove an item
			shopData.saleItems.splice( Math.floor( Math.random() * shopData.saleItems.length ), 1 );
			overage -= 1;
		}
	}

	function renderShop( shopData ) {
		$.cls();
		renderStats();

		$.setColor( 7 );
		renderShopArt();

		$.setColor( 7 );
		$.setPos( 41, 22 );
		$.print( "You have entered a shop." );

		shopBuyItems( shopData );
	}

	async function shopBuyItems( shopData ) {
		$.setPos( 25, 24 );

		let items;
		if( shopData.action === "buy" ) {
			$.print( "Buy an item:" );
			items = shopData.items;
		} else {
			$.print( "Sell an item:" );
			items = shopData.saleItems;
		}

		const maxItemLineSize = items.reduce(
			( acc, item, i ) => Math.max(
				acc, `${i}: ${g_util.properName(item.name)} [${item.quantity}] - `.length
			), 0
		);

		for( let i = 0; i < items.length; i += 1 ) {
			let item = items[ i ];
			$.setColor( 7 );
			$.setPos( 25, 26 + i );
			if( item.quantity === 0 ) {
				$.setColor( 8 );
			}
			$.print( `${i + 1}: ${g_util.properName(item.name)} [${item.quantity}] - `, true );
			$.setColor( 140 );
			$.setPos( maxItemLineSize + 25, $.getPos().row );
			$.print( `${item.cost} GLD`.padStart( 7 ), true );
		}

		$.setColor( 7 );
		$.setPos( 25, 27 + items.length );
		$.print( "----------------------------------" );
		$.print();
		$.setPos( 25, $.getPos().row );
		if( shopData.action === "buy" ) {
			if( shopData.saleItems.length === 0 ) {
				$.setColor( 8 );
			}
			$.print( items.length + 1 + ": Sell items" );
			$.setColor( 7 );
		} else {
			$.print( items.length + 1 + ": Buy items" );
		}
		
		$.print();
		$.setPos( 25, $.getPos().row );
		$.print( "----------------------------------" );
		$.print();
		$.setPos( 25, $.getPos().row );
		$.print( "0: Exit shop" );
		$.setPos( 25, 40 );

		const choice = await $.input(
			`Choose Option (0-${items.length + 1}): `, null, null, true, true, false, 1
		);
		console.log( choice );
		if( choice > items.length + 1 ) {
			$.setColor( 4 );
			$.print( `Invalid choice, please input a number between 0 and ${items.length + 2}.` );
			setTimeout( () => renderShop( shopData ), 1250 );
			return;
		}

		if( choice > 0 && choice < items.length + 1 ) {
			let item = items[ choice - 1 ];
			if( shopData.action === "buy" ) {
				if( item.quantity === 0 ) {
					$.setColor( 4 );
					$.print( `The shop is out of ${item.plural}.` );
				} else if( g_player.gold < item.cost ) {
					$.setColor( 4 );
					$.print( `You cannot afford ${item.article} ${item.name}.` );
				} else {
					const playerItem = structuredClone( item );
					playerItem.quantity = 1;
					let isAdded = pickupItem( playerItem );
					if( isAdded ) {
						$.print( `You have purchased ${item.article} ${item.name}.` );
						item.quantity -= 1;
						g_player.gold -= item.cost;
					} else {
						$.setColor( 4 );
						$.print( `You have too many items and can't make this purchase.` );
					}
				}
			} else {
				g_player.gold += item.cost;
				item.quantity -= 1;
				item.playerItem.quantity -= 1;

				$.print( `You have sold ${item.article} ${item.name} for `, true );
				$.setColor( 140 );
				$.print( `${item.cost} gold` );

				// Remove the item from player inventory if quantity is 0
				if( item.playerItem.quantity === 0 ) {
					const itemIndex = g_player.items.findIndex(
						item2 => item2 === item.playerItem
					);
					g_player.items.splice( itemIndex, 1 );
				}

				// Remove the item from sale options
				if( item.quantity === 0 ) {
					items.splice( choice - 1, 1 );
				}
			}
			
			setTimeout( () => renderShop( shopData ), 1250 );
			return;
		}

		if( choice === items.length + 1 ) {
			if( shopData.action === "buy" ) {
				if( shopData.saleItems.length === 0 ) {
					$.setColor( 4 );
					$.print( "You have no items the merchant is willing to buy." );
				} else {
					$.print( "You present your items to the merchant for sale." );
					shopData.action = "sell";
				}
			} else {
				$.print( "You review the merchants items for purchase." );
				shopData.action = "buy";
			}
			
			setTimeout( () => renderShop( shopData ), 1250 );
		}
		if( choice === 0 ) {
			startLevel();
		}
	}

} )();
