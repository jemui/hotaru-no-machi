var current = 0;   // current dialogue
var fireflies = 0;  // number of fireflies the player has
var playerFF = 0; // for console.log
var faceRight = true;
var full = false; 
var tutSpawned = false; // tutorial spawned firefly
var timesVisited = 0;
var last = 'Shop'; 

var tutorialState = {
	create: function() {
		var background = game.add.sprite(0,-165, 'fAssets', 'breakfastBar');

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



		// Bottom GUI
		this.bottomGUI.scale.setTo(2,1);
		var heart = game.add.sprite(200, game.world.height-55, 'assets', 'heartIcon');
		var playerLives = game.add.text(218, game.world.height-45, (lives),{font: '25px Advent Pro', fill: '#E5D6CE'});
		this.firefliesCaught = game.add.text(20, game.world.height-45, (fireflies+' Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});

		// Pause Button
		var pauseButton =  game.add.button(game.world.width-32, game.world.height-32, 'pause', pauseGame, this);
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		// Light/Temporary exit indicator
		this.light(game.world.width-100, game.world.height-350);
		this.light(game.world.width-100, game.world.height-350);
		this.light.aplha = 0;
		game.add.tween(this.light).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);

		// avoid reappearing when revising this state
		if(timesVisited == 0) {
			// will be deleted after tutorial
			this.rightBound = objects.create(game.width, game.world.centerY+100, 'spriteBounds'); 
			this.rightBound.body.immovable = true;

			this.dialogue = game.add.text(50, game.world.height-155, "Welcome! <Hit the space bar for more text>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			this.dialogue.alpha = 0;
	    	game.add.tween(this.dialogue).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);

			// Add player 
			this.player = game.add.sprite(game.world.centerX-200, game.world.centerY+80, 'fAssets', 'playerSprite0001');
			this.player.anchor.set(0.5);
			this.player.animations.add('left', ['playerSprite0005','playerSprite0006'], 30, true);
			this.player.animations.add('right', ['playerSprite0002','playerSprite0003'], 30, true);
			game.physics.arcade.enable(this.player); // Enable physics on the player
    	} else {

			// Add player 
			this.player = game.add.sprite(game.width-151, game.world.centerY+80, 'fAssets', 'playerSprite0001');
			this.player.anchor.set(0.5);
			this.player.animations.add('left', ['playerSprite0005','playerSprite0006'], 30, true);
			this.player.animations.add('right', ['playerSprite0002','playerSprite0003'], 30, true);
			game.physics.arcade.enable(this.player); // Enable physics on the player

			this.shopDialogue = game.add.text(50, game.world.height-155, "Welcome back!", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			this.shopDialogue.alpha = 0;
	    	game.add.tween(this.dialogue).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);
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
						'Move towards the light (go right) to exit to the town.\nFeel free to drop by our shop for more supplies! Good luck!']; 

		if(current == 0) {
			next = game.add.text(game.world.width-40, game.world.height-90, '▼', {font: '20px Advent Pro', fill: '#FFEDE5'}); 
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
			this.dialogue.text = 'Head towards the light!';
		}
		
		current++;
	    if(current == speech.length) {
	    	this.rightBound.kill();
	    }
	},

	// actionOnClick: function() {
	// 	pauseGame();
	// },

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'fAssets', 'firefly');
			game.add.tween(this.firefly).to( { x: game.world.centerX+400 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerX+300, 1500, Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: game.world.centerY+95 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerY-75, 1500, Phaser.Easing.Linear.None, true);
		}
	},

	// resumeOnClick: function(){
	// 	music.stop();
	// 	//game.state.start('tutorial');	// Update to just remove the menu 
	// 	pauseGame();
	// },
	// titleOnClick: function(){
	// 	music.stop();
	// 	game.state.start('title');
	// },

	over: function(button) {
    	button.frame = 1;
	},

	out: function(button) {
    	button.frame = 0;
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
		this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
	},
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

	    // Player can only hold up to 5 
	    if(fireflies < 5 && full == false) {
  			game.physics.arcade.overlap(this.player, object, this.collectFirefly, null, this);  // Check player collision with fireflies
  		} 

  		if(playerFF == 5) {
  			fillLamp.play();
  			playerFF--;
  		}
	    game.physics.arcade.collide(this.player, this.bottomGUI);
	    game.physics.arcade.collide(this.player, objects);
	    //game.physics.arcade.collide(this.player, this.bound);
	    //game.physics.arcade.collide(this.player, this.boundTop);

	    // Reset the players velocity (movement)
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

	    // Move to next state when player exits shop (move all the way to the right)
	    if(this.player.x > game.world.width + this.player.width) {
	    	game.state.start('play', true, false);
	    }

	    // Arrow keys to move player
	    if (cursors.left.isDown) {
	    	this.player.animations.play('left', 10, false);
	        this.player.body.velocity.x -= 500;	// Move to the left
	        left = true;
	    }
	    else if (cursors.right.isDown) {
			this.player.animations.play('right', 10, false);
	        this.player.body.velocity.x += 500;  // Move to the right
	        right = true;
	    } else {
	    	// stand still 
	    	this.player.animations.stop();
	    	if(left == true)
	    		this.player.frame = 'playerSprite0004';
	    	else 
	    		this.player.frame = 'playerSprite0001';
	    }

	    if(current == 9 && tutSpawned == false) {
	    	tutSpawned = true; 
			this.firefly = object.create(1264, game.world.centerY, 'fAssets', 'firefly');
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

	    //temporary mute by pressing 
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.S)) {
	    	music.stop();
	    }

	    // Arrow keys to move player
	    if (cursors.up.isDown)
	    	this.player.body.velocity.y -= 500;	// Move up
	    if (cursors.down.isDown) 
	    	this.player.body.velocity.y += 500; // Move down
	},
	// render: function() {
	// 	game.debug.spriteInfo(this.player, 32, 32);
	// }
}