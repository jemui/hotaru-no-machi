var game = new Phaser.Game(window.innerWidth/1.4, window.innerHeight/1.4, Phaser.AUTO,'gameDiv' );

// Add the game states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('tutorial', tutorialState);
game.state.add('play', playState);

game.state.start('boot');