var game = new Phaser.Game(500, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('map', 'assets/test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/pokemon_like_fundations.png');
}

var map;
var layer;

function create() {
    game.stage.backgroundColor = '#787878';

    //  The 'mario' key here is the Loader key given in game.load.tilemap
    map = game.add.tilemap('map');

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    map.addTilesetImage('Fundations', 'tiles');
    
    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    layer = map.createLayer('Floor');

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();
}

function update() {
    
}
