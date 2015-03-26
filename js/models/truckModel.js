tinyTrucks.truckModel = (function (win) {
    var truckStorage = [];    
    function getTruckFromModelList(id) {        
        for (var i = 0; i < Trucks.length; i++) {
            if (Trucks[i].id === id) {
                return Trucks.slice(i, i+1)[0];
            }        
        }
    }
    function getAmountOfCargoOfVehicle(vehicleId){
        var cargoAtTruck = 0;        
        var truck = getTruckOrTrailerByUID(vehicleId);
        for(var i = 0; i < truck.cargo.length; i++){
            cargoAtTruck += tinyTrucks.goodsModel.getGoodById(truck.cargo[i]).amount;
        }
        return cargoAtTruck;
    }
    function getTruckOrTrailerByUID(id){        
        for(var i = 0; i < truckStorage.length; i++){
            if(truckStorage[i].uid === id){
                return truckStorage[i];
            }
            if(truckStorage[i].trailers){
                for(var  j = 0; j < truckStorage[i].trailers.length; j++){
                    var trailer = truckStorage[i].trailers[j];
                    if(trailer.uid === id){
                        return trailer;
                    }
                }
            }
        }
    }
    function setAttributesForTruck(truckId, attrs){
        var truck = tinyTrucks.truckModel.getTruckByUID(truckId);
        for(var key in attrs){
            truck[key] = attrs[key];
        }
    }
    function calculateNextStop(truckid){        
        var truck = tinyTrucks.truckModel.getTruckByUID(truckid);
        truck.start = new Date().getTime();
        var street = MapData.getStreetBetweenCitys(truck.tour[0].name, truck.tour[1].name);
        var time = street.length/truck.data.speed;
        var min = Math.floor(time);
        //console.log((time % min));
        var sec = Math.floor((time % min)*60);        
        //TODO !!!!!!!!!!! delete next line
        min = 1;
        
        truck.stop = truck.start + (sec * 1000) + (min * 1000 * 60);
        truck.time = getDisplayTimeForTrucks(truck.stop);
    }
    function truckArrived(truck){
        // TODO check goods
        // TODO Here some statistics has to be saved
        truck.tour.shift();         
        if(truck.tour.length > 1){
            // TODO check if goods are at right place and than go on
            truck.location = truck.tour[0].name + " to " + truck.tour[1].name;
            calculateNextStop(truck.uid);            
            // TODO maybe clac new time
            
        } else {
            truck.status = 'depot';
            truck.location = truck.tour[0].name;
            truck.tour = [];
            truck.start = '';
            truck.stop = '';                        
            truck.time = '';            
        }        
    }
    function getDisplayTimeForTrucks(iTime){
        var time = new Date(iTime - new Date().getTime());
        var displayTime = time.getMinutes();
        if (displayTime > 0){
            displayTime += " min";
        } else {
            displayTime = time.getSeconds() + " sec";
        }
        return displayTime;
    }
    return {
        checkDrivingTrucks: function(){
            for(var i = 0; i < truckStorage.length; i++){
                if(truckStorage[i].status === 'en route'){
                    if(truckStorage[i].stop < new Date().getTime()){
                        console.log("I am at the goal!");
                        truckArrived(truckStorage[i]);
                    } else {                                                
                        truckStorage[i].time = getDisplayTimeForTrucks(truckStorage[i].stop);
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
            obj.location = '';
            obj.cargo = [];
            obj.time = '';
            if(obj.data.trailers > 0){
                obj.trailers = [];
            }
            truckStorage.push(obj);
        },
        removeTruckByUID: function(id){
            for(var i = 0; i < truckStorage.length; i++){
                if (truckStorage[i].uid === id){
                    return truckStorage.splice(i,1)[0];
                }
            }
        },
        getTruckByUID: function (id){
            for(var i = 0; i < truckStorage.length; i++){
                if(truckStorage[i].uid === id){
                    return truckStorage[i];
                }
            }
        },
        getTrucksByFilter: function(filters, dataFilter){
            var data = [];            
            for (var i = 0; i < truckStorage.length; i++) {
                if(truckStorage[i].type === 'truck'){
                    for(var j=0; j < filters.length;j++){
                        var filter = filters[j];
                        if(filter.indexOf(truckStorage[i].status) >= 0){
                            var check = true;
                            if(dataFilter){
                                for(var k = 0; k < dataFilter.length; k++){
                                    check = false;
                                    switch(dataFilter[k]) {
                                        case 'canAddTrailers':
                                            if(truckStorage[i].data.trailers > 0 && truckStorage[i].data.trailers > truckStorage[i].trailers.length){
                                                check = true;
                                            }
                                            break;
                                    }
                                }
                            }
                            if(check){
                                data.push(truckStorage[i]);
                            }
                        }
                    }
                }
            }
            return data;
        },
        getTruckAddTrailerList: function(){
            var trucks = this.getTrucksByFilter(['storage','depot'],['canAddTrailers']);
            var data = [];
            for(var i = 0; i < trucks.length; i++){
                data.push([trucks[i].uid, trucks[i].name, trucks[i].type, trucks[i].location, trucks[i].status, '']);
            }
            return data;
        },
        addTrailerToTruck: function(truckId, trailerId){
            var truck = this.getTruckByUID(truckId);
            var trailer = this.removeTruckByUID(trailerId);
            truck.trailers.push(trailer);            
        },
        changeAttributes: function(id, attrs){
            var truck = this.getTruckByUID(id);
            for(var key in attrs){
                truck[key] = attrs[key];
            }            
        },
        addGoodToTruck: function(truckid, goodId){            
            var good = tinyTrucks.goodsModel.getGoodById(goodId);            
            if(good.status === ''){
                var truck = this.getTruckByUID(truckid);            
                if(truck.data.type === good.type){                
                    var cargoAtTruck = getAmountOfCargoOfVehicle(truckid);                
                    if(cargoAtTruck + good.amount <= truck.data.capacity){
                        tinyTrucks.goodsModel.setStatus(goodId,'inuse');
                        truck.cargo.push(goodId);
                        return true;
                    }

                }
                if(truck.trailers){
                    for(var i = 0; i < truck.trailers.length; i++){
                        var trailer = truck.trailers[i];
                        if(trailer.data.type === good.type){
                            var cargoAtTrailer = getAmountOfCargoOfVehicle(trailer.uid);
                            if(cargoAtTrailer + good.amount <= trailer.data.capacity){
                                tinyTrucks.goodsModel.setStatus(goodId,'inuse');
                                trailer.cargo.push(goodId);
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        },
        removeGoodFromTruck: function(truckid, goodId){
            var truck = this.getTruckByUID(truckid);
            var index = truck.cargo.indexOf(goodId);            
            if(index >= 0){                
                var cargoid = truck.cargo.splice(index, 1)[0];                
                tinyTrucks.goodsModel.setStatus(cargoid,'');
            } else {
                if(truck.trailers){
                    for(var i = 0; i < truck.trailers.length; i++){
                        var trailer = truck.trailers[i];
                        index = trailer.cargo.indexOf(goodId);
                        if(index >= 0){
                            cargoid = trailer.cargo.splice(index, 1)[0];
                            tinyTrucks.goodsModel.setStatus(cargoid,'');
                        }
                    }
                }
            }
        },
        getTruckCargoInfo: function(truckId){
            var html = '';
            var truck = this.getTruckByUID(truckId);
            var currentCargo = getAmountOfCargoOfVehicle(truck.uid);
            html += '<div>' + currentCargo + '/' + truck.data.capacity + '</div>';
            if(truck.trailers){
                for(var i = 0; i < truck.trailers.length; i++){                    
                    var trailer = truck.trailers[i];                    
                    currentCargo = getAmountOfCargoOfVehicle(trailer.uid);
                    html += '<div>' + currentCargo + '/' + trailer.data.capacity + '</div>';
                }
            }            
            return html;
        },
        getTruckInUseList: function(){
            var data = [];
            var trucks = this.getTrucksByFilter(['en route','depot']);            
            for(var i = 0; i < trucks.length; i++){
                data.push([trucks[i].uid, trucks[i].name, trucks[i].type, trucks[i].location, trucks[i].status, trucks[i].time]);
            }
            console.log(trucks);
            return data;
        },
        isGoodInTruck: function(truckid, goodid){
            var truck = this.getTruckByUID(truckid);
            if(truck.cargo.indexOf(goodid) >= 0){
                return true;
            }
            if(truck.trailers){
                for(var i = 0; i < truck.trailers.length; i++){
                    var trailer = truck.trailers[i];
                    if(trailer.cargo.indexOf(goodid) >= 0){
                        return true;
                    }
                }
            }
            return false;
        },
        sendTruck: function(truckid, attr){
            setAttributesForTruck(truckid, attr);
            calculateNextStop(truckid);
        }
    };
}(window));