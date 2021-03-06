//var game = new Phaser.Game(window.innerWidth/1.4, window.innerHeight/1.4, Phaser.AUTO);
var game = new Phaser.Game(1200,700, Phaser.AUTO);

// Add the game states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('title', titleState);
game.state.add('tutorial', tutorialState);
game.state.add('play', playState);
game.state.add('town', townState);
game.state.add('townLeft', townLeftState);
game.state.add('townPastLeft', townPastLeftState);
game.state.add('end', endState);
game.state.add('win', winState);

game.state.start('boot');