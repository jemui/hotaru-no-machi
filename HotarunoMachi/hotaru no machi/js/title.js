var returnedToTitle = 0;
var titleState = {
	// goes to title state when the game is done loading
	create: function() {
		// set the background color 
		//game.stage.setBackgroundColor('#403C38');

		//reset global variables upon returning to title
		if(returnedToTitle > 0) {
			resetVar();
			// lives = 5;
			// playerFF = 0;
			// fireflies = 0;
			// timesVisited = 0;
			// townVisited = 0;
			// townLampLit = false;
			// townLampFill = 0;
			// litStreetLamps = 0;
			// tutSpawned = false;
			// current = 0;
			// full = false; 
			// lanternSize = 5;
		 // 	purificationMilk = 0;
			// healthJuice = 0;
			// proteinShake = 0;
			// purifiedLeft = false; 
		}
		returnedToTitle++;
		spashScreen = game.add.sprite(0,0, 'splashScreen');

		var startButton = game.add.button(155, game.world.centerY/2+160, 'start', this.actionOnClick, this);
		startButton.onInputOver.add(this.over, this.startButton);
		startButton.onInputOut.add(this.out, this.startButton);

		var creditsButton = game.add.button(155, game.world.centerY/2+240, 'credits', this.actionOnClick2, this);
		creditsButton.onInputOver.add(this.over, this.creditsButton);
		creditsButton.onInputOut.add(this.out, this.creditsButton);

		// streetlamp
		this.streetLamp = game.add.sprite(game.world.centerX, game.world.height-450, 'fAssets', 'streetLampDark');

		//center is 600 x 350. Start next to machi and fly to bottom right corner  
		firefly = game.add.sprite(game.world.centerX-175, game.world.centerY-175, 'fAssets', 'singleFirefly');
		firefly.scale.x *= -1;
		game.add.tween(firefly).to( { x: game.world.centerX+50 }, 5500, Phaser.Easing.Linear.None, true);
		game.add.tween(firefly).to( { y: game.world.centerY-100 }, 4500, Phaser.Easing.Linear.None, true);

		// firefly cluster to decorate the title screen 
		groupFirefly =  game.add.sprite(100, game.world.centerY+150, 'fAssets', 'groupFirefly');
	    game.add.tween(groupFirefly).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, { alpha: 0.3 }, 1500, Phaser.Easing.Linear.None, true);
		game.add.tween(groupFirefly).to( { x: 200 }, 25500, Phaser.Easing.Linear.None, true, { x: 100 }, 15500, Phaser.Easing.Linear.None, true);


		groupFirefly =  game.add.sprite(game.world.centerX-100, game.world.centerY-300, 'fAssets', 'groupFirefly');
		groupFirefly.alpha = 0.3;
	    game.add.tween(groupFirefly).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, { alpha: 0.3 }, 1500, Phaser.Easing.Linear.None, true);

		// setup difficulty timer
		this.timer = game.time.create(false);	// .create(autoDestroy)
		this.timer.loop(5500, this.light, this);
		this.timer.start();

		this.visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000014');
		this.visionVisibility.animations.add('light', ['gradient_000015','gradient_000016'], 5, true);


	},
	light: function() {
		streetLampLit = game.add.sprite(game.world.centerX, game.world.height-450, 'fAssets', 'streetLampLit');
		this.visionVisibility.play('light');
		this.streetLamp.kill();
		this.timer.stop();
	},

	over: function(button) {
		//button.tint = 0x6D5B5B;
		button.alpha = 0.7;
    //	button.frame = 1;
	},

	out: function(button) {
    	//button.frame = 0;
		button.alpha = 1;
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
		if(game.input.keyboard.justPressed(Phaser.Keyboard.Q)) {
			game.state.start('play');
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.C)) {
			game.state.start('win');
		}
	},
};