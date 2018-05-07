//  The Google WebFont Loader will look for this object, so create it before loading the script.
// From Phaser tutorial - https://phaser.io/examples/v2/text/google-webfonts
WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Advent Pro']
    }
}
var lives = 5; 
var loadState = {
	preload: function () {
		game.scale.pageAlignHorizontally = true;
		//game.scale.pageAlignVertically = true;
		game.scale.refresh();

		var loadingText = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', {font: '40px Cambria', fill: '#033E54', align: 'center'});
	
	    //  Load the Google WebFont Loader script
    	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		
		// title screen buttons
		game.load.spritesheet('start', 'assets/img/startSpritesheet.png', 317, 74);
		game.load.spritesheet('credits', 'assets/img/credits.png', 317, 72);

		//  pause menu buttons
		game.load.spritesheet('pause', 'assets/img/pause.png', 71, 71);
		game.load.spritesheet('resume', 'assets/img/resume.png', 270, 57);
		game.load.spritesheet('title', 'assets/img/title.png', 270, 57);
		game.load.image('bottom', 'assets/img/bar.png');
		game.load.image('menu', 'assets/img/menu.png');

		game.load.image('player', 'assets/img/player.png');
		game.load.image('shopkeeper', 'assets/img/shopkeeper.png');

		// Load texture atlas
		game.load.atlas('assets', 'assets/img/placeholderArt.png', 'assets/img/placeholderArt.json');

		// Load audio
		game.load.audio('bgm', ['assets/audio/bkgdMusic.wav'])
	},

	// goes to title state when the game is done loading
	create: function() {
		game.state.start('title');
	}, 
};

function createText() {
   //text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nrocking with\ngoogle web fonts");
}
