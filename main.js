var game = new Phaser.Game(640, 495, Phaser.AUTO, '', { preload: preload, create: create, update: update/*, render: render*/});

function preload() {
    game.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON); //Load map.json / Nicolas
    game.load.image('tiles', 'map/tileset_Interior.png'); //Load tileset.png / Nicolas
    game.load.spritesheet("zelda", "player/assets/zelda.png", 120, 130, 80) //Load character spritesheet / Antoine
    game.load.image('statusBar', 'HUD/assets/StatusBar.png'); //Load statusBar image / P-T
    game.load.image('dropOfWater', 'HUD/assets/water.png'); //Load water drop image / P-T
}

let map;
let layers;
let player;
let waterBar;
let timer;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); //Init game physics for player movement / Antoine

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; //Fullscreen mod just for test / Nicolas
    game.stage.backgroundColor = '#000000';

    map = game.add.tilemap('map'); //Load map with different layer, don't touch / Nicolas
    map.addTilesetImage('tileset_Interior', 'tiles');
    
    layers = { //Map all layers for player positionning
        floor: map.createLayer('floor'),
        stairs: map.createLayer('stairs'),
        wall: map.createLayer('wall'),
        windows: map.createLayer('windows'),
        carpet: map.createLayer('carpet'),
        collision: map.createLayer('collision'),
        object: map.createLayer('object'),
        collision2: map.createLayer('collision2'),
        object2: map.createLayer('object2'),
        top: map.createLayer('top') //The sprite should be behind this layers. 
    }
    map.setCollisionByExclusion([], true, layers.wall); //Activate collision / Antoine
    map.setCollisionByExclusion([], true, layers.collision); //Doesn't work
    map.setCollisionByExclusion([], true, layers.collision2); //Doesn't work

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
        scale: 40,
        duration:  105 //en secondes
    }

    waterBar = new EnergyBar(game, 'statusBar', 'dropOfWater', waterConfig);
    timer = new Timer(game, timerConfig);
    timer.start();

    player = new Player(game, map, layers); //Spawn player after the map / Antoine
    
    
}

function update() {
    player.update();
    timer.update();
    waterBar.update(1);
}

/*function render(){              // To debug player hitbox / Antoine
    player.render();
}*/