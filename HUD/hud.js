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

        //this.filling = new Phaser.Rectangle(this.statusBarX + 50, this.statusBarY + 4, this.widthBar - 2, this.heightBar - 2);
        this.color = config.color;

        this.group = new Phaser.Group(this.game);
        this.graphics = game.add.graphics(0, 0);
          
        this.isVertical = config.isVertical;

        this.initPosition(this.isVertical);
    }

    initPosition(isVertical) {
        let spriteBar
        let spriteIcon;
        this.graphics.beginFill(this.color);

        if (isVertical) {
            this.iconX = this.statusBarX + this.widthBar / 2 - this.widthIcon / 2;  //50 ecart entre bar et icone
            this.iconY = this.statusBarY + this.heightBar + 25;
            
            this.group.add(this.graphics);
            spriteBar = this.group.create(this.statusBarX, this.statusBarY, this.statusBar);
            spriteIcon = this.group.create(this.iconX, this.iconY, this.energy);

            this.graphics.drawRect(this.statusBarX, this.statusBarY + this.heightBar - 1, this.widthBar, 1);

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

            this.graphics.drawRect(this.statusBarX, this.statusBarY, 1, this.widthBar);

            spriteBar.scale.setTo(this.scaleBarX, this.scaleBarY);
            spriteIcon.scale.setTo(this.scaleIconX, this.scaleIconY);
        }
       
    }

    update(gain) {
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
        //this.timerDisplay.font = "assets/FFFFORWA";
    }

    newTimer(beginTime, duration) {
        this.timer = this.game.time.create();
        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * this.duration, this.stop, this);
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
            text = "00:00";
        }
        return text;
    }

    update() {
        if (this.timer.running) {
            this.time = this.getCurrentTime()
            //console.log(this.time);
            this.timerDisplay.text = this.time;
        } 
        else {
            this.timerDisplay.text = "Time out!"; //si le chrono est terminé
        }
    }
}
/*
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
ffff
var waterBar;
var timer;

function preload() {
    game.stage.backgroundColor = 'rgb(255, 255, 255)'

    //game.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
    game.load.image('statusBar', 'assets/StatusBar.png');
    game.load.image('dropOfWater', 'assets/water.png');
}


function create() {
    let waterConfig = {
        x: 200, y: 100, 
        scaleBarX: 1, scaleBarY: 1,
        scaleIconX: 1, scaleIconY: 1, 
        initialValue: 0, //pourcentage de remplissage de la barre a l'initialisation
        color: 0x2cb2f5,
        isVertical: true
    };

    let timerConfig = {
        x: 250, y:250,
        scale: 60,
        duration:  105  //en secondes
    }

    waterBar = new EnergyBar(game, 'statusBar', 'dropOfWater', waterConfig);
    timer = new Timer(game, timerConfig);
    timer.start();
}

function update() {
    waterBar.update(1);
    timer.update();
}*/
