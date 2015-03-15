var Map = (function (win) {
    var g = {};
    var CONST_MAP_WIDTH = 6020, CONST_MAP_HEIGHT = 3066;
    var CONST_MAX_ZOOM = 10, CONST_MIN_ZOOM = 1;
    var CityRadius = 15;
    var Eurasia;
    var CitysOfEurope;
    var Streets;
    var ZoomFactor = CONST_MIN_ZOOM;
    var MapPos = { x:0, y:0};
    var highlightedCitys = [];
    function drawContinents() {
        var poly = Eurasia;
        g.ctx.fillStyle = '#007B0C';
        g.ctx.scale(g.canvas.width/CONST_MAP_WIDTH,g.canvas.height/CONST_MAP_HEIGHT);
        g.ctx.beginPath();       
        g.ctx.moveTo((poly[0] + MapPos.x)*ZoomFactor, (poly[1] + MapPos.y)*ZoomFactor);        
        for (var item = 2; item < poly.length - 1; item += 2) {
            g.ctx.lineTo((poly[item] + MapPos.x)*ZoomFactor, (poly[item + 1] + MapPos.y)*ZoomFactor);
        }
        g.ctx.closePath();        
        g.ctx.fill();                
    }
    function drawCitys(){
        // TODO
        // radius must depened on zoom
        // city names also depend on zoom
        var radius = CityRadius ;//* ZoomFactor;
        var standardColor = '#000000';        
        if (highlightedCitys && highlightedCitys.length !== 0) {
            standardColor = '#C0C0C0';
        }
        g.ctx.fillStyle = standardColor;
        for (var i = 0; i < CitysOfEurope.length; i++){
            g.ctx.beginPath();
            g.ctx.arc((CitysOfEurope[i].coordiantes.x + MapPos.x) * ZoomFactor, (CitysOfEurope[i].coordiantes.y + MapPos.y) * ZoomFactor, radius, 0, 2 * Math.PI);            
            if(highlightedCitys ){
                var color = getColorOfCity(CitysOfEurope[i].name);
                if(color !== false){
                    g.ctx.fillStyle = color;
                }
            }             
            g.ctx.fill();
            g.ctx.fillStyle = standardColor;
        }
    }
    function getColorOfCity(name){
        for(var i = 0; i < highlightedCitys.length; i++){
            if(highlightedCitys[i].name === name){
                return highlightedCitys[i].color;
            }
        }
        return false;
    }
    function drawStreets(){
        g.ctx.strokeStyle = '#808080';
        // TODO depending on zoom
        g.ctx.lineWidth = 15;
        for(var i =  0; i < Streets.length; i++){
            var startPoint = MapData.getCityByName(Streets[i].connection[0]).coordiantes;
            var endPoint = MapData.getCityByName(Streets[i].connection[1]).coordiantes;            
            g.ctx.beginPath();
            var parts = Streets[i].parts;
            g.ctx.moveTo((startPoint.x + MapPos.x) * ZoomFactor, (startPoint.y + MapPos.y) * ZoomFactor);
            for(var j = 0; j < parts.length; j++){
                g.ctx.lineTo((parts[j].x+ MapPos.x) * ZoomFactor, (parts[j].y + MapPos.y) * ZoomFactor);
            }
            g.ctx.lineTo((endPoint.x+ MapPos.x) * ZoomFactor, (endPoint.y + MapPos.y) * ZoomFactor);
            g.ctx.stroke();
        }
    }
    function draw(){ 
        //g.canvas.width = win.innerWidth;
        //g.canvas.width =  g.canvas.parentElement.clientWidth;
        g.canvas.width = g.canvas.width;
        g.ctx.fillStyle = "#1C6BA0";            
        g.ctx.fillRect(0, 0,CONST_MAP_WIDTH, CONST_MAP_HEIGHT);
        drawContinents();
        drawStreets();
        drawCitys();        
    }
    return {
        init: function (id) {
            g.canvas = window.document.getElementById(id);
            g.ctx = g.canvas.getContext("2d");
            //g.canvas.width = g.canvas.width;
            g.canvas.width =  g.canvas.parentElement.clientWidth;
            g.canvas.height = g.canvas.parentElement.clientHeight;
            //console.log(g.canvas);
            Eurasia = MapData.getEurasia();
            CitysOfEurope = MapData.getCitysOfEurope();
            Streets = MapData.getAllStreets();
            draw();            
            return Map;
        },
        zoomin: function(){
            //TODO center Map
            if(ZoomFactor < CONST_MAX_ZOOM){                
                ZoomFactor++;
                draw();
            }
        },
        zoomout: function(){
            //TODO center Map
            if(ZoomFactor > CONST_MIN_ZOOM){
                ZoomFactor--;
                draw();
            }
        },
        scroll: function(x, y){            
            if (ZoomFactor > 1){
                if(y < 5 && y > -(CONST_MAP_HEIGHT/ZoomFactor*(ZoomFactor-1))){
                    MapPos.y = y;
                }
                if(x < 5 && x > -(CONST_MAP_WIDTH/ZoomFactor*(ZoomFactor-1))){
                    MapPos.x = x; 
                }
                draw();               
            }   
        },
        getScrollPos: function(){
            return {x:MapPos.x,y:MapPos.y};
        },
        isCityClicked: function(x,y){            
            x = x*CONST_MAP_WIDTH/g.canvas.width ;
            y = y*CONST_MAP_HEIGHT/g.canvas.height;
            var radius = CityRadius ;//* ZoomFactor;            
            for(var i = 0; i < CitysOfEurope.length; i++){
                var pos = JSON.parse( JSON.stringify(CitysOfEurope[i].coordiantes));
                pos.x =(pos.x+ MapPos.x)* ZoomFactor;
                pos.y =(pos.y + MapPos.y)* ZoomFactor;
                if(Math.pow(x-pos.x,2)+Math.pow(y-pos.y,2) < Math.pow(radius,2)){
                    return CitysOfEurope[i];                   
                }
            }
            return false;
        },
        setCityChoice: function(citys){             
            highlightedCitys = citys;
            draw();
        },
        reDraw: function(width){
            g.canvas.width = width;
            //g.canvas.height = g.canvas.height;             
            draw();            
            return Map;
        }
    };
}(window));

