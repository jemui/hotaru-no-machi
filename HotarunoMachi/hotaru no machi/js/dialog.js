function Dialog(geo, style){
	// public vars
	this.x=geo.x;
	this.y=geo.y;
	this.style=style;
	this.style.wordWrap=true;
	this.style.wordWrapWidth=geo.width;
	this.interval=50;
	// private vars
	this._current=0.0;
	this._text="";
	this._lps=25;
	this._textSprite=null;
	this._callback=null;
	this._timer=null;
}

// public functions
Dialog.prototype.playOne=function(textInfo){
	console.log("Dialog.play: dialog position is ("+this.x+","+this.y+")");
	// clear the dialog
	this.reset();
	// init the next play
	this._current=0.0;
	this._text=textInfo.text;
	this._lps=textInfo.lettersPerSec;
	this._textSprite=_createTextSprite(this.x, this.y, textInfo.text, this.style);
	this._callback=textInfo.callback;
	// the _textSprite should be set to "invisible first", and then toggled visible in the _update function
	this._textSprite.visible=false;
	// reset the timer
	this._timer=game.time.create(false);
	this._timer.loop(this.interval, _update, null, this, textInfo.lettersPerSec);
	this._timer.start();
};

Dialog.prototype.finished=function(){
	return this._current>=this._text.length;
}

Dialog.prototype.reset=function(){
	this._current=0.0;
	this._text="";
	this._lps=25;
	if(this._textSprite){
		this._textSprite.destroy();
		this._textSprite=null;
	}
	this._callback=null;
	if(this._timer){
		this._timer.stop(true);
		this._timer=null;
	}
}

// private functions
function _createTextSprite(x, y, text, style){
	return game.add.text(x, y, text, style);
}
function _update(dialog, lettersPerSec){
	if(dialog.finished())
		return;
	// console.log("updating text, interval:",dialog.interval);
	dialog._current+=(lettersPerSec*dialog.interval/1000);
	dialog._current=Math.min(dialog._current, dialog._text.length);
	dialog._textSprite.text=dialog._text.substring(0, dialog._current);
	dialog._textSprite.visible=true;
	// now let's see if it is finished
	if(dialog.finished() && dialog._callback){
		dialog._callback();		
	}
}

// ========================================= Dialog Controller ===========================================

function DialogController(dialog){
	// private vars
	this._dialog=dialog;
	this._textList={};
	this._current=0;
	this._callback;
	this._playing=false;
}

// public functions
DialogController.prototype.setList=function(textList, callback){
	this._textList=textList;
	this._current=0;
	var myself=this;
	for(var i=0;i<this._textList.length-1;i++){
		this._textList[i].callback=function(){
			myself._playing=false;
			myself._current++;
		}
	}
	this._textList[this._textList.length-1].callback=function(){
		myself._playing=false;
		myself._current++;
		callback();
	}
}

DialogController.prototype.playNext=function(){
	// console.log(this._playing, this._current, this._textList.length);
	if(this._playing){
		console.log("DialogController.playNext: can NOT play it while playing.")
		return;
	}
	if(this._current>=this._textList.length){
		this._dialog.reset();
		return;
	}
	this._playing=true;
	var textInfo=this._textList[this._current];
	this._dialog.playOne(textInfo);
}
