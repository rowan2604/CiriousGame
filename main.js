var game = new Phaser.Game(1280, 736, Phaser.AUTO, '', { preload: preload, create: create, update: update/*, render: render*/});
//Please do not change screen size values / Nicolas

function preload() {
    game.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON); //Load map.json / Nicolas
    game.load.image('tiles', 'map/tileset_Interior.png'); //Load tileset.png / Nicolas
    game.load.spritesheet("zelda", "player/assets/zelda.png", 120, 130, 80) //Load character spritesheet / Antoine
    game.load.image('statusBar', 'hud/assets/StatusBar.png'); //Load statusBar image / P-T
    game.load.image('dropOfWater', 'hud/assets/water.png'); //Load water drop image / P-T
}

let map;
let layers;
let player;
let waterBar;
let timer;
let interactText; // Temporary in main.js / Antoine

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); //Init game physics for player movement / Antoine

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; //Fullscreen mod just for test / Nicolas
    game.stage.backgroundColor = '#000000';

    map = game.add.tilemap('map'); //Load map with different layer, don't touch / Nicolas
    map.addTilesetImage('tileset_Interior', 'tiles');
    
    depth = game.add.group();       // Will allow us to choose what we need to display first / Antoine

    layers = { //Map all layers for player positionning
        garden: map.createLayer('garden'),
        floor: map.createLayer('floor'),
        stairs: map.createLayer('stairs'),
        wall: map.createLayer('wall'),
        windows: map.createLayer('windows'),
        carpet: map.createLayer('carpet'),
        collision: map.createLayer('collision'),
        object: map.createLayer('object'),
        collision2: map.createLayer('collision2'),
        object2: map.createLayer('object2'),
        top: map.createLayer('top'), //The sprite should be behind this layers.
        collisions: map.createLayer('collisions'),
        usables: map.createLayer('usables')
    }
    layers.collisions.visible = false;
    layers.usables.visible = false;
    map.setCollisionByExclusion([], true, layers.collisions)        //Activate collision / Antoine

    let waterConfig = {
        x: 100, y: 20, 
        scaleBarX: 0.7, scaleBarY: 1,
        scaleIconX: 0.5, scaleIconY: 0.5, 
        initialValue: 0, // percentage of initial filling of the bar / P-T
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

    interactText = game.add.text(game.world.centerX - 70, 736 - 65, "", {font: "20px Arial", fill: "black", alpha: 0.1})  
    
    {       // Order to display content on the screen (1st id is the farthest and last the nearest) / Antoine
        depth.add(layers.garden);
        depth.add(layers.floor);
        depth.add(layers.stairs);
        depth.add(layers.wall);
        depth.add(layers.windows);
        depth.add(layers.carpet);
        depth.add(layers.collision);
        depth.add(layers.object);
        depth.add(layers.collision2);
        depth.add(layers.object2);
        depth.add(player.sprite);
        depth.add(layers.top);
    }    

}

function update() {
    player.update();
    timer.update();
    waterBar.update(1);
    
    if(player.checkForObject() != null){
        interactText.text = "Press 'E' to interact!";
    }
    else{
        interactText.text = "";
    }
}

/*function render(){              // To debug player hitbox / Antoine
    player.render();
}*/