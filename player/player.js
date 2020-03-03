class Player{
    constructor(game){
        this.game = game;
        this.stamina = 100;
    }
    
};

let game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

let player;
let directions;

function preload(){
    game.load.spritesheet("zelda", "assets/zelda.png", 120, 130, 80)
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    player = game.add.sprite(0, 0, 'zelda');
    player.scale.setTo(0.7, 0.7);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    // All moving animations
    player.animations.add("down", [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
    player.animations.add("left", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
    player.animations.add("up", [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]);
    player.animations.add("right", [70, 71, 72, 73, 74, 75, 76, 77, 78, 79]);
    // test
    //sprite.animations.play("up", 10, true);
    directions = game.input.keyboard.createCursorKeys();
}
let lastAnim;
function update(){
    if(directions.down.isDown){
        player.body.velocity.setTo(0, 100);
        player.animations.play("down", 10, true);
        lastAnim = "down";
    }
    else if(directions.up.isDown){
        player.body.velocity.setTo(0, -100);
        player.animations.play("up", 10, true);
        lastAnim = "up";
    }
    else if(directions.right.isDown){
        player.body.velocity.setTo(100, 0);
        player.animations.play("right", 10, true);
        lastAnim = "right";
    }
    else if(directions.left.isDown){
        player.body.velocity.setTo(-100, 0);
        player.animations.play("left", 10, true);
        lastAnim = "left";
    }
    else{
        player.body.velocity.setTo(0, 0);
        switch(lastAnim){
            case "up":
                player.loadTexture("zelda", 20);
                break;
            case "down":
                player.loadTexture("zelda", 0);
                break;
            case "right":
                player.loadTexture("zelda", 30);
                break;
            case "left":
                player.loadTexture("zelda", 10);
                break;
            default:
                player.loadTexture("zelda", 0);
        }
        player.animations.stop(true);
    }
}