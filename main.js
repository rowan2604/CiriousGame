var game = new Phaser.Game(1280, 736, Phaser.AUTO, '', { preload: preload, create: create, update: update/*, render: render*/});
//Please do not change screen size values / Nicolas

function preload() {
    game.load.tilemap('map', 'map/map.json', null, Phaser.Tilemap.TILED_JSON); //Load map.json / Nicolas
    game.load.image('tiles', 'map/tileset_Interior.png'); //Load tileset.png / Nicolas
    game.load.image('tilesG', 'map/tileset_Garden.png'); //Load tileset.png / Nicolas
    game.load.image('tilesA', 'map/tileset_Active.png'); //Nicolas
    game.load.image('money', 'hud/assets/money.jpeg');   // Load money image / Antoine
    game.load.spritesheet("zelda", "player/assets/zelda.png", 120, 130, 80) //Load character spritesheet / Antoine
    game.load.spritesheet("children", "bot/assets/children.png", 120, 130, 80);
    game.load.spritesheet("child1", "bot/assets/child1.png", 48, 48, 16);
    game.load.spritesheet("child2", "bot/assets/child2.png", 48, 48, 16);
    game.load.spritesheet("child3", "bot/assets/child3.png", 48, 48, 16);
    game.load.spritesheet("child4", "bot/assets/child4.png", 48, 48, 16);
    game.load.image('shop', 'shop/assets/shop.png');            // Shop interface loading / Antoine
    game.load.image('arrow', 'shop/assets/arrow.png');          // Scroll arrow loading / Antoine
    game.load.image('buy_button', 'shop/assets/buy.png');          // Buy Button loading / Antoine
    game.load.image('solar_panel', 'shop/assets/solar_panel2.png')   // Solar Panel image / Antoine
    game.load.image('solar_panel_sprite', 'shop/assets/solar_panel.png'); // Solar Panel Sprite / Antoine
    game.load.image('leds', 'shop/assets/leds.png')   // LEDS image / Antoine
    game.load.image('isolation', 'shop/assets/isolation.png')   // Isolation image / Antoine
    game.load.image('water_receiver', 'shop/assets/water_receiver.png') // Water Receiver / Antoine
    game.load.json('shop_datas', 'shop/shop_datas.json'); // Load the shop datas
    game.load.image('statusBar', 'hud/assets/StatusBar.png'); //Load statusBar image / P-T
    game.load.image('dropOfWater', 'hud/assets/water.png'); //Load water drop image / P-T
    game.load.image('collision_tile', 'map/collision_tile.png'); // Load a collision tile (in 16x16) for custom collisions
    game.load.image('electricity', 'hud/assets/electricity.png'); //Load electricity drop image / P-T
    game.load.image('homeButton', 'endMenu/assets/HomeButton.png');
    game.load.atlas('fullImage', 'extras/images/screen.png', 'extras/images/atlas.json');//Button image fullscreen, json atlas / Nicolas
    game.load.json('objects', 'interaction/objects.json'); //Nicolas data
    

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
}

let map;
let depth;
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
let botPositions = [];
let children = [];
let activeLayers = [];
let interaction;
let isFinished;
let endGame;
let consoElec = "0 Mw/h";  //mettre en string la valeur avec l'unité
let consoEau = "0"; //idem


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); //Init game physics for player movement / Antoine
    game.stage.backgroundColor = '#000000';

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; //Full screen ratio / Nicolas

    map = game.add.tilemap('map'); //Load map with different layer, don't touch / Nicolas
    map.addTilesetImage('tileset_Interior', 'tiles');
    map.addTilesetImage('tileset_Garden', 'tilesG');
    map.addTilesetImage('tileset_Active', 'tilesA');
    
    depth = game.add.group(); // Will allow us to choose what we need to display first / Antoine
    layers = { //Map all layers for player positionning
        Sink2: map.createLayer('Sink2'),
        Sink1: map.createLayer('Sink1'),
        bigLight2: map.createLayer('bigLight2'),
        bigLight1: map.createLayer('bigLight1'),
        smallLight2: map.createLayer('smallLight2'),
        smallLight1: map.createLayer('smallLight1'),
        furnace2: map.createLayer('furnace2'),
        furnace1: map.createLayer('furnace1'),
        phone: map.createLayer('phone'),
        duoFurnace: map.createLayer('duoFurnace'),
        pc3A: map.createLayer('pc3A'),
        pc2A: map.createLayer('pc2A'),
        pc1A: map.createLayer('pc1A'),
        hifiA: map.createLayer('hifiA'),
        tvA: map.createLayer('tvA'),
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
        top_sofas: map.createLayer('top_sofas'),
        collisions: map.createLayer('collisions'),
        bot_collisions: map.createLayer('bot_collisions'),
        bot_positions: map.createLayer('bot_positions'),
        usables: map.createLayer('usables')
    }
    activeLayers.push(layers.tvA); activeLayers.push(layers.hifiA); activeLayers.push(layers.pc1A); activeLayers.push(layers.pc2A); activeLayers.push(layers.pc3A); activeLayers.push(layers.duoFurnace); activeLayers.push(layers.phone); activeLayers.push(layers.furnace1); activeLayers.push(layers.furnace2); activeLayers.push(layers.smallLight1); activeLayers.push(layers.smallLight2); activeLayers.push(layers.bigLight1); activeLayers.push(layers.bigLight2); activeLayers.push(layers.Sink1); activeLayers.push(layers.Sink2);
    for(let i = 0; i < activeLayers.length; i++){
        activeLayers[i].visible = false;
    }

    layers.collisions.visible = false;
    layers.bot_collisions.visible = false;
    layers.usables.visible = false;
    layers.bot_positions.visible = false;
    map.setCollisionByExclusion([], true, layers.collisions) //Activate collision / Antoine
    map.setCollisionByExclusion([], true, layers.bot_collisions);

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
        duration:  300 //seconds
    }

    waterBar = new EnergyBar(game, 'statusBar', 'dropOfWater', waterConfig);
    electricityBar = new EnergyBar(game, 'statusBar', 'electricity', electricityConfig);

    timer = new Timer(game, timerConfig);

    waterBar.setValue(0);
    electricityBar.setValue(0);
    timer.start();

    interaction = new Interaction(game.cache.getJSON('objects'), waterBar, electricityBar, activeLayers);
    player = new Player(game, map, layers, interaction);         //Spawn player after the map / Antoine
    playerMoney = new Money(game, waterBar, electricityBar);                  // Init player money in game / Antoine

    for (let i = 0; i < layers.bot_positions.layer.data.length; i++) {    //We store the position of every usable object
        for (let j = 0; j < layers.bot_positions.layer.data[0].length; j++) {
            if (layers.bot_positions.layer.data[i][j].index != -1) {
                if (j != 27 && i != 12) {   //temporary
                    botPositions.push([j, i]);
                }
            }
        }
    }
    shuffle(botPositions);
    children.push(new Child(game, map, layers, botPositions[0], {x: 22 * 32 - 3,y: 18 * 32 + 16}, "child1", interaction));
    children.push(new Child(game, map, layers, botPositions[1], {x: 23 * 32 - 3,y: 18 * 32 + 16}, "child2", interaction));
    children.push(new Child(game, map, layers, botPositions[2], {x: 22 * 32 - 3,y: 17 * 32 + 16}, "child3", interaction));
    children.push(new Child(game, map, layers, botPositions[3], {x: 23 * 32 - 3,y: 17 * 32 + 16}, "child4", interaction));
    children.push(new Child(game, map, layers, botPositions[3], {x: 23 * 32 - 3,y: 16 * 32 + 16}, "child1", interaction));

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
        for(let i = 0; i < activeLayers.length; i++){
            if(i != 4 && i != 10 && i != 12){
                depth.add(activeLayers[i]);
            }
        }
        for (let i = 0; i < children.length; i++) {
            depth.add(children[i].sprite);
        }
        depth.add(player.sprite);
        depth.add(layers.top_sofas);
        depth.add(layers.top);
        depth.add(layers.pc3A);
        depth.add(layers.top_object);
        depth.add(layers.smallLight2);
        depth.add(layers.bigLight2);
    }   
    
    {       // Generate all custom collisions for Player / Antoine
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

    /*{       // Generate all custom collisions for BOT / Antoine
        custom_collisions.push(new Collision(game, map.getTile(27, 17, layers.wall), [1, 1, 0, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(26, 17, layers.wall), [0, 1, 0, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(28, 17, layers.wall), [1, 0, 0, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(24, 17, layers.wall), [1, 1, 0, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(19, 13, layers.wall), [1, 0, 1, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(19, 14, layers.wall), [1, 0, 1, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(19, 10, layers.collision), [1, 0, 1, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(19, 9, layers.collision), [1, 0, 1, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(20, 9, layers.collision), [1, 1, 0, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(21, 9, layers.collision), [1, 1, 0, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(23, 10, layers.top), [0, 0, 1, 1], child));
        custom_collisions.push(new Collision(game, map.getTile(24, 10, layers.top), [0, 0, 1, 1], child));
        custom_collisions.push(new Collision(game, map.getTile(15, 18, layers.collision), [1, 1, 0, 0], child));
        custom_collisions.push(new Collision(game, map.getTile(16, 18, layers.collision), [1, 1, 0, 0], child));
    }*/

    button = game.add.button(game.world.width - 50, 22, 'fullImage', fullScreen);

    shop = new Shop(game, game.cache.getJSON('shop_datas'), playerMoney);
}

function update() {
    isFinished = timer.update();
    if (!isFinished) {
        shuffle(botPositions);
        for (let i = 0; i < children.length; i++) { //Update each child
            children[i].update(botPositions[i]);
        }

        player.update();
        playerMoney.update();
        for(let i in custom_collisions){
            custom_collisions[i].update();
        }
        waterBar.setValue(interaction.getValue("Water"));
        waterBar.update();
        electricityBar.setValue(interaction.getValue("Electric"));
        electricityBar.update();
        /*game.physics.arcade.collide(player.sprite, child1.sprite);    //Removed collision with bot to avoid blocking it 
        game.physics.arcade.collide(player.sprite, child2.sprite);
        game.physics.arcade.collide(player.sprite, child3.sprite);
        */
        shop.update();

        // DEPTH ORGANISATION DEPENDING ON THE PLAYER POSITION (for the sofas). ROW BUT IT WORKS :( / Antoine
        // For the player
        if(Math.floor(player.sprite.body.y/32) < 19 + 2 && Math.floor(player.sprite.body.y/32) > 19 - 2){
            if(player.sprite.body.y < 19 * 32 + 20 && depth.getChildIndex(player.sprite) > depth.getChildIndex(layers.top_sofas)){
                depth.swap(player.sprite, layers.top_sofas);
            }
            else if(player.sprite.body.y > 19 * 32 + 20 && depth.getChildIndex(player.sprite) < depth.getChildIndex(layers.top_sofas)){
                depth.swap(player.sprite, layers.top_sofas);
            }
        }

        if(Math.floor(player.sprite.body.y/32) < 12 + 2 && Math.floor(player.sprite.body.y/32) > 12 - 2){
            if(player.sprite.body.y < 12 * 32 + 20 && depth.getChildIndex(player.sprite) > depth.getChildIndex(layers.top_sofas)){
                depth.swap(player.sprite, layers.top_sofas);
            }
            else if(player.sprite.body.y > 12 * 32 + 20 && depth.getChildIndex(player.sprite) < depth.getChildIndex(layers.top_sofas)){
                depth.swap(player.sprite, layers.top_sofas);
            }
        }
        // For the children
        for(let i in children){
            if(Math.floor(children[i].sprite.body.y/32) < 19 + 2 && Math.floor(children[i].sprite.body.y/32) > 19 - 2){
                if(children[i].sprite.body.y < 19 * 32 + 16 && depth.getChildIndex(children[i].sprite) > depth.getChildIndex(layers.top_sofas)){
                    depth.swap(children[i].sprite, layers.top_sofas)
                }
                else if(children[i].sprite.body.y > 19 * 32 + 16 && depth.getChildIndex(children[i].sprite) < depth.getChildIndex(layers.top_sofas)){
                    depth.swap(children[i].sprite, layers.top_sofas)
                }
            }
            if(Math.floor(children[i].sprite.body.y/32) < 12 + 2 && Math.floor(children[i].sprite.body.y/32) > 12 - 2){
                if(children[i].sprite.body.y < 12 * 32 + 16 && depth.getChildIndex(children[i].sprite) > depth.getChildIndex(layers.top_sofas)){
                    depth.swap(children[i].sprite, layers.top_sofas);
                }
                else if(children[i].sprite.body.y > 12 * 32 + 16 && depth.getChildIndex(children[i].sprite) < depth.getChildIndex(layers.top_sofas)){
                    depth.swap(children[i].sprite, layers.top_sofas);
                }
            }
        }


        // Display text to notice the possibility to interact / Antoine
        if(player.checkForObject() != null){
            interactText.text = "Press 'E' to interact!";
        }
        else{
            interactText.text = "";
        }
    }
    else {
        endGame = new endGameUI(game, consoElec, consoEau);
        endGame.show();
        shop.close();
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

function shuffle(array) {
    let m = array.length;
    let t;
    let i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick one element
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

// function render(){              // To debug player hitbox / Antoine
//     for(let i in children){
//         children[i].render();
//     }
// }