tinyTrucks.goodsModel = (function (win) {
    var ListOfGoods = [];
    var lastGoodCreation;
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
                    var amountOfGoods = 100;
                    //TODO Amount of goods should depned on population or something
                    for(var j = 0; j < amountOfGoods; j++){
                        var good = {};
                        good.obsolete = false;
                        good.uid = guid();
                        var RandomIndex = Math.floor(Math.random() * Goods.length);
                        //TODO type of good should depend on city
                        var goodData = Goods.slice(RandomIndex, RandomIndex + 1)[0];
                        for(var key in goodData){
                            good[key] = goodData[key];
                        }
                        // TODO randomize amount
                        good.amount = Math.floor((Math.random() * 10) + 1);
                        good.source = citys[i].name;
                        // TODO improve destination setting and destionation not source
                        do{
                            var destination = citys[Math.floor((Math.random() * citys.length))].name;
                        } while(destination === good.source)
                        good.destination = destination;
                        good.status = '';
                        // TODO value(money) of good must be calculated on groundvalue and distance
                        good.value = good.groundvalue;
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
                    data.push(info);
                }
            }
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
                    data.push(info);
                }
            }
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
        }
    };
}(window));