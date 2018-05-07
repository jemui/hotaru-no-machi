var playState = {
	create: function() {
		var background = game.add.sprite(0,0, 'assets', 'worldBackground');

		// Set up the bottom GUI 
		var bottomGUI = game.add.sprite(0, game.world.height-64, 'bottom');
		bottomGUI.scale.setTo(2,1);
		var playerLives = game.add.text(game.world.width-165, game.world.height-45, (lives+' lives left'),{font: '25px Advent Pro', fill: '#E5D6CE'});
		var fireFlies = game.add.text(20, game.world.height-45, (fireflies+' Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});

		var pauseButton =  game.add.button(game.world.width-32, game.world.height-32, 'pause', this.actionOnClick, this);
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		//PlayerSprites
		this.player = game.add.sprite(game.world.centerX-200, game.world.centerY+75, 'assets', 'playerSprite');
		this.player.anchor.set(0.5);
		game.physics.arcade.enable(this.player); // Enable physics on the player
		//this.player.collideWorldbounds = true;
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
	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

	    // Reset the players velocity (movement)
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

	    // Move to next state when player exits shop (move all the way to the right)
	    if(this.player.x > game.world.width + this.player.width)
	    	game.state.start('play');

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
	        this.player.body.velocity.x = -150;	// Move to the left
	    if (cursors.right.isDown) 
	        this.player.body.velocity.x = 150;  // Move to the right
	    if (cursors.up.isDown)
	    	this.player.body.velocity.y = -150;	// Move up
	    if (cursors.down.isDown) 
	    	this.player.body.velocity.y = +150; // Move down

	}	
}