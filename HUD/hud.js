class EnergyBar {

    constructor(game, statusBar, energy, config) {
        this.game = game;

        this.value = config.initialValue;

        this.statusBar = statusBar;
        this.energy = energy;/////////

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
        this.colour = config.colour;

        this.group = new Phaser.Group(this.game);
        this.graphics = game.add.graphics(0, 0);
          
        this.isVertical = config.isVertical;

        this.initPosition(this.isVertical);
    }

    initPosition(isVertical) {
        let spriteBar
        let spriteIcon;
        this.graphics.beginFill(this.colour);

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
        this.graphics.beginFill(this.colour);
        (this.isVertical) ? this.graphics.drawRect(this.statusBarX, this.statusBarY + this.heightBar - this.value * this.heightBar / 100, this.widthBar, this.value * this.heightBar / 100) : this.graphics.drawRect(this.statusBarX, this.statusBarY, this.value / 100 * this.heightBar, this.widthBar);
    }
}

/*class WaterBar extends Energy {

}

class ElectricityBar extends Energy {
    
}*/

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var waterBar;
var elapsedTime;

function preload() {
    game.stage.backgroundColor = 'rgb(255, 255, 255)'

    game.load.image('statusBar', 'assets/StatusBar.png');
    game.load.image('dropOfWater', 'assets/water.png');
}


function create() {
    var waterConfig = {
        x: 200, y: 100, 
        scaleBarX: 1, scaleBarY: 1,
        scaleIconX: 1, scaleIconY: 1, 
        initialValue: 0, //pourcentage de remplissage de la barre a l'initialisation
        colour: 0x2cb2f5,
        isVertical: true
    };

    var waterConfig2 = {
        x: 375, y: 340, 
        scaleBarX: 1, scaleBarY: 1,
        scaleIconX: 1, scaleIconY: 1, 
        initialValue: 100, //pourcentage de remplissage de la barre a l'initialisation
        colour: 0x2ad4a6,
        isVertical: false
    };

    waterBar = new EnergyBar(game, 'statusBar', 'dropOfWater', waterConfig);
    waterBar2 =  new EnergyBar(game, 'statusBar', 'dropOfWater', waterConfig2);
}

function update() {
    waterBar.update(1);
    waterBar2.update(-1)
}
