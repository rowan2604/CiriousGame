class Player{
    constructor(game){
        this.game = game;
        this.stamina = 100;
    }
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload(){
    game.load.spritesheet("zelda", "assets/zelda.png", 120, 130, 80)
}

function create(){
    let sprite = game.add.sprite(0, 0, "zelda");
    // All moving animations
    sprite.animations.add("idle_down", [0, 1, 2]);
    sprite.animations.add("idle_left", [10, 11, 12]);
    sprite.animations.add("idle_up", [20, 21, 22]);
    sprite.animations.add("idle_right", [30, 31, 32]);
    sprite.animations.add("down", [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]);
    sprite.animations.add("left", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
    sprite.animations.add("up", [60, 61, 62, 63, 64, 65, 66, 67, 68, 69]);
    sprite.animations.add("right", [70, 71, 72, 73, 74, 75, 76, 77, 78, 79]);
    // test
    sprite.animations.play("down", 10, true);
}

function update(){

}