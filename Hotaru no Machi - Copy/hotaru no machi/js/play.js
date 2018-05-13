//var faceRight = true;
//var full = false; 
//var playerFF = 0;
var playState = {
	create: function() {
    	game.world.setBounds(0, 0, 2400, 700); // set bound of the game world. (x, y, width, height). Source: Phaser Tutorial
		//var background = game.add.sprite(0, -64, 'assets', 'worldBackground');
		//this.background = game.add.sprite(0, -764, 'assets', 'worldBackground');
		this.background = game.add.sprite(0, -764, 'assets', 'worldBackground');
		this.background.scale.setTo(2,2);
		this.background = game.add.sprite(1200, -764, 'assets', 'worldBackground');
		this.background.scale.setTo(2,2);

		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');

		// Add Firefly object to screen
		object = game.add.group(); 
		object.enableBody = true; 

		bounds = game.add.group(); 
		bounds.enableBody = true; 

		this.bound = bounds.create(0, game.world.height-64, 'bound'); //bottom bound
		this.bound.body.immovable = true; 
		this.bound.fixedToCamera = true;

		this.boundTop = bounds.create(0, game.world.centerY, 'bound');
		this.boundTop.body.immovable = true; 
		this.boundTop.fixedToCamera = true;

		// Add street lamp.
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 

		this.spawnStreetLamp();
		//this.streetLamp = streetLampGroup.create(game.world.centerX+100, game.world.centerY+15, 'assets', 'streetLamp');
		//this.streetLamp.contain = 0; 

		//game.camera.focusOnXY(200, 500);
		this.spawnFirefly(5);

		// Enemy group 
		enemies = game.add.group();
		enemies.enableBody = true;

		this.spawnEnemy(1);

		//PlayerSprite
	//	this.player = game.add.sprite(game.world.centerX-200, game.world.height+500, 'assets', 'playerSprite');
		this.player = game.add.sprite(500, game.world.height-175, 'assets', 'playerSprite');
		this.player.anchor.set(0.5);
		game.physics.arcade.enable(this.player); // Enable physics on the player
		//this.player.collideWorldbounds = true;


		// visibility. Only GUI related elements should go after this
		this.visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000000');
		this.visionVisibility.fixedToCamera = true;


	//	var visionVisibility2 = game.add.sprite(0,0, 'vision', 'gradient_000000');
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

		//var visionVisibility = game.add.sprite(game.world.centerX, game.world.centerY, 'vision', 'gradient_000000');

		var pauseButton =  game.add.button(1168, game.world.height-32, 'pause', this.actionOnClick, this);
		pauseButton.fixedToCamera = true;
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);


		game.camera.follow(this.player);	// Game camera follows player.
	},
	spawnEnemy(n) {
		for(var i = 0; i < n; i++ ){
			this.enemy = enemies.create(game.rnd.integerInRange(game.world.centerX,game.width-64), game.world.height-195, 'assets', 'enemySprite');
			this.enemy.scale.x *= -1;
			game.add.tween(this.enemy).to( { x: game.rnd.integerInRange(game.world.centerX,game.width-64) }, game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(2000,5000), Phaser.Easing.Linear.None, true);
		}
	},
	light: function(x,y) {
		var light = game.add.sprite(x,y, 'light');
	},
	spawnStreetLamp: function() {
		this.streetLamp = streetLampGroup.create(700, game.world.centerY+15, 'assets', 'streetLamp');
		this.streetLamp.contain = 0; 
		/*for(var i = 0; i < 3; i++ ){
			this.streetLamp = streetLampGroup.create(game.rnd.integerInRange(0,game.width-64), game.world.centerY+15, 'assets', 'streetLamp');
			this.streetLamp.contain = 0; 
		}*/
	},

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'assets', 'firefly');
			game.add.tween(this.firefly).to( { x: game.rnd.integerInRange(0,game.world.centerX+400) }, game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true, game.rnd.integerInRange(0,game.world.centerX+400), game.rnd.integerInRange(2000,10000), Phaser.Easing.Linear.None, true);
			//game.add.tween(this.firefly).to( { x: game.world.centerX+400 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerX+300, 1500, Phaser.Easing.Linear.None, true);
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
		//pauseMenu.alpha = 0;
		//this.pauseMenu.visible =! pauseMenu.visible;
		//this.resumeButton.visible =! resumeButton.visible;
	},

	titleOnClick: function(){
		game.state.start('title');
	},

	over: function(button) {
		//console.log('button over');
    	button.frame = 1;
	},

	out: function(button) {
   		//console.log('button out');
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
		//console.log(playerFF);
		this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
	},
	fillStreetLamp: function(player, streetLamp) {
		//Currently deposits one firefly as long as there's one. isDown to keep filling? 
		// Streetlamp can contain 10 fireflies. **TEMP IS 5 RN**
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
			this.light(700, game.world.centerY+15);
			this.visionVisibility.animations.play('first', 5, false);
			console.log('This street lamp is now filled!\nGood job!'); 
		}
	},
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

	    // Player can only hold up to 5 
	    if(fireflies < 5 && full == false) {
  			game.physics.arcade.overlap(this.player, object, this.collectFirefly, null, this);  // Check player collision with fireflies
  			//console.log('fireflies: ' + fireflies); 
	 	//   console.log('full: ' + full); 
  		} 

  		if(playerFF == 5) {
  			fillLamp.play();
  			playerFF--;
  		}
  		// collision detection
  		game.physics.arcade.overlap(this.player, this.streetLamp, this.fillStreetLamp, null, this);
  		game.physics.arcade.overlap(this.player, this.light, this.town, null, this);	// fix later
	    game.physics.arcade.collide(this.player, this.bottomGUI);
	    game.physics.arcade.collide(this.player, this.bound);
	    game.physics.arcade.collide(this.player, this.boundTop);
	    game.physics.arcade.collide(this.player, enemies);
	   // game.physics.arcade.collide(this.player, enemies, this.health);
		game.physics.arcade.collide(enemies, this.firefly2, this.killEnemy);
	    // Reset the players velocity (movement)
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

	    // Move back to tut by going left 
	    if(this.player.x < -this.player.width)
	    	game.state.start('tutorial', false, false);

	    // Flip player sprite
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) && faceRight == true && !game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)) {
	        this.player.scale.x *= -1;
	        faceRight = false;
	    }
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && faceRight == false && !game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)) {
	        this.player.scale.x *= -1;
	        faceRight = true;
	    }

	    // attack enemies
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.A) && fireflies > 0) {
	    	fireflies--; 

			this.firefly2 = object.create(this.player.x+65, this.player.centerY, 'assets', 'firefly');
			game.add.tween(this.firefly2).to( { x: this.player.x+350 }, 1000, Phaser.Easing.Linear.None, true);
			//game.physics.arcade.collide(enemies, this.firefly, this.killEnemy);

			//	this.firefly.kill();
		//		game.add.tween(this.firefly).to( { x: this.player.centerX+50 }, 1500, Phaser.Easing.Linear.None, false, this.player.centerX+150, 1500, Phaser.Easing.Linear.None, false );
		//	}
		/*else {
				this.firefly = object.create(this.player.x-65, this.player.centerY, 'assets', 'firefly');
				game.add.tween(this.firefly).to( { x: this.player.centerY-50 }, 1500, Phaser.Easing.Linear.None, true);
			}*/
			//this.firefly.kill();
	    }

	    // Arrow keys to move player
	    if (cursors.left.isDown) 
	        this.player.body.velocity.x -= 500;	// Move to the left
	    if (cursors.right.isDown) {
	        this.player.body.velocity.x += 500;  // Move to the right
	      //  if(this.background.x >= -1200)
	        	//this.background.x -=10;
	    }
	    if (cursors.up.isDown)
	    	this.player.body.velocity.y -= 500;	// Move up
	    if (cursors.down.isDown) 
	    	this.player.body.velocity.y += 500; // Move down
	},
	render: function() {
		//game.debug.body(this.player);
		//game.debug.cameraInfo(game.camera, 32, 32);
		//  game.debug.spriteInfo(this.player, 32, 500);

	//console.log(this.player.y);
},
}