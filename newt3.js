// ...
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

function updateGameArea() {
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
        if (!myBoxes[i].collided && myGamePiece.crashWith(myBoxes[i])) {
            // Handle collision with a box (e.g., mark it as collided)
            myBoxes[i].collided = true;
            // Add your own logic here for handling the collision, e.g., change the box color
            myBoxes[i].color = "red"; // Change the box color to red when collided
        }
        myBoxes[i].update();
    }
    // ...
}
// ...










method 2 



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

