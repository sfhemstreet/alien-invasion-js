window.onload = startScreen;

// initial start screen
function startScreen() {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.font = '40px Monaco';
    ctx.fillStyle = 'red';
    ctx.fillText('Alien Invasion', 10, 50);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = '15px Monaco';
    ctx.fillStyle = 'red';
    ctx.fillText('DESTROY ALL ALIENS', 10, 100);
    ctx.fillText('YOU ALONE MUST SAVE HUMANITY', 10, 130);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = '12px Monaco';
    ctx.fillStyle = 'green';
    ctx.fillText('left/right arrows move Ship', 10, 400);
    ctx.fillText('up arrow fires rockets', 10, 420);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = '17px Monaco';
    ctx.fillStyle = 'green';
    ctx.fillText('Click or Touch Screen to Start', 10, 200);
    ctx.fill();
    ctx.closePath();
    // user clicks anywhere on screen to start game
    document.addEventListener("click", initGame);
}

function initGame(){
    document.removeEventListener("click", initGame);
    game();
}

// Game
function game() {
    /*
    ##############
    VARIABLES
     */
    // game
    var gameSpeed = 21;
    var level = 1;
    var points = 0;
    // canvas
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    // ship
    var shipHeight = 20;
    var shipWidth = 20;
    var shipX = (canvas.width - shipWidth) / 2;
    var explosionColors =
        ["black","red","red","red","red","orange","orange","orange","orange","yellow","yellow","yellow","pink","pink","pink"];
    var ship = new Ship();
    // rockets
    var rocketRadius = 5;
    var lastRocketTime = (new Date()).valueOf();
    var rateOfFire = 400;
    var rocketSpeed = 5;
    var rockets = [];
    var hitMarker = 0;
    // aliens
    var alienRowCount = 5;
    var alienColumnCount = 3;
    var alienWidth = 37;
    var alienHeight = 20;
    var alienPadding = 28;
    var alienOffsetTop = -120;
    var alienOffsetLeft = 30;
    var aliens = [];
    createAliens(); // creates aliens and puts them in aliens array
    // Alien Bombs
    var bombRadius = 8;
    var bombingRate = 2000;
    var lastBombTime = (new Date()).valueOf();
    var bombSpeed = 3;
    var bombs = [];
    // controls
    var rightPressed = false;
    var leftPressed = false;
    var upPressed = false;      // shoots rocket
    var leftButton = document.getElementById("moveLeft");
    var fireButton = document.getElementById("fireRocket");
    var rightButton = document.getElementById("moveRight");

    /*
    #################
    OBJECTS
    -Rocket
    -Bomb
    -Alien
     */
    function Ship(){
        this.shipX = shipX;
        this.shipWidth = shipWidth;
        this.shipHeight = shipHeight;
        this.color = "green";
        this.status = 1;

        this.show = function(){
            ctx.beginPath();
            ctx.rect(this.shipX, canvas.height - this.shipHeight, this.shipWidth, this.shipHeight);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };

        this.explodes = function(){
            gameSpeed = .1;
            this.shipWidth += 1;
            this.shipHeight += 1;
            if(this.color !== "black") {
                this.color = explosionColors.pop();
            }
            else{
                endGameLoop();
            }
        };
    }

    function Rocket(x,y){
        this.x = x;
        this.y = y;
        this.status = 1;

        this.show = function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, rocketRadius, 0, Math.PI*2);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        };

        this.fire = function(){
            this.y -= rocketSpeed;
        };
    }

    function Alien() {
        this.x = 0;
        this.y = 0;
        this.alienWidth = alienWidth;
        this.alienHeight = alienHeight;
        this.status = 1;
        this.color = "purple";
        this.radius = 10;

        this.show = function(){
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.alienWidth, this.alienHeight);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };

        this.attack= function(){
            if(((new Date()).valueOf() - lastBombTime) >= bombingRate){
                bombs.push(new Bomb(this.x + (alienWidth / 2), this.y));
                lastBombTime = (new Date()).valueOf();
            }
        };

        this.destroyed = function(){
            this.color = "blue";
            ctx.beginPath();
            ctx.arc(hitMarker, this.y + this.alienHeight, this.radius, 0, Math.PI*2);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
            this.radius += 1;
            if(this.radius > 16){
                this.status = 0;
            }
        };
    }

    function createAliens() {
        for (var c = 0; c < alienColumnCount; c++) {
            aliens[c] = [];
            for (var r = 0; r < alienRowCount; r++) {
                aliens[c][r] = new Alien();
            }
        }
    }

    function Bomb(x,y){
        this.x = x;
        this.y = y;
        this.status = 1;
        this.bombRadius = bombRadius;
        this.color = "yellow";
        this.bombSpeed = bombSpeed;

        this.show = function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.bombRadius, 0, Math.PI*2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };

        this.dropBomb = function(){
            this.y += this.bombSpeed;
        };

        this.blowUp = function(){
            this.color = "orange";
            this.bombRadius += 1;
            this.bombSpeed = .7;
        };
    }

    /*
    ########################
    DRAW FUNCTIONS
    draw objects onto canvas
     */
    // players ship
    function drawShip() {
        if(ship.status === 1){
            ship.show();
        }
        if(ship.status === 2){
            ship.show();
            ship.explodes();
        }
    }
    // draw rockets that haven't hit alien yet
    function drawRockets(){
        if(rockets.length > 0) {
            for (var x = 0; x < rockets.length; x++) {
                if(rockets[x] !== undefined) {
                    rockets[x].show();
                    rockets[x].fire();
                }
            }
        }
    }
    // draw aliens that arent hit by rockets
    function drawAliens() {
        var noAliens = true;
        for (var c = 0; c < alienColumnCount; c++) {
            for (var r = 0; r < alienRowCount; r++) {
                var thisAlien = aliens[c][r];
                if (thisAlien.status === 1) {
                    noAliens = false;
                    thisAlien.x = (r * (alienWidth + alienPadding)) + alienOffsetLeft;
                    thisAlien.y = (c * (alienHeight + alienPadding)) + alienOffsetTop;
                    thisAlien.show();
                    thisAlien.attack();
                }
                else if(thisAlien.status === 2) {
                    thisAlien.destroyed();
                    thisAlien.show();
                }
            }

        }
        // if player kills all aliens make new set attack
        if(noAliens){
            aliens = [];
            alienOffsetTop = -120;
            alienOffsetLeft = 30;
            createAliens();
        }
        alienOffsetTop += 0.7; // rate aliens descend at
    }
    // draw bombs still on screen
    function drawBombs(){
        if(bombs.length > 0) {
            for (var x = 0; x < bombs.length; x++) {
                // if bomb hits ground
                if(bombs[x].y + bombs[x].bombRadius >= canvas.height - 1){
                    bombs[x].blowUp();
                }
                // if bomb is off screen
                if(bombs[x].y > canvas.height){
                    bombs[x].status = 0;
                }
                // if bomb is on screen show it and make it drop
                if(bombs[x].status !== 0) {
                    bombs[x].show();
                    bombs[x].dropBomb();
                }
            }
        }
    }

    /*
    #####################
    DETECTION FUNCTIONS
    finds out when
    -rocket hits alien
    -alien hits ship or lands on planet
    -bomb hits ship
     */
    // detect if alien lands/collides with ship or if rocket hits an alien
    function collisionDetection() {
        for(var c = 0; c < alienColumnCount; c++) {
            for(var r = 0; r < alienRowCount; r++) {
                var thisAlien = aliens[c][r];
                if(thisAlien.status === 1) {
                    for(var i = 0; i < rockets.length; i++) {
                        if(rockets[i] !== undefined) {
                            // if rocket hits an alien
                            if (rockets[i].x + rocketRadius >= thisAlien.x && rockets[i].x - rocketRadius <= thisAlien.x + alienWidth &&
                                rockets[i].y >= thisAlien.y && rockets[i].y <= thisAlien.y + alienHeight) {
                                rockets[i].status = 0;
                                hitMarker = rockets[i].x;
                                thisAlien.status = 2;
                                delete(rockets[i]); // delete rocket and alien it hit
                                points += 10;
                            }
                        }

                    }
                    // if alien lands
                    if(thisAlien.y + alienHeight >= canvas.height){
                        endGameLoop();
                    }
                    // if alien collides with ship
                    else if(thisAlien.y + alienHeight >= canvas.height - ship.shipHeight &&
                        (thisAlien.x + alienWidth >= ship.shipX  && thisAlien.x <= ship.shipX + ship.shipWidth)){
                        ship.status = 2;
                    }
                }
            }
        }
    }
    // detects if bomb is onscreen and hits player
    function bombDetection(){
        for (var x = 0; x < bombs.length; x++) {
            if(bombs[x].status !== 0) {
                if(bombs[x].x + bombs[x].bombRadius >= ship.shipX && bombs[x].x - bombs[x].bombRadius <= ship.shipX + ship.shipWidth &&
                    bombs[x].y > canvas.height - ship.shipHeight){
                    bombs[x].blowUp();
                    ship.status = 2;
                }
            }
        }
    }

    /*
    ##################
    GAME LOOP
    main game function
    calls all draw and detection functions
    controls player movement + rocket firing
     */

    function gameLoop() {
        // clears the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draws the ship
        drawShip();
        // draws the aliens
        drawAliens();
        // draws any rockets that might exist
        drawRockets();
        // draws alien bombs
        drawBombs();
        // detect if rocket hits alien, or if alien hits ship or ground
        collisionDetection();
        // detect if bomb hits player
        bombDetection();

        // control movements + rocket fire
        if(rightPressed && ship.shipX <= canvas.width-ship.shipWidth) {
            ship.shipX += 6;
        }
        else if(leftPressed && ship.shipX >= 0) {
            ship.shipX -= 6;
        }
        else if(upPressed){
            if(((new Date()).valueOf() - lastRocketTime) > rateOfFire) {
                rockets.push(new Rocket(ship.shipX + (ship.shipWidth / 2), canvas.height - ship.shipHeight));
                lastRocketTime = (new Date()).valueOf();
            }
        }
    }

    // starts gameLoop and calls it over and over
    var loopGame = setInterval(gameLoop, gameSpeed);

    // stops gameLoop func, ends game
    function endGameLoop(){
        clearInterval(loopGame);
        gameOver(points);
    }

    /*
    ##################
    EVENT HANDLERS
    key and touch
     */
    // keyboard events
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if(e.code === "ArrowRight") {
            rightPressed = true;
        }
        else if(e.code === "ArrowLeft") {
            leftPressed = true;
        }
        else if(e.code === "ArrowUp") {
            upPressed = true;
        }
    }
    function keyUpHandler(e) {
        if(e.code === "ArrowRight") {
            rightPressed = false;
        }
        else if(e.code === "ArrowLeft") {
            leftPressed = false;
        }
        else if(e.code === "ArrowUp") {
            upPressed = false;
        }
    }

    // touch events
    leftButton.addEventListener("touchstart", startMoveLeft);
    leftButton.addEventListener("touchend", stopMoveLeft);
    fireButton.addEventListener("touchstart", startFire);
    fireButton.addEventListener("touchend", stopFire);
    rightButton.addEventListener("touchstart", startMoveRight);
    rightButton.addEventListener("touchend", stopMoveRight);

    function startMoveLeft(){
        leftPressed = true;
    }
    function stopMoveLeft(){
        leftPressed = false;
    }
    function startFire(){
        upPressed = true;
    }
    function stopFire(){
        upPressed = false;
    }
    function startMoveRight(){
        rightPressed = true;
    }
    function stopMoveRight(){
        rightPressed = false;
    }

}

// clear canvas, display 'gameover', let user start again
function gameOver(points){
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.font = '40px Monaco';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 10, 50);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = '15px Monaco';
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE = '+ points, 10, 70);
    ctx.fillText('Click or Touch Screen to Restart', 10, 100);
    ctx.fill();
    ctx.closePath();
    document.addEventListener("click", initGame);
}


