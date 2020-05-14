class Player{
    constructor(game, map, layers, interaction){
        this.game = game;
        this.map = map;
        this.layers = layers;
        this.interaction = interaction;

        // Controls
        this.up_key = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.down_key = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        this.sprint_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);           // Sprint key
        this.use_key = this.game.input.keyboard.addKey(Phaser.Keyboard.E);                  // Use key
        this.use_key.onDown.add(this.interacted, this);

        // Sprite / Physics
        this.sprite = this.game.add.sprite(715, 610, "zelda");
        this.sprite.scale.setTo(0.4, 0.4);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        // Adjust hitbox
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(105, 23, (120 / 2) - (105 / 2), 130 - 23);

        this.position = {
            x: this.sprite.x + this.sprite.width / 2,
            y: this.sprite.y + this.sprite.height - 15
        };


        // Utilities
        this.maxStamina = 100;
        this.curStamina = this.maxStamina;
        this.speed = 100;
        this.sprintSpeedScale = 2;
        this.isSprinting = false;
        this.isTired = false;           // If we just used the full stamina, we can't sprint right after
        
        this.staminaBar = new StaminaBar(game, 1280/2, 710, 500, 3, 2, 0x0a63f2);

        // Animations
        this.currentDir = "down";
        this.initAnimations();

    }

    initAnimations(){
        this.sprite.animations.add("down", [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
        this.sprite.animations.add("left", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        this.sprite.animations.add("up", [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]);
        this.sprite.animations.add("right", [70, 71, 72, 73, 74, 75, 76, 77, 78, 79]);
    }

    move(x, y){                                 // x horizontal move / y vertical move (between 1 and -1)
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
        // Sprint system
        if(this.sprint_key.isDown && !this.isTired){                             // If sprinting key down ...
            this.isSprinting = true;                                             // We update isSprinting
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
        if(this.curStamina <= 0){      // Avoid sprint spam
            this.isTired = true;
        }

        // Moving system
        if(this.up_key.isDown){         // Direction UP
            this.move(0, -1);
            this.currentDir = "up"
            if(this.isSprinting){
                this.curStamina -= 0.5;
                if(this.curStamina < 0){
                    this.curStamina = 0;
                }
            }
        }
        else if(this.left_key.isDown){  // Direction LEFT
            this.move(-1, 0);
            this.currentDir = "left"
            if(this.isSprinting){
                this.curStamina -= 0.5;
                if(this.curStamina < 0){
                    this.curStamina = 0;
                }
            }
        }
        else if(this.right_key.isDown){ // Direction RIGHT
            this.move(1, 0);
            this.currentDir = "right"
            if(this.isSprinting){
                this.curStamina -= 0.5;
                if(this.curStamina < 0){
                    this.curStamina = 0;
                }
            }
        }
        else if(this.down_key.isDown){  // Direction DOWN
            this.move(0, 1, this.speed);
            this.currentDir = "down"
            if(this.isSprinting){
                this.curStamina -= 0.5;
                if(this.curStamina < 0){
                    this.curStamina = 0;
                }
            }
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
    }

    checkForObject(){
        let x = this.layers.object2.getTileX(this.position.x);
        let y = this.layers.object2.getTileY(this.position.y);

        if(this.map.getTile(x, y, this.layers.usables) == null){
            switch(this.currentDir){
                case "up":
                    return this.map.getTile(x, y - 1, this.layers.usables);
                case "down":
                    return this.map.getTile(x, y + 1, this.layers.usables);
                case "left":
                    return this.map.getTile(x - 1, y, this.layers.usables);
                case "right":
                    return this.map.getTile(x + 1, y, this.layers.usables);
                default:                                                    // Error
                    console.log("unidentified direction (checkForObject)");
            }
        }
        else{
            return this.map.getTile(x, y, this.layers.usables);
        }
    }

    interacted(){                               // If the player interacts, returns true. Else returns false.
        var object = this.getObjectTile();
        if(object != null){
            this.interaction.interact(object.index);
        }
    }

    getStamina(){
        return this.curStamina;
    }

    getPosition(){
        return this.position;
    }

    getCurrentTile(){
        let x = this.layers.floor.getTileX(this.position.x);
        let y = this.layers.floor.getTileY(this.position.y);
        return this.map.getTile(x, y, this.layers.floor);
    }

    getObjectTile(){                            // Returns the object tile (If no object in front of player, returns null).
        return this.checkForObject();
    }

    update(){
        this.game.physics.arcade.collide(this.sprite, this.layers.collisions);
        this.checkForActions();
        this.checkForObject();
        // Player position tracked on his feets.
        this.position.x = this.sprite.x + this.sprite.width / 2;
        this.position.y = this.sprite.y + this.sprite.height - 15;
        
        this.staminaBar.update(this.getStamina());
    }

    /*render(){
        this.game.debug.body(this.sprite);
    }*/
};