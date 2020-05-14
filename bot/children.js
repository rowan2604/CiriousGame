class Child { 

    constructor(game, map, layers, position, initialPosition, spritesheet, interaction){  //position is the future destination
        this.game = game;
        this.layers = layers;
        this.map = map;
        this.gridCollision = layers.bot_collisions.layer.data;
        this.gridUsables = layers.usables;
        this.interaction = interaction;
        this.texture = spritesheet;

        // Sprite
        this.sprite = this.game.add.sprite(initialPosition.x, initialPosition.y, spritesheet);
        this.sprite.scale.setTo(0.9, 0.9);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.setSize(30, 10, 10, 48*0.9-10);     // Hitbox   
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
        this.botPositions = [];
        for (let i = 0; i < layers.bot_positions.layer.data.length; i++) {    //We store the position of every usable object
            for (let j = 0; j < layers.bot_positions.layer.data[0].length; j++) {
                if (layers.bot_positions.layer.data[i][j].index != -1) {
                    this.botPositions.push([j, i]);
                }
            }
        }


        // Utilities
        this.destination = position;
        this.currentDir = "down";
        this.isMoving = false;
        this.speed = 64;
        this.timeToWalk = 500;
        this.timeWaiting = 5000;

        this.isWaiting = false;

        this.initAnimations();
        this.path = [];


        this.game.time.events.add(800, function () {    //Child wait a little bit before moving
            this.path = getPath(this.gridCollision, this.getCoordinates(), position);
         }, this);

        //Debug current path
        /*
        let x = this.sprite.x;
        let y = this.sprite.y + this.sprite.height - 23;

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
        
        /*while (this.path.length == 0) {
            let index = Math.floor(Math.random() * this.gridPositions.length);
            //console.log(this.gridPositions[index]);
            this.path = getPath(this.gridCollision, this.getCoordinates(), this.gridPositions[index]);
        }*/
    }

    initAnimations(){
        this.sprite.animations.add("down", [0, 4, 8, 12]);
        this.sprite.animations.add("left", [1, 5, 9, 13]);
        this.sprite.animations.add("up", [2, 6, 10, 14]);
        this.sprite.animations.add("right", [3, 7, 11, 15]);
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
        return coordinates;
    }
    getNewPath(position) {
        this.path = getPath(this.gridCollision, this.getCoordinates(), position);
        while (this.path.length == 0) {
            let index = Math.floor(Math.random() * this.botPositions.length);
            this.path = getPath(this.gridCollision, this.getCoordinates(), this.botPositions[index]);
        }
    }
    
    checkForObject(){
        let x = this.layers.object2.getTileX(this.position.x);
        let y = this.layers.object2.getTileY(this.position.y);
        this.currentDir = this.getDirectionToLookAt(this.destination);//We need the child to be in front of the object he's interacting with
        if(this.map.getTile(x, y, this.layers.usables) == null){
            switch(this.currentDir){
                case "up":
                    if (this.destination[0] < 19 && this.destination[1] < 18) {
                        return this.map.getTile(x, y - 2, this.layers.usables);
                    }
                    else {
                        return this.map.getTile(x, y - 1, this.layers.usables);
                    }
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

    followPath(position) {
        if (this.path.length > 0 && !this.isMoving) {
            switch(this.path[0]) {
                case Directions.TOP:
                    this.move(0, -1);
                    this.newPosition.y = this.sprite.y - 32; 
                    this.newPosition.x = this.sprite.x;
                    break;
                case Directions.BOTTOM:
                    this.move(0, 1);
                    this.newPosition.y = this.sprite.y + 32; 
                    this.newPosition.x = this.sprite.x;
                    break;
                case Directions.LEFT:
                    this.move(-1, 0);
                    this.newPosition.x = this.sprite.x - 32; 
                    this.newPosition.y = this.sprite.y;
                    break;
                case Directions.RIGHT:
                    this.move(1, 0);
                    this.newPosition.x = this.sprite.x + 32; 
                    this.newPosition.y = this.sprite.y;
                    break;
                default:
                    console.log("Error while finding a path for child");
            }
            this.isMoving = true;
            //this.game.physics.arcade.moveToXY(this.sprite, this.newPosition.x, this.newPosition.y, 1, 500);
            this.tween = this.game.add.tween(this.sprite).to({x: this.newPosition.x, y: this.newPosition.y}, this.timeToWalk);
            this.tween.start();
            this.path.shift();
            this.game.time.events.add(this.timeToWalk, function () {    //we need to stop the movement after the delay
                this.isMoving = false;
                this.sprite.body.velocity.setTo(0,0);
                if (this.path.length == 0) {
                    let object = this.checkForObject();
                    //console.log(object)
                    if (object) {
                        //console.log("objectX: ", object.x);
                        //console.log("objectY: ", object.y);
                        if (!this.interaction.active(object)) {
                            this.interaction.interact(object.index);
                        }
                        this.timeToWalk -= 20;
                    }

                }
            }, this);

            if (this.path.length == 0) {    //the child has arrived to the destination
                this.game.time.events.add(this.timeWaiting, function () {
                    this.getNewPath(position);
                    this.destination = position;
                    this.timeWaiting -= 80;
                 }, this);
            }
        }
        else {  //ending game
            
        }
    }

    getDirectionToLookAt(destination) {
        let direction = "";
        let possibleDirections = {
            "up": [destination[0], destination[1] - 1],
            "down": [destination[0], destination[1] + 1],
            "left": [destination[0] - 1, destination[1]],
            "right": [destination[0] + 1, destination[1]],
            "up2": [destination[0], destination[1] - 2], //we need to check two tiles ahead in kitchen
        };
        for (let dir in possibleDirections) {
            let position = {x: possibleDirections[dir][0], y: possibleDirections[dir][1]};
            if (this.map.getTile(position.x, position.y, this.gridUsables)) {   //if we found the object to use
                direction = dir;
                break;
            }
        }
        if (direction == "up2") {
            direction = "up";
        }
        return direction;
    }

    update(position){
        this.position.x = this.sprite.x + this.sprite.width / 2;
        this.position.y =  this.sprite.y + this.sprite.height - 15;
        this.game.physics.arcade.collide(this.sprite, this.layers.bot_collisions);
        this.followPath(position); 
    

        // If bot doesn't move, set him to an idle position
        if(!this.isMoving){
            switch(this.currentDir){               // The sprite display depends on the last player's direction
            case "up":
                this.sprite.loadTexture(this.texture, 2);
                break;
            case "down":
                this.sprite.loadTexture(this.texture, 0);
                break;
            case "right":
                this.sprite.loadTexture(this.texture, 3);
                break;
            case "left":
                this.sprite.loadTexture(this.texture, 1);
                break;
            default:
                this.sprite.loadTexture(this.texture, 0);
            }
        }
    }

    render(){
        this.game.debug.body(this.sprite);
    }
}
