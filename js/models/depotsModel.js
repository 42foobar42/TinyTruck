tinyTrucks.depotsModel = (function (win) {
    var depots = [];
    return {
        addDepots: function(cityname){
            depots.push({ name:cityname, level:1, stock:[], trucks:[]});
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
        },
        removeTruckFromDepot: function(truckid, cityname){
            for(var i = 0; i < depots.length; i++){
                if(depots[i].name === cityname){
                    for(var j = 0; j < depots[i].trucks.length; j++){
                        if(depots[i].trucks[j] === truckid){
                            depots[i].trucks.splice(j, 1);
                        }
                    }
                }
            }
        },
        getDepotsList: function(){
            var data = [];
            for(var i = 0; i < depots.length; i++){
                data.push([depots[i].name, depots[i].level, depots[i].stock.length, depots[i].trucks.length]);
            }
            return data;
        }
    };
}(window));