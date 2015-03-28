var tinyTrucks = (function (win) {
    var menuDiv;
    var CONST_MONEY_START = 10000;
    var CONST_COST_OF_DEPOT = 5000;
    var CONST_CLASSNAME_OF_MENUBUTTONS = "menuButton", CONST_CLASSNAME_OF_VIEWS = "view", CONST_CLASSNAME_OF_CLOSEBUTTONS = "closeMenu", 
        CONST_CLASSNAME_OF_SUBVIEWCLOSEBUTTONS = "closeSubview", CONST_CLASSNAME_OF_CITYHASDEPOT = "hasDepot", CONST_CLASSNAME_OF_CITYNODEPOT = "hasNoDepot";
    var CONST_ID_OF_MONEYINPUT = "account",
            CONST_ID_OF_SELLPARTS = "SellPartList",
            CONST_ID_OF_BUILDARTS = "BuildPartList",
            CONST_ID_OF_TRUCKLIST = "TruckList",
            CONST_ID_OF_MAPS = "playground",
            CONST_ID_OF_ZOOMIN = "zoomin",
            CONST_ID_OF_ZOOMOUT = "zoomout",
            CONST_ID_OF_MAP = "Map",
            CONST_ID_OF_CITY = "City",
            CONST_ID_OF_GOODSMAP = "GoodsList",
            CONST_ID_OF_CITYGOODS = "CityGoods",
            CONST_ID_OF_USEDTRUCKS = "UsedTrucks",
            CONST_ID_OF_REMOVEDESTINATION = "removeLastDestination",
            CONST_ID_OF_SENDTRUCK = "sendTruck",
            CONST_ID_OF_GOODSTRUCK = "GoodsTruckOverview",
            CONST_ID_OF_CITYDEPOT = "CityDepot",
            CONST_ID_OF_CITYINFO = "CityInfo",
            CONST_ID_OF_TRUCKINFO = "TrukInfo",
            CONST_ID_OF_STATISTICS = "Stats",
            CONST_ID_OF_BUTTON_BUYDEPOT = "BuyDepot";
    var MSG_VIEW_NOT_FOUND = "A name of a view is maybe wrong!",
            MSG_CLOSE_BUTTON_MISSING = "No close Button found in the view!",
            MSG_TABLE_NOT_FOUND = "Table not found!",
            MSG_TBODY_NOT_FOUND = "Table has not body!";
    var CONST_TABLEID_BUYPARTS = "tableBuyPartList",
        CONST_TABLEID_BUILDTRUCK = "tableBuildPartList",
        CONST_TABLEID_SELLPARTS = "tableSellPartList",
        CONST_TABLEID_TRUCKSTORAGE = "tableTruckStorageList",
        CONST_TABLEID_MAPGOODS = "tableGoodsListList",
        CONST_TABLEID_USEDTRUCKS = "tableUsedTrucksList",
        CONST_TABLEID_CITYGOODS = 'tableCityGoodsList',
        CONST_TABLEID_CITYDEPOT = "tableCityDepotList",
        CONST_TABLEID_DEPOTS = "tableDepotsList",
        CONST_TABLEID_DEPOTGOODS = "tableCityDepotGoodsList";    
    var CONST_RESALE_VALUE = 0.8;
    var tour;    
    // TODO default depot maybe selectable at gamestart
    var money;    
    var putTruckOnMap = false, switchGoodChoice = false;
    var MapClick = false, startPoint = {x:0,y:0}, lastPoint = {x:0,y:0};
    function showMenu(element) {
        var id = element.id.replace(CONST_CLASSNAME_OF_MENUBUTTONS, "");
        var views = document.getElementsByClassName(CONST_CLASSNAME_OF_VIEWS);
        for (var i = 0; i < views.length; i++) {
            views[i].style.display = "none";
        }
        document.getElementById(id).style.display = "inherit";
        updateTables();
        if (id === CONST_ID_OF_MAP) {
            Map.init(CONST_ID_OF_MAPS);
            if(switchGoodChoice !== false){
                document.getElementById(CONST_ID_OF_REMOVEDESTINATION).style.display = "inherit";
                document.getElementById(CONST_ID_OF_SENDTRUCK).style.display = "inherit";
                document.getElementById(CONST_ID_OF_GOODSTRUCK).style.display = "inherit";
            } else {
                document.getElementById(CONST_ID_OF_REMOVEDESTINATION).style.display = "none";
                document.getElementById(CONST_ID_OF_SENDTRUCK).style.display = "none";
                document.getElementById(CONST_ID_OF_GOODSTRUCK).style.display = "none";
                document.getElementById(CONST_ID_OF_GOODSTRUCK).innerHTML = "";
            }
            document.getElementById(CONST_ID_OF_MAPS).onmousedown = function (event) {                                
                var city = Map.isCityClicked(event.clientX, event.clientY);                
                if(city === false) {
                    startPoint['x'] = event.clientX;
                    startPoint['y'] = event.clientY;
                    MapClick = true;      
                } else {                    
                    if (putTruckOnMap !== false) {
                        putTruckOnDepot(putTruckOnMap, city);
                    } else if(switchGoodChoice !== false){
                        var truckid = document.getElementById(CONST_ID_OF_SENDTRUCK).getAttribute("data-truckid");
                        if(tinyTrucks.truckModel.isCityReachable(truckid, city)){
                            tinyTrucks.truckModel.addTour(truckid, city);
                            updateTruckStatus(truckid);
                        }
                    }else {
                        openCityScreen(city);
                    }
                }
            };
            document.getElementById(CONST_ID_OF_MAPS).onmousemove = function (event) {
                // TODO check out of bounce
                if (MapClick === true){
                    var x  = event.clientX - startPoint.x + lastPoint.x;
                    var y  = event.clientY - startPoint.y + lastPoint.y;
                    Map.scroll(x, y);
                    //console.log(depots);
                }
            };
            document.getElementById(CONST_ID_OF_MAPS).onmouseup = function (event) {
                MapClick = false;
                lastPoint = Map.getScrollPos();
            };            
            // TODO
            // on leave event
        }
        Layout.makeScrollableTableSize(id);
    }
    function getCityInfo(city){
        var html = "";        
        for(var key in city){
            html += '<div>' + key + '</div><div>' + city[key] + '</div>';
        }
        return html;
    }
    function openCityScreen(city){        
        tinyTrucks.show(CONST_ID_OF_CITY);
        fillTable(CONST_TABLEID_CITYGOODS, tinyTrucks.goodsModel.getUnusedGoodsForCityList(city.name));
        fillTable(CONST_TABLEID_CITYDEPOT, tinyTrucks.truckModel.getTrucksPerCity(city.name));
        fillTable(CONST_TABLEID_DEPOTGOODS, tinyTrucks.depotsModel.getGoodsForDepot(city.name));
        document.getElementById(CONST_ID_OF_BUTTON_BUYDEPOT).setAttribute('onclick', "tinyTrucks.buyDepot('" + city.name + "');");
        if(tinyTrucks.depotsModel.hasCityDepot(city.name)){
            document.getElementsByClassName(CONST_CLASSNAME_OF_CITYHASDEPOT)[0].style.display = 'inherit';
            document.getElementsByClassName(CONST_CLASSNAME_OF_CITYNODEPOT)[0].style.display = 'none';
        } else {
            document.getElementsByClassName(CONST_CLASSNAME_OF_CITYHASDEPOT)[0].style.display = 'none';
            document.getElementsByClassName(CONST_CLASSNAME_OF_CITYNODEPOT)[0].style.display = 'inherit';
        }
        var CityView = document.getElementById(CONST_ID_OF_CITY);
        CityView.getElementsByClassName(CONST_CLASSNAME_OF_SUBVIEWCLOSEBUTTONS)[0].onclick = function () {
            tinyTrucks.show(CONST_ID_OF_MAP);
        };
        //TODO show City info and make button use
        CityView.getElementsByTagName("h1")[0].innerHTML = city.name;
        var goodsView = CityView.getElementsByClassName(CONST_ID_OF_CITYGOODS + 'List')[0];
        var depotView = CityView.getElementsByClassName(CONST_ID_OF_CITYDEPOT + 'List')[0];
        var infoView = CityView.getElementsByClassName(CONST_ID_OF_CITYINFO + 'List')[0];
        infoView.innerHTML = getCityInfo(city);
        var hideCityMenus = function(){
            goodsView.style.display = 'none';
            depotView.style.display = 'none';
            infoView.style.display = 'none';
        };
        document.getElementById(CONST_ID_OF_CITYINFO).onclick = function (event){
            hideCityMenus();
            infoView.style.display = 'inherit';
        };
        document.getElementById(CONST_ID_OF_CITYGOODS).onclick = function (event){
            hideCityMenus();
            goodsView.style.display = 'inherit';
        };
        document.getElementById(CONST_ID_OF_CITYDEPOT).onclick = function (event){
            hideCityMenus();
            depotView.style.display = 'inherit';
        };        
    }
    function putTruckOnDepot(id, city) {
        if(tinyTrucks.depotsModel.hasCityDepot(city.name)){
            putTruckOnMap = false;
            tinyTrucks.depotsModel.addTruckToDepot(city.name, id);
            tinyTrucks.truckModel.changeAttributes(id, {location: city.name, status: 'depot'});
            updateTables();
            openTruckGoodChoice(city, id);
        } else {
            // TODO make nice
            alert("You have no depot in this city!");
        }    
    }    
    function openTruckGoodChoice(city, truckid){
        // TODO cleanup code
        
        switchGoodChoice = true;
        tinyTrucks.truckModel.addTour(truckid, city);
        tinyTrucks.show(CONST_ID_OF_MAP);
        
        // TODO color in use rows
        fillTable(CONST_TABLEID_MAPGOODS, tinyTrucks.goodsModel.getGoodsForMapGoodsTable(city.name, truckid), 'row', 'tinyTrucks.useGoodsListClick(this,\'' + truckid + '\')');
        var rows = document.getElementById(CONST_TABLEID_MAPGOODS).getElementsByTagName('tr');        
        for(var i = 0; i < rows.length; i++){
            var cell = rows[i].getElementsByTagName('td');
            if(tinyTrucks.truckModel.isGoodInTruck(truckid, cell[1].innerHTML)){                
                rows[i].className += 'selectedRow';
            }
        }
        
        var goodslist = document.getElementById(CONST_ID_OF_GOODSMAP);
        var map = document.getElementById(CONST_ID_OF_MAPS);
        var MapOrW = map.width;
        var MapW = map.width *= 2/3;
        Map.reDraw(MapW);
        goodslist.style.display = "inherit";
        goodslist.style.float = "right";
        //TODO Maybe calculate in a better way
        goodslist.style.width = (MapOrW - MapW - 2) + 'px';
        goodslist.style.height = map.clientHeight + 'px';
        
        document.getElementById(CONST_ID_OF_SENDTRUCK).setAttribute("data-truckid",truckid);
        updateTruckStatus(truckid);
    }
    function updateTruckStatus(truckid){
        var html = tinyTrucks.truckModel.getTruckCargoInfo(truckid);
        document.getElementById(CONST_ID_OF_GOODSTRUCK).innerHTML = html;
    }
    function updateTables(){
        fillTable(CONST_TABLEID_BUYPARTS, tinyTrucks.partsModel.getPartListForBuying(), 'row', 'tinyTrucks.buyPartClick(this)');
        fillTable(CONST_TABLEID_SELLPARTS, tinyTrucks.partsModel.getPartListForSelling(), null, null);
        fillTable(CONST_TABLEID_BUILDTRUCK, tinyTrucks.partsModel.getBuildableTrucksList(), null, null);
        fillTable(CONST_TABLEID_TRUCKSTORAGE, tinyTrucks.truckModel.getTruckStorageList(), null, null);
        fillTable(CONST_TABLEID_USEDTRUCKS, tinyTrucks.truckModel.getTruckInUseList(), 'row', 'tinyTrucks.usedTruckListClick(this)');
        fillTable(CONST_TABLEID_DEPOTS, tinyTrucks.depotsModel.getDepotsList(), null,  null);
        document.getElementById(CONST_ID_OF_STATISTICS).getElementsByClassName('content')[0].innerHTML = tinyTrucks.statsModel.getStatsAsHTML();
    }
    function menuControls() {
        var buttons = menuDiv.getElementsByClassName(CONST_CLASSNAME_OF_MENUBUTTONS);
        for (var i = 0; i < buttons.length; i++) {
            var id = buttons[i].id.replace(CONST_CLASSNAME_OF_MENUBUTTONS, "");
            var element = document.getElementById(id);            
            if (element) {
                buttons[i].onclick = function () {
                    showMenu(this);
                };
                var closeButton = element.getElementsByClassName(CONST_CLASSNAME_OF_CLOSEBUTTONS)[0];
                if (closeButton) {
                    closeButton.onclick = function () {
                        showMenu(menuDiv);
                        if(putTruckOnMap !== false){
                            putTruckOnMap = false;
                            Map.setCityChoice([]);
                        }
                        if(switchGoodChoice !== false){
                            switchGoodChoice= false;
                            Map.setCityChoice([]);
                        }
                        Layout.relayout();
                    };
                } else {
                    console.log(MSG_CLOSE_BUTTON_MISSING + " - " + id);
                }
            } else {
                console.log(MSG_VIEW_NOT_FOUND + " - " + id);
            }
        }
        var but = document.getElementById(CONST_ID_OF_ZOOMIN);
        if (but) {
            but.onclick = function () {
                Map.zoomin();
            };
        }
        but = document.getElementById(CONST_ID_OF_ZOOMOUT);
        if (but) {
            but.onclick = function () {
                Map.zoomout();
            };
        }
        but = document.getElementById(CONST_ID_OF_REMOVEDESTINATION);
        if (but) {
            but.onclick = function () {
                removeLastDestination();
            };
        }
        but = document.getElementById(CONST_ID_OF_SENDTRUCK);
        if (but) {
            but.onclick = function () {
                sendTruck();
            };
        }
    }
    function sendTruck(){
        var truckId = document.getElementById(CONST_ID_OF_SENDTRUCK).getAttribute("data-truckid");
        if(tinyTrucks.truckModel.getTruckByUID(truckId).tour.length > 1){            
            tinyTrucks.depotsModel.removeTruckFromDepot(truckId, tinyTrucks.truckModel.getTruckByUID(truckId).location);
            var cost = tinyTrucks.truckModel.sendTruck(truckId);
            // TODO check if it make sense to do this check and then stop sending the truck.....
            if(money >= cost){
                money -= cost;
                Map.setCityChoice([]);
                switchGoodChoice = false;
                // TODO close view where to go?
                tinyTrucks.show(CONST_ID_OF_MAP);
                setValuesOnScreen();
            } else {
                // TODO make nice
                alert("Not enouh money to send");
            }
        } else {
            // TODO make nice
            alert("No destination is choosen");
        }
    }    
    function removeLastDestination(){
        var truckid = document.getElementById(CONST_ID_OF_SENDTRUCK).getAttribute("data-truckid");
        tinyTrucks.truckModel.removeTour(truckid);
        updateTruckStatus(truckid);
    }
    function fillTable(id, data, onItemClick, func) {
        var table = document.getElementById(id);        
        if (table) {
            var tbody = table.getElementsByTagName("tbody")[0];
            if (tbody) {
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }
                for (var i = 0; i < data.length; i++) {                    
                    if(data[i]){                        
                        var newRow = document.createElement("tr");
                        for (var j = 0; j < data[i].length; j++) {
                            var newCell = document.createElement("td");
                            newCell.innerHTML = data[i][j];
                            newRow.appendChild(newCell);
                        }
                        if(onItemClick === 'row'){
                            newRow.setAttribute("onclick",func);
                        }
                        tbody.appendChild(newRow);
                    }
                }
            } else {
                console.log(MSG_TBODY_NOT_FOUND + " - " + id);
            }
        } else {
            console.log(MSG_TABLE_NOT_FOUND + " - " + id);
        }
    }   
    function initGame() {
        money = CONST_MONEY_START;
    }
    function setValuesOnScreen() {
        document.getElementById(CONST_ID_OF_MONEYINPUT).value = money;
    }         
    function overWriteBackButton(ViewID, func){
        var view = document.getElementById(ViewID);
        var button = view.getElementsByClassName('closeMenu')[0];
        button.onclick = function (){
            func();
            menuControls();
        };
    }
    function getIdOfOpenView(){
        var views = document.getElementsByClassName('view');
        for(var i = 0; i < views.length; i++){
            if(views[i].style.display !== 'none'){
                return views[i].id;
            }
        }
    }
    return {
        init: function (i_menuDiv) {
            menuDiv = document.getElementById(i_menuDiv);
            menuControls();
            
            
            //TODO
            // check if something is in storage
            if (1) {
                initGame();
                
                /***** test data ****/
                /*truckStorage.push({name:"testdruck", id:0, origin: "getItem(0, 'truck')"});
                fillBuildTable();
                fillTable(CONST_ID_OF_SELLPARTS, getPartStorageAsArray());
                fillTable(CONST_ID_OF_TRUCKLIST, getTruckListAsArray());*/
                /***** test data ****/
                
            } else {
                // TODO
                // read From Storage
                // The truckIdCounter has to be corrected if the data is read
            }
            Map.init(CONST_ID_OF_MAPS);
            setValuesOnScreen();
            return tinyTrucks;
        },
        show: function (id) {
            showMenu(document.getElementById(id));
            return tinyTrucks;
        },                
        showTruckInfo: function (id, type) {
            //console.log("showTruck Info(id/type): " + id + " " + type);
            //document.getElementById(CONST_ID_OF_TRUCKINFO).style.display = 'inherit';
            var OpenView = getIdOfOpenView();
            var TruckInfoView = document.getElementById(CONST_ID_OF_TRUCKINFO);            
            TruckInfoView.getElementsByClassName(CONST_CLASSNAME_OF_SUBVIEWCLOSEBUTTONS)[0].onclick = function () {
                tinyTrucks.show(OpenView);                
            };
            tinyTrucks.show(CONST_ID_OF_TRUCKINFO);
            // TODO
            if(isNaN(id)){
                TruckInfoView.getElementsByClassName('content')[0].innerHTML = tinyTrucks.truckModel.getTruckInfoByUid(id);
                //console.log("uid: " + id);                
            } else {
                TruckInfoView.getElementsByClassName('content')[0].innerHTML = tinyTrucks.truckModel.getTruckInfoById(id);
                //console.log("no: " + id);
            }            
        },       
        useTruck: function (id) {
            putTruckOnMap = id;
            var vehicle = tinyTrucks.truckModel.getTruckByUID(putTruckOnMap);
            if(vehicle.type === 'truck'){
                this.show(CONST_ID_OF_MAP);
                tinyTrucks.depotsModel.highlightDepotCitys();
            } else {
                var trucks = tinyTrucks.truckModel.getTrucksByFilter(['depot', 'storage'],['canAddTrailers']);
                if(trucks.length > 0){                    
                    fillTable(CONST_TABLEID_TRUCKSTORAGE, tinyTrucks.truckModel.getTruckAddTrailerList(),'row', 'tinyTrucks.addTrailerClick(this, \'' + id + '\')');
                    var func = function (){
                        fillTable(CONST_TABLEID_TRUCKSTORAGE, tinyTrucks.truckModel.getTruckStorageList(), null, null);
                    };
                    overWriteBackButton('Trucks', func);
                } else {
                    alert("No Trucks on depot or storage that can carry trailers.");
                }
            }
        },
        getPartStorage: function () {
            return partStorage;
        },
        usedTruckListClick: function (el){
            var status = el.childNodes[4].innerHTML;                        
            if(status === 'depot') {
                //console.log(el.childNodes[3].innerHTML);
                openTruckGoodChoice(MapData.getCityByName(el.childNodes[3].innerHTML), el.childNodes[0].innerHTML);
            } else if(status === 'en route'){
                // TODO what to show                
                var OpenView = getIdOfOpenView();
                var TruckInfoView = document.getElementById(CONST_ID_OF_TRUCKINFO);
                TruckInfoView.getElementsByClassName(CONST_CLASSNAME_OF_SUBVIEWCLOSEBUTTONS)[0].onclick = function () {
                    tinyTrucks.show(OpenView);                
                };
                tinyTrucks.show(CONST_ID_OF_TRUCKINFO);
                // TODO
                TruckInfoView.getElementsByClassName('content')[0].innerHTML = tinyTrucks.truckModel.getTruckInfoByUid(el.childNodes[0].innerHTML);
            }
        },
        addTrailerClick: function(el, trailerID){            
            tinyTrucks.truckModel.addTrailerToTruck(el.getElementsByTagName('td')[0].innerHTML, trailerID);
            updateTables();
        },
        useGoodsListClick: function(row, truckid){            
            // TODO Also maybe put it to the depot
            var goodid = row.getElementsByTagName('td')[1].innerHTML;
            if(row.className.indexOf("selectedRow") > -1){
                var truck = tinyTrucks.truckModel.getTruckByUID(truckid);
                var cityname = row.getElementsByTagName('td')[6].innerHTML;
                // first check if cargo is from the same location
                if(cityname === truck.location){
                    row.className = row.className.replace("selectedRow", "");
                    tinyTrucks.truckModel.removeGoodFromTruck(truckid, goodid);
                } else {
                    // check has city depot
                    //console.log(truck.location);
                    //console.log(tinyTrucks.depotsModel.hasCityDepot(truck.location));
                    if(tinyTrucks.depotsModel.hasCityDepot(truck.location)) {
                        // has city space
                        //console.log(tinyTrucks.depotsModel.spaceOfDepot(truck.location) + " > "+parseInt(row.getElementsByTagName('td')[5].innerHTML));
                        if(tinyTrucks.depotsModel.spaceOfDepot(tinyTrucks.truckModel.getTruckByUID(truckid).location) > parseInt(row.getElementsByTagName('td')[5].innerHTML)){
                            //console.log("now it can be put to depot");
                            tinyTrucks.depotsModel.putGoodToDepot(truck.location, goodid);
                            row.className = row.className.replace("selectedRow", "");
                            tinyTrucks.truckModel.removeGoodFromTruck(truckid, goodid);
                        } 
                    }
                }
            } else {
                var check = tinyTrucks.truckModel.addGoodToTruck(truckid, goodid);
                if(check === true){
                    var truck = tinyTrucks.truckModel.getTruckByUID(truckid);
                    // remove from depot
                    tinyTrucks.depotsModel.removeGoodFromDepot(truck.location, goodid);
                    row.className += "selectedRow";
                }
            }
            updateTruckStatus(truckid);
        },
        getMoney: function(){
            return money;
        },
        addMoney: function(imoney){
            money += imoney;
            setValuesOnScreen();
        },
        loopCheck: function (){
            tinyTrucks.truckModel.checkDrivingTrucks();
            tinyTrucks.partsModel.createPartList();
            tinyTrucks.goodsModel.generateGoodsList();
            var view = getIdOfOpenView();
            if(view === CONST_ID_OF_USEDTRUCKS){               
                tinyTrucks.truckModel.updateTruckTimes(CONST_TABLEID_USEDTRUCKS);
            }
            // TODO check when old good shout be deleted
            if(view !== CONST_ID_OF_GOODSMAP && view !== CONST_ID_OF_CITYGOODS){
                tinyTrucks.goodsModel.deleteObsoleteGoods();
            }            
        },
        getResaleFactor: function(){
            return CONST_RESALE_VALUE;
        },
        buyPartClick: function(row){
            var cells = row.getElementsByTagName('td');
            var costs = parseInt(cells[3].innerHTML);
            var id = parseInt(cells[0].innerHTML);
            if(costs < money){
                money -= costs;
                tinyTrucks.partsModel.addPart(id);
                setValuesOnScreen();
                fillTable(CONST_TABLEID_BUYPARTS, tinyTrucks.partsModel.getPartListForBuying(), 'row', 'tinyTrucks.buyPartClick(this)');
            } else {
                alert("not enought money!");
            }
        },
        sellPart: function (id) {
            // TODO better question field
            var yes = confirm("really?");
            if (yes === true) {
                var part = tinyTrucks.partsModel.removeFromPartStorage(id);                                                
                money += part.value;
                updateTables();
                setValuesOnScreen();
            }
        },
        buildTruck: function(TruckId){            
            var oTruck = tinyTrucks.truckModel.getOriginalTruckData(TruckId);            
            if(oTruck.costs  < money){
                for(var i = 0; i < oTruck.parts.length; i++){
                    tinyTrucks.partsModel.removeFromPartStorage(oTruck.parts[i]);  
                }
                tinyTrucks.truckModel.addTruckByOID(oTruck.id);
                money -= oTruck.costs;
                updateTables();
                setValuesOnScreen();
            } else {
                // TODO
                alert("not enough money");
            }
        },
        buyDepot: function(cityname){            
            if(CONST_COST_OF_DEPOT < money){
                tinyTrucks.depotsModel.addDepots(cityname);
                openCityScreen(MapData.getCityByName(cityname));
            }
        }
    };
}(window));
