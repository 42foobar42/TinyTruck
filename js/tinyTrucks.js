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
            CONST_ID_OF_GOODSMAP = "GoodsList";
    var MSG_VIEW_NOT_FOUND = "A name of a view is maybe wrong!",
            MSG_CLOSE_BUTTON_MISSING = "No close Button found in the view!",
            MSG_TABLE_NOT_FOUND = "Table not found!",
            MSG_TBODY_NOT_FOUND = "Table has not body!";
    var trucks;
    var truckId = 0;
    // TODO default depot maybe selectable at gamestart
    var money, partStorage = [], truckStorage = [], depots = [{name: "Frankfurt", stock: [], trucks: []}];
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
    }
    function putTruckOnDepot(id, city) {        
        for (var i = 0; i  < depots.length; i++){
            if(depots[i].name === city.name){
                depots[i].trucks.push(putTruckFromStorage(id));
                putTruckOnMap = false;                
                // TODO tuck show goods and go on journey
                Map.setCityChoice([]);
                tinyTrucks.show(CONST_ID_OF_MAP);
                var map = document.getElementById(CONST_ID_OF_MAPS);
                var MapOrW = map.width;
                var MapW = map.width *= 2/3;   
                console.log(map);
                Map.reDraw(MapW);
                var goodslist = document.getElementById(CONST_ID_OF_GOODSMAP);
                //goodslist.style.display = "inline-block";
                goodslist.style.display = "inherit";
                goodslist.style.float = "right";
                console.log(MapW + (MapOrW - MapW ));
                goodslist.style.width = (MapOrW - MapW - 1) + 'px';
                goodslist.style.height = map.clientHeight + 'px';
                console.log(goodslist);
                return;
            }
        }
        // TODO make nice
        alert("You have no depot in this city!");
    }
    function putTruckFromStorage(id){
        for(var i = 0; i < truckStorage.length; i++){
            if (truckStorage[i].id === id){
                putTruckOnMap = false;
                return truckStorage[i];
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
    function fillTable(id, data) {
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
                    tbody.appendChild(newRow);
                }
            } else {
                console.log(MSG_TBODY_NOT_FOUND + " - " + id);
            }
        } else {
            console.log(MSG_TABLE_NOT_FOUND + " - " + id);
        }
    }
    function getPartsAsArray(partNo, itemNo) {
        var item = trucks[partNo];
        var but = '<input class="buyButton" value="buy" type="button" onclick="tinyTrucks.buyPart(\'' + item.type
                + '\', ' + item.id + ', \'' + item.parts[itemNo].type + '\',' + item.parts[itemNo].costs + ', this);"/>';
        return [partNo + "_" + itemNo, item.name + but, item.parts[itemNo].type, item.parts[itemNo].costs];
    }
    function getPartStorageAsArray() {
        var ary = [];
        for (var i = 0; i < partStorage.length; i++) {
            var but = '<input class="sellButton" value="sell" type="button" onclick="tinyTrucks.sellPart(' + partStorage[i].parentId
                    + ', \'' + partStorage[i].parentType + "', '" + partStorage[i].type + "', " + partStorage[i].value + ', this);"/>';
            ary.push([partStorage[i].parentId, partStorage[i].parentType, partStorage[i].type + but, partStorage[i].value]);
        }
        return ary;
    }
    function initGame() {
        money = CONST_MONEY_START;
    }
    function setValuesOnScreen() {
        document.getElementById(CONST_ID_OF_MONEYINPUT).value = money;
    }
    function removeFromPartStorage(parentId, parentType, type) {
        for (var i = 0; i < partStorage.length; i++) {
            if (partStorage[i].parentId === parentId && partStorage[i].parentType === parentType && partStorage[i].type === type) {
                partStorage.splice(i, 1);
                return;
            }
        }
    }
    function getItem(id, type) {
        for (var i = 0; i < trucks.length; i++) {
            if (trucks[i].id === id && trucks[i].type === type) {
                return trucks[i];
            }
        }
    }
    function getTruckListAsArray() {
        var data = [];
        for (var i = 0; i < truckStorage.length; i++) {
            var infoBut = '<input class="infoButton" type="button" value="info" onclick="tinyTrucks.showTruckInfo(' + truckStorage[i].origin.id + ',\'' + truckStorage[i].origin.type + '\')"/>';
            var useBut = '<input class="useButton" type="button" value="use" onclick="tinyTrucks.useTruck( ' + truckStorage[i].id + ')"/>';
            data.push([truckStorage[i].name, truckStorage[i].origin.type + " " + infoBut, truckStorage[i].origin.name + " " + useBut]);
        }
        return data;
    }
    function fillBuildTable() {
        var PartsPerItem = {};
        for (var i = 0; i < partStorage.length; i++) {
            var id = partStorage[i].parentId + "_" + partStorage[i].parentType;
            if (!PartsPerItem[id]) {
                PartsPerItem[id] = {};
                PartsPerItem[id].parts = [partStorage[i]];
                PartsPerItem[id][partStorage[i].type] = 1;
            } else {
                if (!PartsPerItem[id][partStorage[i].type]) {
                    PartsPerItem[id][partStorage[i].type] = 1;
                } else {
                    PartsPerItem[id][partStorage[i].type]++;
                }
                PartsPerItem[id].parts.push(partStorage[i]);
            }
        }
        var buildArray = [];
        for (i in PartsPerItem) {
            var parts = i.split("_");
            var item = getItem(Number(parts[0]), parts[1]);
            var infoBut = '<input class="infoButton" type="button" value="info" onclick="tinyTrucks.showTruckInfo(' + parts[0] + ',\'' + parts[1] + '\')"/>';
            var buildBut = "";
            var buildCheck = true;
            for (var j = 0; j < item.parts.length; j++) {
                if (!PartsPerItem[i][item.parts[j].type]) {
                    buildCheck = false;
                }
            }
            if (buildCheck) {
                buildBut = '<input class="buildButton" type="button" value="build" onclick="tinyTrucks.buildTruck(' + parts[0] + ',\'' + parts[1] + '\')"/>';
            }
            buildArray.push([PartsPerItem[i].parts.length, item.name + infoBut, item.costs + buildBut]);
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
                truckStorage.push({name:"testdruck", id:0, origin: "getItem(0, 'truck')"});
                fillBuildTable();
                fillTable(CONST_ID_OF_SELLPARTS, getPartStorageAsArray());
                fillTable(CONST_ID_OF_TRUCKLIST, getTruckListAsArray());
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
        makeData: function (type, id, data) {
            if (type === 1) {
                fillTable(id, data);
            }
            return tinyTrucks;
        },
        addTruckParts: function (data) {
            trucks = data;
            return tinyTrucks;
        },
        getRandomParts: function (type, amount) {
            var itemCount = trucks.length * 3;
            // TODO
            // check type
            var data = [];
            for (var i = 0; i < amount; i++) {
                var random = Math.floor((Math.random() * itemCount));
                var partNo = Math.floor(random / 3);
                var itemNo = random % 3;
                data.push(getPartsAsArray(partNo, itemNo));
            }
            return data;
        },
        buyPart: function (itemType, itemId, partType, costs, button) {
            // TODO
            //  better alert box
            if (costs > money) {
                alert("Not enough money");
            } else {
                var row = button.parentNode.parentNode;
                row.parentNode.removeChild(row);
                var part = {parentType: itemType, parentId: itemId, type: partType, value: parseInt(costs * 0.8)};
                partStorage.push(part);
                money -= costs;
                var storedParts = getPartStorageAsArray();
                fillTable(CONST_ID_OF_SELLPARTS, storedParts);
            }
            setValuesOnScreen();
            fillBuildTable();
        },
        sellPart: function (parentId, parentType, type, value, button) {
            // TODO 
            // Better question field
            var yes = confirm("really?");
            if (yes === true) {
                removeFromPartStorage(parentId, parentType, type);
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
        buildTruck: function (id, type) {
            // TODO
            var item = getItem(id, type);
            if (item.costs < money) {
                for (var i = 0; i < item.parts.length; i++) {
                    removeFromPartStorage(item.id, item.type, item.parts[i].type);
                }
                var NameCounter = 1;
                for(var i = 0; i < truckStorage.length; i++){
                    if (truckStorage[i].origin.name === item.name){
                        NameCounter++;
                    }
                }
                var obj = {name: item.name + " " + NameCounter, origin: item, id:truckId};
                truckId++;
                truckStorage.push(obj);
                console.log(item);
                money -= item.costs;
                setValuesOnScreen();
                fillBuildTable();
                fillTable(CONST_ID_OF_SELLPARTS, getPartStorageAsArray());
                fillTable(CONST_ID_OF_TRUCKLIST, getTruckListAsArray());
            } else {
                // TODO nice box
                alert("No money");
            }
            console.log(truckStorage);
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
        }
    };
}(window));
