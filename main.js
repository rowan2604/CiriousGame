var game = new Phaser.Game(640, 495, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON); //Load map.json / Nicolas
    game.load.image('tiles', 'map/tileset_Interior.png');//Load tileset.png / Nicolas
}

var map;
var layer;

function create() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;//Fullscreen mod just for test / Nicolas
    game.stage.backgroundColor = '#000000';

    game.input.mouse.capture = true; //Capture mouse just for test can be remove / Nicolas
    game.input.onDown.add(gofull, this);//Just for test can be remove / Nicolas

    map = game.add.tilemap('map'); //Load map with different layer, don't touch / Nicolas
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

function gofull() { //Function fullscreen just for test / Nicolas
    if (!game.scale.isFullScreen)
    {
        game.scale.startFullScreen(false);
    }
}

function update() {
    
}
