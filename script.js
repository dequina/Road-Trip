

// Canvas elements
var can;
var ctx;
var img = new Image();
img.src = "lol.png";
var score = 0;
var highScore = 0;

var title = new Image();
title.src = "title.png";


// World vars
var gravity = 0.25;
var state = 0;

// Objects
var myObs = [];
var int1;
var int2;

var ground;
var me;

// the initial image height
var imgHeight = 0;
var scrollSpeed = 5;

class characterComponent {
	constructor(width, height, x, y, picture, con) {
		this.width = width;
		this.height = height;
		this.image = new Image();
		this.image.src = picture;
		this.x = x;
		this.y = y;
		this.con = con;
		this.air = false;

		this.y_v = 0;

		this.update = function () {
			this.con.save();
			this.con.drawImage(this.image, this.x, this.y, this.width, this.height);
			this.con.restore();
		};
	}
}

class groundComponent {
	constructor(width, height, x, y, con) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.con = con;
		this.image = new Image();
		this.image.src = "ground.png";

		this.render = function (){
			this.con.drawImage(this.image, this.x, this.y, this.width, this.height);
		//	this.con.fillStyle = "#124252";
		//	this.con.fillRect(this.x, this.y, this.width, this.height);	
		}
	}
}

class obstacle {
	constructor(width, height, x, y, pic, con) {
		this.width = width;
		this.height = height;
		this.image = new Image();
		this.image.src = pic;
		this.x = x;
		this.y = y;
		this.con = con;
	
		this.update = function () {
				this.x -= 5;
				this.con.drawImage(this.image, this.x, this.y, this.width, this.height);
		};
		this.crashCheck = function(player){
			var myleft = this.x;
			var myright = this.x + (this.width);
			var mytop = this.y;
			var mybottom = this.y + (this.height);
			var otherleft = player.x;
			var otherright = player.x + (player.width);
			var othertop = player.y;
			var otherbottom = player.y + (player.height);
			var crash = true;
			if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
				crash = false;
			}
			return crash;
		}
	}
}


function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}


// window.onload is an event that occurs when all the assets
// have been successfully loaded
window.onload = function(){
	can = document.getElementById('canvas1');
	ctx = can.getContext('2d');
	console.log(can.width);
	

	can.width = 640;
	can.height = 640;

	if (state == 0) {
		ctx.drawImage(title, 0, 0, can.width, can.height);
	}


	window.addEventListener('keydown', event => {
		if (event.code == "KeyW" || event.code =="ArrowUp" || (event.code == "Space" && state == 1)){
			moveUp(me);
		}
		if (state == 0 && event.code == "Space"){
			state = 1;
			start();

		}
		if (state == 2 && event.code == "Space"){
			state = 1;
			ctx.clearRect(0, 0, can.width, can.height);
			myObs = [];
			start();
			
		} 
	});

};

function start() {
	ctx.clearRect(0, 0, can.width, can.height);
	// main character
	ground = new groundComponent(can.width, can.height / 3, 0, 2 * can.height / 3, ctx);
	me = new characterComponent(can.width/10,can.width/10, can.width/20, can.height/2, "player.png",ctx);
	score = 0;
	startGame();
}

function moveUp(char) {
	if (char.air == false){
		char.y_v = -10;
	}
};

function loop()
{
	// draw image 1
	ctx.drawImage(img, imgHeight, 0);
	// update image height
	imgHeight = ((imgHeight - scrollSpeed)) % can.width;
	// draw image 2 
	ctx.drawImage(img, imgHeight + can.width, 0);
	ground.render();

	for (var i = 0; i < myObs.length; i += 1) {
		if (myObs[i].crashCheck(me)) {
			endGame();
		} 
	}
	if (me.air) {
		me.y_v += gravity;
	}  
	me.air = true;
	me.y += me.y_v;
	let ch = -1;
	if (ground.y < me.y + me.height && me.y + me.height < ground.y + ground.height){
		ch = 0;
	} 
	if (ch != -1) {
		me.air = false;
		me.y = ground.y - me.height ; 
		ch = -1;   
	}	
	for (i = 0; i < myObs.length; i += 1) {
		myObs[i].update();
	}
	score +=1;
	if (highScore < score) {
		highScore = score;
	}
	drawScore();
	me.update();
}
function addNew(){
	if (myObs.length < 3) {
	  myObs.push(new obstacle(can.width/10, can.width/10, can.width, ground.y - 48, "rocks.png", ctx));
	}
	
}

function startGame() {
	ctx.clearRect(0, 0, can.width, can.height);
	int1 = setInterval(loop, 10);
	int2 = setInterval(function(){
		if (myObs.length > 1){
			myObs.shift();
		}}, 3000);
	(function loop() {    
		var rand = Math.floor(Math.random() * 7000) + 3000;
		setTimeout(function() {
				addNew(); 
				loop(); 
		}, rand);
	}());
		
}

function endGame(){
	state = 2;
	drawFail();
	clearInterval(int1);
	clearInterval(int2);
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("High Score: "+highScore, 8, 24);

	ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+score, 8, 48);
}
function drawFail() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Game Over!", can.width / 3, can.height / 2);
}






