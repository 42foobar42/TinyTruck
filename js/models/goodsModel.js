tinyTrucks.goodsModel = (function (win) {
    var ListOfGoods = [];
    var lastGoodCreation;
    var CONST_FACTOR_OF_GOODSAMOUNT = 5,
        CONST_DIVIDER_OF_GOODSAMOUNT = 500000,
        CONST_ROW_OF_DESTINATION = 8,
        CONST_PERCENT_OF_NEEDEDGOODS = 0.8;
    var SortFunction = function(a, b){
                if(a[CONST_ROW_OF_DESTINATION] < b[CONST_ROW_OF_DESTINATION]){
                    return -1;
                }
                if(a[CONST_ROW_OF_DESTINATION]> b[CONST_ROW_OF_DESTINATION]){
                    return 1;
                }
                return 0;};
    var CONST_RENEW_GOODS_LIST = 1000 * 60 * 2.5; // 2.5 minutes
    function getAllGoodsByCity(cityname){
        var goodsList = [];
        for(var i = 0; i < ListOfGoods.length; i++){
            if(ListOfGoods[i].source === cityname){
                goodsList.push(ListOfGoods[i]);
            }
        }
        return goodsList;
    }
    function getRandomGoodByIndustry(industry){
        var goodList = [];
        for(var i = 0; i < Goods.length; i++){
            if(Goods[i].industry === industry){
                goodList.push(Goods[i]);
            }
        }
        var RandomIndex = Math.floor(Math.random() * goodList.length);
        return goodList.slice(RandomIndex, RandomIndex + 1)[0];
    }
    return {
        addNewGoodsToCitys: function(){
            var citys = MapData.getAllCitys();
            for(var i = 0; i < citys.length; i++){
                var goods = getAllGoodsByCity(citys[i].name);
                MapData.setAttributeOfCity(citys[i].name, {goods:goods});
            }
        },
        generateGoodsList: function(){
            if(!lastGoodCreation || new Date().getTime() > lastGoodCreation + CONST_RENEW_GOODS_LIST){
                lastGoodCreation = new Date().getTime();
                // TODO check if this is correct
                for(var i = 0; i < ListOfGoods.length; i++){
                    if(ListOfGoods[i].status === ''){
                        ListOfGoods[i].obsolete = true;
                    }
                }
                var citys = MapData.getAllCitys();
                for(var i = 0; i < citys.length; i++){
                    var amountOfGoods = Math.ceil(citys[i].population / CONST_DIVIDER_OF_GOODSAMOUNT) * CONST_FACTOR_OF_GOODSAMOUNT;
                    //console.log(Math.ceil(citys[i].population / 500000));
                    //TODO Amount of goods should depned on population or something                    
                    for(var j = 0; j < amountOfGoods; j++){
                        var good = {};
                        good.obsolete = false;
                        good.uid = guid();
                        //TODO type of good should depend on city
                        var goodData;
                        if(j <= amountOfGoods * CONST_PERCENT_OF_NEEDEDGOODS){
                            goodData = getRandomGoodByIndustry(citys[i].production[j % citys[i].production.length]);
                        } else {
                            var RandomIndex = Math.floor(Math.random() * Goods.length);                        
                            goodData = Goods.slice(RandomIndex, RandomIndex + 1)[0];
                        }
                        
                        for(var key in goodData){
                            good[key] = goodData[key];
                        }
                        // TODO randomize amount
                        good.amount = Math.floor((Math.random() * 10) + 1);
                        good.source = citys[i].name;
                        // TODO improve destination setting and destionation not source
                        var destination = MapData.getDestinationForIndustry(good.source, good.industry);
                        good.destination = destination;
                        good.status = '';
                        // TODO value(money) of good must be calculated on groundvalue and distance
                        var distance = MapData.getDistanceBetweenCitys(destination, good.source);
                        good.value = Math.round(good.groundvalue * good.amount * distance); //* street.length;
                        ListOfGoods.push(good);
                    }
                }
            }                    
        },
        getGoodsForMapGoodsTable: function(cityname, truckid){
            var data = [];
            for(var i = 0; i < ListOfGoods.length; i++){
                if(ListOfGoods[i].source === cityname && ListOfGoods[i].status === '' 
                        || (ListOfGoods[i].status !== '' && tinyTrucks.truckModel.isGoodInTruck(truckid, ListOfGoods[i].uid) )
                        || (tinyTrucks.depotsModel.isGodInDepot(cityname, ListOfGoods[i].uid))){
                    var info = [];
                    for(var key in ListOfGoods[i]){
                        info.push(ListOfGoods[i][key]);
                    }
                    if(tinyTrucks.depotsModel.isGodInDepot(cityname, ListOfGoods[i].uid)){
                        info.cls = 'depot';
                    }
                    data.push(info);
                }
            }
            data.sort(SortFunction);
            return data;
        },
        getGoodById: function(id){
            for(var i = 0; i < ListOfGoods.length; i++){
                if(ListOfGoods[i].uid === id){
                    return ListOfGoods[i];
                }
            }
            return false;
        },
        setStatus: function(id, status){
            this.getGoodById(id).status = status;
        },
        getUnusedGoodsForCityList: function(cityname){
            var data = [];
            for(var i = 0; i < ListOfGoods.length; i++){
                if(ListOfGoods[i].source === cityname){
                    var good = ListOfGoods[i];
                    var info = [];
                    for(var key in good){
                        info.push(good[key]);
                    }
                    if(tinyTrucks.depotsModel.isGodInDepot(cityname, good.uid)){
                        info.cls = 'depot';
                    }
                    data.push(info);
                }
            }
            data.sort(SortFunction);
            return data;
        },
        removeFromGoodList: function(goodId){
            for(var i = 0; i < ListOfGoods.length; i++){
                if(ListOfGoods[i].uid === goodId){
                    return ListOfGoods.splice(i,1)[0];
                }
            }
            return false;
        },
        deleteObsoleteGoods: function(){
            for(var i = 0; i < ListOfGoods.length; i++){
                if(ListOfGoods[i].obsolete === true && ListOfGoods[i].status ===''){
                    ListOfGoods.splice(i,1);
                    i--;
                }
            }
        },
        getIndustryName: function (shortcut){
           for(var i = 0; i < Industries.length; i++){
               if(Industries[i].shortcut === shortcut){
                    return Industries[i].name;
               }
           }
        }
    };
}(window));

function compareDestinations(a, b){
        console.log(b);
        if(a[7] < b[7]){
            return -1;
        }
        if(a[7]> b[7]){
            return 1;
        }
        return 0;
    }