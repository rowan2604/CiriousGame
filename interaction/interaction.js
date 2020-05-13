class Interaction {
    constructor(data, waterBar, electricityBar, activeLayers){
        this.data = data;
        this.water = waterBar;
        this.electricity = electricityBar;
        this.number = this.data.objects.length;
        this.activeLayers = activeLayers;

        this.coefElec = 1;
        this.coefWater = 1;
        this.currentElec = 0;
        this.currentWater = 0;
    }

    interact(tiled, x, y){
        console.log(tiled, x, y); //debug
        for(let i = 0; i < this.number; i++){
            for(let j = 0; j < this.data.objects[i].Tileset.length; j++){
                if(this.data.objects[i].Tileset[j] == tiled){
                    let tmp =  this.data.objects[i];
                    if(tmp.active){
                        tmp.active = false;
                        if(this.data.objects[i].type == "Electric"){
                            this.currentElec = this.currentElec - this.data.objects[i].consumption;
                        }
                        else if(this.data.objects[i].type == "Water"){
                            this.currentWater = this.currentWater - this.data.objects[i].consumption;
                        }
                    }
                    else{
                        tmp.active = true
                        if(this.data.objects[i].type == "Electric"){
                            this.currentElec += this.data.objects[i].consumption;
                        }
                        else if(this.data.objects[i].type == "Water"){
                            this.currentWater += this.data.objects[i].consumption;
                        }
                    }
                    this.activeLayers[tmp.index].visible ? this.activeLayers[tmp.index].visible = false : this.activeLayers[tmp.index].visible = true;
                }
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