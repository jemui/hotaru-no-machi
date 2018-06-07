var litStreetLamps = 0;
var left, right;
var townVisited = 0; 
var townLampFill = 0;	// track if streetlamp in first town map is filled
var townLampLit = false;
var townEnemy = false;
var civDialogueCounter = 0;
//var town2LampFill = 0;  
// 30-32 gradient images to use. array of 4 street lamps. stores litStreetLamps 
// create animations in the states. animation played depends on # lit lamps and position in array

var playState = {
	create: function() {
    	game.world.setBounds(0, 0, 2400, 700); // set bound of the game world. (x, y, width, height). Source: Phaser Tutorial

		this.background = game.add.sprite(0, -64, 'fAssets', 'shopExterior');
		this.background = game.add.sprite(2400, -25, 'fAssets', 'townBackground');
		this.background.scale.x *= -1;

		// sound effects
		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');
		enemyDies = game.add.audio('enemyDies');
		//playerDies = game.add.audio('playerDies');
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



		if(townVisited < 1) {
			this.spawnStreetLamp();
			this.spawnFirefly(game.rnd.integerInRange(5,7));

			shopEntranceSignal = game.add.text(1440, game.world.centerY-210, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			shopEntranceSignal.alpha = 0;
	    	game.add.tween(shopEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
		
			fillInstruct = game.add.text(1850, game.world.centerY-220, "<F to Fill>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			fillInstruct.alpha = 0;
	    	game.add.tween(fillInstruct).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
		
			portalEntranceSignal = game.add.text(game.world.centerX+850, game.world.centerY-100, "<W to Enter>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
			portalEntranceSignal.alpha = 0;
	    	game.add.tween(portalEntranceSignal).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
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


	//	if (townEnemy == false)
		//	this.spawnEnemy(1);

		// Portals
		portal = game.add.group();
		portal.enableBody = true;
		//this.portalToShop = portal.create(game.world.centerX+250, game.world.centerY, 'light');
		this.portalToShop = portal.create(230, game.world.centerY+30, 'fAssets', 'portal');
		this.portalToShop.scale.set(0.5);
		this.portalToShop.alpha = 1;
		game.add.tween(this.portalToShop).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);


		this.portalToTown2 = portal.create(game.world.centerX+850, game.world.centerY-30, 'fAssets', 'portal');
		game.add.tween(this.portalToTown2).to( { alpha:0.3 }, 4000, Phaser.Easing.Linear.None, true, { alpha: 1}, 4000, Phaser.Easing.Linear.None, true);


		this.portalToTownLeft = portal.create(30, game.world.centerY+20, 'fAssets', 'portal');
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
		//PlayerSprite
		if (last == 'townLeft') {
			player = new Player(game, 150, game.world.height-175, 'fAssets', 'playerSprite0001', 150, game.world.height-175);

		//	player = game.add.sprite(150, game.world.height-175, 'fAssets', 'playerSprite0001');
		} else if( last == 'Shop') 
			player = new Player(game, 290, game.world.centerY+135, 'fAssets', 'playerSprite0001', 150, game.world.height-175);

			//player = game.add.sprite(150, game.world.height-175, 'fAssets', 'playerSprite0001');
		else if(last != 'town2') {
			player = new Player(game, 1530, game.world.height-175, 'fAssets', 'playerSprite0001', 150, game.world.height-175);

			//player = game.add.sprite(1530, game.world.height-175, 'fAssets', 'playerSprite0001');
		} else {
			player = new Player(game, 2160, game.world.height-175, 'fAssets', 'playerSprite0001', 150, game.world.height-175);

			//player = game.add.sprite(2160, game.world.height-175, 'fAssets', 'playerSprite0001');   

	    	left == true
	    	player.frame = 'playerSprite0004'; //not working

		}

		game.add.existing(player);


		townVisited++;
		last = 'Town'; 

		// player.enableBody = true;
		// player.anchor.set(0.5);
		// player.animations.add('left', ['playerSprite0005','playerSprite0006'], 30, true);
		// player.animations.add('right', ['playerSprite0002','playerSprite0003'], 30, true);

	//	game.physics.arcade.enable(player); // Enable physics on the player

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

		// if(litStreetLamps == 1) {
		// 	this.visionVisibility.animations.play('first');
		// } else if (litStreetLamps == 2) {
		// 	this.visionVisibility.animations.play('second');
		// }
	//	if(townLampLit == true && town2LampLit == true)
			
		// Firefly Respawner
		// set up looping event (delay, callback, context, arguments)
		timer = game.time.create();
		timer.loop(10500, function() { 
			//console.log('loop event at: ' + timer.ms);
			console.log(game.rnd.integerInRange(1, 10));
			if(game.rnd.integerInRange(1, 10)%3==0) 

				this.spawnFirefly(game.rnd.integerInRange(0,2));
		}, this);
		timer.start(); 

		statusBar();


	//	playerLives = game.add.text(218, game.world.height-45, lives,{font: '25px Advent Pro', fill: '#E5D6CE'});
	//	playerLives.fixedToCamera = true;

	//	this.firefliesCaught = game.add.text(20, game.world.height-45, (fireflies+'/5 Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});


		// Pause button
		var pauseButton =  game.add.button(1168, game.world.height-32, 'pause', pauseGame, this);
		pauseButton.fixedToCamera = true;
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

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


			this.civilian.scale.x *= -1;
			civText = game.add.text(x-250, y-55, '<Press Space to Interact with Me!>',{font: '25px Advent Pro', fill: '#E5D6CE'});
		//	game.add.tween(this.civText).to( { x: 1200 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);
			game.add.tween(civText).to( { alpha: 0.5 }, game.rnd.integerInRange(5000, 7000), Phaser.Easing.Linear.None, true, {alpha: 1}, game.rnd.integerInRange(5000,7000), Phaser.Easing.Linear.None, true);

		}
	},
	spawnEnemy: function(n) {
		for(var i = 0; i < n; i++ ){
			this.enemy = enemies.create(1200, game.world.centerY+55, 'fAssets', 'enemySprite0001');

			//this.enemy = enemies.create(game.rnd.integerInRange(100,600), game.world.centerY+55, 'fAssets', 'enemySprite0001');
			//this.enemy.scale.x *= -1;
			this.enemy.animations.add('right',['enemySprite0002', 'enemySprite0003'], 5, true);
			this.enemy.animations.add('left',['enemySprite0005', 'enemySprite0006'], 5, true);
		//console.log(this.enemy.body.velocity.x);
			game.add.tween(this.enemy).to( { x: 350 }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);

			//game.add.tween(this.enemy).to( { x: game.rnd.integerInRange(0,1200) }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);

		}
	},
	light: function(x,y) {
		this.streetLamp.animations.play('light');
	},
	spawnStreetLamp: function() {
		this.streetLamp = streetLampGroup.create(1750, game.world.centerY-140, 'fAssets', 'streetLampDark');
		//this.streetLamp.scale *= -1;
		//this.streetLamp.contain = 0; 
		//this.streetLamp.n? + counter
		this.streetLamp.animations.add('light', ['streetLampLit'], 30, true);
		if(townLampLit == true) {
			full = true;
			this.streetLamp.animations.play('light');
		}
		//  else {
		// 	full = false; 
		// }
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

			fillText = game.add.text(player.x-150, player.y-150, 'Your lantern is now full. Try storing fireflies in street lamps!',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: player.y-150 }, 3500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 3500, Phaser.Easing.Linear.None, true);

			console.log('Your lantern is now full. Try storing fireflies in street lamps!'); 
		}
		statusBar();  //update the inventory
	},

	fillStreetLamp: function(player, streetLamp) {
		// Streetlamp can contain 10 fireflies. **TEMP IS 5 right now**
		if((fireflies > 0) && (townLampFill < 5) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			statusBar();
			//this.firefliesCaught.text = fireflies+'/'+lanternSize;	// update text
			townLampFill++;

			full = false;

			fillText = game.add.text(player.x+50, player.y-100, 'StreetLamp contains ' + townLampFill + '/5 fireflies.',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(fillText).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(fillText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			console.log('StreetLamp contains ' + townLampFill + ' fireflies.');
			var temp = true;
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			noFirefliesLeft = game.add.text(player.x+50, player.y-100, 'You do not have any more fireflies.',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(noFirefliesLeft).to( { y: player.y-150 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(noFirefliesLeft).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			console.log('You do not have any more fireflies.'); 
		}

		if(townLampFill == 5 && temp == true) { //temp
			temp = false;
			fillStreet = game.add.audio('fillStreet');
			fillStreet.play();

			// light up the map when street lamp is lit
			this.light(750, game.world.centerY-200);

			litStreetLamps++;

			if (litStreetLamps == 1)
				this.visionVisibility.animations.play('first', 5, false);
			else if(litStreetLamps == 2)
				this.visionVisibility.animations.play('second', 5, false);

			filledText = game.add.text(player.x+50, player.y-50, 'This street lamp is now filled!',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(filledText).to( { y: player.y-100 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(filledText).to( { alpha: 0 }, 2500, Phaser.Easing.Linear.None, true);

			townLampLit = true;
			console.log('This street lamp is now filled!\nGood job!'); 
		}
	},

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
	    
	    game.physics.arcade.overlap(player, enemies, health, null, this);
	    game.physics.arcade.collide(player, bounds);
		game.physics.arcade.collide(enemies, this.firefly2, this.killEnemy, null, this);

		// ----------------------------------------------------------------------

		// dat.gui stuff 
	    this.game.physics.arcade.collide(player, this.collisionLayer);

	    //Here we update the player variables with the adjusted settings in dat.gui
	    player.xSpeed = settings.moveSpeed;
	    player.ySpeed = settings.jumpSpeed;
	    //player.body.gravity.y = settings.gravity;

		// ----------------------------------------------------------------------

	    // Reset the players velocity (movement)
	    player.body.velocity.x = 0;
	    player.body.velocity.y = 0;

	    // Move back to tut by going left 
	    if(player.x < -player.width) {
	    	game.state.start('tutorial', true, false);
	    	faceRight = true;
	    	//music.stop();
	    }

	   	/******* ENEMY 8*********************888 
  		if( this.enemy.x ==1200)
	    	this.enemy.animations.play('left');
	    else if( this.enemy.x == 350)
	    	this.enemy.animations.play('right');
*/
	  //  console.log(this.enemy.body.velocity.x);
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
					console.log('You ran out of fireflies. Try collecting more!'); 
					playerFF--;
				}

				this.firefliesCaught.text = fireflies+'/'+lanternSize;	// update text
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
				this.firefliesCaught.text = fireflies+'/'+lanternSize;	// update text

			}
	    }

	},
	 render: function() {
	 	//game.debug.spriteInfo(this.enemy, 32, 32);
	 //	game.debug.body(this.civilian); 
	 	//game.debug.body(this.spriteBoundsRight); 
	 	game.debug.spriteInfo(player, 32, 32);
	 }
}