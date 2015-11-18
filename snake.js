var COLS=26, ROWS=26;

// possible values in the games representing a game object
var EMPTY=0, SNAKE=1, FRUIT=2;
// directions
var LEFT=0, UP=1, DOWN=2, RIGHT=3;
// KeyCodes
var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40;

// grid object
var grid = {
	width: null,
	height:null,
	_grid: null,

	// initialize function of grid object (first function to run)
	init: function(d, col, row) {
		this.width = col;
		this.height = row;

		this._grid = [];
		for(var i=0; i<col; i++) {
			this._grid.push([]);
			for(var j=0; j<row; j++) {
				this._grid[i].push(d);
			}
		}
	},

	// call set function to set a value for a x,y coordinate on the grid
	set: function(val, x, y) {
		this._grid[x][y] = val;
	},

	// call get function to return value at x,y coordinate on the grid
	get: function(x, y) {
		return this._grid[x][y];
	}
}

// snake object
var snake = {
	direction: null,
	last: null,
	_queue: null,

	// initialize the snake object with these dir, x & y coord
	init: function(dir, x, y) {
		this.direction = dir;
		this._queue = [];
		this.insert(x, y);
	},

	// call insert function to 
	insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},
	remove: function() {
		return this._queue.pop();
	}
}

// function to spawn food on the grid
function setFood() {
	var empty = [];

	// finds the empty cells in the grid
	for (var i=0; i < grid.width; i++) {
		for (var j=0; j < grid.height; j++) {
			if (grid.get(i,j) == EMPTY) {
				empty.push({x:i, y:j});
			}
		}
	}
	// generate a random position from empty cells
	var randpos = empty[Math.floor(Math.random()*empty.length)];
	// sets FRUIT value to x,y coordinate of the grid
	grid.set(FRUIT, randpos.x, randpos.y);
}

        console.log("start game");

// Game objects
var canvas, ctx, keystate, frames, score;

function main() {
	// creating html elements 
	canvas = document.createElement("canvas");
	canvas.width = COLS*20;
	canvas.height = ROWS*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	ctx.font = "12px Helvetica";

	frames = 0;
	keystate = {};

	// listen for key presses to identify when the controls is being pressed
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode]= true;
	});
	document.addEventListener("keyup", function(evt) {
		// cancel any existing controls
		delete keystate[evt.keyCode];
	});


	init();
	loop();
}

// function to initialize all other game objects
function init() {
	grid.init(EMPTY, COLS, ROWS);
	score = 0;

	var spawnPos = {x:Math.floor(COLS/2), y:ROWS-1};
	snake.init(UP, spawnPos.x, spawnPos.y);
	grid.set(SNAKE, spawnPos.x, spawnPos.y);

	setFood();
}

// looping function for game updates

        console.log("loop function called");

function loop() {
	update();
	draw();

	window.requestAnimationFrame(loop, canvas);
}
function update() {
	frames++;

	// handle direction controls
	if (keystate[KEY_LEFT] && snake.direction != RIGHT) snake.direction = LEFT;
	if (keystate[KEY_UP] && snake.direction != DOWN) snake.direction = UP;
	if (keystate[KEY_RIGHT] && snake.direction != LEFT) snake.direction = RIGHT;
	if (keystate[KEY_DOWN] && snake.direction != UP) snake.direction = DOWN;

	// for every 5 frames...
	if (frames%5 == 0) {
		var newXCoord = snake.last.x;
		var newYCoord = snake.last.y;

		switch (snake.direction) {
			case LEFT:
				newXCoord--; 
				break;
			case UP:
				newYCoord--; 
				break;
			case RIGHT:
				newXCoord++; 
				break;
			case DOWN:
				newYCoord++; 
				break;
		}

		// if snake overflows the cell do... or hits itself...
		if (0 > newXCoord || newXCoord > grid.width-1 ||
			0 > newYCoord || newYCoord > grid.height-1 ||
			grid.get(newXCoord, newYCoord) == SNAKE) {
			return init();
		}

		// handle events when the snake reaches a new cell with an existing object...
		if (grid.get(newXCoord, newYCoord) == FRUIT) {
			var tail = {x:newXCoord, y:newYCoord};
			setFood();
			score++;
		} else {
			// remove the tail of the snake to make it seem like moving
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
			tail.x = newXCoord;
			tail.y = newYCoord;	
		}
		grid.set (SNAKE, tail.x, tail.y);
		snake.insert(tail.x, tail.y);
	}
}

// function to draw the game objects in the grid
function draw() {
	var tileWidth = canvas.width/grid.width;
	var tileHeight = canvas.height/grid.height;
	
	// color cell in grid depending on what is in that cell
	for (var i=0; i < grid.width; i++) {
		for (var j=0; j < grid.height; j++) {

			switch(grid.get(i,j)) {
				case EMPTY:
					// white for empty cells
					ctx.fillStyle = "#fff";
					break;
				case SNAKE:
					// color for snake
					ctx.fillStyle = "#13afb9";
					break;
				case FRUIT:
					// color for fruit
					ctx.fillStyle = "#ff6262";
					break;
			}
			ctx.fillRect(i*tileWidth, j*tileHeight, tileWidth, tileHeight);
		}
	}
	ctx.fillStyle = "#000";
	ctx.fillText("SCORE: " + score, 10, canvas.height-10);
}
main();