class Player{
    constructor(game, map, layers){
        this.game = game;
        this.map = map;
        this.layers = layers;

        // Controls
        this.directions_keys = this.game.input.keyboard.createCursorKeys();                // Conttrols keys
        this.sprint_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);           // Sprint key
        this.use_key = this.game.input.keyboard.addKey(Phaser.Keyboard.E);

        // Sprite / Physics
        this.sprite = this.game.add.sprite(390, 420, "zelda");
        this.sprite.scale.setTo(0.4, 0.4);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        // Adjust hitbox
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.setSize(105, 15, (120 / 2) - (105 / 2), 130 - 15);

        this.position = {
            x: this.sprite.x + this.sprite.width / 2,
            y: this.sprite.y + this.sprite.height - 5
        };


        // Utilities
        this.maxStamina = 100;
        this.curStamina = this.maxStamina;
        this.speed = 100;
        this.sprintSpeedScale = 2;
        this.isSprinting = false;
        this.isTired = false;           // If we just used the full stamina, we can't sprint right after
        
        this.staminaBar = new StaminaBar(game, 1280/2, 700, 500, 15, 10, 0x0a63f2);

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
        // Avoid sprint spam
        if(this.curStamina <= 0){
            this.isTired = true;
        }

        if(this.use_key.isDown){
            console.log("I used something !");
        }

        // Moving system
        if(this.directions_keys.up.isDown){         // Direction UP
            this.move(0, -1);
            this.currentDir = "up"
            if(this.isSprinting){
                this.curStamina -= 0.5;
            }
        }
        else if(this.directions_keys.left.isDown){  // Direction LEFT
            this.move(-1, 0);
            this.currentDir = "left"
            if(this.isSprinting){
                this.curStamina -= 0.5;
            }
        }
        else if(this.directions_keys.right.isDown){ // Direction RIGHT
            this.move(1, 0);
            this.currentDir = "right"
            if(this.isSprinting){
                this.curStamina -= 0.5;
            }
        }
        else if(this.directions_keys.down.isDown){  // Direction DOWN
            this.move(0, 1, this.speed);
            this.currentDir = "down"
            if(this.isSprinting){
                this.curStamina -= 0.5;
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

    getStamina(){
        return this.curStamina;
    }

    getPosition(){
        return this.position;
    }

    getCurrentTile(){
        let x = this.layers.floor.getTileX(this.position.x);
        let y = this.layers.floor.getTileY(this.position.y);
        let tile = this.map.getTile(x, y, this.layers.wall);
        return this.map.getTile(x, y, this.layers.floor);
    }

    update(){
        this.game.physics.arcade.collide(this.sprite, this.layers.wall);
        this.game.physics.arcade.collide(this.sprite, this.layers.collision);
        this.game.physics.arcade.collide(this.sprite, this.layers.collision2);
        this.checkForActions();
        // Player position tracked on his feets.
        this.position.x = this.sprite.x + this.sprite.width / 2;
        this.position.y = this.sprite.y + this.sprite.height - 5;
        this.staminaBar.update(this.getStamina());
    }

    /*render(){
        this.game.debug.body(this.sprite);
    }*/
};