class Money{

    constructor(game, water, elec){
        this.game = game;
        this.water = water;
        this.electricity = elec;

        // Display
        this.icon = this.game.add.image(30, this.game.height - 80, "money");
        this.icon.height = 85;
        this.icon.width = 85;

        this.text = game.add.text(0, 0, "", {font: "bold 30px Arial", fill: "green", alpha: 0.1});
        this.text.y = this.icon.y + (this.icon.height / 2) - (this.text.height / 2);
        this.text.x = this.icon.x + 90;
        this.text.stroke = '#000000';
        this.text.strokeThickness = 4;

        // Utilities

        this.amount = 100;
        this.addAmount = 0;
        this.text.text = this.amount + " €";    // Init player money display

        this.collectTimer = this.game.time.create(false);
        this.collectTimer.loop(10000, this.refreshMoney, this);
        this.collectTimer.start();
    }

    refreshMoney(){
        this.amount += this.addAmount;
        this.text.text = this.amount + " €";
    }

    add(amount){
        this.amount += amount;
        this.text.text = this.amount;
    }

    getAmount(){
        return this.amount;
    }

    update(){
        this.addAmount = 100 - this.water.getValue() + 100 - this.electricity.getValue();
    }
} 