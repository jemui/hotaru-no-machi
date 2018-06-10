// Civlian prefab constructor function
function Civlian(game, x, y, key, fr, scale, rotation) {
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, fr);

	this.anchor.set(0.5);

	// put some physics on it
	this.enableBody = true;
	game.physics.enable(this);
	this.body.setSize(80,200,45,0);
	
	//add walking animation
	this.animations.add('left', ['CivlianSprite0005','CivlianSprite0006'], 30, true);
	this.animations.add('right', ['CivlianSprite0002','CivlianSprite0003'], 30, true);
	
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Civlian)
Civlian.prototype = Object.create(Phaser.Sprite.prototype);
Civlian.prototype.constructor = Civlian;

// override Phaser.Sprite update 
Civlian.prototype.update = function() {
	// Arrow keys to move Civlian
	if (cursors.left.isDown) {
		this.animations.play('left', 10, false);
		this.body.velocity.x = -500;	// Move to the left
		left = true;
		right = false;
	}
	else if (cursors.right.isDown) {
		this.animations.play('right', 10, false);
		this.body.velocity.x = 500;  // Move to the right
		right = true;
		left = false;
	} else {
		// stand still 
		this.animations.stop();
		if(left == true)
			this.frame = 'CivlianSprite0004';
		else 
			this.frame = 'CivlianSprite0001';
		this.body.velocity.x = 0;
	}
	if (cursors.up.isDown) {
		this.body.velocity.y = -500;	// Move up
	}
	if (cursors.down.isDown) {
		this.body.velocity.y = 500; // Move down
	}
	
}