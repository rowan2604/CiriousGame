class Child{

    constructor(game, layers){
        this.game = game;
        this.layers = layers;

        // Sprite
        this.sprite = this.game.add.sprite(350, 400, "children");
        this.sprite.scale.setTo(0.3, 0.3);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.setSize(105, 23, (120 / 2) - (105 / 2), 130 - 23);     // Hitbox   
        this.sprite.body.immovable = true;                                      // Can't be pushed

        // Utilities
        this.currentDir = "down";
        this.isMoving = false;
        this.speed = 150;

        this.initAnimations();
    }

    initAnimations(){
        this.sprite.animations.add("down", [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
        this.sprite.animations.add("left", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        this.sprite.animations.add("up", [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]);
        this.sprite.animations.add("right", [70, 71, 72, 73, 74, 75, 76, 77, 78, 79]);
    }

    move(x, y){             // x for horizontal (-1 for left and 1 for right) / y for vertical (-1 for up, 1 for down) 0, 0 to idle
        switch(x){
            case 1:
                this.currentDir = "right";
                break;
            case -1:
                this.currentDir = "left";
                break;
            default:
                switch(y){
                    case 1:
                        this.currentDir = "down";
                        break;
                    case -1:
                        this.currentDir = "up";
                        break;
                    default:
                        console.log("bot isn't moving");
                }
        }
        if(x == y){
            this.sprite.body.velocity.setTo(0, 0);
            this.sprite.animations.stop();
            this.isMoving = false;
        }
        else{
            this.sprite.body.velocity.setTo(x * this.speed, y * this.speed);
            this.sprite.animations.play(this.currentDir, 12);                   // 12 the number of frames for 1 loop
            this.isMoving = true;
        }

    }

    update(){
        this.game.physics.arcade.collide(this.sprite, this.layers.collisions);
        this.move(0, -1);       // Debug line to test bot movement
        // If bot doesn't move, set him to an idle position
        if(!this.isMoving){
            switch(this.currentDir){               // The sprite display depends on the last player's direction
            case "up":
                this.sprite.loadTexture("children", 20);
                break;
            case "down":
                this.sprite.loadTexture("children", 0);
                break;
            case "right":
                this.sprite.loadTexture("children", 30);
                break;
            case "left":
                this.sprite.loadTexture("children", 10);
                break;
            default:
                this.sprite.loadTexture("children", 0);
            }
        }
    }

    /*render(){
        this.game.debug.body(this.sprite);
    }*/
}
