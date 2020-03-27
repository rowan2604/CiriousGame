class Shop{
    constructor(game){
        this.game = game;
        this.open_key = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

        // Display 

        

        this.interface = this.game.add.image(0, 0, 'shop');
        this.interface.scale.setTo(1.2, 1.2);
        this.interface.anchor.setTo(0.5, 0.5);
        this.interface.x = this.game.width / 2;
        this.interface.y = this.game.height / 2;
        this.interface.visible = false;


        // Utilities
        this.delay = 0;
    }

    display(){
        if(this.game.time.now > this.delay){
            if(this.interface.visible == true){
                this.interface.visible = false;
                this.delay = this.game.time.now + 250;
            }
            else{
                this.interface.visible = true;
                this.delay = this.game.time.now + 250;
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