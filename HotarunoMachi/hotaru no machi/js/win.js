function Main(game){
    this.game=game;
}


var winState = {
	create: function() {
	    var dialog=new Dialog( 
	        {x:150, y:275, width:900}, // the geo of the dialog box
	        { font: "bold 32px Advent Pro", fill: "#fff" } // the style of the text
	    );

	  var controller=new DialogController(dialog);

	    controller.setList(
	        [
	            {        
	                text: "The ones responsible for the nuclear power plant accident that has thrown the town into darkness until you came along...\n  							  				  							  							  							[SPACE]", // the text you want to play
	                lettersPerSec: 50, // letters per second
	            },
	            {        
	                text: "It was actually us - the owners of the breakfast bar. We are spirits overwhelmed with guilt and regret for the cause of the accident and the deaths of many.\n  							  				  							  							  							[SPACE]", // the text you want to play
	                lettersPerSec: 50, // letters per second
	            },
	            {        
	                text: "This is why we opened up the Breakfast Bar..in hopes of being able to move on. We had no choice but to rely on you.\n  							  				  							  							  							[SPACE]", // the text you want to play
	                lettersPerSec: 50, // letters per second
	            },
	            {        
	                text: "Both of us give you our sincere thanks for bringing light back to the town...", // the text you want to play
	                lettersPerSec: 50, // letters per second
	            }
	        ],
	        function(){
				var fade = game.add.sprite(0,0, 'fade', 'fade_000000');
				fade.animations.add('fadeToBlack', ['fade_000001', 'fade_000002', 'fade_00003', 'fade_000004', 'fade_000005', 'fade_000006', 'fade_000008', 'fade_000009', 'fade_000010', 'fade_000011', 'fade_000012'
								, 'fade_000013', 'fade_000014', 'fade_000015', 'fade_000016', 'fade_000017', 'fade_000018', 'fade_000019', 'fade_000020', 'fade_000021'], 12, false);
				fade.play('fadeToBlack');
				timer = game.time.create();
				timer.loop(3000, function() { 
					music.stop();
					game.state.start('title');
			}, this);
			timer.start(); 
	        }
	        // fade out when text is over 

	    );

	    controller.playNext();

	    _setupKeys(controller);
	}

}


  

// private functions
function _setupKeys(controller){
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    enterKey.onUp.add(function(){
        console.log("Enter pressed!");
        this.playNext();
    }, controller);
}

