tinyTrucks.truckModel = (function (win) {
    var truckStorage = [];
    var CONST_PRICE_PER_LITER_GAS = 3 / 100;
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
        var sec = Math.floor((time % min)*60);        
        //TODO !!!!!!!!!!! delete next 2 line
        min = 0;
        sec = 10;
        truck.stop = truck.start + (sec * 1000) + (min * 1000 * 60);
        truck.time = getDisplayTimeForTrucks(truck.stop);
    }
    function truckArrived(truck){                
        var stats = {};
        var tour = truck.tour.shift();
        var street = MapData.getStreetBetweenCitys(tour.name, truck.tour[0].name);
        stats.length = street.length;
        stats.money = 0;
        stats.cargo = '';
        stats.truck = truck;
        stats.time = truck.stop-truck.start;
        stats.timestamp = new Date().getTime();
        var goods = getGoodsFromTruck(truck);
        for(var i = 0; i < goods.length; i++){
            if(goods[i].destination ===  truck.tour[0].name){
                stats.money = goods[i].value;
                tinyTrucks.addMoney(goods[i].value);
                tinyTrucks.truckModel.removeGoodFromTruck(truck.uid,goods[i].uid);
                stats.cargo = tinyTrucks.goodsModel.removeFromGoodList(goods[i].uid);
            }
        }
        tinyTrucks.statsModel.addTruckStat(stats);
        if(truck.tour.length > 1){
            truck.location = truck.tour[0].name + " to " + truck.tour[1].name;
            calculateNextStop(truck.uid);
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
    function setHighlightCity(citys){
        var data = [];
        for(var i = 0; i < citys.length; i++){
            data.push({name:citys[i].name, color:'#ff0000'});
        }
        Map.setCityChoice(data);
    }
    function checkCityConnection(source, destination){
        var conCitys = MapData.getAllConnectedCitys(source);
        if(conCitys.indexOf(destination.name) >= 0){
            return true;
        } else {
            return false;
        }
    }
    function getDistanceOfTour(truck){
        var distance = 0;
        for(var i = 1; i < truck.tour.length; i++){
            var street = MapData.getStreetBetweenCitys(truck.tour[i-1].name,truck.tour[i].name);
            distance += street.length;
        }
        return distance;
    }
    function getRevenueOfTour(truck){
        var revenue = 0;
        for(var i = 0; i < truck.cargo.length; i++){
            var cargo = tinyTrucks.goodsModel.getGoodById(truck.cargo[i]);
            for(var j = 1; j < truck.tour.length; j++){
                if(cargo.destination === truck.tour[j].name){
                    revenue += cargo.value;
                }
            }
        }
        if(truck.trailers){
            for(var i = 0; i < truck.trailers.length; i++){
                var trailer = truck.trailers[i];
                for(var j = 0; j < trailer.cargo.length; j++){
                    var cargo = tinyTrucks.goodsModel.getGoodById(trailer.cargo[j]);
                    for(var j = 1; j < truck.tour.length; j++){
                        if(cargo.destination === truck.tour[j].name){
                            revenue += cargo.value;
                        }
                    }
                }
            }
        }
        return revenue;
    }
    function getGoodsFromTruck(truck){
        var goods = [];
        for(var i = 0; i < truck.cargo.length; i++){
            goods.push(tinyTrucks.goodsModel.getGoodById(truck.cargo[i]));
        }
        if(truck.trailers){
            for(var i = 0; i < truck.trailers.length; i++){
                var trailer = truck.trailers[i];
                for(var j = 0; j < trailer.cargo.length; j++){
                    goods.push(tinyTrucks.goodsModel.getGoodById(trailer.cargo[j]));
                }
            }
        }
        return goods;
    }
    return {
        checkDrivingTrucks: function(){
            for(var i = 0; i < truckStorage.length; i++){
                if(truckStorage[i].status === 'en route'){
                    if(truckStorage[i].stop < new Date().getTime()){
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
            obj.tour = [];
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
            var gasPrice = 0;
            var distance = getDistanceOfTour(truck);
            var revenue = getRevenueOfTour(truck);
            //console.log(truck);
            html += '<div class="truck">' + currentCargo + '/' + truck.data.capacity + '</div>';
            gasPrice += truck.data.fuelconsumption * distance * CONST_PRICE_PER_LITER_GAS;
            if(truck.trailers){
                for(var i = 0; i < truck.trailers.length; i++){
                    var trailer = truck.trailers[i];
                    currentCargo = getAmountOfCargoOfVehicle(trailer.uid);
                    html += '<div class="trailer">' + currentCargo + '/' + trailer.data.capacity + '</div>';
                    gasPrice += trailer.data.fuelconsumption * distance * CONST_PRICE_PER_LITER_GAS;
                }
            }
            //console.log(revenue);
            //console.log(gasPrice);
            var profit = Math.round(revenue - gasPrice);
            html += '<div class="profit';
            if(profit > 0){
                html += ' plus';
            } else {
                html += ' minus';
            }
            html += '">' + profit + '</div>';
            return html;
        },
        getTruckInUseList: function(){
            var data = [];
            var trucks = this.getTrucksByFilter(['en route','depot']);
            for(var i = 0; i < trucks.length; i++){
                data.push([trucks[i].uid, trucks[i].name, trucks[i].type, trucks[i].location, trucks[i].status, trucks[i].time]);
            }
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
        sendTruck: function(truckid){
            var truck = this.getTruckByUID(truckid);
            var tour = truck.tour;
            setAttributesForTruck(truckid, {status:'en route', location:tour[0].name + ' to ' + tour[1].name});
            calculateNextStop(truckid);
            var distance = getDistanceOfTour(truck);
            var gasPrice = 0;
            gasPrice += truck.data.fuelconsumption * distance * CONST_PRICE_PER_LITER_GAS;
            if(truck.trailers){
                for(var i = 0; i < truck.trailers.length; i++){
                    var trailer = truck.trailers[i];
                    gasPrice += trailer.data.fuelconsumption * distance * CONST_PRICE_PER_LITER_GAS;
                }
            }
            return Math.round(gasPrice);
        },
        addTour: function(truckid, city){
            var truck = this.getTruckByUID(truckid);
            truck.tour.push(city);
            setHighlightCity(truck.tour);
        },
        removeTour: function(truckid){
            var truck = this.getTruckByUID(truckid);
            truck.tour.pop();
            setHighlightCity(truck.tour);
        },
        isCityReachable: function(truckid, city){
            var truck = this.getTruckByUID(truckid);
            return checkCityConnection(truck.tour[truck.tour.length - 1], city);
        },
        getTrucksPerCity: function(cityname){
            // TODO Which info is required
            var data = [];
            var trucks = this.getTrucksByFilter(['depot']);
            for(var i = 0; i < trucks.length; i++){
                if(trucks[i].location === cityname){
                    data.push([trucks[i].uid, trucks[i].name, trucks[i].type, trucks[i].location, trucks[i].status]);
                }
            }
            return data;
        },
        getTruckInfoByUid: function(id){
            var html = '';
            var truck = getTruckOrTrailerByUID(id);
            for(var key in truck){
                html += '<div><span>' + key + ': </span><span>' + truck[key] + '</span></div>';
            }
            return html;
        },
        getTruckInfoById: function(id){
            var html = '';
            var truck = getTruckFromModelList(id);
            for(var key in truck){
                html += '<div><span>' + key + ': </span><span>' + truck[key] + '</span></div>';
            }
            return html;
        },
        updateTruckTimes: function(domId){
            //var trucks = this.getTrucksByFilter(['en rout']);
            var rows = document.getElementById(domId).getElementsByTagName('tr');
            for(var i = 0; i < rows.length; i++){
                var cells = rows[i].getElementsByTagName('td');
                //console.log(cells);
                if(cells[4].innerHTML === "en route"){
                    var truck = getTruckOrTrailerByUID(cells[0].innerHTML);
                    cells[5].innerHTML = truck.time;
                    cells[4].innerHTML = truck.status;
                    cells[3].innerHTML = truck.location;
                }
            }
        },
        getGasprice: function(){
            return CONST_PRICE_PER_LITER_GAS;
        }
    };
}(window));