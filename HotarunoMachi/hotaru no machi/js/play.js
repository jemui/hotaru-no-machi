var litStreetLamps = 0;
var left, right;
var townVisited = 0; 
var townLampFill = 0;	// track if streetlamp in first town map is filled
var townLampLit = false;
var townEnemy = false;
var civDialogueCounter = 0;

var playState = {
	create: function() {
    	game.world.setBounds(-1200, 0, 3600, 700); // set bound of the game world. (x, y, width, height). Source: Phaser Tutorial

    	// add the backgrounds
		this.background = game.add.sprite(0, -25, 'fAssets', 'townBackground');
		this.background.scale.x *= -1;

		this.background = game.add.sprite(0, -64, 'fAssets', 'shopExterior');

		this.background = game.add.sprite(2400, -25, 'fAssets', 'townBackground');
		this.background.scale.x *= -1;

		if(litStreetLamps == totalLamps) {
			this.background = game.add.sprite(0, -25, 'endGame', 'townBackgroundEnd');

			this.background.scale.x *= -1;
			this.background = game.add.sprite(0, -64, 'endGame', 'shopExteriorEnd');

			this.background = game.add.sprite(2400, -25, 'endGame', 'townBackgroundEnd');
			this.background.scale.x *= -1;

			bright = game.add.text(player.x+50, player.y-100, 'Maybe I should head back to the Breakfast Bar now that the town is bright again.',{font: '38px Advent Pro', fill: '#000000'});
			game.add.tween(bright).to( { y: player.y-150 }, 5500, Phaser.Easing.Linear.None, true);
			game.add.tween(bright).to( { alpha: 0 }, 5500, Phaser.Easing.Linear.None, true);
		}

		// sound effects
		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');
		enemyDies = game.add.audio('enemyDies');
		consume = game.add.audio('consume');
		hitEnemy = game.add.audio('hitEnemy');
		shootFF = game.add.audio('shootFF');
		fillStreet = game.add.audio('fillStreet');		

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

		// Top Bound
		this.boundTop = bounds.create(0, game.world.centerY-115, 'bound');
		this.boundTop.body.immovable = true; 
		this.boundTop.fixedToCamera = true;

		this.leftBound = bounds.create(-1300, game.world.centerY+100, 'spriteBounds'); 
		this.leftBound.body.immovable = true;

		this.rightBound = bounds.create(2400, game.world.centerY+100, 'spriteBounds'); 
		this.rightBound.body.immovable = true;

		// Add street lamp.
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 

		// indicators for player 
		shopEntranceSignal = game.add.text(200, game.world.centerY-30, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
	    game.add.tween(shopEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0.4}, 1500, Phaser.Easing.Linear.None, true);
		
		LeftEntranceSignal = game.add.text(-990, game.world.centerY-50, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
	    game.add.tween(LeftEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0.4}, 1500, Phaser.Easing.Linear.None, true);

		fillInstruct = game.add.text(1750, game.world.centerY-220, "<F to Fill>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
	    game.add.tween(fillInstruct).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0.4}, 1500, Phaser.Easing.Linear.None, true);
		
		portalEntranceSignal = game.add.text(game.world.centerX+1350, game.world.centerY-100, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
	    game.add.tween(portalEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0.4}, 1500, Phaser.Easing.Linear.None, true);

		if(townVisited < 1) {
			this.spawnStreetLamp();
			this.spawnFirefly(game.rnd.integerInRange(5,7));
		} 
		// if town streetlamp is already lit, keep it on
		else if(townVisited >= 0 && townLampLit == true) {
			this.spawnStreetLamp();
		} else {
			this.spawnStreetLamp();		//gets reset :c when leaving map.. 
			this.spawnFirefly(game.rnd.integerInRange(0,2));
		}

		// Enemy group 
		enemies = game.add.group();
		enemies.enableBody = true;

		// Portals
		portal = game.add.group();
		portal.enableBody = true;
		//this.portalToShop = portal.create(game.world.centerX+250, game.world.centerY, 'light');
		this.portalToShop = portal.create(230, game.world.centerY+30, 'fAssets', 'portal');
		this.portalToShop.scale.set(0.5);
		this.portalToShop.alpha = 1;
		game.add.tween(this.portalToShop).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

		this.portalToTown2 = portal.create(game.world.centerX+1300, game.world.centerY-30, 'fAssets', 'portal');
		game.add.tween(this.portalToTown2).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

		this.portalToTownLeft = portal.create(-950, game.world.centerY+20, 'fAssets', 'portal');
		this.portalToTownLeft.alpha = 1;
		this.portalToTownLeft.scale.set(0.7);
		game.add.tween(this.portalToTownLeft).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

		civ = game.add.group();
		civ.enableBody = true;

		// spawn a civilian (x, y, n)
		this.spawnCivilian(750, game.world.centerY, 1); 

		this.civDialogue = ['Hey you! Are you a bit lost?', 'Hey you! Are you a bit lost? I see a dark street lamp down this path that might help you see better if you can figure out how to get it working again.',
							'Oh! And a few more important things. If you see some strange looking..apples.. do not hestiate to attack them with the "A" key with your fireflies.',
							'There are some strange puddles around the town, which might be linked to their hositility, so try not to get killed out there!' ];

		// speech bubble
		this.speechBubble = game.add.sprite(this.civilian.centerX-250, this.civilian.centerY - 300, 'speech');
		this.speechBubble.tint = 0xD0D0D0;
		this.speechBubble.visible = false; 
		this.speechArrow = game.add.sprite(this.civilian.centerX-250, this.civilian.centerY - 300, 'speechArrow');
		this.speechArrow.tint = 0xD0D0D0;
		this.speechArrow.visible = false; 
		this.dialogue = game.add.text(this.speechBubble.x+5, this.speechBubble.y+5, '', {font: '30px Advent Pro', fill: '#000000', wordWrap: true, wordWrapWidth: 490});

		this.next = game.add.text(this.speechBubble.x+470, this.speechBubble.y+170, '▼',{font: '38px Advent Pro', fill: '#000000'});
		game.add.tween(this.next).to( { alpha: 0.5 }, 500, Phaser.Easing.Linear.None, true, {alpha: 1}, 500, Phaser.Easing.Linear.None, true);
		this.next.visible = false;

		//PlayerSprite
		if (last == 'townLeft') {
			player = new Player(game, -950, game.world.height-175, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		} 
		else if(last == 'Shop') {
			player = new Player(game, 290, game.world.centerY+135, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		}		
		 else if(last == 'Town2') {
			player = new Player(game, 2000, game.world.centerY+135, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		}
		else {
		 	player = new Player(game, player.x, player.y, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		}

		game.add.existing(player);

		townVisited++;
		last = 'Town'; 

		// Firefly Respawner
		// set up looping event (delay, callback, context, arguments)
		timer = game.time.create();
		timer.loop(5000, function() { 
			var spawn = game.rnd.integerInRange(1, 10);
			if(spawn%2==0) 
				this.spawnFirefly(game.rnd.integerInRange(1,3));
		}, this);
		timer.start(); 

		// visibility. Only GUI related elements should go after this
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

		if(litStreetLamps == totalLamps) {
				this.visionVisibility.animations.play('seventh', 5, false);
		}
		// Add the status bar to the bottom
		statusBar();

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
			this.civilian.body.setSize(333, 192, -100, 0); //(width, height, offsetX, offsetY)

			this.civilian.animations.add('right',['civilianSprite0002', 'civilianSprite0003'], 5, true);
			this.civilian.animations.add('left',['civilianSprite0005', 'civilianSprite0006'], 5, true);

			this.civilian.scale.x *= -1;
			civText = game.add.text(x-300, y-55, '<Press Space to Interact with Me!>',{font: '30px Advent Pro', fill: '#E5D6CE'});
	
			game.add.tween(civText).to( { alpha: 0.5 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, {alpha: 1}, game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);

		}
	},
	light: function(x,y) {
		this.streetLamp.animations.play('light');
	},
	spawnStreetLamp: function() {
		this.streetLamp = streetLampGroup.create(1750, game.world.centerY-140, 'fAssets', 'streetLampDark');
		this.streetLamp.animations.add('light', ['streetLampLit'], 30, true);
		if(townLampLit == true) {
			full = true;
			this.streetLamp.animations.play('light');
		}
	},

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(50,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'fAssets', 'singleFirefly');
			game.add.tween(this.firefly).to( { x: game.rnd.integerInRange(game.world.centerX, game.world.centerX+800) }, game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(0,game.world.centerX), game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true);
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
		townEnemy = true;
	},

	collectFirefly: function(player, firefly) {
		collectFF.play();
		firefly.kill();

		fireflies++;	// add to lantern
		playerFF = fireflies; 
		if(fireflies == 5) {
			full = true;

			fillText = game.add.text(player.x-150, player.y-150, 'Your lantern is now full. Try storing fireflies in street lamps!',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);
		}
		statusBar();  //update the inventory
	},

	fillStreetLamp: function(player, streetLamp) {
		// Streetlamp can contain 10 fireflies. **TEMP IS 5 right now**
		if((fireflies > 0) && (townLampFill < 5) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			statusBar();
			townLampFill++;

			full = false;

			fillText = game.add.text(player.x+50, player.y-100, 'StreetLamp contains ' + townLampFill + '/5 fireflies.',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			var temp = true;	
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You do not have any more fireflies.',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
		}

		if(townLampFill == 5 && temp == true) { //temp
			temp = false;	//set back to false to avoid filled text from below to show up
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

			filledText = game.add.text(player.x+50, player.y-50, 'This street lamp is now filled!',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(filledText).to( { y: player.y-100 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(filledText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			townLampLit = true;
		}
	},
	// remove firefly after attacking
	fadeFF: function() {
		this.firefly2.kill();
	},
	
	// bring player to town 2 (see if you can move to another map? ) 
	town2: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('town'); 
	},
	townLeft: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('townLeft'); 
	},
	update: function() {
		// Win Condition
		 if(litStreetLamps == totalLamps && win == false) {
		 	win = true;
		 	game.state.start('play'); 
		 }
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

		//If player runs out of lives
		if(lives <= 0){
			playerDies.play();
			lives = 1; //to avoid the playerDies sound from playing repeatedly 
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
		//	else
			//	dialogue.text = this.civDialogue[civDialogueCounter];

			civDialogueCounter++;
  		} else if (game.physics.arcade.overlap(player, this.civilian)==false){
  			civDialogueCounter = 0;
  			this.dialogue.text = '';
  			this.speechBubble.visible = false;
  			this.speechArrow.visible = false;
  			this.next.visible = false; 
  		}

  		// collision detection for portals
  		game.physics.arcade.overlap(player, this.portalToShop, this.shop);
  		game.physics.arcade.overlap(player, this.portalToTown2, this.town2);
  		game.physics.arcade.overlap(player, this.portalToTownLeft, this.townLeft);

  		// collision detections for player 
  		game.physics.arcade.overlap(player, this.streetLamp, this.fillStreetLamp, null, this);
	    game.physics.arcade.collide(player, this.bottomGUI);
	    
	    // detection for enemies, bounds between player and fireflies
	    game.physics.arcade.overlap(player, enemies, health, null, this);
	    game.physics.arcade.collide(player, bounds);
		game.physics.arcade.collide(enemies, this.firefly2, this.killEnemy, null, this);

		if(game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) {
			var noPuddle = game.add.text(player.x+50, player.y-100, 'There are no toxic puddles here.',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noPuddle).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noPuddle).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
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
					var noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You do not have any more fireflies.',{font: '38px Advent Pro', fill: '#E5D6CE'});
					game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
					game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
					playerFF--;
				}

				statusBar();	// update inventory
			} else {
				this.firefly2 = attack.create(player.x-65, player.centerY, 'fAssets', 'singleFirefly');
				game.add.tween(this.firefly2).to( { x: player.x-450 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);
				// update fireflies
				
				if(playerFF == 0) {
					var noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You do not have any more fireflies.',{font: '38px Advent Pro', fill: '#E5D6CE'});
					game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
					game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
				
					playerFF--;
				}
				statusBar();	// update inventory

			}
	    }

	},
}