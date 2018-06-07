var current = 0;   // current dialogue
var fireflies = 0;  // number of fireflies the player has
var playerFF = 0; // for console.log
var faceRight = true;
var full = false; 
var tutSpawned = false; // tutorial spawned firefly
var timesVisited = 0;
var last = 'Shop'; 
var showMenu = true;

var tutorialState = {
	create: function() {
		var background = game.add.sprite(0,-165, 'fAssets', 'breakfastBar');

		if(litStreetLamps == totalLamps) {
			var background = game.add.sprite(0,-165, 'endGame', 'breakfastBarEnd');

			message = game.add.group(); 
			message.enableBody = true; 

			this.envelope = message.create(game.world.width-100, game.world.centerY, 'endGame', 'envelope');
			
			interact = game.add.text(this.envelope.x, player.y-100, '< Hit Space to read the envelope >',{font: '25px Advent Pro', fill: '#E5D6CE'});
	    	game.add.tween(interact).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0.3}, 1500, Phaser.Easing.Linear.None, true);
		
		}
		// sound effects
		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');

		game.world.setBounds(0,0,1200,700);

		// Add Firefly object to screen
		object = game.add.group(); 
		object.enableBody = true; 

	    // Boundary Group
		objects = game.add.group(); 
		objects.enableBody = true; 

		// Set up the bottom GUI 
		this.bottomGUI = objects.create(0, game.world.height-64, 'bottom');
		this.bottomGUI.body.immovable = true; 
		this.bottomGUI.aplha = 0;
		game.add.tween(this.bottomGUI).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, false);

		// Set up bounds
		this.bound = objects.create(0, game.world.height-165, 'bound');
		this.bound.body.immovable = true; 

		this.boundTop = objects.create(0, game.world.centerY-140, 'bound');
		this.boundTop.body.immovable = true; 

		this.leftBound = objects.create(-100, game.world.centerY+100, 'spriteBounds'); 
		this.leftBound.body.immovable = true;

		// Inventory
		statusBar();

		portal = game.add.group();
		portal.enableBody = true;

		this.portalToTown = portal.create(100, game.world.centerY-100, 'fAssets', 'portal');
    	game.add.tween(this.portalToTown).to( { alpha:0.3 }, 5000, Phaser.Easing.Linear.None, true, { alpha: 1}, 5000, Phaser.Easing.Linear.None, true);
		this.portalToTown.visible = false;

		// Pause Button
		var pauseButton =  game.add.button(game.world.width-32, game.world.height-32, 'pause', pauseGame, this);
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		// avoid reappearing when revising this state
		if(timesVisited == 0) {
			// will be deleted after tutorial
			this.rightBound = objects.create(game.width, game.world.centerY+100, 'spriteBounds'); 
			this.rightBound.body.immovable = true;

			this.dialogue = game.add.text(50, game.world.height-155, "Welcome! <Hit the space bar for more text>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			this.dialogue.alpha = 0;
	    	game.add.tween(this.dialogue).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);

			// Add player 
			player = new Player(game, 100, game.world.centerY+80, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
			game.add.existing(player);

		//	bot = new Status(game, game.world.centerX-200, game.world.centerY+80, 'bottom', 150, game.world.height-175);
			game.add.existing(player);
    	} else if(timesVisited != 0 && win == false) {
			// Add player 

    		this.portalToTown.visible = true;
			player = new Player(game, game.world.width-100, game.world.centerY+80, 'fAssets', 'playerSprite0001', 150, game.world.height-175); //bugged 
			game.add.existing(player);

			this.shopDialogue = game.add.text(50, game.world.height-155, "Welcome back! To buy supplies from us, hit the space bar!", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			this.shopDialogue.alpha = 1;
	    	game.add.tween(this.shopDialogue).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
    	
    	} else {
    		player = new Player(game, 100, game.world.centerY+80, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
			game.add.existing(player);
    	}

    	timesVisited++;
	},
	light: function(x,y) {
		var light = game.add.sprite(x,y, 'light');
	},
	dialogueOnClick: function() {
		// Array of dialogue. **10 fireflies will be needed later**
		var speech = ['Welcome! You must be confused after what happened. Let me help refresh\nyour memory. You see..', 'The town has lost its source of power and is currently dark.', //2
						'To make the town bright again, we need to fill up all the street lamps with a\npower source.','That power source would be the fireflies scattered all around town.', //2
						'We have a big request to make of you. We hope that you can go around\nthe town and light up all the street lamps.', 'The main power source of the town is connected to these street lamps.', //3
						'Once all the street lamps are lit, power will be restored to town.',  //1
						'Here is a lantern that can hold up to 5 fireflies.', 'Here is a lantern that can hold up to 5 fireflies.\nYou just need to walk up to them using the arrow keys to collect it.', //2
						'Look! One appears to have flown inside the shop!\nTry collecting it!', 'Nice! You caught your first firefly! If you come across any streetlamps\nin town,press F to fill it up.', //2
						'5 fireflies are needed to completely fill a street lamp up!', 'If you run into an enemy, press A to attack it using fireflies!\nYou can return here by pressing W in front of our door in town.', 'Also, for every street lamp filled, your field of vision will expand as the town\ngets brighter.',
						'We just opened up a portal for you to enter town.\nFeel free to drop by our shop for more supplies! Good luck!']; 

		if(current == 0) {
			next = game.add.text(game.world.width-50, game.world.height-100, '▼', {font: '30px Advent Pro', fill: '#FFEDE5'}); 
			next.alpha = 0;
	    	game.add.tween(next).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
		} 
		else if(current+1 == speech.length) {
			next.alpha = 0;
			next.kill();
		}

		if(current == 7) {
			collectFF.play();
		}
		// current = 10 starts the collection tutorial
		if(current < speech.length) 
	   		this.dialogue.text = speech[current];
		 else {
			this.dialogue.text = 'Go to the portal and press W!';
		}
		
		current++;
	    if(current == speech.length) {
			portal = game.add.group();
			portal.enableBody = true;
			this.portalToTown = portal.create(100, game.world.centerY-100, 'fAssets', 'portal');
			this.portalToTown.alpha = 1;
			game.add.tween(this.portalToTown).to( { alpha:0.3 }, 5000, Phaser.Easing.Linear.None, true, { alpha: 1}, 5000, Phaser.Easing.Linear.None, true);
	    	//this.rightBound.kill();
	    }
	},

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'fAssets', 'singleFirefly');
			game.add.tween(this.firefly).to( { x: game.world.centerX+400 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerX+300, 1500, Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: game.world.centerY+95 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerY-75, 1500, Phaser.Easing.Linear.None, true);
		}
	},
	over: function(button) {
    	button.frame = 1;
	},

	out: function(button) {
    	button.frame = 0;
	},	
	town: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('play'); 
	},
	collectFirefly: function(player, firefly) {
		collectFF.play();
		firefly.kill();

		fireflies++;	// add to lantern
		playerFF = fireflies; 
		if(fireflies == 5) {
			full = true;
			console.log('Your lantern is now full. Try storing fireflies in street lamps!'); 
		}
		//console.log(playerFF);
		statusBar();	// update inventory
	},
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

	    // Player can only hold up to 5 
	    if(fireflies < 5 && full == false) {
  			game.physics.arcade.overlap(player, object, this.collectFirefly, null, this);  // Check player collision with fireflies
  		} 

  		if(playerFF == 5) {
  			fillLamp.play();
  			playerFF--;
  		}
	    game.physics.arcade.collide(player, this.bottomGUI);
	    game.physics.arcade.collide(player, objects);
	    game.physics.arcade.overlap(player, this.portalToTown, this.town);
	    //game.physics.arcade.collide(this.player, this.bound);
	    //game.physics.arcade.collide(this.player, this.boundTop);

	    // Reset the players velocity (movement)
	    //player.body.velocity.x = 0;
	   // player.body.velocity.y = 0;

	    if(timesVisited > 1 && game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
	    	this.shopDialogue.text = 'Use the number keys (1-3) to buy your desired item.\nHit the space bar again to close the shop menu!'; 
	    	this.shopMenu = game.add.sprite(game.world.centerX, game.world.centerY-75, 'shopMenu');
	    	this.shopMenu.anchor.set(0.5);
	    	showMenu = true; 
	    	this.shopMenu.visible = true;
	    }

	    // insert message here
	    if(win == true) {
	    	if(game.physics.arcade.overlap(player, message) && game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
				shopMessage = game.add.text(player.x+50, player.y-100, 'To Be Implemented Soon!',{font: '25px Advent Pro', fill: '#E5D6CE'});
				game.add.tween(shopMessage).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
				game.add.tween(shopMessage).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
	    		console.log('To Be Implemented Soon!');
	    	}
	    }

	    // Buying items
	    if(showMenu == true && game.input.keyboard.justPressed(Phaser.Keyboard.ONE) && fireflies >= 2) {
	    	purificationMilk++;
	    	//update text & subtract fireflies
			if(fireflies == lanternSize) {
				full = false; 
			}
	    	//shootFF.play(); 
	    	fireflies=fireflies-2; 
			statusBar();

	    	console.log('You bought purification milk. Close the menu and press 1 to use it.');
	    } else if(showMenu==true && game.input.keyboard.justPressed(Phaser.Keyboard.ONE) && fireflies < 2) {
	    	console.log('You do not have enough fireflies.');
	    }

	    if(showMenu == true && game.input.keyboard.justPressed(Phaser.Keyboard.TWO) && fireflies >=3) {
	    	healthJuice++;
	    	//update text & subtract fireflies
			if(fireflies == lanternSize) {
				full = false; 
			}
	    	//shootFF.play(); 
	    	fireflies=fireflies-3; 
			statusBar();

	    	console.log('You bought health juice.');
	    } else if(showMenu==true && game.input.keyboard.justPressed(Phaser.Keyboard.TWO) && fireflies < 3) {
	    	console.log('You do not have enough fireflies.');
	    }


	    if(showMenu == true && game.input.keyboard.justPressed(Phaser.Keyboard.THREE) && fireflies >= 5) {
	    	proteinShake++;
	    	//update text & subtract fireflies
			if(fireflies == lanternSize) {
				full = false; 
			}
	    	//shootFF.play(); 
	    	fireflies=fireflies-5; 
			statusBar();


	    	console.log('You bought a storage upgrade');
	    } else if(showMenu==true && game.input.keyboard.justPressed(Phaser.Keyboard.THREE) && fireflies < 5) {
	    	console.log('You do not have enough fireflies.');
	    }


	    // close the shop menu
	    if(showMenu == true && game.input.keyboard.justPressed(Phaser.Keyboard.X)) {
	    	showMenu = false; 
	    	//this.shopMenu = game.add.sprite(game.world.centerX, game.world.centerY-75, 'shopMenu');
	    	//this.shopMenu.anchor.set(0.5);
	    	this.shopMenu.visible = false;
	    }

	    // Move to next state when player exits shop (move all the way to the right)
	    if(player.x > game.world.width + player.width) {
	    	game.state.start('play', true, false);
	    }

	    if(current == 9 && tutSpawned == false) {
	    	tutSpawned = true; 
			this.firefly = object.create(1264, game.world.centerY, 'fAssets', 'singleFirefly');
			game.add.tween(this.firefly).to( { x: game.world.centerX+300 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: game.world.centerY+75 }, 5500, Phaser.Easing.Linear.None, true, game.world.centerY+65, 5500, Phaser.Easing.Linear.None, true);
	    }

	    if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && timesVisited == 1) {
	    	// tutorial if
	    	if(current == 10 && fireflies < 1) 
	    		this.dialogue.text = 'Walk up to the firefly to collect it!';
	    	else
	    		this.dialogueOnClick();
	    }

	    // go to next dialogue once player has collected a firefly
	    if(current == 10 && fireflies >= 1) 
	        this.dialogueOnClick();

	},
	// render: function() {
	// 	game.debug.spriteInfo(this.player, 32, 32);
	// }
}