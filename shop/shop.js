class Shop{
    constructor(game){
        this.game = game;
        this.open_key = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

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
        this.ui.push(this.leftArrow);
        this.ui.push(this.rightArrow);

        this.title = game.add.text(0, 0, "Command c'que tu veu", {font: "bold 30px Comic Sans MS", fill: "black", alpha: 0.1});
        this.title.anchor.setTo(0.5, 0.5);
        this.title.x = this.interface.x;
        this.title.y = this.interface.y - (this.interface.height / 2) + 50;
        this.ui.push(this.title);

        this.page = game.add.text(0, 0, "1/1", {font: "bold 25px Arial", fill: "black", alpha: 0.1});
        this.page.anchor.setTo(0.5, 0.5);
        this.page.x = this.interface.x;
        this.page.y = this.interface.y + (this.interface.height / 3);
        this.ui.push(this.page);

        for(let i in this.ui){
            this.ui[i].visible = false;
        }

        // Utilities
        this.isOpen = false;
        this.delay = 0;
    }

    display(){
        if(this.game.time.now > this.delay){
            if(this.isOpen){
                for(let i in this.ui){
                    this.ui[i].visible = false;
                }
                this.delay = this.game.time.now + 250;
                this.isOpen = false;
            }
            else{
                for(let i in this.ui){
                    this.ui[i].visible = true;
                }
                this.delay = this.game.time.now + 250;
                this.isOpen = true;
            }
        }
    }

    checkForActions(){
        if(this.open_key.isDown){
            this.display();
        }
    }

    update(){
        this.checkForActions();
    }
}