class endGameUI {
    constructor(game, consoElec, consoEau) {
        this.game = game;
        this.consoElec = consoElec;
        this.consoEau = consoEau;

        // Display 

        this.ui = [];
        this.visibleItems = [];

        this.interface = this.game.add.image(0, 0, 'shop');
        this.interface.scale.setTo(2.8, 1.2);
        this.interface.anchor.setTo(0.5, 0.5);
        this.interface.x = this.game.width / 2;
        this.interface.y = this.game.height / 2;
        this.interface.visible = false;
        this.ui.push(this.interface);

        this.homeButton = this.game.add.sprite(0, 0, 'homeButton');
        this.homeButton.scale.setTo(0.15, 0.15);
        this.homeButton.anchor.setTo(0.5, 0.5);
        this.homeButton.x = this.game.width / 2;
        this.homeButton.y = this.game.height / 2 + this.interface.height / 3;
        this.homeButton.visible = false;
        this.homeButton.events.onInputDown.add(this.onClickButton, this);
        this.homeButton.inputEnabled = true;
        this.ui.push(this.homeButton);

        this.timeOut = this.game.add.text(this.game.width / 2, this.interface.y - this.interface.height / 2.5, this.time);
        this.timeOut.anchor.setTo(0.5, 0.5);
        this.timeOut.text = "Time out!";
        this.timeOut.fontSize = 46;
        this.ui.push(this.timeOut);

        this.graphics = this.game.add.graphics(this.game.width / 2 - this.interface.width / 2, this.game.height / 2 - this.interface.height / 2);
        this.graphics.beginFill(0x000000);
        this.rectangle = this.graphics.drawRect(this.interface.width / 2 - 3, 100, 5, this.interface.height - 250);
        this.ui.push(this.rectangle);

        this.consommationElec1 = this.game.add.text(this.game.width / 2 - this.interface.width / 4, this.interface.y - this.interface.height / 4, this.time);
        this.consommationElec1.anchor.setTo(0.5, 0.5);
        this.consommationElec1.text = "Your energy consumption";
        this.consommationElec1.addColor("#474747", 0);
        this.consommationElec1.fontSize = 28;
        this.ui.push(this.consommationElec1);

        this.consommationElec2 = this.game.add.text(this.game.width / 2 + this.interface.width / 4, this.interface.y - this.interface.height / 4, this.time);
        this.consommationElec2.anchor.setTo(0.5, 0.5);
        this.consommationElec2.text = "Average energy consumption in France";
        this.consommationElec2.addColor("#474747", 0);
        this.consommationElec2.fontSize = 28;
        this.ui.push(this.consommationElec2);

        this.consommationElec1Value = this.game.add.text(this.game.width / 2 - this.interface.width / 4, this.interface.y - this.interface.height / 8, this.time);
        this.consommationElec1Value.anchor.setTo(0.5, 0.5);
        this.consommationElec1Value.text = this.consoElec;
        this.consommationElec1Value.fontSize = 26;
        this.ui.push(this.consommationElec1Value);

        this.consommationElec2Value = this.game.add.text(this.game.width / 2 + this.interface.width / 4, this.interface.y - this.interface.height / 8, this.time);
        this.consommationElec2Value.anchor.setTo(0.5, 0.5);
        this.consommationElec2Value.text = "Mettre valeur ligne 65 endGame.js";
        this.consommationElec2Value.fontSize = 26;
        this.ui.push(this.consommationElec2Value);

        this.consommationEau1 = this.game.add.text(this.game.width / 2 - this.interface.width / 4, this.interface.y + this.interface.height / 8, this.time);
        this.consommationEau1.anchor.setTo(0.5, 0.5);
        this.consommationEau1.text = "Your energy consumption";
        this.consommationEau1.addColor("#474747", 0);
        this.consommationEau1.fontSize = 28;
        this.ui.push(this.consommationEau1);

        this.consommationEau2 = this.game.add.text(this.game.width / 2 + this.interface.width / 4, this.interface.y + this.interface.height / 8, this.time);
        this.consommationEau2.anchor.setTo(0.5, 0.5);
        this.consommationEau2.text = "Average energy consumption in France";
        this.consommationEau2.addColor("#474747", 0);
        this.consommationEau2.fontSize = 28;
        this.ui.push(this.consommationEau2);

        this.consommationEau1Value = this.game.add.text(this.game.width / 2 - this.interface.width / 4, this.interface.y + this.interface.height / 4, this.time);
        this.consommationEau1Value.anchor.setTo(0.5, 0.5);
        this.consommationEau1Value.text = this.consoEau;
        this.consommationEau1Value.fontSize = 26;
        this.ui.push(this.consommationEau1Value);

        this.consommationEau2Value = this.game.add.text(this.game.width / 2 + this.interface.width / 4, this.interface.y + this.interface.height / 4, this.time);
        this.consommationEau2Value.anchor.setTo(0.5, 0.5);
        this.consommationEau2Value.text = "Mettre valeur ligne 89 endGame.js";
        this.consommationEau2Value.fontSize = 26;
        this.ui.push(this.consommationEau2Value);

        for(let i in this.ui){
            this.ui[i].visible = false;
        }

    }

    onClickButton() {
        window.location.href = 'menu.html';
    }

    show(){
        for(let i in this.ui){
            this.ui[i].visible = true;
        }
    }
}