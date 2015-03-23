window.onload = function () {
    Layout.init("menu", "closeMenu", "view", "scrolltablewrapper", "closeSubview");
    window.onresize = function () {
        Layout.relayout();                
    };
    tinyTrucks.init("menu");
    //tinyTrucks.buildTruck(0);
    //tinyTrucks.buildTruck(0);
    //tinyTrucks.buildTruck(0);
    tinyTrucks.buildTruck(0);
    tinyTrucks.buildTruck(1);
    tinyTrucks.buildTruck(1);
    tinyTrucks.show("Map");
    
    //Map.init("playground");
    /*
    var g={canvas:'', ctx:''};
    g.canvas = document.getElementById("playground");
            g.ctx = g.canvas.getContext("2d");  
            console.log(window);
            //g.canvas.width = win.innerWidth;
            //g.canvas.height = win.innerHeight;
            console.log(g.canvas.width);
            console.log(g.canvas.height);
            
            g.ctx.fillStyle = "#FF0000";
            g.ctx.fillRect(0, 0, g.canvas.width, g.canvas.height);
    */
    /*
    var c = document.getElementById("playground");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0,0,c.width,c.height);
    */
    
    var data = tinyTrucks.getRandomParts(50);    
    tinyTrucks.makeData(1, "tableBuyPartList",data);
    
    tinyTrucks.addNewGoodsToCitys();
    /*
    var Game;
    Game.fps = 50;

    Game.run = function() {
        //Game.update();
        //Game.draw();
        tinyTrucks.checkDrivingTrucks();
    };

    // Start the game loop
    Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
    */
    var GameLoop = function (){
        tinyTrucks.checkDrivingTrucks();
    };
    
    setInterval(GameLoop, 500);
};
