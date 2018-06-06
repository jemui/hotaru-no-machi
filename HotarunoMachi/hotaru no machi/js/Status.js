// Status prefab constructor function
function Status(game, key, x, y, key, fr) {
	// (game, key, lives, heart, firefly, fireflyIcon, pMilk, milkIcon, hJuice, juiceIcon, pShake, shakeIcon)
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, fr);
		//this = objects.create(0, game.world.height-64, 'bottom');
		this.body.immovable = true; 
		this.alpha = 0;
		this.scale.setTo(2,1);
		
		game.add.tween(this).to( { alpha: 1 }, 1500, Phaser.Easing.Linear.None, false);

		var playerLives = game.add.text(20, game.world.height-45, lives + '/5',{font: '25px Advent Pro', fill: '#E5D6CE'});
		var heart = game.add.sprite(playerLives.x+40, game.world.height-55, 'assets', 'heartIcon');

		this.firefliesCaught = game.add.text(heart.x+65, game.world.height-45, (fireflies+'/'+lanternSize),{font: '25px Advent Pro', fill: '#E5D6CE'});
		var fireflyIcon = game.add.sprite(this.firefliesCaught.x+40, game.world.height-58, 'fAssets', 'singleFirefly');

		this.pureMilk = game.add.text(fireflyIcon.x+65, game.world.height-45, purificationMilk,{font: '25px Advent Pro', fill: '#E5D6CE'});
		var milkInventoryIcon = game.add.sprite(this.pureMilk.x+20, game.world.height-58, 'endGame', 'milkInventoryIcon');

		this.juice = game.add.text(milkInventoryIcon.x+60, game.world.height-45, healthJuice,{font: '25px Advent Pro', fill: '#E5D6CE'});
		var juiceInventoryIcon = game.add.sprite(this.juice.x+20, game.world.height-58, 'endGame', 'juiceInventoryIcon');

		this.shake = game.add.text(juiceInventoryIcon.x+60, game.world.height-45, proteinShake,{font: '25px Advent Pro', fill: '#E5D6CE'});
		var proteinShakeInventoryIcon = game.add.sprite(this.shake.x+20, game.world.height-58, 'endGame', 'proteinShakeInventoryIcon');


//	this.anchor.set(0.5);

	// put some physics on it
	//this.enableBody = true;
	//game.physics.enable(this);

	
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Status)
Status.prototype = Object.create(Phaser.Sprite.prototype);
Status.prototype.constructor = Status;

// override Phaser.Sprite update 
Status.prototype.update = function() {
	
}