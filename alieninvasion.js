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
    ctx.fillText('press left/right side of screen to move left/right', 10, 440);
    ctx.fillText('tap middle of screen to fire rockets', 10, 460);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = '17px Monaco';
    ctx.fillStyle = 'green';
    ctx.fillText('Click or Swipe Screen to Start', 10, 200);
    ctx.fill();
    ctx.closePath();
    // user clicks anywhere on screen to start game
    canvas.addEventListener("click", initGame);
    canvas.addEventListener("touchmove",initGame);
}

function initGame(){
    var canvas = document.getElementById("gameCanvas");
    canvas.removeEventListener("click", initGame);
    canvas.removeEventListener("touchmove", initGame);
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
    var newLvl = true;
    var levelTimer = 0;
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
    var alienRowCount = 4;
    var alienColumnCount = 4;
    var alienWidth = 30;
    var alienHeight = 20;
    var alienPadding = 28;
    const alienRespawnY = -170;
    const alienRespawnX = 30;
    var alienOffsetTop = alienRespawnY;
    var alienOffsetLeft = alienRespawnX;
    var aliens = [];
    var alienColors = ["magenta","MediumOrchid","DarkOrchid","DarkMagenta","purple", "gold","white"]
    createAliens(); // creates aliens and puts them in aliens array
    var aliensHitRight = false;
    var aliensHitLeft = true;
    var lrAlienSpeed = 1;
    var alienDescentSpeed = .2;
    const maxLrAlienSpeed = 64;
    const maxALienDescentSpeed = .55;
    // Alien Bombs
    var bombRadius = 7;
    var bombingRate = 2000;
    const maxBombingRate = 1099;
    var lastBombTime = (new Date()).valueOf();
    var bombSpeed = 3;
    var bombs = [];
    // controls
    var rightPressed = false;
    var leftPressed = false;
    var upPressed = false;   // shoots rocket

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
            gameSpeed += 100;
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
        this.color = alienColors[level -1];
        this.radius = 10;

        this.show = function(){
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.alienWidth, this.alienHeight);
            if(this.status === 2){
                ctx.fillStyle = "blue";
            }else{
                ctx.fillStyle = this.color;
            }
            ctx.fill();
            ctx.closePath();
        };

        this.attack= function(){
            if(((new Date()).valueOf() - lastBombTime) >= bombingRate){
                bombs.push(new Bomb(this.x + (this.alienWidth / 2), this.y + this.alienHeight));
                lastBombTime = (new Date()).valueOf();
            }
        };

        this.destroyed = function(){
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
            this.bombSpeed = 1;
        };
    }

    /*
    ########################
    DRAW FUNCTIONS
    draw objects onto canvas
    also check for collisions
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
                if(rockets[x].status !== 0) {
                    rockets[x].show();
                    rockets[x].fire();
                }else{
                    rockets.splice(x--,1);
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
                // if alien is alive and well give new x,y, show and attack
                if (thisAlien.status === 1) {
                    noAliens = false;
                    thisAlien.x = (r * (alienWidth + alienPadding)) + alienOffsetLeft;
                    thisAlien.y = (c * (alienHeight + alienPadding)) + alienOffsetTop;
                    thisAlien.show();
                    // choose random alien to drop bombs
                    if(.25 >= Math.random()){
                        thisAlien.attack();
                    }
                    // if alien hits the right side of screen
                    if(thisAlien.x + thisAlien.alienWidth > canvas.width){
                        aliensHitRight = true;
                        aliensHitLeft =false;
                    }
                    // if alien hits left side of screen
                    else if(thisAlien.x <= 0){
                        aliensHitLeft = true;
                        aliensHitRight = false;
                    }
                    // check to see if rocket hits alien
                    for(var i = 0; i < rockets.length; i++) {
                        if(rockets[i].status !== 0) {
                            // if rocket hits an alien
                            if (rockets[i].x + rocketRadius >= thisAlien.x &&
                                rockets[i].x - rocketRadius <= thisAlien.x + alienWidth &&
                                rockets[i].y >= thisAlien.y && rockets[i].y <= thisAlien.y + alienHeight)
                            {
                                // stop showing rocket
                                rockets[i].status = 0;
                                // get x coord of rocket hit
                                hitMarker = rockets[i].x;
                                // change alien status to show its destruction
                                thisAlien.status = 2;
                                points += 10;       // player gets points
                                // make game harder every time player destroys alien
                                if(level >= 5){
                                    lrAlienSpeed += .01;
                                    alienDescentSpeed += 0.008;
                                    bombingRate -= 20;
                                }
                            }
                        }
                    }
                    // if alien lands
                    if(thisAlien.y + alienHeight >= canvas.height){
                        //aliensTakeOver();
                        endGameLoop();
                    }
                    // if alien collides with ship
                    else if(thisAlien.y + alienHeight >= canvas.height - ship.shipHeight &&
                        (thisAlien.x + alienWidth >= ship.shipX  && thisAlien.x <= ship.shipX + ship.shipWidth)){
                        ship.status = 2;
                    }
                }
                // if alien is hit show its demise
                else if(thisAlien.status === 2) {
                    thisAlien.destroyed();
                    thisAlien.show();
                }
            }

        }
        // if player destroys all aliens make new set attack
        if(noAliens){
            aliens = [];
            alienOffsetTop = alienRespawnY;
            alienOffsetLeft = alienRespawnX;
            level++;
            //rateOfFire -= 100; 
            levelTimer = 0;
            newLvl = true;
            createAliens();
        }
        if(aliensHitRight){
            alienOffsetLeft -= lrAlienSpeed;
            alienOffsetTop += alienDescentSpeed; // rate aliens descend at
        }
        else if(aliensHitLeft){
            alienOffsetLeft += lrAlienSpeed;
            alienOffsetTop += alienDescentSpeed;
        }
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
                if(bombs[x].status !== 0){
                    bombs[x].show();
                    bombs[x].dropBomb();
                    // if bomb hits ship, blow it up
                    if(bombs[x].x + bombs[x].bombRadius >= ship.shipX && bombs[x].x - bombs[x].bombRadius <= ship.shipX + ship.shipWidth &&
                        bombs[x].y > canvas.height - ship.shipHeight){
                        bombs[x].blowUp();
                        ship.status = 2;
                    }
                }
            }
        }
    }

    function displayLvl(){
        ctx.beginPath();
        ctx.font = '15px Monaco';
        ctx.fillStyle = 'gold';
        ctx.fillText('Level '+ (level), 10, 400);
        ctx.fill();
        ctx.closePath();
        levelTimer++;
        if(levelTimer > 100){
            levelTimer = 0;
            newLvl = false;
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

        if(newLvl && levelTimer < 100){
            displayLvl();
        }
    }

    // starts gameLoop and calls it over and over
    var loopGame = setInterval(gameLoop, gameSpeed);

    // stops gameLoop func, ends game
    function endGameLoop(){
        clearInterval(loopGame);
        gameOver(points, level);
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

    canvas.addEventListener("touchend", endTouch, false);
    canvas.addEventListener("touchstart", touchDetection, false);


    function endTouch(e){
        e.preventDefault();
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
    }

    function touchDetection(e) {
        e.preventDefault();
        console.log("touch");
        var currentX = e.changedTouches[0].pageX;
        if (currentX > 0){
            if (currentX > canvas.width/2 + 50){
                leftPressed = false;
                rightPressed = true;
                console.log("right");
            }
            else if(currentX < canvas.width/2 - 50){
                rightPressed = false;
                leftPressed = true;
                console.log("left");
            }
            if(currentX < canvas.width/2 + 50 && currentX > canvas.width/2 - 50){
                upPressed = true;
                console.log("middle");
            }
        }
    }
}

// clear canvas, display 'gameover', let user start again
function gameOver(points, level){
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.font = '40px Monaco';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 10, 250);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = '15px Monaco';
    ctx.fillStyle = 'red';
    ctx.fillText('Level = '+ level, 10, 300);
    ctx.fillText('SCORE = '+ points, 10, 350);
    ctx.fillText('Click or Swipe Screen to Restart', 10, 400);
    ctx.fill();
    ctx.closePath();
    canvas.addEventListener("click", initGame);
    canvas.addEventListener("touchmove", initGame);
}


