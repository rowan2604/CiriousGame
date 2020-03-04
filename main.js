var game = new Phaser.Game(640, 495, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON); //Load map.json / Nicolas
    game.load.image('tiles', 'map/tileset_Interior.png');//Load tileset.png / Nicolas
    game.load.spritesheet("zelda", "player/assets/zelda.png", 120, 130, 80)    // Load character spritesheet / Antoine
    game.load.image('statusBar', 'HUD/assets/StatusBar.png');  //Load statusBar image / P-T
    game.load.image('dropOfWater', 'HUD/assets/water.png'); //Load water drop image / P-T
}

let map;
let layer;
let player;
let waterBar;
let timer;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);     // Init game physics for player movement / Antoine

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

<<<<<<< HEAD
    let waterConfig = {
        x: 100, y: 20, 
        scaleBarX: 0.7, scaleBarY: 1,
        scaleIconX: 0.5, scaleIconY: 0.5, 
        initialValue: 0, //pourcentage de remplissage de la barre a l'initialisation
        color: 0x2cb2f5,
        isVertical: false
    };

    let timerConfig = {
        x: 500, y: 10,
        scale: 60,
        duration:  105  //en secondes
    }

    waterBar = new EnergyBar(game, 'statusBar', 'dropOfWater', waterConfig);
    timer = new Timer(game, timerConfig);
    timer.start();

=======
    button = game.add.button(game.world.centerX, game.world.centerY, 'button', gofull, this, 1, 0, 2);
>>>>>>> 0b84be3cf0e9aa448c192ce7cde69bab25cf1727
    player = new Player(game);                          // Spawn player after the map / Antoine
}

function gofull() { //Function fullscreen just for test / Nicolas
    if (!game.scale.isFullScreen)
    {
        game.scale.startFullScreen(false);
    }
}

function update() {
    player.update();
    timer.update();
    waterBar.update(1);
}
