var current = 0; 
var fireflies = 0;
var tutorialState = {
	create: function() {
		//console.log('tutorialState');
		game.stage.setBackgroundColor('#7F7772');

		// Set up the bottom GUI 
		var bottomGUI = game.add.sprite(0, game.world.height-64, 'bottom');
		bottomGUI.scale.setTo(2,1);
		var playerLives = game.add.text(game.world.width-165, game.world.height-45, (lives+' lives left'),{font: '25px Advent Pro', fill: '#E5D6CE'});
		var fireFlies = game.add.text(20, game.world.height-45, (fireflies+' Fireflies Caught'),{font: '25px Advent Pro', fill: '#E5D6CE'});

		//Player and Shopkeeper Sprites
		this.player = game.add.sprite(game.world.centerX-300, game.world.centerY-200, 'player');
	//	this.player  = game.add.group();
//		this.player.enableBody = true;
		game.physics.arcade.enable(this.player); // Enable physics on the player
		//this.player.body.allowGravity = false;
		//this.player.collideWorldbounds = true;
		// this.player.body.velocity.x = 0;

		this.shopkeeper = game.add.sprite(game.world.centerX+200, game.world.centerY-200, 'shopkeeper');

		var pauseButton =  game.add.button(game.world.width-32, game.world.height-32, 'pause', this.actionOnClick, this);
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);

		// Dialogue Box
		var dialogueBox = game.add.button(game.world.centerX, game.world.height-150, 'dialogueBox', this.dialogueOnClick, this);
		dialogueBox.anchor.set(0.5);
		//dialogueBox.alpha = 0.5;


		// array of dialogue
	

	},
	dialogueOnClick: function() {
		//var speech = game.cache.getJSON('speech'); 
		//convo = speech['1424791485315'];

		var speech = ['Hello.', 'Hello.\nYou can use the arrow keys to move around.','How are you feeling?', 'I have a big request to make of you.', 'I have a big request to make of you.\nYou see..', 'The town is *insert more dialogue here*']; 
		if(current > 0) {
			var dialogueBox = game.add.sprite(game.world.centerX, game.world.height-150, 'dialogueBox');
			dialogueBox.anchor.set(0.5);
			//dialogueBox.alpha = 0.5;
		}
		dialogue = game.add.text(game.world.centerX-475, game.world.height-200, speech[current], {font: '40px Advent Pro', fill: '#7F7772'}); 
		current++;

		if(current>speech.length) {
			console.log('No more dialogue left');
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

	update: function() {
	   // Read input from keyboard to move the player
	    cursors = game.input.keyboard.createCursorKeys();

	    // Reset the players velocity (movement)
	    this.player.body.velocity.x = 0;
	    this.player.body.velocity.y = 0;

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