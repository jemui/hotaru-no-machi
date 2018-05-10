var faceRight = true;
var playState = {
	create: function() {
    	//game.world.setBounds(0, 650, 2400, 700); // set bound of the game world. Source: Phaser Tutorial
		//var background = game.add.sprite(0, -64, 'assets', 'worldBackground');
		var background = game.add.sprite(0, -764, 'assets', 'worldBackground');
		background.scale.setTo(2,2);
		// Set up the bottom GUI 
		var bottomGUI = game.add.sprite(0, game.world.height-64, 'bottom');
		bottomGUI.scale.setTo(2,2);
		bottomGUI.fixedToCamera = true;
		var heart = game.add.sprite(200, game.world.height-55, 'assets', 'heartIcon');
		heart.fixedToCamera = true;
		var playerLives = game.add.text(218, game.world.height-45, (lives),{font: '25px Advent Pro', fill: '#E5D6CE'});
		playerLives.fixedToCamera = true;
		this.firefliesCaught = game.add.text(20, game.world.height-45, (fireflies+' Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});

		this.firefliesCaught.fixedToCamera = true;



		var pauseButton =  game.add.button(game.world.width-32, game.world.height-32, 'pause', this.actionOnClick, this);
		pauseButton.fixedToCamera = true;
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		// Add street lamp.
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 
		this.streetLamp = streetLampGroup.create(game.world.centerX+100, game.world.centerY+25, 'assets', 'streetLamp');
		this.streetLamp.contain = 0; 


		//PlayerSprite
	//	this.player = game.add.sprite(game.world.centerX-200, game.world.height+500, 'assets', 'playerSprite');
		this.player = game.add.sprite(game.world.centerX-200, game.world.height-175, 'assets', 'playerSprite');
		this.player.anchor.set(0.5);
		game.physics.arcade.enable(this.player); // Enable physics on the player
		//this.player.collideWorldbounds = true;

		game.camera.follow(this.player);	// Game camera follows player.
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
	fillStreetLamp: function(player, streetLamp) {
		//Currently deposits one firefly as long as there's one. isDown to keep filling? 
		// Streetlamp can contain 10 fireflies. **TEMP IS 1 RN**
		if((fireflies > 0) && (this.streetLamp.contain < 1) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			depositFF.play();
			fireflies--;	// add to lantern
			this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
			this.streetLamp.contain++;
			console.log('StreetLamp contains ' + this.streetLamp.contain + ' fireflies.');
			var temp = true;
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			console.log('You do not have any more fireflies.'); 
		}
		if(this.streetLamp.contain == 1 && temp == true) { //temp
			temp = false;
			console.log('This street lamp is now filled!\nGood job!'); 
		}
	},
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();
	    game.physics.arcade.collide(this.player, this.bottomGUI);
	    // Reset the players velocity (movement)
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

	    if(fireflies < 5) {
  			game.physics.arcade.overlap(this.player, this.firefly, this.collectFirefly, null, this);  // Check player collision with fireflies
  		} else {
  			console.log('Your lantern is full. Try storing fireflies in street lamps!'); 
  		}
  		if(playerFF == 5) {
  			fillLamp.play();
  			playerFF--;
  		}
  		game.physics.arcade.overlap(this.player, this.streetLamp, this.fillStreetLamp, null, this);

	    // Move to next state when player exits shop (move all the way to the left)
	    if(this.player.x < -this.player.width) {
	    	game.state.start('tutorial');
	    	music.stop();
	    	this.player.x = game.world.width-128; //dpesn't work for now. use global var
	    	faceRight = true;
	    }

	    // Flip player sprite
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) && faceRight == true) {
	        this.player.scale.x *= -1;
	        faceRight = false;
	    }
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) && faceRight == false) {
	        this.player.scale.x *= -1;
	        faceRight = true;
	    }

	    // Arrow keys to move player
	    if (cursors.left.isDown) 
	        this.player.body.velocity.x -= 500;	// Move to the left
	    if (cursors.right.isDown) 
	        this.player.body.velocity.x += 500;  // Move to the right
	    if (cursors.up.isDown)
	    	this.player.body.velocity.y -= 150;	// Move up
	    if (cursors.down.isDown) 
	    	this.player.body.velocity.y += 150; // Move down

	}	
}