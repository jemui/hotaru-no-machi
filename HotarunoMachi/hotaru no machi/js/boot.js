var bootState = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

    //---------------- Start dat.gui code ----------------

    //This object defines all the default values we can change with dat.gui
    //make sure it's either global (defined outside of all functions)
    //or it's added as a property of the game. (this.game.settings = settings;)
	    settings = {

	      // Debug controls
	      debugCollisionLayer: false,
	      debugPlayerBody: false,
	      debugPlayerBodyInfo: false,
	      debugCameraInfo: false,
	      debugFps: false,
	      musicOn: true,
	      sfxOn: true,

	      // Player properties
	      maxVelocity: 700,
	      moveSpeed: 150,
	      jumpSpeed: 375,
	      gravity: 1000

	    };

	    //Give a reference to the gui to the game.
	    this.game.gui = new dat.GUI({
	      width: 350
	    });

	    //This allows us to save (and remember) our settings.
	    this.game.gui.useLocalStorage = true;
	    this.game.gui.remember(settings);

	    //stepSize lets us choose the precision level of our gui
	    var stepSize = 1;

		// Player
	    this.game.gui.playerFolder = this.game.gui.addFolder('Player');
	    this.game.gui.playerFolder.add(settings, 'moveSpeed').min(0).max(1000).step(stepSize).name('Move Speed');
	    this.game.gui.playerFolder.add(settings, 'jumpSpeed').min(0).max(2000).step(stepSize).name('Jump Speed');
	    this.game.gui.playerFolder.add(settings, 'maxVelocity').min(0).max(1000).step(stepSize).name('Max Velocity');
	    this.game.gui.playerFolder.add(settings, 'gravity').min(0).max(5000).step(stepSize).name('Gravity');

	    //Debug
	    this.game.gui.debugFolder = this.game.gui.addFolder('Debug');
	    this.game.gui.debugFolder.add(settings, 'debugFps').name('FPS');
	    this.game.gui.debugFolder.add(settings, 'debugCollisionLayer').name('Collision Layer');
	    this.game.gui.debugFolder.add(settings, 'debugPlayerBody').name('Player Body');
	    this.game.gui.debugFolder.add(settings, 'debugPlayerBodyInfo').name('Player Body Info');
	    this.game.gui.debugFolder.add(settings, 'debugCameraInfo').name('Camera Info');
	    this.game.gui.debugFolder.add(settings, 'musicOn').name('Music On');
	    this.game.gui.debugFolder.add(settings, 'sfxOn').name('SFX On')

	    //---------------- end dat.gui code ----------------

	    //make pixel art not look shitty!
	    //this.game.renderer.renderSession.roundPixels = true;
	    //Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	    //partially fix shaky sprites
	    //this.game.camera.roundPx = false;

	    //MAGIC SCALING CODE 
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
//	pauseGame();
	game.state.start('title');

	//reset all variables
	music.stop();
    current = 0;   // current dialogue
    fireflies = 0;  // number of fireflies the player has
    playerFF = 0; // for console.log
    faceRight = true;
    full = false; 
    tutSpawned = false; // tutorial spawned firefly
    timesVisited = 0;

}

function over(button) {
   button.frame = 1;
}

function out(button) {
    button.frame = 0;
}

// Game functions shared by all states 
function lighting() {
	this.visionVisibility = game.add.sprite(0,0, 'vision', 'gradient_000000');
	this.visionVisibility.fixedToCamera = true;

	this.visionVisibility.animations.add('first', ['gradient_000001', 'gradient_000002', 'gradient_000003', 'gradient_000004'], 30, true);
	this.visionVisibility.animations.add('second', ['gradient_000005', 'gradient_000006', 'gradient_000007', 'gradient_000008'], 30, true);
	this.visionVisibility.animations.add('third', ['gradient_000009', 'gradient_000010', 'gradient_000011', 'gradient_000012'], 30, true);
	this.visionVisibility.animations.add('fourth', ['gradient_000013', 'gradient_000014', 'gradient_000015', 'gradient_000016'], 30, true);
	this.visionVisibility.animations.add('fifth', ['gradient_000017', 'gradient_000018', 'gradient_000019', 'gradient_000020'], 30, true);
	this.visionVisibility.animations.add('sixth', ['gradient_000021', 'gradient_000022', 'gradient_000023', 'gradient_000024'], 30, true);
	this.visionVisibility.animations.add('seventh', ['gradient_000025', 'gradient_000026', 'gradient_000027', 'gradient_000028'], 30, true);

	if (litStreetLamps == 1)
		this.visionVisibility.animations.play('first', 5, false);
	else if(litStreetLamps == 2)
		this.visionVisibility.animations.play('second', 5, false);
	else if(litStreetLamps == 3)
		this.visionVisibility.animations.play('third', 5, false);
	else if(litStreetLamps == 4)
		this.visionVisibility.animations.play('fourth', 5, false);
	else if(litStreetLamps == 5)
		this.visionVisibility.animations.play('fifth', 5, false);
	else if(litStreetLamps == 6)
		this.visionVisibility.animations.play('sixth', 5, false);
	else if(litStreetLamps > 6)
		this.visionVisibility.animations.play('seventh', 5, false);
}


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
	//this.playerLives.text = lives + '/5';
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

// function speechBubble(show) {
// 	if(show == 0) {
// 		this.speechBubble = game.add.sprite(this.civilian.centerX-250, this.civilian.centerY - 300, 'speech');
// 		this.speechBubble.tint = 0xD0D0D0;
// 		this.speechBubble.visible = false; 
// 		this.speechArrow = game.add.sprite(this.civilian.centerX-250, this.civilian.centerY - 300, 'speechArrow');
// 		this.speechArrow.tint = 0xD0D0D0;
// 		this.speechArrow.visible = false; 
// 		this.dialogue = game.add.text(this.speechBubble.x+5, this.speechBubble.y+5, '', {font: '30px Advent Pro', fill: '#000000', wordWrap: true, wordWrapWidth: 490});

// 		this.next = game.add.text(this.speechBubble.x + 460, this.speechBubble.y + 160, '▼', {font: '30px Advent Pro', fill: '#000000'});
// 		this.next.alpha = 1;
// 		game.add.tween(this.next).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
// 		this.next.visible = false;
// 	} else {
// 		this.speechBubble.visible = true;
// 		this.speechArrow.visible = true;
// 	}
// }