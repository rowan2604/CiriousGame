// !!!!!!----------------------------!!!!!!
// Before creating a new custom collision,
// Don't forget to disable the collision of the tile in tiled (id collision activated)
// then create a new collision in custom_collisions (in main.js)
// !!!!!!----------------------------!!!!!!
class Collision{
    constructor(game, tile, config, player){
        this.game = game;
        this.player = player;
        this.tile = tile;
        this.config = config;
        this.shapes = [];
        for(let i in this.config){
            if(this.config[i] == 1){
                
                switch(i){
                    case "0":
                        this.shapes.push(this.game.add.tileSprite(this.tile.worldX, this.tile.worldY, 16, 16,  'collision_tile'));
                        break;
                    case "1":
                        this.shapes.push(this.game.add.tileSprite(this.tile.worldX + this.tile.width / 2, this.tile.worldY, 16, 16, 'collision_tile'));
                        break;
                    case "2": 
                        this.shapes.push(this.game.add.tileSprite(this.tile.worldX, this.tile.worldY + this.tile.height / 2, 16, 16, 'collision_tile'));
                        break;
                    case "3": 
                        this.shapes.push(this.game.add.tileSprite(this.tile.worldX + this.tile.width / 2, this.tile.worldY + this.tile.height / 2, 16, 16, 'collision_tile'));
                        break;
                    default: 
                        console.log("unidentified index (Collision class)");
                        break;
                }
            }
        }
        for(let i in this.shapes){      // Config of the sprite
            this.game.physics.enable(this.shapes[i], Phaser.Physics.ARCADE);
            this.shapes[i].body.collideWorldBounds = true;
            this.shapes[i].body.immovable = true;
            this.shapes[i].body.allowGravity = false;
            this.shapes[i].visible = false // To debug, set to true this value.
        }
    }

    update(){
        for(let i in this.shapes){
            this.game.physics.arcade.collide(this.player.sprite, this.shapes[i]);
        }
    }
}