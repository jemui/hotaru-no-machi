var town2LampFill = 0;  // keep track of how full the lamp is 
var town2Visited = 0;	// keep track of times visited for firefly spawning
var town2LampLit = false;	// helps determine if a lit street lamp is still lit in the map upon revisiting the map

var killedBelow = false;
var purifiedBelow = false;

var yCenter = 350;
// 30-32 gradient images to use. array of 4 street lamps. stores litStreetLamps 
// create animations in the states. animation played depends on # lit lamps and position in array

var townState = {
	create: function() {
    	game.world.setBounds(0, 0, 2400, 700); // set bound of the game world. (x, y, width, height). Source: Phaser Tutorial

		this.background = game.add.sprite(0, -64, 'fAssets', 'townBackground');
		this.background = game.add.sprite(1200, -64, 'fAssets', 'townBackground');

		this.background = game.add.sprite(0, 636, 'fAssets', 'townBackground');
		this.background = game.add.sprite(1200, 636, 'fAssets', 'townBackground');		

		if(litStreetLamps == totalLamps) {
			this.background = game.add.sprite(0, -64, 'endGame', 'townBackgroundEnd');
			this.background = game.add.sprite(1200, -64, 'endGame', 'townBackgroundEnd');

			this.background = game.add.sprite(0, 636, 'endGame', 'townBackgroundEnd');
			this.background = game.add.sprite(1200, 636, 'endGame', 'townBackgroundEnd');		

			bright = game.add.text(player.x+50, player.y-100, 'Maybe I should head back to the Breakfast Bar now that the town is bright again.',{font: '38px Advent Pro', fill: '#E5D6CE'});
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

		// Top Bound
		this.boundTop = bounds.create(0, yCenter-115, 'bound');
		this.boundTop.body.immovable = true; 
		this.boundTop.fixedToCamera = true;

		this.leftBound = bounds.create(-100, yCenter+100, 'spriteBounds'); 
		this.leftBound.body.immovable = true;

		this.rightBound = bounds.create(2400, yCenter+100, 'spriteBounds'); 
		this.rightBound.body.immovable = true;

		// hitbox
		hitBox = game.add.group();
		hitBox.enableBody = true;

		// Add street lamp.
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 

		if(town2Visited < 1) {
			this.spawnStreetLamp(1720, yCenter-150);
			this.spawnFirefly(game.rnd.integerInRange(3,8));

			// shopEntranceSignal = game.add.text(1440, yCenter-210, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			// shopEntranceSignal.alpha = 0;
	  //   	game.add.tween(shopEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
			portalEntranceSignal = game.add.text(270, yCenter-100, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			portalEntranceSignal.alpha = 0;
	    	game.add.tween(portalEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);

			fillInstruct = game.add.text(1720, yCenter-220, "<F to Fill>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			fillInstruct.alpha = 0;
	    	game.add.tween(fillInstruct).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
		
		} 
		// if town streetlamp is already lit, keep it on
		else if(town2Visited >= 0 && town2LampLit == true) {
			this.spawnStreetLamp(1720, yCenter-150);
		} else {
			this.spawnStreetLamp(1720, yCenter-150);		//gets reset :c when leaving map.. 
			this.spawnFirefly(game.rnd.integerInRange(5,7));
		}
		// townbelow conditions here

		// toxic puddle
		puddle = game.add.group();
		puddle.enableBody = true;

		// create toxic puddle if the puddle has not been purified yet
		if(purifiedBelow == false) {
			this.toxicPuddle = puddle.create(1400, 1250, 'fAssets', 'singlePuddle');
			this.toxicPuddle.body.immovable = true;
			this.toxicPuddle.body.setSize(50, 73, 40, -20);

			this.puddleHitBox = hitBox.create(this.toxicPuddle.x-250, this.toxicPuddle.y,'puddleHitBox');
			this.puddleHitBox.scale.setTo(2.5,1);
			this.puddleHitBox.body.immovable = true;
		}

		// Enemy group 
		enemies = game.add.group();
		enemies.enableBody = true;

		if(killedBelow == false)
			this.spawnEnemy(1200, 1100);

		civ = game.add.group();
		civ.enableBody = true;

		this.spawnCivilian(1000, yCenter,1);

		this.civDialogue = ['Sometimes fireflies respawn.','Rumor has it that only two people at the accident site survived.', 'The town hasn’t been the same ever since that meltdown incident.'];

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

		portal = game.add.group();
		portal.enableBody = true;
		this.portalToTown = portal.create(270, yCenter-30, 'fAssets', 'portal');

		this.portalToTownBelow = portal.create(game.world.centerX+850, yCenter-30, 'fAssets', 'portal');
		game.add.tween(this.portalToTownBelow).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

 		this.portalToTownTop = portal.create(game.world.centerX+850, 1000, 'fAssets', 'portal');
		game.add.tween(this.portalToTownTop).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

 		this.portalToTownPastLeft = portal.create(400, 1000, 'fAssets', 'portal');
		game.add.tween(this.portalToTownPastLeft).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);

		// Firefly Respawner
		// set up looping event (delay, callback, context, arguments)
		timer = game.time.create();
		timer.loop(10500, function() { 
			//console.log('loop event at: ' + timer.ms);
			var spawn = game.rnd.integerInRange(1, 10);
			if(spawn%2==0) 
				this.spawnFirefly(game.rnd.integerInRange(1,2));
		}, this);
		timer.start(); 
//		this.portalToTown2 = portal.create(game.world.centerX+1000, yCenter, 'light');

		//PlayerSprite
		if (last == 'Town') {
			player = new Player(game, 380, 525, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		} else if (last == 'townPastLeft') {
			game.world.setBounds(0, 700, 2400, 700);
			player = new Player(game, 400, 1200, 'fAssets', 'playerSprite0001', 150, game.world.height-175);

		}
		else {
			player = new Player(game, player.x, player.y, 'fAssets', 'playerSprite0001', 150, game.world.height-175);
		}


		game.add.existing(player);
		town2Visited++;
		last = 'Town2';

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

		// Inventory
		statusBar();

		game.camera.follow(player);	// Game camera follows player.
	},
	shop: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('tutorial', true, false);
	},
	spawnCivilian: function(x,y,n) {
		for(var i = 0; i < n; i++ ){
			this.civilian = civ.create(x, y, 'fAssets', 'civilianSprite0001');

			this.civilian.animations.add('right',['civilianSprite0002', 'civilianSprite0003'], 5, true);
			this.civilian.animations.add('left',['civilianSprite0005', 'civilianSprite0006'], 5, true);
			game.add.tween(this.civilian).to( { x: x+200 }, 5000, Phaser.Easing.Linear.None, true, x-300, 5000, Phaser.Easing.Linear.None, true);
			this.civText = game.add.text(this.civilian.x-50, this.civilian.y-55, '<Press Space to Interact with Me!>',{font: '30px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(this.civText).to( { x: x+200 }, 5000, Phaser.Easing.Linear.None, true, x-300, 5000, Phaser.Easing.Linear.None, true);

		}
	},
	civDialogue: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			var speech = ['I wonder what happened to the nuclear power plant..']; 
			//this.civText.text = speech[1]; 
		}
	}, 
	spawnEnemy: function(x, y) {
		this.enemy = enemies.create(x, y, 'fAssets', 'enemySprite0001');
		//this.enemy.scale.x *= -1;
		this.enemy.animations.add('right',['enemySprite0002', 'enemySprite0003'], 5, true);
		this.enemy.animations.add('left',['enemySprite0005', 'enemySprite0006'], 5, true);
		game.add.tween(this.enemy).to( { x: x+400 }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, x-400, game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);

		//game.add.tween(this.enemy).to( { x: game.rnd.integerInRange(0,1200) }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);
	},
	light: function(x,y) {
		this.streetLamp.animations.play('light');
	},
	spawnStreetLamp: function(x,y) {
		this.streetLamp = streetLampGroup.create(x, y, 'fAssets', 'streetLampDark');
		this.streetLamp.animations.add('light', ['streetLampLit'], 30, true);

		if(town2LampLit == true) {
			full = true;
			this.streetLamp.animations.play('light');
		} else {
			full= false; 
		}
	},

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(50,game.width-64), game.rnd.integerInRange(yCenter,game.height-128), 'fAssets', 'singleFirefly');
			game.add.tween(this.firefly).to( { x: game.rnd.integerInRange(game.world.centerX, game.world.centerX+800) }, game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(0,game.world.centerX), game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: yCenter+95 }, 1500, Phaser.Easing.Linear.None, true, yCenter-75, 1500, Phaser.Easing.Linear.None, true);
		}
	},

	over: function(button) {
    	button.frame = 1;
	},

	out: function(button) {
    	button.frame = 0;
	},

	health: function(enemy) {
		hitEnemy.play(); 
		lives-=1;	// sometimes subtracts 0.5, sometimes 1 
		playerLives.text = lives;

		if(left == true) {
			player.x += 10;
			game.add.tween(player).to( {x:player.x+90}, 100, Phaser.Easing.Linear.None, true);
		}
		else {
			player.x -= 10;
			game.add.tween(player).to( {x:player.x-90}, 100, Phaser.Easing.Linear.None, true);
		}
	},

	killEnemy: function(player, enemy) {
		enemy.kill();
		enemyDies.play();
		killedBelow = true;
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
		statusBar();	// update inventory
	},

	fillStreetLamp: function(player, streetLamp) {
		// Streetlamp can contain 10 fireflies. **TEMP IS 5 right now**
		if((fireflies > 0) && (town2LampFill < 5) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			statusBar();	// update inventory
			town2LampFill++;

			full = false;

			fillText = game.add.text(player.x+50, player.y-100, 'StreetLamp contains ' + town2LampFill + '/5 fireflies.',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			var temp = true;
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You do not have any more fireflies.',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);
		}

		if(town2LampFill == 5 && temp == true) { //temp
			temp = false;
			
			fillStreet.play();

			// light up the map when street lamp is lit
			this.light(750, yCenter-200);

			litStreetLamps++;

			if (litStreetLamps == 1)
				this.visionVisibility.animations.play('first', 5, false);
			else
				this.visionVisibility.animations.play('second', 5, false);

			filledText = game.add.text(player.x+50, player.y-50, 'This street lamp is now filled!',{font: '38px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(filledText).to( { y: player.y-100 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(filledText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			town2LampLit = true;
		}
	},

	fadeFF: function() {
		this.firefly2.kill();
	},
	
	// bring player to town 2 (see if you can move to another map? ) 
	town: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('play');
	},
	townBelow: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
			game.world.setBounds(0, 700, 2400, 700); // change the world bounds to fit the bottom part of the town map
			player.y = 1200; 
		}
	},
	townPastLeft: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
			game.state.start('townPastLeft');
		}
	},
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

  		// collision detection for portals
  		game.physics.arcade.overlap(player, this.portalToTown, this.town);
   		game.physics.arcade.overlap(player, this.portalToTownBelow, this.townBelow);
   		game.physics.arcade.overlap(player, this.portalToTownPastLeft, this.townPastLeft);

  		// collision detection for player 
  		game.physics.arcade.overlap(player, this.streetLamp, this.fillStreetLamp, null, this);
	    game.physics.arcade.collide(player, this.bottomGUI);
	    
	    game.physics.arcade.collide(player, bounds);
	    game.physics.arcade.overlap(player, enemies, health, null, this);
		game.physics.arcade.collide(enemies, this.firefly2, this.killEnemy, null, this);
  		game.physics.arcade.collide(player, puddle, health, null, this); 

		// collision detection for civilians becoming rotten apples 
  		game.physics.arcade.overlap(this.civilian, this.toxicPuddle, this.rottenApple);


   		if(game.physics.arcade.overlap(player, this.portalToTownTop) && game.input.keyboard.justPressed(Phaser.Keyboard.W)) {
			game.world.setBounds(0, 0, 2400, 700);
   			player.y = player.y-700; 
   		}

		// Win Condition
		 if(litStreetLamps == totalLamps && win == false) {
		 	win = true;
		 	game.state.start('town'); 
		 }

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

  		// enemy walking animations
  		 if( this.enemy.x ==1200)
	     	this.enemy.animations.play('right');
	     else if( this.enemy.x ==1600)
	     	this.enemy.animations.play('left');

	    // civilian walking animations
  		if( this.civilian.x == 1200)
	    	this.civilian.animations.play('left');
	    else if( this.civilian.x ==1000)
	    	this.civilian.animations.play('right');

  		// Removing Toxic Puddle
  		if(purifiedBelow == false) {
  			if(game.physics.arcade.overlap(player,this.puddleHitBox) && purificationMilk > 0 && game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) {
				consume.play();
				purifyText = game.add.text(player.x-150, player.y-150, 'You poured some purification milk onto the toxic puddle and it vanishes.',{font: '30px Advent Pro', fill: '#E5D6CE'});
				game.add.tween(purifyText).to( { y: player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
				game.add.tween(purifyText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);

  				this.toxicPuddle.kill();
  				this.puddleHitBox.kill();

  				purificationMilk--;
  				statusBar();
  				purifiedBelow = true;
  			}
  			else if (game.physics.arcade.overlap(player,this.puddleHitBox) && (purificationMilk == 0) && game.input.keyboard.justPressed(Phaser.Keyboard.ONE)) {
				purifyText = game.add.text(player.x-150, player.y-150, 'You do not have any purificationMilk.',{font: '25px Advent Pro', fill: '#E5D6CE'});
				game.add.tween(purifyText).to( { y: player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
				game.add.tween(purifyText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);
  			}
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

	    // attack enemies using A
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.A) && fireflies > 0) {
			full = false; 
	    	shootFF.play(); 
	    	fireflies--; 
			playerFF = fireflies; 

	    	if(right == true) {
				this.firefly2 = attack.create(player.x+65, player.centerY, 'fAssets', 'singleFirefly');
				game.add.tween(this.firefly2).to( { x: player.x+450 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);

				// update fireflies
				if(playerFF == 0) {
					console.log('You ran out of fireflies. Try collecting more!'); 
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
					console.log('You ran out of fireflies. Try collecting more!'); 
					playerFF--;
				}
				statusBar();	// update inventory

			}
	    }

	    // Arrow keys to move player
	    if (cursors.left.isDown) {
	    	player.animations.play('left', 10, false);
	        player.body.velocity.x -= 500;	// Move to the left
	        left = true;
	        right = false;
	    }
	    else if (cursors.right.isDown) {
			player.animations.play('right', 10, false);
	        player.body.velocity.x += 500;  // Move to the right
	        right = true;
	        left = false;
	    } else {
	    	// stand still 
	    	player.animations.stop();
	    	if(left == true)
	    		player.frame = 'playerSprite0004';
	    	else 
	    		player.frame = 'playerSprite0001';
	    }
	    if (cursors.up.isDown) {
	    	player.body.velocity.y -= 500;	// Move up
	    }
	    if (cursors.down.isDown) {
	    	player.body.velocity.y += 500; // Move down
	    }

	}
}