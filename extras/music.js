class Music{
    constructor(game,map){
        this.game = game;
        this.map = map;
        
    }

    
}


    this.load.audio('musicaudio', 'assets/music.mp3');

    var music = this.sound.add('musicaudio');
    music.setLoop(true);
    music.play();

