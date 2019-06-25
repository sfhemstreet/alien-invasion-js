// SPENCER HEMSTREET


window.onload = startScreen;

// initial start screen
function startScreen() {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var controlCanvas = document.getElementById("controlCanvas");
    var cctx = controlCanvas.getContext("2d");
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
    ctx.fillText('up arrow/space fires rockets', 10, 420);
    ctx.fillText('press left/right side of screen', 10, 440);
    ctx.fillText('to move left/right', 10, 460);
    ctx.fillText('tap middle of screen to fire rockets', 10, 480);
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
    controlCanvas.addEventListener("touchmove",initGame);
}

function initGame(){
    var canvas = document.getElementById("gameCanvas");
    var controlCanvas = document.getElementById("controlCanvas");
    canvas.removeEventListener("click", initGame);
    controlCanvas.removeEventListener("touchmove", initGame);
    canvas.removeEventListener("touchmove", initGame);
    game();
}


// clear canvas, display 'gameover', let user start again
function gameOver(points, level){
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var controlCanvas = document.getElementById("controlCanvas");
    var cctx = controlCanvas.getContext("2d");
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
    controlCanvas.addEventListener("touchmove", initGame);
    canvas.addEventListener("touchmove", initGame);
}

function playerWins(points){
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var controlCanvas = document.getElementById("controlCanvas");
    var cctx = controlCanvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.font = '27px Monaco';
    ctx.fillStyle = 'red';
    ctx.fillText('YOU SAVED EARTH!', 10, 50);
    ctx.fillText('FREE BEER 4 LIFE!', 10, 250);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.font = '15px Monaco';
    ctx.fillStyle = 'red';
    ctx.fillText('SCORE = '+ points, 10, 350);
    ctx.fillText('Click or Swipe Screen to Replay', 10, 400);
    ctx.fill();
    ctx.closePath();
    canvas.addEventListener("click", initGame);
    controlCanvas.addEventListener("touchmove", initGame);
    canvas.addEventListener("touchmove", initGame);
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
    // sound
    /*
    var bombBlowUpSound = new sound("mp3/bombblowup.mp3");
    var rocketBlowUpSound = new sound("mp3/rocketblowup.mp3");
    var rocketFireSound = new sound("mp3/rocketfire.mp3");
    var laserFireSound = new sound("mp3/laserfire.mp3");
    var alienBlowUpSound = new sound("mp3/alienblowup.mp3");
    var shipBlowUpSound = new sound("mp3/shipblowup.mp3");
    var newLevelSound = new sound("mp3/newlevel.mp3");
    */
    // canvas
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var controlCanvas = document.getElementById("controlCanvas");
    var cctx = controlCanvas.getContext("2d");
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width
    var controlCanvasWidth = controlCanvas.width;
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
    // bonus box
    var bonusBoxHeight = 17;
    var bonusBoxWidth = 17;
    var bonus = false;
    var bonusBoxes = [];
    var laserOn = false;
    var laser = null;
    var laserRadius = 2;
    var laserSpeed = 25;
    // aliens
    var alienRowCount = 4;
    var alienColumnCount = 4;
    var alienWidth = 30;
    var alienHeight = 20;
    var alienPadding = 28;
    var alienRespawnY = -170;
    var alienRespawnX = 30;
    var alienOffsetTop = alienRespawnY;
    var alienOffsetLeft = alienRespawnX;
    var aliens = [];
    var alienColors = ["magenta","MediumOrchid","DarkOrchid","DarkMagenta","purple", "gold","white","gold","white","black","gold"];
    createAliens(); // creates aliens and puts them in aliens array
    var aliensHitRight = false;
    var aliensHitLeft = true;
    var lrAlienSpeed = 1;
    var alienDescentSpeed = .2;
    // Alien Bombs
    var bombRadius = 7;
    var bombingRate = 2000;
    var lastBombTime = (new Date()).valueOf();
    var bombSpeed = 3;
    var bombBlowUpHeight = canvas.height - 1;
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
            ctx.rect(this.shipX, canvasHeight - this.shipHeight, this.shipWidth, this.shipHeight);
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

    function BonusBox(){
        this.x = Math.floor(Math.random() * canvasWidth-1) + 0.5;
        this.y = canvasHeight - bonusBoxHeight;
        this.color = 'blue';
        this.status = 1;
        this.counter = 0;

        this.show = function(){
            ctx.beginPath();
            ctx.rect(this.x, this.y, bonusBoxWidth, bonusBoxHeight);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        };
    }

    function Laser(){
        this.counter = 0;

        this.show = function(x){
            this.x = x;
            ctx.beginPath();
            ctx.rect(this.x, 0, laserRadius, canvasHeight - shipHeight);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
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

    function createAliens() {
        for(var c = 0; c < alienColumnCount; c++) {
            aliens[c] = [];
            for(var r = 0; r < alienRowCount; r++) {
                aliens[c][r] = new Alien();
            }
        }
    }

    /*
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }    
    }
    */

    /*
    ########################
    Reaction Functions
    detect hits
    increase difficulty
    */
    function newLevel(){
        aliens = [];
        alienOffsetTop = alienRespawnY;
        alienOffsetLeft = alienRespawnX;
        level++;
        if(level >= 11){
            clearInterval(loopGame);
            playerWins(points);
        }
        if(level <= 10){
            levelTimer = 0;
            newLvl = true;
            createAliens();
        }
        /*
        if(level === 5){
            rateOfFire -= 50;
        }
        */
    }

    function increaseDifficulty(){
        lrAlienSpeed += .01;
        alienDescentSpeed += 0.008;
        bombingRate -= 20;
    }

    function calcRandomBonus(){
        let ran = Math.random();
        if(ran <= .67 && ran >= .66){
            bonusBoxes.push(new BonusBox());
            bonus = true;
        }
    }

    function aliensGoLeft(){
        alienOffsetLeft -= lrAlienSpeed;
        alienOffsetTop += alienDescentSpeed;
    }

    function aliensGoRight(){
        alienOffsetLeft += lrAlienSpeed;
        alienOffsetTop += alienDescentSpeed;
    }

    function alienGroundDetection(thisAlien){
        // if alien lands
        if(thisAlien.y + alienHeight >= canvasHeight){
            //aliensTakeOver();
            //endGameLoop();
            ship.status = 2;
        }
        // if alien collides with ship
        else if(thisAlien.y + alienHeight >= canvasHeight - ship.shipHeight &&
            (thisAlien.x + alienWidth >= ship.shipX  && thisAlien.x <= ship.shipX + ship.shipWidth)){
            thisAlien.status = 2;
            ship.status = 2;
        }
    }

    function alienSideDetection(thisAlien){
        // if alien hits the right side of screen
        if(thisAlien.x + thisAlien.alienWidth > canvasWidth){
            aliensHitRight = true;
            aliensHitLeft = false;
        }
        // if alien hits left side of screen
        else if(thisAlien.x <= 0){
            aliensHitLeft = true;
            aliensHitRight = false;
        }
    }

    function alienCanAttack(thisAlien){
        if(.25 >= Math.random()){
            thisAlien.attack();
        }
    }

    function detectRocketCollision(thisAlien){
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
                    if(level <= 5){
                        increaseDifficulty();
                    }
                    // random chance at getting bonus 
                    calcRandomBonus();
                }
            }
        }
    }

    function detectLaserCollision(thisAlien){
        if(upPressed) {
            if (laser.x + laserRadius >= thisAlien.x &&
                laser.x - laserRadius <= thisAlien.x + alienWidth && thisAlien.y + alienHeight > 0) {
                hitMarker = laser.x;
                thisAlien.status = 2;
                points += 10;
                if(level <= 5){
                    increaseDifficulty();
                }
            }
        }
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
                if(rockets[x].status !== 0 && rockets[x].y > -1) {
                    rockets[x].show();
                    rockets[x].fire();
                }else{
                    rockets.splice(x--,1);
                }
            }
        }
    }

    function drawBonusBoxes(){
        for(let x = 0; x < bonusBoxes.length; x++){
            var box = bonusBoxes[x];
            box.show();
            box.counter += 1;
            if(box.x + bonusBoxWidth >= ship.shipX  && box.x <= ship.shipX + ship.shipWidth){
                laser = new Laser();
                bonus = true;
                laserOn = true;
                bonusBoxes.splice(x--,1);
            }
            else if(box.counter >= 220){
                bonusBoxes.splice(x--,1);
                bonus = false;
            }
        }
    }

    // draw aliens and call detection functions
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
                    // calc if this alien can attack
                    alienCanAttack(thisAlien);
                    // detect if alien hits screen sides
                    alienSideDetection(thisAlien);
                    if(laserOn){
                        detectLaserCollision(thisAlien);
                    }
                    detectRocketCollision(thisAlien);
                    alienGroundDetection(thisAlien);
                }
                // if alien is hit show its demise
                else if(thisAlien.status === 2){
                    thisAlien.show();
                    thisAlien.destroyed();
                }
            }
        }
        if(noAliens){
            newLevel(); 
        }
        if(aliensHitRight){
            aliensGoLeft();
        }
        else if(aliensHitLeft){
            aliensGoRight();
        }
    }

    // draw bombs still on screen
    function drawBombs(){
        if(bombs.length > 0) {
            for (var x = 0; x < bombs.length; x++) {
                // if bomb hits ground
                if(bombs[x].y + bombs[x].bombRadius >= bombBlowUpHeight){
                    bombs[x].blowUp();
                }
                // if bomb is off screen
                if(bombs[x].y > canvasHeight){
                    bombs[x].status = 0;
                }
                // if bomb is on screen show it and make it drop
                if(bombs[x].status === 1){
                    bombs[x].show();
                    bombs[x].dropBomb();
                    // if bomb hits ship, blow it up
                    if(bombs[x].x + bombs[x].bombRadius >= ship.shipX &&
                        bombs[x].x - bombs[x].bombRadius <= ship.shipX + ship.shipWidth &&
                        bombs[x].y > canvasHeight - ship.shipHeight)
                    {
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
    EVENT HANDLERS
    key and touch
     */

    function keyDownHandler(e) {
        if(e.code === "ArrowRight") {
            rightPressed = true;
        }
        else if(e.code === "ArrowLeft") {
            leftPressed = true;
        }
        else if(e.code === "ArrowUp" || e.code === "Space") {
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
        else if(e.code === "ArrowUp" || e.code === "Space") {
            upPressed = false;
        }
    }

    function endTouch(e){
        e.preventDefault();
        rightPressed = false;
        leftPressed = false;
        upPressed = false;
    }

    function touchDetection(e) {
        e.preventDefault();
        var currentX = e.changedTouches[0].pageX;
        if (currentX > 0){
            if (currentX > controlCanvasWidth/2 + 50){
                leftPressed = false;
                rightPressed = true;
            }
            else if(currentX < controlCanvasWidth/2 - 50){
                rightPressed = false;
                leftPressed = true;
            }
            else if(currentX < controlCanvasWidth/2 + 50 && currentX > controlCanvasWidth/2 - 50){
                upPressed = true;
            }
        }
    }

    // keyboard event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    //touch event listeners
    controlCanvas.addEventListener("touchend", endTouch, false);
    controlCanvas.addEventListener("touchstart", touchDetection, false);
    canvas.addEventListener("touchend", endTouch, false);
    canvas.addEventListener("touchstart", touchDetection, false);


    /*
    ##################
    GAME LOOP
    main game function
    calls all draw funcs
    controls player movement + rocket firing
     */
    function gameLoop() {
        // clears the canvas 
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // draws the ship
        drawShip();
        // draws the aliens and calls reactive functions
        drawAliens();
        // draws any rockets that might exist
        drawRockets();
        // draws alien bombs and detects bomb hits
        drawBombs();
        // if bonus box is on screen or if user collected bonus
        if(bonus){
            //draw bonus Boxes
            drawBonusBoxes();
        }

        // control movements + rocket fire
        if(rightPressed && ship.shipX <= canvasWidth-ship.shipWidth) {
            ship.shipX += 6;
        }
        else if(leftPressed && ship.shipX >= 0) {
            ship.shipX -= 6;
        }
        if(upPressed){
            if(laserOn){
                laser.show(ship.shipX + (ship.shipWidth / 2));
                laser.counter += 1;
                if(laser.counter >= 40){
                    laserOn = false;
                    bonus = false;
                    laser = null;
                }
            }
            else if(((new Date()).valueOf() - lastRocketTime) > rateOfFire) {
                rockets.push(new Rocket(ship.shipX + (ship.shipWidth / 2), canvasHeight - ship.shipHeight));
                lastRocketTime = (new Date()).valueOf();
            }
        }

        if((newLvl <= 10) && levelTimer < 100){
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
}
