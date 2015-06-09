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
   var Taiwan = [// TODO - 70 y
        1074, 909, 1083, 906, 1089, 902, 1095, 896, 1101, 891, 1104, 888, 1108, 880, 1111, 876, 1112, 871,
        1110, 865, 1112, 861, 1115, 856, 1119, 851, 1122, 845, 1125, 840, 1132, 834, 1138, 829, 1143, 826,
        1144, 827, 1141, 830, 1145, 830, 1149, 822, 1157, 818, 1157, 813, 1164, 805, 1151, 806, 1141, 808,
        1134, 813, 1127, 813, 1118, 819, 1111, 824, 1104, 831, 1097, 838, 1094, 843, 1099, 842, 1104, 838,
        1109, 833, 1112, 830, 1116, 830, 1114, 833, 1109, 838, 1103, 844, 1101, 850, 1097, 854, 1092, 860,
        1088, 865, 1085, 870, 1081, 876, 1078, 882, 1075, 889, 1073, 896, 1074, 902, 1074, 906
    ];
    var String = "";
    for(var i = 0; i < Taiwan.length; i+=2){
        String += (Taiwan[i] - 130) + ", ";
        String += (Taiwan[i+1] + 0) + ", ";
    }
    //alert(String);
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