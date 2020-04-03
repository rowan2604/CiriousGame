class Child { 

    constructor(game, map, layers){
        this.game = game;
        this.layers = layers;
        this.map = map;
        this.gridCollision = layers.collisions.layer.data;
        this.gridPositions = [];

        for (let i = 0; i < layers.bot_positions.layer.data.length; i++) {    //We store the position of every usable object
            for (let j = 0; j < layers.bot_positions.layer.data[0].length; j++) {
                if (layers.bot_positions.layer.data[i][j].index != -1) {
                    this.gridPositions.push([j, i]);
                }
            }
        }

        // Sprite
        this.sprite = this.game.add.sprite(22 * 32 - 2, 18 * 32 + 16, "children");
        this.sprite.scale.setTo(0.3, 0.3);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.setSize(90, 15, (120 / 2) - (105 / 2) + 10, 130 - 23);     // Hitbox   
        this.sprite.body.immovable = true;                                      // Can't be pushed
        this.sprite.body.checkCollision.none = true;

        this.position = {
            x: this.sprite.x + this.sprite.width / 2,
            y: this.sprite.y + this.sprite.height - 15
        };
        
        this.newPosition = {
            x: this.sprite.x,
            y: this.sprite.y
        }

        console.log(this.sprite.width);
        console.log(this.sprite.height);

        // Utilities
        this.currentDir = "down";
        this.isMoving = false;
        this.speed = 64;

        this.initAnimations();
        this.path = [];
        
        while (this.path.length == 0) {
            let index = Math.floor(Math.random() * this.gridPositions.length);
            console.log(this.gridPositions[index]);
            this.path = getPath(this.gridCollision, this.getCoordinates(), this.gridPositions[index]);
        }
        
        //Debug to show path
        /*
        let x = this.sprite.x;
        let y = this.sprite.y + this.sprite.height - 23;

        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0x32a852);


        //this.graphics.drawRect(this.gridUsables[20][1] * 32, this.gridUsables[20][0] * 32,32,32);
        this.graphics = game.add.graphics(0, 0);
        this.graphics.beginFill(0xfc0303);
        for (let i = 0; i < this.path.length - 1; i++) {
            if (this.path[i] == Directions.TOP) {
                y = y - 32;
                this.graphics.drawRect(x,y,32,32);
            }
            if (this.path[i] == Directions.BOTTOM) {
                y = y + 32;
                this.graphics.drawRect(x,y,32,32);
            }
            if (this.path[i] == Directions.LEFT) {
                x = x - 32;
                this.graphics.drawRect(x,y,32,32);
            }
            if (this.path[i] == Directions.RIGHT) {
                x = x + 32;
                this.graphics.drawRect(x,y,32,32);
            }
            
        }*/
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
            //this.sprite.body.velocity.setTo(x * this.speed, y * this.speed);
            this.sprite.animations.play(this.currentDir, 12);                   // 12 the number of frames for 1 loop
            this.isMoving = true;
        }
    }

    getCoordinates() {
        let coordinates = [0,0];
        coordinates[0] = Math.floor(this.position.x / 32);
        coordinates[1] = Math.floor(this.position.y / 32);
        return coordinates;z
    }

    getNewPath() {
        while (this.path.length == 0) {
            let index = Math.floor(Math.random() * this.gridPositions.length);
            this.path = getPath(this.gridCollision, this.getCoordinates(), this.gridPositions[index]);
        }
    }

    followPath() {
        if (this.path.length > 0 && !this.isMoving) {
            console.log(this.path);
            switch(this.path[0]) {
                case Directions.TOP:
                    this.move(0, -1);
                    this.newPosition.y = this.sprite.y - 32; 
                    this.newPosition.x = this.sprite.x;
                    console.log("top")
                    break;
                case Directions.BOTTOM:
                    this.move(0, 1);
                    this.newPosition.y = this.sprite.y + 32; 
                    this.newPosition.x = this.sprite.x;
                    console.log("bottom")
                    break;
                case Directions.LEFT:
                    this.move(-1, 0);
                    this.newPosition.x = this.sprite.x - 32; 
                    this.newPosition.y = this.sprite.y;
                    console.log("left")
                    break;
                case Directions.RIGHT:
                    this.move(1, 0);
                    this.newPosition.x = this.sprite.x + 32; 
                    this.newPosition.y = this.sprite.y;
                    console.log("right")
                    break;
                default:
                    console.log("Error while finding a path for child");
            }
            this.isMoving = true;
            this.game.physics.arcade.moveToXY(this.sprite, this.newPosition.x, this.newPosition.y, 1, 500);
            this.game.time.events.add(500, function () {    //we need to stop the movement after the delay
                this.isMoving = false;
                this.sprite.body.velocity.setTo(0,0);
             }, this);
            /*this.game.time.events.add(525, function () {
                this.isMoving = false;
             }, this);*/
            this.path.shift();
            if (this.path.length == 0) {    //the child has arrived to the destination
                this.game.time.events.add(5000, function () {
                    this.getNewPath();
                 }, this);
            }
        }
    }

    update(){
        this.position.x = this.sprite.x + this.sprite.width / 2;
        this.position.y =  this.sprite.y + this.sprite.height - 15;
        this.game.physics.arcade.collide(this.sprite, this.layers.bot_collisions);
        this.followPath();       

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

    render(){
        this.game.debug.body(this.sprite);
    }
}
