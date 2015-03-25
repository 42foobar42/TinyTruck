tinyTrucks.goodsModel = (function (win) {
    var ListOfGoods = [];
    var lastGoodCreation;
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
            lastGoodCreation = new Date().getTime();
            for(var i = 0; i < ListOfGoods.length; i++){
                ListOfGoods[i].obsolete = true;
            }
            var citys = MapData.getAllCitys();            
            for(var i = 0; i < citys.length; i++){                
                var amountOfGoods = 10;
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
                    ListOfGoods.push(good);
                }                
            }            
        }
    };
}(window));

