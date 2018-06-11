var townLeftLampFill = 0;  
var townLeftVisited = 0;
var townLeftLampLit = false; 
var purifiedLeft = false; 
var leftEnemyAlive = true;

var townLeftState = {
	create: function() {
    	game.world.setBounds(0, 0, 2400, 700); // set bound of the game world. (x, y, width, height). Source: Phaser Tutorial

		this.background = game.add.sprite(0, -64, 'fAssets', 'townBackground');
		this.background = game.add.sprite(1200, -64, 'fAssets', 'townBackground');

		if(litStreetLamps == totalLamps) {
			this.background = game.add.sprite(0, -64, 'endGame', 'townBackgroundEnd');
			this.background = game.add.sprite(1200, -64, 'endGame', 'townBackgroundEnd');

			bright = game.add.text(player.x+50, player.y-100, 'Maybe I should head back to the Breakfast Bar now that the town is bright again.',{font: '38px Advent Pro', fill: '#000000'});
			game.add.tween(bright).to( { y: player.y-150 }, 5500, Phaser.Easing.Linear.None, true);
			game.add.tween(bright).to( { alpha: 0 }, 5500, Phaser.Easing.Linear.None, true);
		}

		// sound effects
		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');
		enemyDies = game.add.audio('enemyDies');
		hitEnemy = game.add.audio('hitEnemy');
		shootFF = game.add.audio('shootFF');	
		playerDies = game.add.audio('playerDies');
		fillStreet = game.add.audio('fillStreet');
		consume = game.add.audio('consume');

		// Add Firefly object to screen
		object = game.add.group(); 
		object.enableBody = true; 

		//Firefly attack group
		attack = game.add.group(); 
		attack.enableBody = true; 

		// Bounds
		bounds = game.add.group(); 
		bounds.enableBody = true; 

		// Bottom bound
		this.bound = bounds.create(0, game.world.height-64, 'bound'); 
		this.bound.body.immovable = true; 
		this.bound.fixedToCamera = true;

		// hitbox
		hitBox = game.add.group();
		hitBox.enableBody = true;

		// Top Bound
		this.boundTop = bounds.create(0, game.world.centerY-115, 'bound');
		this.boundTop.body.immovable = true; 
		this.boundTop.fixedToCamera = true;

		this.leftBound = bounds.create(-100, game.world.centerY+100, 'spriteBounds'); 
		this.leftBound.body.immovable = true;

		this.rightBound = bounds.create(2400, game.world.centerY+100, 'spriteBounds'); 
		this.rightBound.body.immovable = true;

		// toxic puddle
		puddle = game.add.group();
		puddle.enableBody = true;

		// create toxic puddle if the puddle has not been purified yet
		if(purifiedLeft == false) {
			this.toxicPuddle = puddle.create(700, 550, 'fAssets', 'doublePuddle');
			this.toxicPuddle.body.immovable = true;
			this.toxicPuddle.body.setSize(100, 53, 50, 0);

			this.puddleHitBox = hitBox.create(this.toxicPuddle.x-250, this.toxicPuddle.y,'puddleHitBox');
			this.puddleHitBox.scale.setTo(2.5,1);
			this.puddleHitBox.body.immovable = true;
		}

		// Add street lamp.
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 

		if(townLeftVisited < 1) {
			this.spawnStreetLamp(300);
			this.spawnFirefly(game.rnd.integerInRange(3,8));

			portalEntranceSignal = game.add.text(270, game.world.centerY-100, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			portalEntranceSignal.alpha = 0;
	    	game.add.tween(portalEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);

			fillInstruct = game.add.text(1720, game.world.centerY-220, "<F to Fill>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			fillInstruct.alpha = 0;
	    	game.add.tween(fillInstruct).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
		
		} 
		// if town streetlamp is already lit, keep it on
		else if(townLeftVisited >= 0 && townLeftLampLit == true) {
			this.spawnStreetLamp(300);
		} else {
			this.spawnStreetLamp(300);		//gets reset :c when leaving map.. 
			this.spawnFirefly(game.rnd.integerInRange(5,7));
		}



		// Enemy group 
		enemies = game.add.group();
		enemies.enableBody = true;

		//this.spawnEnemy(1);
		civ = game.add.group();
		civ.enableBody = true;

		if(leftEnemyAlive == true)
			this.spawnEnemy(50, game.world.centerY+55, 1);

		this.spawnCivilian(1500, game.world.centerY+50, 1);

		this.civDialogue = ['..there is a strange puddle up ahead..', '..there is a strange puddle up ahead.. I recommend that you watch your step. I also heard that an item called Purification Milk can removed them.',
							'How the puddle vanishes afterwards from mixing one kind of liquid with another..we will never know.', 'I believe that a shop called the "Breakfast Bar" sells them.',
							'To use purification milk, press the 1 key.', 'That is all the help I can give you regarding these strange puddles.', 'Anyways..It’s a shame what happened at the power plant.'];

		// speech bubble
		this.speechBubble = game.add.sprite(this.civilian.centerX-250, this.civilian.centerY - 300, 'speech');
		this.speechBubble.tint = 0xD0D0D0;
		this.speechBubble.visible = false; 
		this.speechArrow = game.add.sprite(this.civilian.centerX-250, this.civilian.centerY - 300, 'speechArrow');
		this.speechArrow.tint = 0xD0D0D0;
		this.speechArrow.visible = false; 
		this.dialogue = game.add.text(this.speechBubble.x+5, this.speechBubble.y+5, '', {font: '30px Advent Pro', fill: '#000000', wordWrap: true, wordWrapWidth: 490});

		this.next = game.add.text(this.speechBubble.x+470, this.speechBubble.y+170, '▼',{font: '25px Advent Pro', fill: '#000000'});
		game.add.tween(this.next).to( { alpha: 0.5 }, 500, Phaser.Easing.Linear.None, true, {alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		this.next.visible = false;

		portal = game.add.group();
		portal.enableBody = true;
		this.portalToTown = portal.create(2100, game.world.centerY-30, 'fAssets', 'portal');
		game.add.tween(this.portalToTown).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

		//Firefly respawner 
		timer = game.time.create();
		timer.loop(10500, function() { 
			var spawn = game.rnd.integerInRange(1, 10);
			if(spawn%2==0) 
				this.spawnFirefly(game.rnd.integerInRange(1,2));
		}, this);
		timer.start(); 

		//Player
		if (last == 'Town') {
			player = new Player(game, 2200, game.world.height-175, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		} else {
		 	player = new Player(game, player.x, player.y, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		}
		game.add.existing(player);

		// Lighting
		this.visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000000');
		this.visionVisibility.fixedToCamera = true;

		this.visionVisibility.animations.add('first', ['gradient_000001', 'gradient_000002', 'gradient_000003', 'gradient_000004'], 30, true);
		this.visionVisibility.animations.add('second', ['gradient_000005', 'gradient_000006', 'gradient_000007', 'gradient_000008'], 30, true);
		this.visionVisibility.animations.add('third', ['gradient_000009', 'gradient_000010', 'gradient_000011', 'gradient_000012'], 30, true);
		this.visionVisibility.animations.add('fourth', ['gradient_000013', 'gradient_000014', 'gradient_000015', 'gradient_000016'], 30, true);
		this.visionVisibility.animations.add('fifth', ['gradient_000017', 'gradient_000018', 'gradient_000019', 'gradient_000020'], 30, true);
		this.visionVisibility.animations.add('sixth', ['gradient_000021', 'gradient_000022', 'gradient_000023', 'gradient_000024'], 30, true);
		this.visionVisibility.animations.add('seventh', ['gradient_000025', 'gradient_000026', 'gradient_000027', 'gradient_000028'], 30, true);

		if (litStreetLamps == 1)
			this.visionVisibility.animations.play('first', 5, false);
		else if(litStreetLamps == 2)
			this.visionVisibility.animations.play('second', 5, false);
		else if(litStreetLamps == 3)
			this.visionVisibility.animations.play('third', 5, false);
		else if(litStreetLamps == 4)
			this.visionVisibility.animations.play('fourth', 5, false);
		else if(litStreetLamps == 5)
			this.visionVisibility.animations.play('fifth', 5, false);
		else if(litStreetLamps == 6)
			this.visionVisibility.animations.play('sixth', 5, false);
		else if(litStreetLamps > 6)
			this.visionVisibility.animations.play('seventh', 5, false);

		// Inventory
		statusBar();

		// Pause button
		var pauseButton =  game.add.button(1168, game.world.height-32, 'pause', pauseGame, this);
		pauseButton.fixedToCamera = true;
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		townLeftVisited++;
		last = 'townLeft';
		//console.log(game.width);
		game.camera.follow(player);	// Game camera follows player.
	},
	shop: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('tutorial', true, false);
	},
	spawnCivilian: function(x, y, n) {
		for(var i = 0; i < n; i++ ){
			this.civilian = civ.create(x, y, 'fAssets', 'civilianSprite0001');

			//this.civilian.anchor.set(0.5);
			this.civilian.body.setSize(333, 192, -100, 0); //(width, height, offsetX, offsetY)

			this.civilian.animations.add('right',['civilianSprite0002', 'civilianSprite0003'], 5, true);
			this.civilian.animations.add('left',['civilianSprite0005', 'civilianSprite0006'], 5, true);
		//console.log(this.enemy.body.velocity.x);
			//game.add.tween(this.civilian).to( { x: 1200 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);

			civText = game.add.text(x-250, y-55, '<Press Space to Interact with Me!>',{font: '30px Advent Pro', fill: '#E5D6CE'});
		//	game.add.tween(this.civText).to( { x: 1200 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);
			game.add.tween(civText).to( { alpha: 0.5 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, {alpha: 1}, game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);
		}
	},

	spawnEnemy: function(x,y, n) {
		for(var i = 0; i < n; i++ ){
			this.enemy = enemies.create(x,y, 'fAssets', 'enemySprite0001');

			//this.enemy = enemies.create(game.rnd.integerInRange(100,600), game.world.centerY+55, 'fAssets', 'enemySprite0001');
			//this.enemy.scale.x *= -1;
			this.enemy.animations.add('right',['enemySprite0002', 'enemySprite0003'], 5, true);
			this.enemy.animations.add('left',['enemySprite0005', 'enemySprite0006'], 5, true);
		//console.log(this.enemy.body.velocity.x);
			game.add.tween(this.enemy).to( { x: this.enemy.x+500 }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, {x: this.enemy.x-500 }, game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);

			//game.add.tween(this.enemy).to( { x: game.rnd.integerInRange(0,1200) }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);

		}
	},
	light: function(x,y) {
		this.streetLamp.animations.play('light');
	},
	spawnStreetLamp: function(x) {
		this.streetLamp = streetLampGroup.create(x, game.world.centerY-150, 'fAssets', 'streetLampDark');
		//this.streetLamp.scale *= -1;
		//this.streetLamp.contain = 0; 
		//this.streetLamp.n? + counter
		this.streetLamp.animations.add('light', ['streetLampLit'], 30, true);
		if(townLeftLampLit == true) {
			full = true;
			this.streetLamp.animations.play('light');
		}else {
			full= false; 
		}
	},

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(50,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'fAssets', 'singleFirefly');
			game.add.tween(this.firefly).to( { x: game.rnd.integerInRange(0,game.world.centerX+400) }, game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(0,game.world.centerX+400), game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: game.world.centerY+95 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerY-75, 1500, Phaser.Easing.Linear.None, true);
		}
	},

	over: function(button) {
    	button.frame = 1;
	},

	out: function(button) {
    	button.frame = 0;
	},

	killEnemy: function(player, enemy) {
		enemy.kill();
		enemyDies.play();
		leftEnemyAlive = false;
	},

	collectFirefly: function(player, firefly) {
		collectFF.play();
		firefly.kill();

		fireflies++;	// add to lantern
		playerFF = fireflies; 
		if(fireflies == 5) {
			full = true;

			fillText = game.add.text(player.x-150, player.y-150, 'Your lantern is now full. Try storing fireflies in street lamps!',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);
		}
		statusBar();	// update inventory
	},

	fillStreetLamp: function(player, streetLamp) {
		// Streetlamp can contain 10 fireflies. **TEMP IS 5 right now**
		if((fireflies > 0) && (townLeftLampFill < 5) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			statusBar();	// update inventory
			townLeftLampFill++;

			full = false;

			fillText = game.add.text(player.x+50, player.y-100, 'StreetLamp contains ' + townLeftLampFill + '/5 fireflies.',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			var temp = true;
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You do not have any more fireflies.',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
		}

		if(townLeftLampFill == 5 && temp == true) { //temp
			temp = false;

			fillStreet.play();

			// light up the map when street lamp is lit
			this.light(750, game.world.centerY-200);

			litStreetLamps++;

			if (litStreetLamps == 1)
				this.visionVisibility.animations.play('first', 5, false);
			else if(litStreetLamps == 2)
				this.visionVisibility.animations.play('second', 5, false);
			else if(litStreetLamps == 3)
				this.visionVisibility.animations.play('third', 5, false);
			else if(litStreetLamps == 4)
				this.visionVisibility.animations.play('fourth', 5, false);
			else if(litStreetLamps == 5)
				this.visionVisibility.animations.play('fifth', 5, false);
			else if(litStreetLamps == 6)
				this.visionVisibility.animations.play('sixth', 5, false);
			else if(litStreetLamps > 6)
				this.visionVisibility.animations.play('seventh', 5, false);


			filledText = game.add.text(player.x+50, player.y-50, 'This street lamp is now filled!',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(filledText).to( { y: player.y-100 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(filledText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			townLeftLampLit = true;
			console.log('This street lamp is now filled!\nGood job!'); 
		}
	},

	fadeFF: function() {
		this.firefly2.kill();
	},
	
	// bring player to town map
	town: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('play');
	},
	rottenApple: function(civilian, toxicPuddle) {
		civilian.kill(); 
	},
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

  		// collision detection for portals
  		game.physics.arcade.overlap(player, this.portalToTown, this.town);

  		// collision detection for player 
  		game.physics.arcade.overlap(player, this.streetLamp, this.fillStreetLamp, null, this);
	    game.physics.arcade.collide(player, this.bottomGUI);
	    game.physics.arcade.collide(player, bounds);

  		// collision detection between player and enemies
	    game.physics.arcade.overlap(player, enemies, health, null, this);
		game.physics.arcade.collide(enemies, this.firefly2, this.killEnemy, null, this);
		game.physics.arcade.collide(player, puddle, health, null, this); 

		// collision detection for civilians becoming rotten apples 
  		game.physics.arcade.overlap(this.civilian, this.toxicPuddle, this.rottenApple);

		// Win Condition
		 if(litStreetLamps == totalLamps && win == false) {
		 	win = true;
		 	game.state.start('townLeft'); 
		 }

		//If player runs out of lives
		if(lives <= 0){
			playerDies.play();
			lives = 1; //to avoid the playerDies sound from playing repeatedly.
			game.state.start('end');

			music.stop();
		}

	    // Player can only hold up to 5 
	    if(fireflies < 5 && full == false) {
  			game.physics.arcade.overlap(player, object, this.collectFirefly, null, this);  // Check player collision with fireflies
  		} 
  		// play sound when player lamp is full
  		if(playerFF == 5) {
  			fillLamp.play();
  			playerFF--;
  		}

	    // use health juice
	    if(healthJuice > 0 && game.input.keyboard.justPressed(Phaser.Keyboard.TWO) && lives < 5) {
	    	healthJuice--;
	    	lives = 5; 
			consume.play();

			var fullHealth = game.add.text(player.x+50, player.y-100, 'Your health is now full again!',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fullHealth).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(fullHealth).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

	    	statusBar();
	    } else if(game.input.keyboard.justPressed(Phaser.Keyboard.TWO) && lives == 5) {
			var fullHealth = game.add.text(player.x+50, player.y-100, 'Your health is already full!',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fullHealth).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(fullHealth).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
	    } else if(game.input.keyboard.justPressed(Phaser.Keyboard.TWO)){
			var noItem = game.add.text(player.x+50, player.y-100, 'You do not have any health juice.',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noItem).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noItem).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
	    }

	    // use protein shake
	    if(proteinShake > 0 && game.input.keyboard.justPressed(Phaser.Keyboard.THREE) && lanternSize < 15) {
	    	proteinShake--;
	    	lanternSize += 5;
			consume.play();

			var bought = game.add.text(player.x-150, player.y-150, 'You can now collect up to '+lanternSize +' fireflies!',{font: '38px Advent Pro', fill: '#000000'});
			game.add.tween(filledText).to( { y: player.y-100 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(filledText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

	    	statusBar();
	    } else if (lanternSize == 15 && proteinShake > 0 && game.input.keyboard.justPressed(Phaser.Keyboard.THREE)) {
			var maxSize = game.add.text(player.x+50, player.y-100, 'You cannot expand your lantern storage space any further!',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(maxSize).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(maxSize).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
	    } else if(game.input.keyboard.justPressed(Phaser.Keyboard.THREE)){
			var noItem = game.add.text(player.x+50, player.y-100, 'You do not have any protein shakes.',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noItem).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noItem).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
	    }

	    if(leftEnemyAlive == true) {
	    	if(this.enemy.x == 50)
	    		this.enemy.animations.play('right');
	    	else if(this.enemy.x == 550)
	    		this.enemy.animations.play('left');
	    }

  		// Check if player is interacting with a citizen 
  		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && game.physics.arcade.overlap(player, this.civilian)) {
			// civilian dialogue
			this.speechBubble.visible = true;
			this.speechArrow.visible = true;
			if(civDialogueCounter < this.civDialogue.length)
				this.dialogue.text = this.civDialogue[civDialogueCounter];

			if(civDialogueCounter == 0 ) {
				this.next.visible = true;
			} 
			else if(civDialogueCounter == this.civDialogue.length) {
				this.next.visible = false;
			}
			civDialogueCounter++;
  		} 
  		else if (game.physics.arcade.overlap(player, this.civilian)==false){
  			civDialogueCounter = 0;
  			this.dialogue.text = '';
  			this.speechBubble.visible = false;
  			this.speechArrow.visible = false;
  			this.next.visible = false; 
  		}

  		// Removing Toxic Puddle
  		if(purifiedLeft == false) {
  			if(game.physics.arcade.overlap(player,this.puddleHitBox) && purificationMilk > 0 && game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) {
  				consume.play();
				purifyText = game.add.text(player.x-150, player.y-150, 'You poured some purification milk onto the toxic puddle and it vanishes.',{font: '25px Advent Pro', fill: '#E5D6CE'});
				game.add.tween(purifyText).to( { y: player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
				game.add.tween(purifyText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);

  				this.toxicPuddle.kill();
  				this.puddleHitBox.kill();

  				purificationMilk--;
  				statusBar();
  				purifiedLeft = true;
  			}
  			else if (game.physics.arcade.overlap(player,this.puddleHitBox) && (purificationMilk == 0) && game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) {
				purifyText = game.add.text(player.x-150, player.y-150, 'You do not have any purificationMilk.',{font: '25px Advent Pro', fill: '#E5D6CE'});
				game.add.tween(purifyText).to( { y: player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
				game.add.tween(purifyText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);
  			}
  		}

	    // attack enemies
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.A) && fireflies > 0) {
			full = false; 
	    	shootFF.play(); 
	    	fireflies--; 
			playerFF = fireflies; 

	    	if(right == true) {
				this.firefly2 = attack.create(player.x+65, player.centerY, 'fAssets', 'singleFirefly');
				// game.add.tween(object).to( {property that you want to modify}, time (1000 = 1 sec), copy, true for repeat)
				game.add.tween(this.firefly2).to( { x: player.x+450 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);

				// update fireflies
				if(playerFF == 0) {
					noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You ran out of fireflies. Try collecting more!',{font: '25px Advent Pro', fill: '#E5D6CE'});
					game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
					game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

					playerFF--;
				}

				statusBar(0);	// update Inventory
			} else {
				this.firefly2 = attack.create(player.x-65, player.centerY, 'fAssets', 'singleFirefly');
				game.add.tween(this.firefly2).to( { x: player.x-450 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);
				// update fireflies
				
				if(playerFF == 0) {
					noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You ran out of fireflies. Try collecting more!',{font: '25px Advent Pro', fill: '#E5D6CE'});
					game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
					game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

					playerFF--;
				}
				statusBar(0);	// update Inventory

			}
	    }
	},
}