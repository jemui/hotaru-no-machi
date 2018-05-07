var current = 0; 
var fireflies = 0;
var faceRight = true;
var tutorialState = {
	create: function() {
		var background = game.add.sprite(0,0, 'assets', 'shopBackground');

		// Set up the bottom GUI 
		var bottomGUI = game.add.sprite(0, game.world.height-64, 'bottom');
		bottomGUI.scale.setTo(2,1);
		var playerLives = game.add.text(game.world.width-165, game.world.height-45, (lives+' lives left'),{font: '25px Advent Pro', fill: '#E5D6CE'});
		this.firefliesCaught = game.add.text(20, game.world.height-45, (fireflies+' Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});

		// Add Firefly to screen
		fireflyGroup = game.add.group(); 
		fireflyGroup.enableBody = true; 

		// Add street lamp. **TO BE MOVED TO PLAY STATE** Might need prefab for streetlamp to keep track of fill
		streetLampGroup = game.add.group();
		streetLampGroup.enableBody = true; 
		this.streetLamp = streetLampGroup.create(game.world.centerX+100, game.world.centerY-75, 'assets', 'streetLamp');
		this.streetLamp.contain = 0; 

		this.firefly = fireflyGroup.create(game.world.centerX+300, game.world.centerY+75, 'assets', 'firefly');
		game.add.tween(this.firefly).to( { x: game.world.centerX+400 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerX+300, 1500, Phaser.Easing.Linear.None, true);
		game.add.tween(this.firefly).to( { y: game.world.centerY+95 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerY-75, 1500, Phaser.Easing.Linear.None, true);


		//Player
		this.player = game.add.sprite(game.world.centerX-200, game.world.centerY+75, 'assets', 'playerSprite');
		this.player.anchor.set(0.5);
		this.player.enableBody = true;
		game.physics.arcade.enable(this.player); // Enable physics on the player
		//this.player.collideWorldbounds = true;

		this.dialogue = game.add.text(50, game.world.height-150, "Hello! <Hit the space bar for more text>", {font: '40px Advent Pro', fill: '#FFEDE5'}); 
		this.dialogue.alpha = 0;
    	game.add.tween(this.dialogue).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true);

		var pauseButton =  game.add.button(game.world.width-32, game.world.height-32, 'pause', this.actionOnClick, this);
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);
	},

	dialogueOnClick: function() {
		// Array of dialogue
		var speech = ['Hello!\nYou can use the arrow keys to move around.', 'I have a big request to make of you.', 'I have a big request to make of you.\nYou see..', 'The town is *insert more dialogue here*']; 
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

	resumeOnClick: function(){
		game.state.start('tutorial');	// Update to just remove the menu 
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
	collectFirefly: function(player, firefly) {
		firefly.kill();

		fireflies++;	// add to lantern
		this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
	},
	fillStreetLamp: function(player, streetLamp) {
		//Currently deposits one firefly as long as there's one. isDown to keep filling? 
		// Streetlamp can contain 10 fireflies
		if((fireflies > 0) && (this.streetLamp.contain < 10) && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			fireflies--;	// add to lantern
			this.firefliesCaught.text = fireflies+' Fireflies Caught';	// update text
			this.streetLamp.contain++;
			console.log('StreetLamp contains ' + this.streetLamp.contain + ' fireflies.');
		} 
		else if(fireflies == 0 && game.input.keyboard.justPressed(Phaser.Keyboard.F)) {
			console.log('You do not have any more fireflies.'); 
		}
	},


	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

  		game.physics.arcade.overlap(this.player, this.firefly, this.collectFirefly, null, this);  // Check player collision with fireflies
  		game.physics.arcade.overlap(this.player, this.streetLamp, this.fillStreetLamp, null, this);

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
	    if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
	    	this.dialogueOnClick();
	    }

	    // Arrow keys to move player
	    if (cursors.left.isDown) 
	        this.player.body.velocity.x = -500;	// Move to the left
	    if (cursors.right.isDown) 
	        this.player.body.velocity.x = 500;  // Move to the right
	    if (cursors.up.isDown)
	    	this.player.body.velocity.y = -150;	// Move up
	    if (cursors.down.isDown) 
	    	this.player.body.velocity.y = +150; // Move down
	},

	
}