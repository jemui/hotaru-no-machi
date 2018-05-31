var town2LampFill = 0;  
var town2Visited = 0;
var town2LampLit = false; 
// 30-32 gradient images to use. array of 4 street lamps. stores litStreetLamps 
// create animations in the states. animation played depends on # lit lamps and position in array

var townState = {
	create: function() {
    	game.world.setBounds(0, 0, 2400, 700); // set bound of the game world. (x, y, width, height). Source: Phaser Tutorial

		this.background = game.add.sprite(0, -64, 'fAssets', 'townBackground');
		this.background = game.add.sprite(1200, -64, 'fAssets', 'townBackground');

		// sound effects
		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');
		enemyDies = game.add.audio('enemyDies');
		hitEnemy = game.add.audio('hitEnemy');
		shootFF = game.add.audio('shootFF');	

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

		this.leftBound = bounds.create(-100, game.world.centerY+100, 'spriteBounds'); 
		this.leftBound.body.immovable = true;

		this.rightBound = bounds.create(2400, game.world.centerY+100, 'spriteBounds'); 
		this.rightBound.body.immovable = true;

		// Add street lamp.
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 

		if(town2Visited < 1) {
			this.spawnStreetLamp(1720);
			this.spawnFirefly(game.rnd.integerInRange(3,8));

			// shopEntranceSignal = game.add.text(1440, game.world.centerY-210, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			// shopEntranceSignal.alpha = 0;
	  //   	game.add.tween(shopEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
			portalEntranceSignal = game.add.text(270, game.world.centerY-100, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			portalEntranceSignal.alpha = 0;
	    	game.add.tween(portalEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);

			fillInstruct = game.add.text(1720, game.world.centerY-220, "<F to Fill>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			fillInstruct.alpha = 0;
	    	game.add.tween(fillInstruct).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
		
		} 
		// if town streetlamp is already lit, keep it on
		else if(town2Visited >= 0 && town2LampLit == true) {
			this.spawnStreetLamp(1720);
		} else {
			this.spawnStreetLamp(1720);		//gets reset :c when leaving map.. 
			this.spawnFirefly(game.rnd.integerInRange(5,7));
		}

		town2Visited++;
		last = 'Town2';

		// Enemy group 
		enemies = game.add.group();
		enemies.enableBody = true;

		//this.spawnEnemy(1);
		civ = game.add.group();
		civ.enableBody = true;

		this.spawnCivilian(1);

		portal = game.add.group();
		portal.enableBody = true;
		this.portalToTown = portal.create(270, game.world.centerY-30, 'fAssets', 'portal');

//		this.portalToTown2 = portal.create(game.world.centerX+1000, game.world.centerY, 'light');

		//PlayerSprite
		this.player = game.add.sprite(380, game.world.height-175, 'fAssets', 'playerSprite0001');
		this.player.enableBody = true;
		this.player.anchor.set(0.5);
		this.player.animations.add('left', ['playerSprite0005','playerSprite0006'], 30, true);
		this.player.animations.add('right', ['playerSprite0002','playerSprite0003'], 30, true);

		game.physics.arcade.enable(this.player); // Enable physics on the player

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

		// Set up the bottom GUI 
		var bottomGUI = game.add.sprite(0, game.world.height-64, 'bottom');
		bottomGUI.scale.setTo(2,2);
		bottomGUI.fixedToCamera = true;

		var heart = game.add.sprite(200, game.world.height-55, 'assets', 'heartIcon');
		heart.fixedToCamera = true;
		this.playerLives = game.add.text(218, game.world.height-45, lives,{font: '25px Advent Pro', fill: '#E5D6CE'});
		this.playerLives.fixedToCamera = true;

		this.firefliesCaught = game.add.text(20, game.world.height-45, (fireflies+'/5 Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});
		this.firefliesCaught.fixedToCamera = true;

		// Pause button
		var pauseButton =  game.add.button(1168, game.world.height-32, 'pause', pauseGame, this);
		pauseButton.fixedToCamera = true;
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		//console.log(game.width);
		game.camera.follow(this.player);	// Game camera follows player.
	},
	shop: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W))
			game.state.start('tutorial', true, false);
	},
	spawnCivilian: function(n) {
		for(var i = 0; i < n; i++ ){
			this.civilian = civ.create(1000, game.world.centerY, 'fAssets', 'civilianSprite0001');


			this.civilian.animations.add('right',['civilianSprite0002', 'civilianSprite0003'], 5, true);
			this.civilian.animations.add('left',['civilianSprite0005', 'civilianSprite0006'], 5, true);
		//console.log(this.enemy.body.velocity.x);
			game.add.tween(this.civilian).to( { x: 1200 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);


			this.civText = game.add.text(700, game.world.centerY-55, '<Press Space to Interact with Me!>',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(this.civText).to( { x: 1200 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);
			//game.add.tween(civText).to( { alpha: 0 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, {alpha: 1}, game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);

			//game.add.tween(this.enemy).to( { x: game.rnd.integerInRange(0,1200) }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);

		}
	},
	civDialogue: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			var speech = ['I wonder what happened to the nuclear power plant..']; 
			//this.civText.text = speech[1]; 
		}
	}, 
	spawnEnemy: function(n) {
		for(var i = 0; i < n; i++ ){
			this.enemy = enemies.create(0, game.world.centerY+55, 'fAssets', 'enemySprite0001');

			//this.enemy = enemies.create(game.rnd.integerInRange(100,600), game.world.centerY+55, 'fAssets', 'enemySprite0001');
			//this.enemy.scale.x *= -1;
			this.enemy.animations.add('right',['enemySprite0002', 'enemySprite0003'], 5, true);
			this.enemy.animations.add('left',['enemySprite0005', 'enemySprite0006'], 5, true);
		//console.log(this.enemy.body.velocity.x);
			game.add.tween(this.enemy).to( { x: 1200 }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);

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
		if(town2LampLit == true) {
			full = true;
			this.streetLamp.animations.play('light');
		}else {
			full= false; 
		}
	},

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'fAssets', 'singleFirefly');
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

	health: function(enemy) {
		hitEnemy.play(); 
		lives-=0.5;	// sometimes subtracts 0.5, sometimes 1 
		this.playerLives.text = lives;

		if(this.player.x >= enemy.x)
			game.add.tween(this.player).to( {x:this.player.x+200}, 100, Phaser.Easing.Linear.None, true);
		else
			game.add.tween(this.player).to( {x:this.player.x-200}, 100, Phaser.Easing.Linear.None, true);
	},

	killEnemy: function(player, enemy) {
		enemy.kill();
		enemyDies.play();
	},

	collectFirefly: function(player, firefly) {
		collectFF.play();
		firefly.kill();

		fireflies++;	// add to lantern
		playerFF = fireflies; 
		if(fireflies == 5) {
			full = true;

			fillText = game.add.text(this.player.x-150, this.player.y-150, 'Your lantern is now full. Try storing fireflies in street lamps!',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: this.player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);

			console.log('Your lantern is now full. Try storing fireflies in street lamps!'); 
		}
		this.firefliesCaught.text = fireflies+'/5 Fireflies Caught';	// update text
	},

	fillStreetLamp: function(player, streetLamp) {
		// Streetlamp can contain 10 fireflies. **TEMP IS 5 right now**
		if((fireflies > 0) && (town2LampFill < 5) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			this.firefliesCaught.text = fireflies+'/5 Fireflies Caught';	// update text
			town2LampFill++;

			full = false;

			fillText = game.add.text(this.player.x+50, this.player.y-100, 'StreetLamp contains ' + town2LampFill + '/5 fireflies.',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: this.player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			console.log('StreetLamp contains ' + town2LampFill + ' fireflies.');
			var temp = true;
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			noFirefliesLeft = game.add.text(this.player.x+50, this.player.y-100, 'You do not have any more fireflies.',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noFirefliesLeft).to( { y: this.player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			console.log('You do not have any more fireflies.'); 
		}

		if(town2LampFill == 5 && temp == true) { //temp
			temp = false;
			fillStreet = game.add.audio('fillStreet');
			fillStreet.play();

			// light up the map when street lamp is lit
			this.light(750, game.world.centerY-200);

			litStreetLamps++;

			if (litStreetLamps == 1)
				this.visionVisibility.animations.play('first', 5, false);
			else
				this.visionVisibility.animations.play('second', 5, false);

			filledText = game.add.text(this.player.x+50, this.player.y-50, 'This street lamp is now filled!',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(filledText).to( { y: this.player.y-100 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(filledText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			town2LampLit = true;
			console.log('This street lamp is now filled!\nGood job!'); 
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
	
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

		//If player runs out of lives
		if(lives <= 0){
			game.state.start('end');
			music.stop();
		}

	    // Player can only hold up to 5 
	    if(fireflies < 5 && full == false) {
  			game.physics.arcade.overlap(this.player, object, this.collectFirefly, null, this);  // Check player collision with fireflies
  		} 
  		// play sound when player lamp is full
  		if(playerFF == 5) {
  			fillLamp.play();
  			playerFF--;
  		}

  		// collision detection for portals
  		game.physics.arcade.overlap(this.player, this.portalToTown, this.town);

  		// collision detection for player 
  		game.physics.arcade.overlap(this.player, this.streetLamp, this.fillStreetLamp, null, this);
	    game.physics.arcade.collide(this.player, this.bottomGUI);
	    
	    game.physics.arcade.collide(this.player, bounds);

	    game.physics.arcade.overlap(this.player, enemies, this.health, null, this);
		game.physics.arcade.collide(enemies, this.firefly2, this.killEnemy, null, this);
  		game.physics.arcade.overlap(this.player, civ, this.civDialogue);

		// ----------------------------------------------------------------------

		// dat.gui stuff 
	    this.game.physics.arcade.collide(this.player, this.collisionLayer);

	    //Here we update the player variables with the adjusted settings in dat.gui
	    this.player.xSpeed = settings.moveSpeed;
	    this.player.ySpeed = settings.jumpSpeed;
	    //this.player.body.gravity.y = settings.gravity;

		// ----------------------------------------------------------------------

	    // Reset the players velocity (movement)
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

	    // Move back to tut by going left 
	    if(this.player.x < -this.player.width) {
	    	game.state.start('tutorial', true, false);
	    	faceRight = true;
	    	//music.stop();
	    }

  		// if( this.enemy.x ==1200)
	   //  	this.enemy.animations.play('left');
	   //  else if( this.enemy.x ==0)
	   //  	this.enemy.animations.play('right');
  		if( this.civilian.x == 1200)
	    	this.civilian.animations.play('left');
	    else if( this.civilian.x ==1000)
	    	this.civilian.animations.play('right');

	  //  console.log(this.enemy.body.velocity.x);
	    // attack enemies
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.A) && fireflies > 0) {
			full = false; 
	    	shootFF.play(); 
	    	fireflies--; 
			playerFF = fireflies; 

	    	if(right == true) {
				this.firefly2 = attack.create(this.player.x+65, this.player.centerY, 'fAssets', 'singleFirefly');
				// game.add.tween(object).to( {property that you want to modify}, time (1000 = 1 sec), copy, true for repeat)
				game.add.tween(this.firefly2).to( { x: this.player.x+450 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);

				// update fireflies
				if(playerFF == 0) {
					console.log('You ran out of fireflies. Try collecting more!'); 
					playerFF--;
				}

				this.firefliesCaught.text = fireflies+'/5 Fireflies Caught';	// update text
			} else {
				this.firefly2 = attack.create(this.player.x-65, this.player.centerY, 'fAssets', 'singleFirefly');
				game.add.tween(this.firefly2).to( { x: this.player.x-450 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);
				// update fireflies
				
				if(playerFF == 0) {
					console.log('You ran out of fireflies. Try collecting more!'); 
					playerFF--;
				}
				this.firefliesCaught.text = fireflies+'/5 Fireflies Caught';	// update text

			}
	    }

	    // Arrow keys to move player
	    if (cursors.left.isDown) {
	    	this.player.animations.play('left', 10, false);
	        this.player.body.velocity.x -= 500;	// Move to the left
	        left = true;
	        right = false;
	    }
	    else if (cursors.right.isDown) {
			this.player.animations.play('right', 10, false);
	        this.player.body.velocity.x += 500;  // Move to the right
	        right = true;
	        left = false;
	    } else {
	    	// stand still 
	    	this.player.animations.stop();
	    	if(left == true)
	    		this.player.frame = 'playerSprite0004';
	    	else 
	    		this.player.frame = 'playerSprite0001';
	    }
	    if (cursors.up.isDown) {
	    	this.player.body.velocity.y -= 500;	// Move up
	    }
	    if (cursors.down.isDown) {
	    	this.player.body.velocity.y += 500; // Move down
	    }

	},
	 render: function() {
	 	//game.debug.spriteInfo(this.enemy, 32, 32);
	 	//game.debug.body(this.spriteBounds); 
	 	//game.debug.body(this.spriteBoundsRight); 
	 	//game.debug.spriteInfo(this.player, 32, 32);
	 }
}