class Interaction {
    constructor(data, waterBar, electricityBar){
        this.data = data;
        this.water = waterBar;
        this.electricity = electricityBar;
        this.number = this.data.objects.length;

        this.coefElec = 1;
        this.coefWater = 1;
        this.currentElec = 0;
        this.currentWater = 0;
    }

    interact(tiled, x, y){
        console.log(tiled, x, y); //debug
        for(let i = 0; i < this.number; i++){
            if(this.data.objects[i].aTileset == tiled){
                if(this.data.objects[i].type == "Electric"){
                    this.currentElec = this.currentElec - this.data.objects[i].consumption;
                    //change tileset
                }
                else if(this.data.objects[i].type == "Water"){
                    this.currentWater = this.currentWater - this.data.objects[i].consumption;
                    //change tileset
                }
                break;
            }
            else if(this.data.objects[i].dTileset == tiled){
                if(this.data.objects[i].type == "Electric"){
                    this.currentElec += this.data.objects[i].consumption;
                    //change tileset
                }
                else if(this.data.objects[i].type == "Water"){
                    this.currentWater += this.data.objects[i].consumption;
                    //change tileset
                }
                break;
            }
        }
    }

    setCoef(type, value){
        if(type == "Electric") {this.coefElec = value}
        else if(type == "Water") {this.coefWater = value}
    }

    
    getValue(type){
        if(type == "Electric") {return this.coefElec * this.currentElec}
        else if(type == "Water") {return this.coefWater * this.coefWater}
    }
}