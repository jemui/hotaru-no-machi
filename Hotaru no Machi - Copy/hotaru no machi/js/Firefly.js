function Firefly(game){
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(game.world.centerX,game.width-64), game.rnd.integerInRange(game.world.centerY,game.height-128), 'assets', 'firefly');

}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Armada)
Firefly.prototype = Object.create(Phaser.Sprite.prototype);
Firefly.prototype.constructor = Firefly;

// override Phaser.Sprite update (to spin the ship)
Firefly.prototype.update = function() {
	game.add.tween(this.firefly).to( { x: game.world.centerX+400 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerX+300, 1500, Phaser.Easing.Linear.None, true);
	game.add.tween(this.firefly).to( { y: game.world.centerY+95 }, 1500, Phaser.Easing.Linear.None, true, game.world.centerY-75, 1500, Phaser.Easing.Linear.None, true);
		
}
