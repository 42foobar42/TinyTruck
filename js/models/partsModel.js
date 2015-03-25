tinyTrucks.partsModel = (function (win) {
    var partStorage =[];
    var partListCreationTime;
    var partsToBuy = [];
    var CONST_RENEW_PARTS_TO_BUY_LIST = 1000 * 60 * 0.5; // .5 minutes
    function getPart(id) {
        for (var i = 0; i < Parts.length; i++) {
            if (Parts[i].id === id) {
                return Parts[i];
            }
        }       
    }  
    function getPartsById(id){
        var data = [];
        for(var i = 0; i < partStorage.length; i++){
            if(partStorage[i].id === id){
                data.push(partStorage[i]);
            }
        }
        return data;
    }
    function removePartFromToBuyList(id){
        for(var i = 0; i < partsToBuy.length; i++){
            if(partsToBuy[i].id === id){
                partsToBuy.splice(i, 1);
                return;
            }
        }
    }
    function getBuildableTrucks(){
        var PartsPerItem = [];
        for(var i = 0; i < Trucks.length; i++){
            var hasAllParts = true;
            var counter = 0;
            for(var j = 0; j < Trucks[i].parts.length; j ++){
                var partCounter = getPartsById(Trucks[i].parts[j]).length;
                if(partCounter === 0){
                    hasAllParts = false;                   
                } else {
                    counter += partCounter;
                }
            }
            if(hasAllParts){
                PartsPerItem.push({counter:counter, item:Trucks[i]});
            }
        }
        return PartsPerItem;
    }
    return {
        getBuildableTrucksList: function(){
            var PartsPerItem = getBuildableTrucks();            
            var buildArray = [];
            for(var i = 0; i < PartsPerItem.length; i++){
                var infoBut = '<input class="infoButton" type="button" value="info" onclick="tinyTrucks.showTruckInfo(' + PartsPerItem[i].item.id + ')"/>';
                var buildBut = '<input class="buildButton" type="button" value="build" onclick="tinyTrucks.buildTruck(' + PartsPerItem[i].item.id + ')"/>';
                buildArray.push([PartsPerItem[i].counter, PartsPerItem[i].item.original_name + infoBut, PartsPerItem[i].item.costs + buildBut]);
            }
            return buildArray;            
        },
        getPartListForSelling: function() {
            var ary = [];
            for (var i = 0; i < partStorage.length; i++) {
                var but = '<input class="sellButton" value="sell" type="button" onclick="tinyTrucks.sellPart(' + partStorage[i].id + ');"/>';
                ary.push([partStorage[i].id, partStorage[i].name, partStorage[i].type + but, partStorage[i].value]);
            }            
            return ary;
        },
        createPartList: function(){
            // TODO how many parts should be on list
            var amountOfParts = 50;
            // TODO check if a amount of time is gone
            if(!partListCreationTime || new Date().getTime() > partListCreationTime + CONST_RENEW_PARTS_TO_BUY_LIST){
                // TODO checks for part list(which should shown which not depending a player level)
                partsToBuy = [];
                for(var i = 0; i < amountOfParts; i++){
                    var random = Math.floor(Math.random() * Parts.length);
                    var part = Parts.slice(random, random + 1)[0];
                    //part.uid = guid();
                    partsToBuy.push(part);
                }
                partListCreationTime = new Date().getTime();                
                return true;
            }
            return false;
        },
        getPartListForBuying: function(){
            var data = [];
            for(var i = 0; i < partsToBuy.length; i++){
                var part = partsToBuy[i];
                //var index = 0;
                data[i] = [];
                for(var key in part){
                    data[i].push(part[key]);
                }
            }
            return data;
        },
        addPart: function(id){
            var part = getPart(id);
            part.value = parseInt(part.costs * tinyTrucks.getResaleFactor());
            partStorage.push(part);
            removePartFromToBuyList(id);            
        },
        removeFromPartStorage: function(id){
            for (var i = 0; i < partStorage.length; i++) {
                if (partStorage[i].id === id ) {
                    return partStorage.splice(i, 1)[0];
                }
            }
        }
    };
}(window));