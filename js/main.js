window.onload = function () {
    Layout.init("menu", "closeMenu", "view", "scrolltablewrapper", "closeSubview");
    window.onresize = function () {
        Layout.relayout();                
    };
    tinyTrucks.init("menu");
    tinyTrucks.addTruckParts(Trucks);
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
};
