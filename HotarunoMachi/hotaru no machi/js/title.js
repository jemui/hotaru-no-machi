var returnedToTitle = 0;
var show = false;
var titleState = {
	// goes to title state when the game is done loading
	create: function() {
		// set the background color 

		// Bounds
		screen = game.add.group(); 
		screen.enableBody = true; 

		//reset global variables upon returning to title
		if(returnedToTitle > 0) {
			resetVar();
		}
		returnedToTitle++;
		this.spashScreen = screen.create(0,0, 'splashScreen');


		this.startButton = game.add.button(155, game.world.centerY/2+160, 'start', this.actionOnClick, this);
		this.startButton.onInputOver.add(this.over, this.startButton);
		this.startButton.onInputOut.add(this.out, this.startButton);

		this.creditsButton = game.add.button(155, game.world.centerY/2+240, 'credits', this.actionOnClick2, this);
		this.creditsButton.onInputOver.add(this.over, this.creditsButton);
		this.creditsButton.onInputOut.add(this.out, this.creditsButton);

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

		this.creditsScreen = screen.create(0,0, 'creditsScreen');
		this.creditsScreen.visible = false;

		this.visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000014');
		this.visionVisibility.animations.add('light', ['gradient_000015','gradient_000016'], 5, true);


		this.closeCredits = game.add.text(60,255, "<Press the Space bar to return to the title screen>", {font: '30px Advent Pro', fill: '#000000'}); 
	    game.add.tween(this.closeCredits).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, {alpha: 0.4}, 1500, Phaser.Easing.Linear.None, true);
		this.closeCredits.visible = false;
	},
	light: function() {
		streetLampLit = game.add.sprite(game.world.centerX, game.world.height-450, 'fAssets', 'streetLampLit');
		this.visionVisibility.play('light');
		this.streetLamp.kill();
		this.timer.stop();
	},

	over: function(button) {
		if(show == false)
			button.alpha = 0.7;
	},

	out: function(button) {
    	if(show== false)
			button.alpha = 1;
	},
	// start button action
	actionOnClick: function() {
		if(show== false) {
			game.state.start('tutorial');
			music = game.add.audio('bgm');
			music.loopFull(0.3);
			music.play();
		}
	},
	// Credits button action
	actionOnClick2: function() {
		this.startButton.alpha= 0;
		this.creditsButton.alpha= 0;
		this.creditsScreen.visible = true;
		show = true;
		this.closeCredits.visible = true;
	},
	update: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			this.startButton.alpha= 1;
			this.creditsButton.alpha= 1;
			this.creditsScreen.visible = false;
			show = false;
			this.closeCredits.visible = false;
		}
	},
};