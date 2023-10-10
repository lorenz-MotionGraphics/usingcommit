var myGamePiece;
var myBoxes = []; // Array to store boxes
var myScore;
var gameAreaWidth = 1366; // Set the width of the game area
var gameAreaHeight = 700; // Set the height of the game area
var cameraX = 0; // Initialize the camera's X position

// Define and initialize the myGameArea object
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = gameAreaWidth;
        this.canvas.height = gameAreaHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    updateCamera: function () {
        cameraX = myGamePiece.x - gameAreaWidth / 2;
        if (cameraX < 0) {
            cameraX = 0;
        }
    }
};

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();

    // Create boxes at specific positions
    myBoxes.push(new component(60, 60, "blue", 200, 200));
    myBoxes.push(new component(60, 60, "blue", 400, 400));
    // Add more boxes as needed
}

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
function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNo += 1;

    // Handle player input
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[87]) { myGamePiece.speedY = -1; } // W key
    if (myGameArea.keys && myGameArea.keys[83]) { myGamePiece.speedY = 1; } // S key
    if (myGameArea.keys && myGameArea.keys[65]) { myGamePiece.speedX = -1; } // A key
    if (myGameArea.keys && myGameArea.keys[68]) { myGamePiece.speedX = 1; } // D key

    myGamePiece.newPos();
    myGamePiece.update();

    // Update the game camera
    myGameArea.updateCamera();

    // Update and render the boxes
    for (i = 0; i < myBoxes.length; i += 1) {
        if (!myBoxes[i].collided && checkCollision(myGamePiece, myBoxes[i])) {
            // Handle collision with a box (e.g., mark it as collided)
            myBoxes[i].collided = true;
            // Add your own logic here for handling the collision
            myBoxes[i].color = "red"; // Change the box color to red when collided

            // Collision response: Move the player back to its previous position
            myGamePiece.x = myGamePiece.prevX;
            myGamePiece.y = myGamePiece.prevY;

            // Update the player's newPos to ensure accurate collision response
            myGamePiece.newPos();
        }
        myBoxes[i].update();
    }
}

function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Call startGame() after defining everything
startGame();
