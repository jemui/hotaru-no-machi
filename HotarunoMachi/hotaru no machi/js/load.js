//  The Google WebFont Loader will look for this object, so create it before loading the script.
// From Phaser tutorial - https://phaser.io/examples/v2/text/google-webfonts
WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Advent Pro', 'Indie Flower']
    }
}
// needed for webFontConfig
function createText() {
}

//GUI + Player Inventory
var lives = 5; 
var lanternSize = 5;
var purificationMilk = 0;
var healthJuice = 0;
var proteinShake = 0;
var totalLamps = 4;
var win = false;

var loadState = {
	preload: function () {
		game.scale.pageAlignHorizontally = true;

		game.scale.refresh();

		var loadingText = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', {font: '40px Cambria', fill: '#033E54', align: 'center'});
		loadingText.anchor.set(0.5);

	    //  Load the Google WebFont Loader script
    	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		
		// title screen buttons
		game.load.image('start', 'assets/img/startButton.png');
		game.load.image('credits', 'assets/img/creditsButton.png');

		// pause menu buttons
		game.load.spritesheet('pause', 'assets/img/pause.png', 71, 71);
		game.load.spritesheet('resume', 'assets/img/resume.png', 270, 57);
		game.load.spritesheet('title', 'assets/img/title.png', 270, 57);
		game.load.image('bottom', 'assets/img/bar.png');
		game.load.image('menu', 'assets/img/menu.png'); //pause menu

		// game.load.image('player', 'assets/img/player.png');
		game.load.image('puddleHitBox', 'assets/img/puddleHitBox.png');
		game.load.image('shopMenu', 'assets/img/shopMenu.png');
		game.load.image('bound', 'assets/img/bound.png');
		game.load.image('speech', 'assets/img/speechBubble.png');
		game.load.image('speechArrow', 'assets/img/speechBubbleArrow.png');
		game.load.image('spriteBounds', 'assets/img/spriteBounds.png');
		game.load.image('splashScreen', 'assets/img/splashScreen.png');
		game.load.image('creditsScreen', 'assets/img/creditsScreen.png');

		// Load texture atlas
		game.load.atlas('assets', 'assets/img/placeholderArt.png', 'assets/img/placeholderArt.json');
		game.load.atlas('vision', 'assets/img/gradient.png', 'assets/img/gradient.json');
		game.load.atlas('fAssets', 'assets/img/FinalArtAssets.png', 'assets/img/FinalArtAssets.json');
		game.load.atlas('endGame', 'assets/img/endGame.png', 'assets/img/endGame.json');
		game.load.atlas('fade', 'assets/img/fade.png', 'assets/img/fade.json');
		game.load.atlas('finalAssets', 'assets/img/finalAssets.png', 'assets/img/finalAssets.json');

		// Load audio
		game.load.audio('bgm', ['assets/audio/bkgdMusic.ogg']);
		game.load.audio('depositFF', ['assets/audio/depositff.ogg']);
		game.load.audio('fillLamp', ['assets/audio/filledLamp.ogg']);
		game.load.audio('hitFF', ['assets/audio/hitFF.ogg']);
		game.load.audio('fillStreet', ['assets/audio/filledStreet.ogg']);	
		game.load.audio('playerDies', ['assets/audio/playerDies.ogg']);	
		game.load.audio('enemyDies', ['assets/audio/enemyDies.ogg']);
		game.load.audio('hitEnemy', ['assets/audio/hitEnemy.ogg']);
		game.load.audio('shootFF', ['assets/audio/shootFF.ogg']);	
		game.load.audio('buy', ['assets/audio/buy.ogg']);
		game.load.audio('consume', ['assets/audio/consume.ogg']);
	},

	// goes to title state when the game is done loading
	create: function() {
		game.state.start('title');
	}, 
};
