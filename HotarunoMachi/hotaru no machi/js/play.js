var litStreetLamps = 0;
var left, right;
var playState = {
	create: function() {
    	game.world.setBounds(0, 0, 2400, 700); // set bound of the game world. (x, y, width, height). Source: Phaser Tutorial

		this.background = game.add.sprite(0, -764, 'fAssets', 'worldBackground');
		this.background.scale.setTo(2,2);
		//this.background = game.add.sprite(1200, -764, 'fAssets', 'worldBackground');
		//this.background.scale.setTo(2,2);

		// sound effects
		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');

		// Add Firefly object to screen
		object = game.add.group(); 
		object.enableBody = true; 

		// Bounds
		bounds = game.add.group(); 
		bounds.enableBody = true; 

		this.bound = bounds.create(0, game.world.height-64, 'bound'); //bottom bound
		this.bound.body.immovable = true; 
		this.bound.fixedToCamera = true;

		this.boundTop = bounds.create(0, game.world.centerY-115, 'bound');
		this.boundTop.body.immovable = true; 
		this.boundTop.fixedToCamera = true;

		// Add street lamp.
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 

		this.spawnStreetLamp();
		this.spawnFirefly(5);

		// Enemy group 
		enemies = game.add.group();
		enemies.enableBody = true;

		this.spawnEnemy(1);

		portal = game.add.group();
		this.portalToShop = portal.create(game.world.centerX+250, game.world.centerY, 'light');
		this.portalToShop.enableBody = true;

		//PlayerSprite
		this.player = game.add.sprite(1530, game.world.height-175, 'fAssets', 'playerSprite0001');
		this.player.anchor.set(0.5);
		this.player.animations.add('left', ['playerSprite0005','playerSprite0006'], 30, true);
		this.player.animations.add('right', ['playerSprite0002','playerSprite0003'], 30, true);

		game.physics.arcade.enable(this.player); // Enable physics on the player

		// visibility. Only GUI related elements should go after this
		this.visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000000');
		this.visionVisibility.fixedToCamera = true;

		this.visionVisibility.animations.add('first', ['gradient_000001', 'gradient_000002', 'gradient_000003', 'gradient_000004'], 30, true);
		this.visionVisibility.animations.add('second', ['gradient_000005', 'gradient_000006', 'gradient_000007', 'gradient_000008'], 30, true);

		// Set up the bottom GUI 
		var bottomGUI = game.add.sprite(0, game.world.height-64, 'bottom');
		bottomGUI.scale.setTo(2,2);
		bottomGUI.fixedToCamera = true;

		var heart = game.add.sprite(200, game.world.height-55, 'assets', 'heartIcon');
		heart.fixedToCamera = true;
		this.playerLives = game.add.text(218, game.world.height-45, lives,{font: '25px Advent Pro', fill: '#E5D6CE'});
		this.playerLives.fixedToCamera = true;

		this.firefliesCaught = game.add.text(20, game.world.height-45, (fireflies+' Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});
		this.firefliesCaught.fixedToCamera = true;

		// Pause button
		var pauseButton =  game.add.button(1168, game.world.height-32, 'pause', this.actionOnClick, this);
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
	spawnEnemy(n) {
		for(var i = 0; i < n; i++ ){
			this.enemy = enemies.create(game.rnd.integerInRange(0,1200), game.world.centerY+55, 'fAssets', 'enemySprite0001');
			//this.enemy.scale.x *= -1;
			game.add.tween(this.enemy).to( { x: game.rnd.integerInRange(0,1200) }, game.rnd.integerInRange(3000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);
		}
	},
	light: function(x,y) {
		this.streetLamp.animations.play('light');
		//var light = game.add.sprite(x-8,y, 'fAssets', 'streetLampLit');
		//var light = game.add.sprite(x,y, 'light');
	},
	spawnStreetLamp: function() {
		this.streetLamp = streetLampGroup.create(1850, game.world.centerY-180, 'fAssets', 'streetLampDark');
		//this.streetLamp.scale *= -1;
		this.streetLamp.contain = 0; 
		//this.streetLamp.n? + counter
		this.streetLamp.animations.add('light', ['streetLampLit'], 30, true);
	},

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'fAssets', 'firefly');
			game.add.tween(this.firefly).to( { x: game.rnd.integerInRange(0,game.world.centerX+400) }, game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(0,game.world.centerX+400), game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: game.world.centerY+95 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerY-75, 1500, Phaser.Easing.Linear.None, true);
		}
	},
	actionOnClick: function() {
		// Pause Menu
		var pauseMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'menu');
		pauseMenu.anchor.set(0.5);

		// Resume and Title Buttons
		var resumeButton = game.add.button(game.world.centerX, game.world.centerY-10, 'resume', this.resumeOnClick, this);
		resumeButton.anchor.set(0.5);
		resumeButton.onInputOver.add(this.over, this.resumeButton);
		resumeButton.onInputOut.add(this.out, this.resumeButton);
		//	resumeButton.alpha = 0;

		var returntoTitle = game.add.button(game.world.centerX, game.world.centerY+80, 'title', this.titleOnClick, this);
		returntoTitle.anchor.set(0.5);
		returntoTitle.onInputOver.add(this.over, this.returntoTitle);
		returntoTitle.onInputOut.add(this.out, this.returntoTitle);
	},

	resumeOnClick: function(){
		game.state.start('tutorial');
	},

	titleOnClick: function(){
		game.state.start('title');
	},

	over: function(button) {
    	button.frame = 1;
	},

	out: function(button) {
    	button.frame = 0;
	},

	health: function() {
		lives--;
		this.playerLives.text = lives;
	},

	killEnemy: function(player, enemy) {
		enemy.kill();
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
		this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
	},
	fillStreetLamp: function(player, streetLamp) {
		// Streetlamp can contain 10 fireflies. **TEMP IS 5 right now**
		if((fireflies > 0) && (this.streetLamp.contain < 5) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
			this.streetLamp.contain++;

			full = false;
			console.log('StreetLamp contains ' + this.streetLamp.contain + ' fireflies.');
			var temp = true;
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			console.log('You do not have any more fireflies.'); 
		}
		if(this.streetLamp.contain == 5 && temp == true) { //temp
			temp = false;
			fillStreet = game.add.audio('fillStreet');
			fillStreet.play();

			// light up the map when street lamp is lit
			this.light(750, game.world.centerY-200);
			this.visionVisibility.animations.play('first', 5, false);
			litStreetLamps++;
			filledText = game.add.text(this.player.x, this.player.y-50, 'This street lamp is now filled!',{font: '25px Advent Pro', fill: '#E5D6CE'});
			game.add.tween(filledText).to( { y: this.player.y-100 }, 1000, Phaser.Easing.Linear.None, true);

			console.log('This street lamp is now filled!\nGood job!'); 
		}
	},
	fadeFF: function() {
		this.firefly2.kill();
	},
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

	    // Player can only hold up to 5 
	    if(fireflies < 5 && full == false) {
  			game.physics.arcade.overlap(this.player, object, this.collectFirefly, null, this);  // Check player collision with fireflies
  		} 
  		// play sound when player lamp is full
  		if(playerFF == 5) {
  			fillLamp.play();
  			playerFF--;
  		}

  		// collision detection
  		
  		game.physics.arcade.overlap(this.player, portal, this.shop, null, this); //buggy
  		game.physics.arcade.overlap(this.player, this.streetLamp, this.fillStreetLamp, null, this);
  		game.physics.arcade.overlap(this.player, this.light, this.town, null, this);	// fix later
	    game.physics.arcade.collide(this.player, this.bottomGUI);
	    game.physics.arcade.collide(this.player, this.bound);
	    game.physics.arcade.collide(this.player, this.boundTop);
	    game.physics.arcade.collide(this.player, enemies);
		game.physics.arcade.collide(enemies, this.firefly2, this.killEnemy);

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

	    // Flip player sprite
	 /*   if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) && faceRight == true && !game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)) {
	        this.player.scale.x *= -1;
	        faceRight = false;
	    }
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && faceRight == false && !game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)) {
	        this.player.scale.x *= -1;
	        faceRight = true;
	    }*/

	    // attack enemies
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.A) && fireflies > 0) {
	    	fireflies--; 

	    	if(faceRight == true) {
				this.firefly2 = object.create(this.player.x+65, this.player.centerY, 'fAssets', 'firefly');
				game.add.tween(this.firefly2).to( { x: this.player.x+350 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);
			} else {
				this.firefly2 = object.create(this.player.x-65, this.player.centerY, 'fAssets', 'firefly');
				game.add.tween(this.firefly2).to( { x: this.player.x-350 }, 1000, Phaser.Easing.Linear.None, true);
				game.add.tween(this.firefly2).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
				game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeFF, this);
			}
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
	    if (cursors.up.isDown)
	    	this.player.body.velocity.y -= 500;	// Move up
	    if (cursors.down.isDown) 
	    	this.player.body.velocity.y += 500; // Move down



	},
	// render: function() {
	// 	game.debug.spriteInfo(this.player, 32, 32);
	// }
}