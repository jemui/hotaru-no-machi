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
		// if(game.paused == true) {
		// 	this.pauseMenu.alpha = 1;
		// 	this.resumeButton.alpha = 1;
		// 	this.returntoTitle.alpha =1; 
		// }
	}
}

function pauseGame() {
	// toggle game pause
	game.paused ? game.paused = false : game.paused = true;
	console.log(game.paused);

	// Pause Menu
	this.pauseMenu = game.add.sprite(game.world.centerX, game.world.centerY, 'menu');
	this.pauseMenu.anchor.set(0.5);
	this.pauseMenu.alpha = 0; 

	// Resume and Title Buttons
	this.resumeButton = game.add.button(game.world.centerX, game.world.centerY-10, 'resume', resumeOnClick, this);
	this.resumeButton.anchor.set(0.5);
	this.resumeButton.onInputOver.add(this.over, this.resumeButton);
	this.resumeButton.onInputOut.add(this.out, this.resumeButton);
	this.resumeButton.alpha = 0; 

	this.returntoTitle = game.add.button(game.world.centerX, game.world.centerY+80, 'title', titleOnClick, this);
	this.returntoTitle.anchor.set(0.5);
	this.returntoTitle.onInputOver.add(this.over, this.returntoTitle);
	this.returntoTitle.onInputOut.add(this.out, this.returntoTitle);
	this.returntoTitle.alpha = 0; 

	if(game.paused == true) {
		this.pauseMenu.alpha = 1;
		this.resumeButton.alpha = 1;
		this.returntoTitle.alpha =1; 
	}
}

// function resumeOnClick(){
// 	console.log(game.paused);
// 	pauseGame();
// }

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