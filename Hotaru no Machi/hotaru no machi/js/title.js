var titleState = {
	// goes to title state when the game is done loading
	create: function() {
		// set the background color 
		game.stage.setBackgroundColor('#403C38');

		var title = game.add.text(game.world.centerX/3, game.world.centerY/4, 'Hotaru no Machi', {font: '40px Advent Pro', fill: '#E5D9C9'});
		title.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
		var lineDec = game.add.text(game.world.centerX/3+35, game.world.centerY/4+15, '_____________________', {font: '40px Advent Pro', fill: '#E5D9C9'});
		lineDec.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

		//var startButton = game.add.sprite(game.world.center-100, game.world.centerY/3+75, 'start');
		var startButton = game.add.button(game.world.center-100, game.world.centerY/2, 'start', this.actionOnClick, this);
		startButton.onInputOver.add(this.over, this.startButton);
		startButton.onInputOut.add(this.out, this.startButton);

		var creditsButton = game.add.button(game.world.center-100, game.world.centerY/2+80, 'credits', this.actionOnClick2, this);
		creditsButton.onInputOver.add(this.over, this.creditsButton);
		creditsButton.onInputOut.add(this.out, this.creditsButton);

	},

	over: function(button) {
		//console.log('button over');
    	button.frame = 1;
	},

	out: function(button) {
   		//console.log('button out');
    	button.frame = 0;
	},
	// start button action
	actionOnClick: function() {
		game.state.start('tutorial'); //should add option to skip tutorial later
	},
	// Credits button action
	actionOnClick2: function() {
		console.log('To Be Implemented');
	},
	update: function() {
		// click on instructions to view the instructions
		// click on start to start the game
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR))
			game.state.start('play');
	},
//	start: function() {

//	}
};