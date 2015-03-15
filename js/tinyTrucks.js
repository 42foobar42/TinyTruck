var tinyTrucks = (function (win) {
    var menuDiv;
    var CONST_MONEY_START = 20000;
    var CONST_CLASSNAME_OF_MENUBUTTONS = "menuButton", CONST_CLASSNAME_OF_VIEWS = "view", CONST_CLASSNAME_OF_CLOSEBUTTONS = "closeMenu", 
        CONST_CLASSNAME_OF_SUBVIEWCLOSEBUTTONS = "closeSubview";
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
            CONST_ID_OF_USEDTRUCKS = "UsedTrucks";
    var MSG_VIEW_NOT_FOUND = "A name of a view is maybe wrong!",
            MSG_CLOSE_BUTTON_MISSING = "No close Button found in the view!",
            MSG_TABLE_NOT_FOUND = "Table not found!",
            MSG_TBODY_NOT_FOUND = "Table has not body!";
    var CONST_RESALE_VALUE = 0.8;
    var trucks;
    var truckId = 0;
    // TODO default depot maybe selectable at gamestart
    var money, partStorage = [], truckStorage = [], trucksInUseStorage = [];
    var depots = [{name: "Frankfurt", stock: [], trucks: []}];
    var putTruckOnMap = false;
    var MapClick = false, startPoint = {x:0,y:0}, lastPoint = {x:0,y:0};
    function showMenu(element) {
        var id = element.id.replace(CONST_CLASSNAME_OF_MENUBUTTONS, "");
        var views = document.getElementsByClassName(CONST_CLASSNAME_OF_VIEWS);
        for (var i = 0; i < views.length; i++) {
            views[i].style.display = "none";
        }
        document.getElementById(id).style.display = "inherit";
        if (id === CONST_ID_OF_MAP) {
            Map.init(CONST_ID_OF_MAPS);               
            document.getElementById(CONST_ID_OF_MAPS).onmousedown = function (event) {                                
                var city = Map.isCityClicked(event.clientX, event.clientY);
                // TODO 
                // check out of bounce
                if(city === false) {
                    startPoint['x'] = event.clientX;
                    startPoint['y'] = event.clientY;
                    MapClick = true;      
                } else {
                    if (putTruckOnMap !== false) {
                        putTruckOnDepot(putTruckOnMap, city);
                    } else {
                        openCityScreen(city);
                    }
                }
            };
            document.getElementById(CONST_ID_OF_MAPS).onmousemove = function (event) {
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
    function openCityScreen(city){        
        tinyTrucks.show(CONST_ID_OF_CITY);
        var CityView = document.getElementById(CONST_ID_OF_CITY);
        CityView.getElementsByClassName(CONST_CLASSNAME_OF_SUBVIEWCLOSEBUTTONS)[0].onclick = function () {
            tinyTrucks.show(CONST_ID_OF_MAP);
        };
        //TODO show City info and make button use
        CityView.getElementsByTagName("h1")[0].innerHTML = city.name;
        document.getElementById(CONST_ID_OF_CITYGOODS).onclick = function (event){            
            fillTable('table' + CONST_ID_OF_CITYGOODS + 'List', getGoodsDataForTable(city));
            CityView.getElementsByClassName(CONST_ID_OF_CITYGOODS + 'List')[0].style.display = 'inherit';
        };
                       
        console.log(city);
    }
    function getGoodsDataForTable(city){
        var data = [];
        for(var i = 0; i  < city.goods.length; i++){
            var good = city.goods[i];
            var info = [];
            for(var key in good){
                info.push(good[key]);
            }
            data.push(info);
        }
        return data;
    }
    // TODO change name
    function putTruckOnDepot(id, city) {        
        for (var i = 0; i  < depots.length; i++){
            if(depots[i].name === city.name){
                var truck = getTruckById(id);
                truck.location = city.name;
                truck.status = 'depot';
                fillTable(CONST_ID_OF_USEDTRUCKS, getTruckListAsArray(['depot', 'running']), 'row', 'tinyTrucks.usedTruckListClick(this)');
                depots[i].trucks.push(id); 
                fillTable(CONST_ID_OF_TRUCKLIST, getTruckListAsArray(['storage']));
                putTruckOnMap = false;                
                // TODO tuck show goods and go on journey
                openTruckGoodChoice(city, id);  
                Map.setCityChoice([]);
                return;
            }
        }
        // TODO make nice
        alert("You have no depot in this city!");
    }    
    function openTruckGoodChoice(city, truckid){        
        tinyTrucks.show(CONST_ID_OF_MAP);
        var map = document.getElementById(CONST_ID_OF_MAPS);
        var MapOrW = map.width;
        var MapW = map.width *= 2/3;                
        Map.reDraw(MapW);
        var goodslist = document.getElementById(CONST_ID_OF_GOODSMAP);
        fillTable('table' + CONST_ID_OF_GOODSMAP + 'List', getGoodsDataForTable(city));
                //goodslist.style.display = "inline-block";
        goodslist.style.display = "inherit";
        goodslist.style.float = "right";                
        goodslist.style.width = (MapOrW - MapW - 1) + 'px';
        goodslist.style.height = map.clientHeight + 'px';
    }
    function getTruckById(id){
        for(var i = 0; i < truckStorage.length; i++){
            if(truckStorage[i].id === id){
                return truckStorage[i];
            }
        }
        return false;
    }
    function removeTruck(id){
        for(var i = 0; i < truckStorage.length; i++){
            if (truckStorage[i].id === id){
                putTruckOnMap = false;                
                return truckStorage.splice(i,1);
            }
        }
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
                    var newRow = document.createElement("tr");
                    for (var j = 0; j < data[i].length; j++) {
                        var newCell = document.createElement("td");
                        newCell.innerHTML = data[i][j];
                        newRow.appendChild(newCell);
                    }
                    if(onItemClick === 'row'){
                        /*newRow.onclick = (function (){
                            return function(){
                                func;
                            }
                        });*/
                        newRow.setAttribute("onclick",func);
                    }
                    tbody.appendChild(newRow);
                }
            } else {
                console.log(MSG_TBODY_NOT_FOUND + " - " + id);
            }
        } else {
            console.log(MSG_TABLE_NOT_FOUND + " - " + id);
        }
    }
    function getPartsAsArray(partNo) {   
        var item = Parts[partNo];
        var but = '<input class="buyButton" value="buy" type="button" onclick="tinyTrucks.buyPart(' + item.id + ', ' + item.costs + ', this);"/>';
        return [partNo, item.name + but, item.type, item.costs];
    }
    function getPartStorageAsArray() {
        var ary = [];        
        for (var i = 0; i < partStorage.length; i++) {
            var but = '<input class="sellButton" value="sell" type="button" onclick="tinyTrucks.sellPart(' + partStorage[i].id
                    + ', ' + partStorage[i].value + ', this);"/>';
            ary.push([partStorage[i].id, partStorage[i].name, partStorage[i].type + but, partStorage[i].value]);
        }
        return ary;
    }
    function initGame() {
        money = CONST_MONEY_START;
    }
    function setValuesOnScreen() {
        document.getElementById(CONST_ID_OF_MONEYINPUT).value = money;
    }
    function removeFromPartStorage(ids) {
        for(var j = 0; j < ids.length; j++){
            var id = ids[j];
            for (var i = 0; i < partStorage.length; i++) {
                if (partStorage[i].id === id ) {
                    partStorage.splice(i, 1);
                    break;
                }
            }
        }
        
    }
    function getItem(id, type) {
        if(type === 'truck') {
            for (var i = 0; i < Trucks.length; i++) {
                if (Trucks[i].id === id) {
                    return Trucks[i];
                }
            }
        } else if (type === 'part') {
            for (var i = 0; i < Parts.length; i++) {
                if (Parts[i].id === id) {
                    return Parts[i];
                }
            }
        }
       
    }
    function getTruckListAsArray(filter) {
        var data = [];
        for (var i = 0; i < truckStorage.length; i++) {            
            if(filter.indexOf(truckStorage[i].status) >= 0){
                //TODO better check for filter
                if(filter.length === 1){
                    var infoBut = '<input class="infoButton" type="button" value="info" onclick="tinyTrucks.showTruckInfo(' + truckStorage[i].origin.id + ',\'' + truckStorage[i].origin.type + '\')"/>';
                    var useBut = '<input class="useButton" type="button" value="use" onclick="tinyTrucks.useTruck( ' + truckStorage[i].id + ')"/>';
                    data.push([truckStorage[i].name, truckStorage[i].origin.type + " " + infoBut, truckStorage[i].origin.name + " " + useBut]);
                } else {
                     data.push([truckStorage[i].id, truckStorage[i].name, truckStorage[i].origin.type, truckStorage[i].location, truckStorage[i].status]);
                }
            }
        }
        return data;
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
    function fillBuildTable() {
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

        var buildArray = [];
        for(var i = 0; i < PartsPerItem.length; i++){
            var infoBut = '<input class="infoButton" type="button" value="info" onclick="tinyTrucks.showTruckInfo(' + PartsPerItem[i].item.id + ')"/>';
            var buildBut = '<input class="buildButton" type="button" value="build" onclick="tinyTrucks.buildTruck(' + PartsPerItem[i].item.id + ')"/>';
            buildArray.push([PartsPerItem[i].counter, PartsPerItem[i].item.name + infoBut, PartsPerItem[i].item.costs + buildBut]);
        }
        fillTable(CONST_ID_OF_BUILDARTS, buildArray);
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
                // The truckId has to be corrected if the data is read
            }
            //Map.init(CONST_ID_OF_MAPS);
            setValuesOnScreen();
            return tinyTrucks;
        },
        show: function (id) {
            showMenu(document.getElementById(id));
            return tinyTrucks;
        },
        // is this needed 
        makeData: function (type, id, data) {
            if (type === 1) {
                fillTable(id, data);
            }
            return tinyTrucks;
        },
        // is this needed?
        addTruckParts: function (data) {
            trucks = data;
            return tinyTrucks;
        },
        getRandomParts: function (amount) {
            var data = [];
            for (var i = 0; i < amount; i++) {
                var random = Math.floor((Math.random() * Parts.length));                                
                data.push(getPartsAsArray(random));
            }
            return data;
        },
        buyPart: function (itemId, costs, button) {
            // TODO
            //  better alert box
            if (costs > money) {
                alert("Not enough money");
            } else {
                var row = button.parentNode.parentNode;
                row.parentNode.removeChild(row);
                var part = getItem(itemId, 'part');                
                part.value = parseInt(part.costs * CONST_RESALE_VALUE);
                partStorage.push(part);
                money -= costs;
                var storedParts = getPartStorageAsArray();
                fillTable(CONST_ID_OF_SELLPARTS, storedParts);
            }
            setValuesOnScreen();
            fillBuildTable();
        },
        addNewGoodsToCitys: function(){
            var citys = MapData.getAllCitys();
            for(var i = 0; i < citys.length; i++){
                //TODO Amount of goods should depned on population or something
                var goods = [];
                for(var j = 0; j < Goods.length; j++){
                    var good = Goods[j];
                    // TODO randomize amount
                    good.amount = 10;
                    goods.push(good);
                }
                MapData.setAttributeOfCity(citys[i].name, {goods:goods});
            }
        },
        sellPart: function (id, value, button) {
            // TODO 
            // Better question field
            var yes = confirm("really?");
            if (yes === true) {
                removeFromPartStorage([id]);
                var row = button.parentNode.parentNode;
                row.parentNode.removeChild(row);
                money += value;
            }
            setValuesOnScreen();
            fillBuildTable();
        },
        showTruckInfo: function (id, type) {
            // TODO
            console.log("showTruck Info(id/type): " + id + " " + type);
        },
        buildTruck: function (id) {
            // TODO
            var item = getItem(id, 'truck');
            if (item.costs < money) {
                removeFromPartStorage(item.parts);                
                var NameCounter = 1;
                for(var i = 0; i < truckStorage.length; i++){
                    if (truckStorage[i].origin.name === item.name){
                        NameCounter++;
                    }
                }
                var obj = {name: item.name + " " + NameCounter, origin: item, id:truckId, status:'storage'};
                truckId++;
                truckStorage.push(obj);                
                money -= item.costs;
                setValuesOnScreen();
                fillBuildTable();
                fillTable(CONST_ID_OF_SELLPARTS, getPartStorageAsArray());
                fillTable(CONST_ID_OF_TRUCKLIST, getTruckListAsArray(['storage']));
            } else {
                // TODO nice box
                alert("No money");
            }
        },
        useTruck: function (id) {
            putTruckOnMap = id;
            this.show(CONST_ID_OF_MAP);
            var citys = [];
            for(var i = 0; i < depots.length; i++){
                citys.push(depots[i].name);
            }
            Map.setCityChoice(citys);                        
        },
        getPartStorage: function () {
            return partStorage;
        },
        usedTruckListClick: function (el){
            console.log(MapData.getCityByName(el.childNodes[3].innerHTML));
            // TODO switch between status
            openTruckGoodChoice(MapData.getCityByName(el.childNodes[3].innerHTML), el.childNodes[0].innerHTML);            
        }
    };
}(window));
