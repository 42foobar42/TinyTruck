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
        5319, 1402, 5317, 1393, 5317, 1385, 5318, 1384, 5319, 1384, 5324, 1383, 5325, 1381, 5325, 1377, 
        5324, 1371, 5327, 1365, 5324, 1355, 5326, 1351, 5326, 1346, 5329, 1342, 5331, 1336, 5335, 1334, 
        5339, 1336, 5347, 1339, 5352, 1342, 5355, 1341, 5359, 1337, 5362, 1339, 5363, 1339, 5360, 1345, 
        5360, 1349, 5361, 1353, 5362, 1357, 5365, 1361, 5366, 1367, 5364, 1371, 5362, 1374, 5359, 1379, 
        5355, 1380, 5352, 1382, 5348, 1385, 5346, 1388, 5346, 1395, 5346, 1401, 5349, 1408, 5351, 1416,
        5359, 1420, 5361, 1421, 5367, 1414, 5369, 1413, 5374, 1414, 5375, 1418, 5377, 1421, 5380, 1423, 
        5384, 1424, 5387, 1423, 5392, 1423, 5391, 1426, 5388, 1428, 5388, 1431, 5393, 1433, 5399, 1435,
        5397, 1438, 5395, 1442, 5392, 1441, 5383, 1437, 5381, 1434, 5375, 1429, 5372, 1427, 5371, 1423,
        5369, 1421, 5368, 1427, 5367, 1430, 5361, 1426, 5354, 1424, 5348, 1425, 5345, 1426, 5340, 1426,
        5335, 1423, 5331, 1421, 5329, 1418, 5329, 1414, 5330, 1411, 5332, 1405, 5329, 1404, 5323, 1403,
        5318, 1402
    ];
    var String = "";
    for(var i = 0; i < Taiwan.length; i+=2){
        String += (Taiwan[i] - 60) + ", ";
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