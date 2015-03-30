window.onload = function () {
    Layout.init("menu", "closeMenu", "view", "scrolltablewrapper", "closeSubview");
    window.onresize = function () {
        Layout.relayout();                
    };
    tinyTrucks.init("menu");
    tinyTrucks.depotsModel.addDepots("Frankfurt");
    //tinyTrucks.depotsModel.addDepots("Berlin");
    tinyTrucks.truckModel.addTruckByOID(0);    
    tinyTrucks.truckModel.addTruckByOID(0);
    /*tinyTrucks.truckModel.addTruckByOID(0);
    tinyTrucks.truckModel.addTruckByOID(2);
    tinyTrucks.truckModel.addTruckByOID(2);
    tinyTrucks.truckModel.addTruckByOID(1);
    tinyTrucks.truckModel.addTruckByOID(1);*/
    tinyTrucks.show("Trucks");
    
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
    
    /*
    var data = tinyTrucks.getRandomParts(50);    
    tinyTrucks.makeData(1, "tableBuyPartList",data);
    
    // to be done in loop
    tinyTrucks.goodsModel.generateGoodsList();
    
    // to be done in tiny trucks
    tinyTrucks.goodsModel.addNewGoodsToCitys();
    */
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
        tinyTrucks.loopCheck();
    };
    
    setInterval(GameLoop, 500);
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}