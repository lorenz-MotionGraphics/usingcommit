var myGamePiece;
var myBoxes = []; // Array to store boxes
var myScore;
var gameAreaWidth = 1366; // Set the width of the game area
var gameAreaHeight = 700; // Set the height of the game area
var cameraX = 0; // Initialize the camera's X position

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();

    // Create boxes at specific positions
    myBoxes.push(new component(60, 60, "blue", 200, 200));
    myBoxes.push(new component(60, 60, "blue", 400, 400));
    // Add more boxes as needed
}

// ...

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height); // Do not adjust for camera position
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitTop();
        this.hitBottom();
    }
    this.hitTop = function() {
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }
    this.hitBottom = function() {
        var rockbottom = gameAreaHeight - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

// ...

function updateGameArea() {
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            // You can add some handling here for the collision with obstacles, if needed.
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    
    // Handle player input
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[87]) {myGamePiece.speedY = -1; } // W key
    if (myGameArea.keys && myGameArea.keys[83]) {myGamePiece.speedY = 1; } // S key
    if (myGameArea.keys && myGameArea.keys[65]) {myGamePiece.speedX = -1; } // A key
    if (myGameArea.keys && myGameArea.keys[68]) {myGamePiece.speedX = 1; } // D key
    
    myGamePiece.newPos();
    myGamePiece.update();
    
    // Update the game camera
    myGameArea.updateCamera();
    
    // Update and render the boxes
    for (i = 0; i < myBoxes.length; i += 1) {
        myBoxes[i].update();
    }

    // Check for collisions with boxes (example collision detection)
    for (i = 0; i < myBoxes.length; i += 1) {
        if (myGamePiece.crashWith(myBoxes[i])) {
            // Handle collision with a box (e.g., remove the box)
            myBoxes.splice(i, 1); // Remove the box from the array
            // Add your own logic here for handling the collision
        }
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

startGame();
