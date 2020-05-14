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

        // Utilities
        this.timers = []
        this.hour = Math.floor(timer.duration / 24) + 1;
        
        let timerConfig = {
            x: 0, y: 0,
            scale: 1,
            duration: timer.duration //seconds
        }

        //Set the timers
        for(let i in this.data.objects){
            let timer_ = new Timer(game, timerConfig);
            this.timers.push(timer_);
        }
        for(let i in this.timers){
            this.timers[i].start();
        }
    }

    updateTimers(){
        for(let i in this.data.objects){
            if(this.data.objects[i].active){
                this.timers[i].pause();
            }
            else if(!this.timers[i].paused){
                this.timers[i].resume();
            }
        }
    }

    calculateAverageConsumption(){
        let total = {
            consoElec: 0,
            consoEau: 0
        };
        for(let i in this.timers){
            if(this.timers[i].getTimeSeconds() != -1 && this.timers[i].getTimeSeconds() != 10){
                if(this.data.objects[i].type == "Electric"){
                    let objectConsumption = this.timers[i].getTimeSeconds() * this.data.objects[i].consumption / this.hour;
                    total.consoElec += objectConsumption;
                }
                else{
                    let objectConsumption = this.timers[i].getTimeSeconds() * this.data.objects[i].consumption / this.hour;
                    total.consoEau += objectConsumption;
                }
            }
        }
        return total
    }

    interact(tiled){
<<<<<<< HEAD
        //console.log(tiled); //debug
=======
>>>>>>> ae8d0223cc1950d60e27c38669c42c505a08edd9
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
        this.updateTimers();
    }

    setCoef(type, value){
        if(type == "Electric") {this.coefElec = value}
        else if(type == "Water") {this.coefWater = value}
    }

    active(tiled){
        for(let i = 0; i < this.number; i++){
            for(let j = 0; j < this.data.objects[i].Tileset.length; j++){
                if(this.data.objects[i].Tileset[j] == tiled){
                    if(this.data.objects[i].active){
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
    }
    
    getValue(type){
        if(type == "Electric") {return this.coefElec * this.currentElec}
        else if(type == "Water") {return this.coefWater * this.currentWater}
    }
}