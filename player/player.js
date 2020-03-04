class Player{
    constructor(game){
        this.game = game;
        // Controls
        this.directions_keys = this.game.input.keyboard.createCursorKeys();                // Conttrols keys
        this.sprint_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);           // Sprint key

        // Sprite / Physics
        this.sprite = this.game.add.sprite(0, 0, "zelda");
        this.sprite.scale.setTo(0.4, 0.4);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;

        // Utilities
        this.maxStamina = 100;
        this.curStamina = this.maxStamina;
        this.speed = 100;
        this.sprintSpeedScale = 2;
        this.isSprinting = false;
        this.isTired = false;           // If we just used the full stamina, we can't sprint right after

        // Animations
        this.currentDir = "";
        this.initAnimations();
    }

    initAnimations(){
        this.sprite.animations.add("down", [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
        this.sprite.animations.add("left", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        this.sprite.animations.add("up", [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]);
        this.sprite.animations.add("right", [70, 71, 72, 73, 74, 75, 76, 77, 78, 79]);
    }

    move(x, y){                                 // x horizontal move / y vertical move
        if(this.isSprinting){
            this.sprite.body.velocity.setTo(x * this.speed * this.sprintSpeedScale, y * this.speed * this.sprintSpeedScale);
            this.sprite.animations.play(this.currentDir, 17);
        }
        else{
            this.sprite.body.velocity.setTo(x * this.speed, y * this.speed);
            this.sprite.animations.play(this.currentDir, 10);
        }
    }
    checkForActions(){
        if(this.directions_keys.up.isDown){         // Direction UP
            this.move(0, -1);
            this.currentDir = "up"
        }
        else if(this.directions_keys.left.isDown){  // Direction LEFT
            this.move(-1, 0);
            this.currentDir = "left"
        }
        else if(this.directions_keys.right.isDown){ // Direction RIGHT
            this.move(1, 0);
            this.currentDir = "right"
        }
        else if(this.directions_keys.down.isDown){  // Direction DOWN
            this.move(0, 1, this.speed);
            this.currentDir = "down"
        }
        else{                                       // Else, player isn't moving
            this.sprite.body.velocity.setTo(0, 0);
            switch(this.currentDir){               // The sprite display depends on the last player's direction
                case "up":
                    this.sprite.loadTexture("zelda", 20);
                    break;
                case "down":
                    this.sprite.loadTexture("zelda", 0);
                    break;
                case "right":
                    this.sprite.loadTexture("zelda", 30);
                    break;
                case "left":
                    this.sprite.loadTexture("zelda", 10);
                    break;
                default:
                    this.sprite.loadTexture("zelda", 0);
            }
            this.sprite.animations.stop();                      // Stop animation.
        }
        // Sprint system
        if(this.sprint_key.isDown && !this.isTired){                             // If sprinting key down ...
            this.isSprinting = true;                            // We update isSprinting
            this.curStamina -= 0.5;
        }
        else{
            this.isSprinting = false;
            if(this.curStamina < this.maxStamina){
                this.curStamina += 0.25;
                if(this.curStamina >= 30 && this.isTired){
                    this.isTired = false;
                }
            }
        }
        if(this.curStamina <= 0){
            this.isTired = true;
        }
    }
    update(){
        this.checkForActions();
    }
};

/*let game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

let player;

function preload(){
    game.load.spritesheet("zelda", "assets/zelda.png", 120, 130, 80)
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = new Player(game);
}

function update(){
    player.update();
}*/