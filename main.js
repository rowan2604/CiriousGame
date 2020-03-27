var game = new Phaser.Game(1280, 736, Phaser.AUTO, '', { preload: preload, create: create, update: update, /*render: render*/});
//Please do not change screen size values / Nicolas

function preload() {
    game.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON); //Load map.json / Nicolas
    game.load.image('tiles', 'map/tileset_Interior.png'); //Load tileset.png / Nicolas
    game.load.image('tilesG', 'map/tileset_Garden.png'); //Load tileset.png / Nicolas
    game.load.image('money', 'hud/assets/money.jpeg');   // Load money image / Antoine
    game.load.spritesheet("zelda", "player/assets/zelda.png", 120, 130, 80) //Load character spritesheet / Antoine
    game.load.spritesheet("children", "bot/assets/children.png", 120, 130, 80);
    game.load.image('shop', 'shop/assets/shop.png');
    game.load.image('statusBar', 'hud/assets/StatusBar.png'); //Load statusBar image / P-T
    game.load.image('dropOfWater', 'hud/assets/water.png'); //Load water drop image / P-T
    game.load.image('collision_tile', 'map/collision_tile.png'); // Load a collision tile (in 16x16) for custom collisions
    game.load.image('electricity', 'hud/assets/electricity.png'); //Load electricity drop image / P-T
    game.load.atlas('fullImage', 'extras/images/screen.png', 'extras/images/atlas.json');//Button image fullscreen, json atlas / Nicolas

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
}

let map;
let layers;
let player;
let waterBar;
let electricityBar;
let playerMoney;
let timer;
let interactText; // Temporary in main.js / Antoine
let instructionText;
let custom_collisions = [];
let child;
let shop;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); //Init game physics for player movement / Antoine
    game.stage.backgroundColor = '#000000';

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; //Full screen ratio / Nicolas

    map = game.add.tilemap('map'); //Load map with different layer, don't touch / Nicolas
    map.addTilesetImage('tileset_Interior', 'tiles');
    map.addTilesetImage('tileset_Garden', 'tilesG');
    
    depth = game.add.group(); // Will allow us to choose what we need to display first / Antoine

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
        garden2: map.createLayer('garden2'),
        top: map.createLayer('top'),            //The sprite should be behind this layers.
        top_object: map.createLayer('top_object'),
        collisions: map.createLayer('collisions'),
        usables: map.createLayer('usables')
    }
    layers.collisions.visible = false;
    layers.usables.visible = false;
    map.setCollisionByExclusion([], true, layers.collisions) //Activate collision / Antoine

    let waterConfig = {
        x: 100, y: 20, 
        scaleBarX: 0.7, scaleBarY: 1,
        scaleIconX: 0.5, scaleIconY: 0.5, 
        initialValue: 0, // percentage of initial filling of the bar / P-T
        color: 0x2cb2f5,
        isVertical: false
    };

    let electricityConfig = {
        x: 1280 - 150 - this.game.cache.getImage('electricity').height, y: 20, 
        scaleBarX: 0.7, scaleBarY: 1,
        scaleIconX: 0.5, scaleIconY: 0.5, 
        initialValue: 0, // percentage of initial filling of the bar / P-T
        color: 0xdac815,
        isVertical: false
    };

    let timerConfig = {
        x: 1280 / 2 - 35, y: 10,
        scale: 40,
        duration:  105 //seconds
    }

    waterBar = new EnergyBar(game, 'statusBar', 'dropOfWater', waterConfig);
    electricityBar = new EnergyBar(game, 'statusBar', 'electricity', electricityConfig);

    timer = new Timer(game, timerConfig);

    waterBar.setValue(100);
    electricityBar.setValue(40);
    timer.start();

    player = new Player(game, map, layers);         //Spawn player after the map / Antoine
    playerMoney = new Money(game, waterBar, electricityBar);                  // Init player money in game / Antoine
    child = new Child(game, layers);                // Spawn the Child / Antoine

    interactText = game.add.text(game.world.centerX - 70, 736 - 65, "", {font: "20px Arial", fill: "black", alpha: 0.1});
    instructionText = game.add.text(playerMoney.icon.x, playerMoney.icon.y - 10, "'A' to open the shop", {font: "22px Arial", fill: "black", alpha: 0.1});
    
    { // Order to display content on the screen (1st id is the farthest and last the nearest) / Antoine
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
        depth.add(layers.top_object);
    }    
    
    {       // Generate all custom collisions / Antoine
        custom_collisions.push(new Collision(game, map.getTile(27, 17, layers.wall), [1, 1, 0, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(26, 17, layers.wall), [0, 1, 0, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(28, 17, layers.wall), [1, 0, 0, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(24, 17, layers.wall), [1, 1, 0, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(19, 13, layers.wall), [1, 0, 1, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(19, 14, layers.wall), [1, 0, 1, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(19, 10, layers.collision), [1, 0, 1, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(19, 9, layers.collision), [1, 0, 1, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(20, 9, layers.collision), [1, 1, 0, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(21, 9, layers.collision), [1, 1, 0, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(23, 10, layers.top), [0, 0, 1, 1], player));
        custom_collisions.push(new Collision(game, map.getTile(24, 10, layers.top), [0, 0, 1, 1], player));
        custom_collisions.push(new Collision(game, map.getTile(15, 18, layers.collision), [1, 1, 0, 0], player));
        custom_collisions.push(new Collision(game, map.getTile(16, 18, layers.collision), [1, 1, 0, 0], player));
    }

    button = game.add.button(game.world.width - 50, 22, 'fullImage', fullScreen);

    shop = new Shop(game);
}

function update() {
    player.update();
    playerMoney.update();
    child.update();
    timer.update();
    for(let i in custom_collisions){
        custom_collisions[i].update();
    }
    waterBar.update();
    electricityBar.update();
    game.physics.arcade.collide(player.sprite, child.sprite);
    shop.update();


    // Display text to notice the possibility to interact / Antoine
    if(player.checkForObject() != null){
        interactText.text = "Press 'E' to interact!";
    }
    else{
        interactText.text = "";
    }
}

function fullScreen() {
    if (game.scale.isFullScreen){
        game.scale.stopFullScreen();
        button.frameName = "enter";
    }
    else {
        game.scale.startFullScreen(false);
        button.frameName = "exit";
    }
}

/*function render(){              // To debug player hitbox / Antoine
    child.render();
}*/