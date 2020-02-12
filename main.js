var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'map/tileset_Interior.png');
}

var map;
var layer;

function create() {
    game.stage.backgroundColor = '#000000';
    map = game.add.tilemap('map');
    map.addTilesetImage('tileset_Interior', 'tiles');

    layer = map.createLayer('floor');
    layer = map.createLayer('stairs');
    layer = map.createLayer('behind');
    layer = map.createLayer('wall');
    layer = map.createLayer('carpet');
    layer = map.createLayer('windows');
    layer = map.createLayer('object');
    layer = map.createLayer('object2');
    layer = map.createLayer('object3');
    layer.resizeWorld();
}

function update() {
    
}
