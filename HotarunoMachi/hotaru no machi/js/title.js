var titleState = {
	// goes to title state when the game is done loading
	create: function() {
		// set the background color 
		game.stage.setBackgroundColor('#403C38');

		var title = game.add.text(game.world.centerX/3, game.world.centerY/4, 'Hotaru no Machi', {font: '40px Advent Pro', fill: '#E5D9C9'});
		title.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
		var lineDec = game.add.text(game.world.centerX/3+35, game.world.centerY/4+15, '_____________________', {font: '40px Advent Pro', fill: '#E5D9C9'});
		lineDec.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

		var startButton = game.add.button(game.world.center-100, game.world.centerY/2, 'start', this.actionOnClick, this);
		startButton.onInputOver.add(this.over, this.startButton);
		startButton.onInputOut.add(this.out, this.startButton);

		var creditsButton = game.add.button(game.world.center-100, game.world.centerY/2+80, 'credits', this.actionOnClick2, this);
		creditsButton.onInputOver.add(this.over, this.creditsButton);
		creditsButton.onInputOut.add(this.out, this.creditsButton);

		// streetlamp
		this.streetLamp = game.add.sprite(game.world.width-300, game.world.height-250, 'fAssets', 'streetLampDark');

		//center is 600 x 350. Start next to machi and fly to bottom right corner  
		firefly = game.add.sprite(game.world.centerX, game.world.centerY, 'fAssets', 'firefly');
		firefly.scale.x *= -1;
		game.add.tween(firefly).to( { x: game.world.centerX+360 }, 5500, Phaser.Easing.Linear.None, true);
		game.add.tween(firefly).to( { y: game.world.centerY+80 }, 4500, Phaser.Easing.Linear.None, true);

		// setup difficulty timer
		this.timer = game.time.create(false);	// .create(autoDestroy)
		this.timer.loop(5500, this.light, this);
		this.timer.start();

		this.visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000014');
		this.visionVisibility.animations.add('light', ['gradient_000015','gradient_000016'], 5, true);
	},
	light: function() {
		streetLampLit = game.add.sprite(game.world.width-300, game.world.height-250, 'fAssets', 'streetLampLit');
		this.visionVisibility.play('light');
		this.streetLamp.kill();
		this.timer.stop();
	},

	over: function(button) {
    	button.frame = 1;
	},

	out: function(button) {
    	button.frame = 0;
	},
	// start button action
	actionOnClick: function() {
		game.state.start('tutorial'); //should add option to skip tutorial later
		music = game.add.audio('bgm');
		music.loopFull(0.3);
		music.play();
	},
	// Credits button action
	actionOnClick2: function() {
		console.log('To Be Implemented');
	},
	update: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.P)) {
			game.state.start('play');
		}
	},
};