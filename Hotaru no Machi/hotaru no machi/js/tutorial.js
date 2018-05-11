var current = 0;   // current dialogue
var fireflies = 0;  // number of fireflies the player has
var playerFF = 0; // for console.log
var faceRight = true;
var full = false; 
var tutSpawned = false; // tutorial spawned firefly

var tutorialState = {
	create: function() {
		var background = game.add.sprite(0,0, 'assets', 'shopBackground');

		music = game.add.audio('bgm');
		music.loopFull(0.3);
		//music.play();

		collectFF = game.add.audio('hitFF');
		fillLamp = game.add.audio('fillLamp');
		depositFF = game.add.audio('depositFF');

		//game.world.setBounds(0,0,1200,634);

		// Add Firefly object to screen
		object = game.add.group(); 
		object.enableBody = true; 

		//this.spawnFirefly(5);

		this.dialogue = game.add.text(50, game.world.height-155, "Welcome! <Hit the space bar for more text>", {font: '38px Advent Pro', fill: '#FFEDE5'}); 
		this.dialogue.alpha = 0;
    	game.add.tween(this.dialogue).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);


		objects = game.add.group(); 
		objects.enableBody = true; 
		// Set up the bottom GUI 
		this.bottomGUI = objects.create(0, game.world.height-64, 'bottom');
		this.bottomGUI.body.immovable = true; 

		this.bound = objects.create(0, game.world.height-165, 'bound');
		this.bound.body.immovable = true; 

		this.boundTop = objects.create(0, game.world.centerY-100, 'bound');
		this.boundTop.body.immovable = true; 

		this.bottomGUI.scale.setTo(2,1);
		var heart = game.add.sprite(200, game.world.height-55, 'assets', 'heartIcon');
		var playerLives = game.add.text(218, game.world.height-45, (lives),{font: '25px Advent Pro', fill: '#E5D6CE'});
		this.firefliesCaught = game.add.text(20, game.world.height-45, (fireflies+' Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});

		var pauseButton =  game.add.button(game.world.width-32, game.world.height-32, 'pause', this.actionOnClick, this);
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		this.light(game.world.width-100, game.world.height-350);
		this.light(game.world.width-100, game.world.height-350);

		this.player = game.add.sprite(game.world.centerX-200, game.world.centerY+75, 'assets', 'playerSprite');
		this.player.anchor.set(0.5);
		game.physics.arcade.enable(this.player); // Enable physics on the player
//	this.player.collideWorldbounds = true;
		//var visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000000');
	},
	light: function(x,y) {
		var light = game.add.sprite(x,y, 'light');
	},
	dialogueOnClick: function() {
		// Array of dialogue
		var speech = ['Welcome! You must be confused after what happened. Let me help refresh\nyour memory.', 'You can use the arrow keys to move around.', 'I have a big request to make of you.', //3
						'I have a big request to make of you.\nYou see..', 'The town has lost its source of power.', //2
						'To make the town bright again, we need to fill up all the street lamps with a\npower source.','That power source would be the fireflies scattered all around town.', //2
						'Here is a lantern that can hold up to 5 fireflies.', 'Here is a lantern that can hold up to 5 fireflies.\nYou just need to walk up to them to collect it.', //2
						'Look! One appears to have flown inside the shop!\nTry collecting it!', 'Nice! You caught your first firefly! If you come across any streetlamps\nin town,press F to fill it up.', //2
						'10 (5 is temp right now) fireflies are needed to completely fill a street lamp up!', 'For every street lamp filled, your field of vision will expand as the town\ngets brighter.',
						'Move towards the light (go right) to exit to the town.\nFeel free to drop by our shop for more supplies! Good luck!']; 

		// current = 10 starts the collection tut
		if(current < speech.length) 
	   		this.dialogue.text = speech[current];
		 else 
			console.log('No more dialogue left');
		
		current++;
		
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

	spawnFirefly: function(n) {
		for(var i = 0; i < n; i++ ){
			this.firefly = object.create(game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'assets', 'firefly');
			game.add.tween(this.firefly).to( { x: game.world.centerX+400 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerX+300, 1500, Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: game.world.centerY+95 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerY-75, 1500, Phaser.Easing.Linear.None, true);
		}
	},

	resumeOnClick: function(){
		music.stop();
		game.state.start('tutorial');	// Update to just remove the menu 
		//pauseMenu.alpha = 0;
		//this.pauseMenu.visible =! pauseMenu.visible;
		//this.resumeButton.visible =! resumeButton.visible;
	},
	titleOnClick: function(){
		music.stop();
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
		// Streetlamp can contain 10 fireflies
		if((fireflies > 0) && (this.streetLamp.contain < 10) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			full = false;
			this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
			this.streetLamp.contain++;
			console.log('StreetLamp contains ' + this.streetLamp.contain + ' fireflies.');
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			console.log('You do not have any more fireflies.'); 
		}
		if(this.streetLamp.contain == 10) {
			console.log('This street lamp is now filled!\n Good job!'); 
		}
	},
	town: function() {
		console.log('town!');
		game.state.start('play');
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
  		game.physics.arcade.overlap(this.player, this.streetLamp, this.fillStreetLamp, null, this);
  		game.physics.arcade.overlap(this.player, this.light, this.town, null, this);	// fix later
	    game.physics.arcade.collide(this.player, this.bottomGUI);
	    game.physics.arcade.collide(this.player, this.bound);
	    game.physics.arcade.collide(this.player, this.boundTop);

	    // Reset the players velocity (movement)
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

	    // Move to next state when player exits shop (move all the way to the right)
	    if(this.player.x > game.world.width + this.player.width)
	    	game.state.start('play');

	    // Flip player sprite
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) && faceRight == true && !game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)) {
	        this.player.scale.x *= -1;
	        faceRight = false;
	    }
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && faceRight == false && !game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)) {
	        this.player.scale.x *= -1;
	        faceRight = true;
	    }

	    if(current == 9 && tutSpawned == false) {
	    	tutSpawned = true; 
			this.firefly = object.create(1264, game.world.centerY, 'assets', 'firefly');
			game.add.tween(this.firefly).to( { x: game.world.centerX+300 }, 2500, Phaser.Easing.Linear.None, true);
			game.add.tween(this.firefly).to( { y: game.world.centerY+75 }, 5500, Phaser.Easing.Linear.None, true, game.world.centerY+65, 5500, Phaser.Easing.Linear.None, true);
	    }

	    if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
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
	    if (cursors.left.isDown) 
	        this.player.body.velocity.x -= 500;	// Move to the left
	    if (cursors.right.isDown) 
	        this.player.body.velocity.x += 500;  // Move to the right
	    if (cursors.up.isDown)
	    	this.player.body.velocity.y -= 500;	// Move up
	    if (cursors.down.isDown) 
	    	this.player.body.velocity.y += 500; // Move down
	},
/*render: function() {
	game.debug.body(this.player);
	//game.debug.body(this.firefly);
	//console.log(this.player.y);
},*/
	
}