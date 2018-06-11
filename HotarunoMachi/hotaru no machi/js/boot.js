var bootState = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

	    //MAGIC SCALING CODE from dat.gui
	    this.game.scale.pageAlignVertically = true;
	    this.game.scale.pageAlignHorizontally = true;
	    this.windowHeight = window.innerHeight;
	    // The 9 and 16 here are your ratio, in this case 16 x 9.
	    this.windowWidth = (this.windowHeight / 9) * 16;
	    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    window._this = this;
	    this.scale.refresh();
	    this.scale.setMinMax(40, 30, this.windowWidth, this.windowHeight);
	    window.addEventListener('resize', function () {
	      window._this.windowHeight = window.innerHeight;
	      window._this.windowWidth = (_this.windowHeight / 9) * 16;
	      window._this.scale.setMinMax(40, 30, _this.windowWidth, _this.windowHeight);
	    }, true);

		game.state.start('load');
	},

}

// bind pause key to browser window event
window.onkeydown = function(event) {
	// capture keycode (event.which for Firefox compatibility)
	var keycode = event.keyCode || event.which;	
	if(keycode === Phaser.Keyboard.P) {
		pauseGame();
	}
}

function pauseGame() {
	// toggle game pause
	game.paused ? game.paused = false : game.paused = true;
	console.log(game.paused);

	// Pause Menu
	this.pauseMenu = game.add.sprite(game.camera.x+650, game.camera.y+330, 'menu');
	this.pauseMenu.anchor.set(0.5);
	this.pauseMenu.alpha = 0; 

	// Resume and Title Buttons
	this.resumeButton = game.add.button(game.camera.x+650, game.camera.y+320, 'resume', resumeOnClick, this);
	this.resumeButton.anchor.set(0.5);
	this.resumeButton.onInputOver.add(this.over, this.resumeButton);
	this.resumeButton.onInputOut.add(this.out, this.resumeButton);
	this.resumeButton.alpha = 0; 

	this.returntoTitle = game.add.button(game.camera.x+650, game.camera.y+420, 'title', titleOnClick, this);
	this.returntoTitle.anchor.set(0.5);
	this.returntoTitle.onInputOver.add(this.over, this.returntoTitle);
	this.returntoTitle.onInputOut.add(this.out, this.returntoTitle);
	this.returntoTitle.alpha = 0; 

	//var pauseButton =  game.add.button(1168, game.world.height-32, 'pause', resumeOnClick, this);

	if(game.paused == true) {
		this.pauseMenu.alpha = 1;
		this.resumeButton.alpha = 1;
		this.returntoTitle.alpha =1; 
	}
}

function resumeOnClick(){
	// Make menu invisible and toggle pause state
	this.pauseMenu.alpha = 0;
	this.resumeButton.alpha = 0;
	this.returntoTitle.alpha = 0; 

	game.paused ? game.paused = false : game.paused = true;
}

function titleOnClick(){
	game.paused ? game.paused = false : game.paused = true;
	game.state.start('title');

	//reset all variables
	music.stop();
	resetVar();

}

function over(button) {
   button.frame = 1;
}

function out(button) {
    button.frame = 0;
}

function resetVar() {
	lives = 5;
	playerFF = 0;
	fireflies = 0;
	timesVisited = 0;
	townVisited = 0;
	townLampLit = false;
	townLampFill = 0;
	litStreetLamps = 0;
	tutSpawned = false;
	current = 0;
	full = false; 

	lanternSize = 5;
	purificationMilk = 0;
	healthJuice = 0;
	proteinShake = 0;

	purifiedLeft = false; 
	purifiedBelow = false;
	
	town2LampFill = 0;  
	town2Visited = 0;
	town2LampLit = false; 
	townLeftLampFill = 0;  
	townLeftVisited = 0;
	townLeftLampLit = false; 
	purifiedLeft = false; 
	leftEnemyAlive = true;	

    townPastLeftLampFill = 0;  
    townPastLeftVisited = 0;
    townPastLeftLampLit = false; 

	win = false;
}
// Game functions shared by all states 

function statusBar() {
		// Set up the bottom GUI 
		var bottomGUI = game.add.sprite(0, game.world.height-64, 'bottom');
		bottomGUI.scale.setTo(2,2);
		bottomGUI.fixedToCamera = true;

		this.playerLives = game.add.text(20, game.world.height-45, lives + '/5',{font: '25px Advent Pro', fill: '#E5D6CE'});
		var heart = game.add.sprite(this.playerLives.x+40, game.world.height-55, 'assets', 'heartIcon');
		this.playerLives.fixedToCamera = true;
		heart.fixedToCamera = true;

		this.firefliesCaught = game.add.text(heart.x+65, game.world.height-45, (fireflies+'/'+lanternSize),{font: '25px Advent Pro', fill: '#E5D6CE'});
		var fireflyIcon = game.add.sprite(this.firefliesCaught.x+40, game.world.height-58, 'fAssets', 'singleFirefly');
		this.firefliesCaught.fixedToCamera = true;
		fireflyIcon.fixedToCamera = true;

		this.pureMilk = game.add.text(fireflyIcon.x+65, game.world.height-45, purificationMilk,{font: '25px Advent Pro', fill: '#E5D6CE'});
		var milkInventoryIcon = game.add.sprite(this.pureMilk.x+20, game.world.height-58, 'endGame', 'milkInventoryIcon');
		this.pureMilk.fixedToCamera = true;
		milkInventoryIcon.fixedToCamera = true;

		this.juice = game.add.text(milkInventoryIcon.x+60, game.world.height-45, healthJuice,{font: '25px Advent Pro', fill: '#E5D6CE'});
		var juiceInventoryIcon = game.add.sprite(this.juice.x+20, game.world.height-58, 'endGame', 'juiceInventoryIcon');
		this.juice.fixedToCamera = true;
		juiceInventoryIcon.fixedToCamera = true;

		this.shake = game.add.text(juiceInventoryIcon.x+60, game.world.height-45, proteinShake,{font: '25px Advent Pro', fill: '#E5D6CE'});
		var proteinShakeInventoryIcon = game.add.sprite(this.shake.x+20, game.world.height-58, 'endGame', 'proteinShakeInventoryIcon');
		this.shake.fixedToCamera = true;
		proteinShakeInventoryIcon.fixedToCamera = true;	

		// Pause button
		var pauseButton =  game.add.button(1168, game.world.height-32, 'pause', pauseGame, this);
		pauseButton.fixedToCamera = true;
		pauseButton.anchor.set(0.5);
		pauseButton.scale.setTo(0.5);
		pauseButton.onInputOver.add(this.over, this.pauseButton);
		pauseButton.onInputOut.add(this.out, this.pauseButton);
}

function health() {
	hitEnemy.play(); 
	lives-=1;	
	statusBar();

	if(left == true) {
		player.x += 10;
		game.add.tween(player).to( {x:player.x+90}, 100, Phaser.Easing.Linear.None, true);
	}
	else {
		player.x -= 10;
		game.add.tween(player).to( {x:player.x-90}, 100, Phaser.Easing.Linear.None, true);
	}
}