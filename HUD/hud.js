class EnergyBar {

    constructor(game, statusBar, energy, config) {
        this.game = game;

        this.value = config.initialValue;

        this.statusBar = statusBar;
        this.energy = energy;

        this.statusBarImage = this.game.cache.getImage(statusBar);
        this.energyImage = this.game.cache.getImage(energy);

        this.scaleBarX = config.scaleBarX;
        this.scaleBarY = config.scaleBarY;
        this.scaleIconX = config.scaleIconX;
        this.scaleIconY = config.scaleIconY;

        this.widthBar = this.statusBarImage.width * this.scaleBarX;
        this.heightBar = this.statusBarImage.height * this.scaleBarY;
        this.widthIcon = this.energyImage.width * this.scaleIconX;
        this.heightIcon = this.energyImage.height * this.scaleIconY;

        this.statusBarX = config.x;
        this.statusBarY = config.y;
        this.iconX = 0;
        this.iconY = 0;

        this.color = config.color;

        this.group = new Phaser.Group(this.game);
        this.graphics = game.add.graphics(0, 0);
          
        this.isVertical = config.isVertical;

        this.timer;
        this.timerEvent;
        this.elapsedTime = 0;
        this.isTimerRunning = false;
        this.duration = 5;

        this.initPosition(this.isVertical);
    }

    initPosition(isVertical) {
        let spriteBar
        let spriteIcon;
        //this.graphics.beginFill(this.color);

        if (isVertical) {
            this.iconX = this.statusBarX + this.widthBar / 2 - this.widthIcon / 2;  //50 ecart entre bar et icone
            this.iconY = this.statusBarY + this.heightBar + 25;
            
            this.group.add(this.graphics);
            spriteBar = this.group.create(this.statusBarX, this.statusBarY, this.statusBar);
            spriteIcon = this.group.create(this.iconX, this.iconY, this.energy);

            //this.graphics.drawRect(this.statusBarX, this.statusBarY + this.heightBar - 1 + 4, this.widthBar - 8, 1);

            spriteBar.scale.setTo(this.scaleBarX, this.scaleBarY);
            spriteIcon.scale.setTo(this.scaleIconX, this.scaleIconY);
        } 
        else {
            this.iconX = this.statusBarX - this.widthIcon - 25;
            this.iconY = this.statusBarY + this.widthBar / 2 - this.heightIcon / 2;

            this.group.add(this.graphics);
            spriteBar = this.group.create(this.statusBarX, this.statusBarY + this.widthBar, this.statusBar);
            spriteIcon = this.group.create(this.iconX, this.iconY, this.energy);
            spriteBar.angle -= 90;
            
            //this.graphics.drawRect(this.statusBarX + 4, this.statusBarY, 1, this.widthBar - 8);

            spriteBar.scale.setTo(this.scaleBarX, this.scaleBarY);
            spriteIcon.scale.setTo(this.scaleIconX, this.scaleIconY);
        }
       
    }

    update() {
        if (this.value == 100 && !this.isTimerRunning) {
            this.isTimerRunning = true;
            this.newTimer(this.duration);
            this.timer.start();
        }
        if (this.value == 100 && this.isTimerRunning) {
            this.elapsedTime = this.duration - this.getCurrentTime();
            
            this.graphics.clear();
            if (this.elapsedTime % 0.6 > 0 && this.elapsedTime % 0.6 < 0.3) { //We flicker the color to red to warn the player
                this.graphics.beginFill(0xfc0303);
            } else {
                this.graphics.beginFill(this.color);
            }
            if (this.isVertical) {
                this.graphics.drawRect(this.statusBarX, this.statusBarY + this.heightBar - this.value * this.heightBar / 100 + 4, this.widthBar, this.value * this.heightBar / 100 - 8);
            } else {
                this.graphics.drawRect(this.statusBarX + 4, this.statusBarY, this.value / 100 * this.heightBar - 8, this.widthBar);
            }
        }
        /*
        if (this.value + gain > 100) {
            this.value = 100;

        } else if (this.value + gain < 0) {
            this.value = 0
        }
        else {
            this.value += gain;
        }
        this.graphics.clear();
        this.graphics.beginFill(this.color);
        (this.isVertical) ? this.graphics.drawRect(this.statusBarX, this.statusBarY + this.heightBar - this.value * this.heightBar / 100, this.widthBar, this.value * this.heightBar / 100) : this.graphics.drawRect(this.statusBarX, this.statusBarY, this.value / 100 * this.heightBar, this.widthBar);
        */
    }

    setValue(value) {
        if (value > 100) {
            this.value = 100;
        } else if (value < 0) {
            this.value = 0;
        }
        else {
            this.value = value;
        }
        this.graphics.clear();
        this.graphics.beginFill(this.color);
        if (this.isVertical) {
            this.graphics.drawRect(this.statusBarX, this.statusBarY + this.heightBar - this.value * this.heightBar / 100 + 4, this.widthBar, this.value * this.heightBar / 100);
        } else {
            this.graphics.drawRect(this.statusBarX + 4, this.statusBarY, this.value / 100 * this.heightBar, this.widthBar);
        }
    }

    newTimer(duration) {
        this.timer = this.game.time.create();
        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * duration, this.stopTimer, this);
    }

    stopTimer() {
        this.timer.stop();
        this.isTimerRunning = false;
        console.log("Game Over");
    }

    getCurrentTime() {
        let time = (this.timerEvent.delay - this.timer.ms) / 1000;
        return time;
    }

    getValue(){
        return this.value;
    }
}

class Timer {
    constructor(game, config) {
        this.x = config.x;
        this.y = config.y;
        this.scale = config.scale;
        this.duration = config.duration;
        this.game = game;
        
        this.timer;
        this.timerEvent;
        
        this.newTimer(this.duration);
        this.time = this.formatTime(0);
        this.timerDisplay = this.game.add.text(this.x, this.y, this.time);
        this.timerDisplay.fontSize = this.scale;
    }

    newTimer(duration) {
        this.timer = this.game.time.create();
        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * duration, this.stop, this);
    }

    start() {
        this.timer.start();
    }

    stop() {
        this.timer.stop();
    }

    getCurrentTime() {
        let time = Math.floor((this.timerEvent.delay - this.timer.ms) / 1000);
        return this.formatTime(time);
    }

    getTimeSeconds() {
        return Math.floor((this.timerEvent.delay - this.timer.ms) / 1000);
    }

    formatTime(sec) {
        let text = "";
        if (sec > 0) {
            let minutes = String(Math.floor(sec / 60));
            let seconds = "0" + (sec - minutes * 60);

            text = minutes.substr(-2) + ":" + seconds.substr(-2);   
            //console.log(text);
        }
        else {
            text = "0:00";
        }
        return text;
    }

    update() {
        let isFinished = false;
        if (this.timer.running) {
            this.time = this.getCurrentTime()
            //console.log(this.time);
            this.timerDisplay.text = this.time;
        } 
        else {
            this.timerDisplay.visible = false; //si le chrono est terminé
            isFinished = true;

        }
        return isFinished;
    }
}

class StaminaBar {

    constructor(game, x, y, width, height, radius, color) {
        this.game = game;
        this.x = x - width / 2;
        this.y = y - height / 2;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.color = color;
        this.graphics = this.game.add.graphics(0,0);


        this.graphics.beginFill(0x000000);
        this.graphics.drawRoundedRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2, this.radius);
        this.graphics.endFill();    

        this.graphics.beginFill(this.color);
        this.graphics.drawRoundedRect(this.x, this.y, this.width, this.height, this.radius);
        this.graphics.endFill();
    }

    update(staminaLevel) {
        this.graphics.clear()

        let width = this.width * staminaLevel / 100;
        let x = this.x + this.width / 2 - width / 2;

        this.graphics.beginFill(0x000000);
        this.graphics.drawRoundedRect(x - 1, this.y - 1, width + 2, this.height + 2, this.radius);
        this.graphics.endFill();    
        this.graphics.beginFill(this.color);
        this.graphics.drawRoundedRect(x, this.y, width, this.height, this.radius);
        this.graphics.endFill();
    }
}
