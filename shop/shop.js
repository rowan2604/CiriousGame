class Shop{
    constructor(game, datas, money){
        this.game = game;
        this.datas = datas;
        this.money = money;
        // Keys
        this.open_key = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        
        // Utilities
        this.isOpen = false;
        this.delay = 0;
        this.boughtItems = 0;
        this.currentPage = -1;      // Impossible value. Allows the selectPage function to work in the constructor.

        // Display 

        this.ui = [];

        this.interface = this.game.add.image(0, 0, 'shop');
        this.interface.scale.setTo(1.2, 1.2);
        this.interface.anchor.setTo(0.5, 0.5);
        this.interface.x = this.game.width / 2;
        this.interface.y = this.game.height / 2;
        this.ui.push(this.interface);

        this.rightArrow = this.game.add.image(0, 0, 'arrow');
        this.leftArrow = this.game.add.image(0, 0, 'arrow');
        this.rightArrow.anchor.setTo(0.5, 0.5);
        this.leftArrow.anchor.setTo(0.5, 0.5);
        this.rightArrow.scale.setTo(0.5, 0.5);
        this.leftArrow.scale.setTo(0.5, 0.5);
        this.leftArrow.angle += 180;
        this.leftArrow.x = this.interface.x - (this.interface.width / 4);
        this.leftArrow.y = this.interface.y + (this.interface.height / 3);
        this.rightArrow.x = this.interface.x + (this.interface.width / 4);
        this.rightArrow.y = this.interface.y + (this.interface.height / 3);
        this.leftArrow.events.onInputDown.add(this.onClickLeft, this);
        this.rightArrow.events.onInputDown.add(this.onClickRight, this);
        this.ui.push(this.leftArrow);
        this.ui.push(this.rightArrow);

        this.title = game.add.text(0, 0, "Command c'que tu veu", {font: "bold 30px Comic Sans MS", fill: "black", alpha: 0.1});
        this.title.anchor.setTo(0.5, 0.5);
        this.title.x = this.interface.x;
        this.title.y = this.interface.y - (this.interface.height / 2) + 50;
        this.ui.push(this.title);

        this.pages = game.add.text(0, 0, "1/", {font: "bold 25px Arial", fill: "black", alpha: 0.1});
        this.pages.text += this.datas.items.length;
        this.pages.anchor.setTo(0.5, 0.5);
        this.pages.x = this.interface.x;
        this.pages.y = this.interface.y + (this.interface.height / 3);
        this.ui.push(this.pages);

        this.buy_button = game.add.image(0, 0, 'buy_button');
        this.buy_button.anchor.setTo(0.5, 0.5);
        this.buy_button.x = this.pages.x;
        this.buy_button.y = this.pages.y - 40;
        this.buy_button.events.onInputDown.add(this.buy, this);
        this.ui.push(this.buy_button);

        this.item_name = game.add.text(0, 0, "", {font: "bold 25px Comic Sans MS", fill: "black", alpha: 0.1});
        this.item_name.anchor.setTo(0.5, 0.5);
        this.item_name.x = this.title.x;
        this.item_name.y = this.title.y + 40;
        this.ui.push(this.item_name);

        this.item_price = game.add.text(0, 0, "", {font: "bold 20px Comic Sans MS", fill: "black", alpha: 0.1});
        this.item_price.anchor.setTo(0.5, 0.5);
        this.item_price.x = this.pages.x;
        this.item_price.y = this.pages.y - 80;
        this.ui.push(this.item_price);

        this.item_image = game.add.image(0, 0, 'solar_panel');
        this.item_image.anchor.setTo(0.5, 0.5);
        this.item_image.x = this.interface.x;
        this.item_image.y =this.interface.y - 30;
        this.ui.push(this.item_image);

        this.selectPage(0);
        // Set every graphics content to invisible
        for(let i in this.ui){
            this.ui[i].visible = false;
        }
    }

    selectPage(index){
        if(index != this.currentPage){
            this.currentPage = index;

            this.item_name.text = this.datas.items[index].name;
            this.item_price.text = this.datas.items[index].price + " €";
            this.item_image.loadTexture(this.datas.items[index].image);
            this.item_image.scale.setTo(1, 1);
            this.item_image.scale.setTo(250 / this.item_image.width, 250 / this.item_image.height);
            this.pages.text = (this.currentPage + 1) + "/" + (this.datas.items.length - this.boughtItems);

        }
    }

    onClickRight(){
        if(this.currentPage < this.datas.items.length - 1){
            this.selectPage(this.currentPage + 1);
        }
    }

    onClickLeft(){
        if(this.currentPage > 0){
            this.selectPage(this.currentPage - 1);
        }
    }

    buy(){
        if(this.money.getAmount() - this.datas.items[this.currentPage].price > 0){
            this.money.add(-(this.datas.items[this.currentPage].price));

            let filteredItems = this.datas.items.slice(0, this.currentPage).concat(this.datas.items.slice(this.currentPage + 1, this.datas.items.length))
            this.datas.items = filteredItems;

            this.close();
            this.updateEnergyValues("solar_panel");
        }
    }

    checkForActions(){
        if(this.open_key.isDown){
            if(this.game.time.now > this.delay){
                if(!this.isOpen){            // Open or close the shop. Add a delay to avoid spam.
                    this.open();
                }
                else{
                    this.close();
                }
            }
        }
    }

    open(){
        for(let i in this.ui){
            this.ui[i].visible = true;
        }
        this.rightArrow.inputEnabled = true;
        this.leftArrow.inputEnabled = true;
        this.buy_button.inputEnabled = true;
        this.selectPage(0);

        this.delay = this.game.time.now + 250;
        this.isOpen = true;
    }

    close(){
        for(let i in this.ui){
            this.ui[i].visible = false;
        }
        this.rightArrow.inputEnabled = false;
        this.leftArrow.inputEnabled = false;
        this.buy_button.inputEnabled = false;

        this.delay = this.game.time.now + 250;
        this.isOpen = false;
    }

    updateEnergyValues(item){
        if(item == "solar_panel"){
            for(let i in interaction.data.objects){
                if(interaction.data.objects[i].type == "Electric" && interaction.data.objects[i].active){
                    interaction.currentElec -= (Math.floor(this.datas.items[this.currentPage].reduceScale * interaction.data.objects[i].consumption));
                }
                interaction.data.objects[i].consumption = interaction.data.objects[i].consumption - (Math.floor(this.datas.items[this.currentPage].reduceScale * interaction.data.objects[i].consumption));
            }
        }
        this.currentPage = -1;
    }

    update(){
        this.checkForActions();
    }
}