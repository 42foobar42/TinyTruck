tinyTrucks.depotsModel = (function (win) {
    var depots = [];
    function getDepotByName(cityname){
        for(var i = 0; i < depots.length; i++){
            if(depots[i].name === cityname){
                return depots[i];
            }
        }
        return false;
    }
    return {
        addDepots: function(cityname){
            depots.push({ name:cityname, level:1, stock:[], trucks:[], maxStock:20});
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
        },
        spaceOfDepot: function(cityname){
            console.log(cityname);
            var depot = getDepotByName(cityname);
            var space = 0;
            if(depot){
                for(var i = 0; i < depot.stock.length; i++){
                    console.log(tinyTrucks.goodsModel.getGoodById(depot.stock[i]));
                    space += tinyTrucks.goodsModel.getGoodById(depot.stock[i]).amount;
                }
            }
            console.log(depot);
            console.log(space);
            return depot.maxStock - space;
        },
        putGoodToDepot: function(cityname, goodid){
            getDepotByName(cityname).stock.push(goodid);
        },
        removeGoodFromDepot: function(cityname, goodid){
            var depot = getDepotByName(cityname);
            if(depot){
                for(var i = 0; i < depot.stock.length; i++){
                    if(depot.stock[i] === goodid){
                        return depot.stock.splice(i,1);                    
                    }
                }
            }
            return false;
        },
        getGoodsForDepot: function(cityname){
            var depot = getDepotByName(cityname);
            var data = [];
            if(depot){
                for(var i = 0; i < depot.stock.length; i++){
                    var good = tinyTrucks.goodsModel.getGoodById(depot.stock[i]);
                    data.push([good.uid, good.name, good.amount, good.value]);
                }
            }
            return data;
        },
        isGodInDepot: function (cityname, goodid){
            var depot = getDepotByName(cityname);
            if(depot){
                if(depot.stock.indexOf(goodid) >= 0){
                    return true;
                }
            }
            return false;
        }
    };
}(window));