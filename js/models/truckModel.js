tinyTrucks.truckModel = (function (win) {
    var truckStorage = [];    
    function getTruckFromModelList(id) {        
        for (var i = 0; i < Trucks.length; i++) {
            if (Trucks[i].id === id) {
                return Trucks.slice(i, i+1)[0];
            }        
        }
    }
    return {
        checkDrivingTrucks: function(){
            for(var i = 0; i < truckStorage.length; i++){
                if(truckStorage[i].status === 'en route'){
                    if(truckStorage[i].stop < new Date().getTime()){
                        console.log("I am at the goal!");
                        truckArrived(truckStorage[i]);
                    } else {
                        var time = new Date(truckStorage[i].stop - new Date().getTime());
                        var filter = [[0, truckStorage[i].id]];
                        //console.log(time.getMinutes() + " : " + time.getSeconds());
                        var displayTime = time.getMinutes();
                        if (displayTime > 0){
                            displayTime += " min";
                            var values = [[5, displayTime]];
                            changeCell(CONST_ID_OF_USEDTRUCKS, filter, values);
                        } else {
                            if(time.getSeconds() % 10 === 0){
                                displayTime = time.getSeconds() + " sec";
                                var values = [[5, displayTime]];
                                changeCell(CONST_ID_OF_USEDTRUCKS, filter, values);
                            }
                        }
                    }                                       
                }
            }
        },
        getTruckStorageList: function() {
            var data = [];
            for (var i = 0; i < truckStorage.length; i++) {
                if(truckStorage[i].status === 'storage'){
                    var infoBut = '<input class="infoButton" type="button" value="info" onclick="tinyTrucks.showTruckInfo(\'' + truckStorage[i].uid + '\',\'' + truckStorage[i].type + '\')"/>';
                    var useBut = '<input class="useButton" type="button" value="use" onclick="tinyTrucks.useTruck(\'' + truckStorage[i].uid + '\')"/>';
                    data.push([truckStorage[i].name, truckStorage[i].type + " " + infoBut, truckStorage[i].name + " " + useBut]);                    
                        // data.push([truckStorage[i].id, truckStorage[i].name, truckStorage[i].origin.type, truckStorage[i].location, truckStorage[i].status, '']);                    
                }
            }
            return data;
        },        
        getOriginalTruckData: function(id){
            return getTruckFromModelList(id);            
        },
        addTruckByOID: function(id){
            var oTruck = getTruckFromModelList(id);
            var NameCounter = 1;
            for(var i = 0; i < truckStorage.length; i++){
                if (truckStorage[i].original_name === oTruck.original_name){
                    NameCounter++;
                }
            }
            var obj = {name: oTruck.original_name + " " + NameCounter, status:'storage'};
            for(var key in oTruck){
                obj[key] = oTruck[key];
            }
            obj.uid = guid();
            truckStorage.push(obj);
        },
        getTruckByUID: function (id){
            for(var i = 0; i < truckStorage.length; i++){
                if(truckStorage[i].uid === id){
                    return truckStorage[i];
                }
            }
        }
    };
}(window));