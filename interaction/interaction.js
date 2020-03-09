class interaction {
    constructor(){
        this.object = []; //Array to store all objects. /Nicolas
        this.electricity; //Value of instantaneous electricity consumption. /Nicolas
        this.water; //Value of instantaneous water consumption. /Nicolas
        
        this.object.push({tiledActivate: [1,2,3], tiledDesactivate: [5,8,12], type: "electricity", value: 10, name: "light"}); //Example of object. /Nicolas
    }

    update(tiled){}
    get(type){}

    /* Dev bellow */
    
}