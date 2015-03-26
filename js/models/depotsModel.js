tinyTrucks.depotsModel = (function (win) {
    var depots = [];
    return {
        addDepots: function(cityname){
            depots.push({ name:cityname, stock:[], trucks:[]});
        },
        highlightDepotCitys: function(){
            var citys = [];
            for(var i = 0; i < depots.length; i++){
                citys.push({name:depots[i].name,color: '#0000ff'});
            }
            Map.setCityChoice(citys);
        },
        hasCityDepot: function(cityname){
            for(var i = 0; i < depots.length; i++){
                if(depots[i].name === cityname){
                    return true;
                }
            }
            return false;
        },
        addTruckToDepot: function(cityname, truckid){
            for(var i = 0; i < depots.length; i++){
                if(depots[i].name === cityname){
                    depots[i].trucks.push(truckid);
                }
            }
        }
    };
}(window));