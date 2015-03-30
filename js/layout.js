var Layout = (function (win) {
    var menuDiv, closeButtons, views, scrollTablesClassNames, subViewsCloseButton;
    var CONST_PERCENT_OF_MENU_BUTTONS_SIZE = 0.9, CONST_PERCENT_OF_CLOSE_BUTTONS_SIZE = 0.1;
    var CONST_MIN_SIZE_CLOSEBUTTON = 20;
    function makeIconMenuSize() {
        var size = 0;
        var wrapper = menuDiv.getElementsByClassName("menuButtonWrap");
        if (wrapper[0].offsetWidth > wrapper[0].offsetHeight) {
            size = wrapper[0].offsetHeight;
        } else {
            size = wrapper[0].offsetWidth;
        }
        size *= CONST_PERCENT_OF_MENU_BUTTONS_SIZE;
        for (var i = 0; i < wrapper.length; i++) {
            var but = wrapper[i].getElementsByClassName("menuButton")[0];
            but.setAttribute("style", "width:" + size + "px;height:" + size + "px;margin-left:-" + (size / 2) + "px;margin-top:-" + (size / 2) + "px");
        }
    }
    function makeCloseButtonSize() {
        var offSetWidth = 0, offSetHeight = 0;
        for (var i = 0; i < views.length; i++) {
            if (views[i].offsetWidth > 0) {
                offSetWidth = views[i].offsetWidth;
                offSetHeight = views[i].offsetHeight;
                break;
            }
        }
        var winSize = offSetWidth;
        if (winSize > offSetHeight) {
            winSize = offSetHeight;
        }
        var size = winSize * CONST_PERCENT_OF_CLOSE_BUTTONS_SIZE;
        if (size < CONST_MIN_SIZE_CLOSEBUTTON) {
            size = CONST_MIN_SIZE_CLOSEBUTTON;
        }
        for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].setAttribute("style", "width:" + size + "px;height:" + size + "px;left:" + (offSetWidth - size - (size / 2)) + "px;top:" + (size / 2) + "px");
        }
        for (var i = 0; i < subViewsCloseButton.length; i++) {
            subViewsCloseButton[i].setAttribute("style", "width:" + size + "px;height:" + size + "px;left:" + (offSetWidth - size - (size / 2)) + "px;top:" + (size / 2) + "px");
        }
    }/*
     function makeScrollableTableSize() {
     for (var i = 0; i < scrollTables.length; i++) {
     var parent = scrollTables[i].parentNode;
     console.log(parent);
     console.log(parent.style.height);
     }
     }*/
    function makeSizes() {
        makeIconMenuSize();
        makeCloseButtonSize();
        for (var i = 0; i < views.length; i++) {
            var id = views[i].id.replace("menuButton", "");
            Layout.makeScrollableTableSize(id);
        }
    }
    return{
        init: function (menu, closeBut, viewName, scrollTabs, subViewCloseBut) {
            menuDiv = document.getElementById(menu);
            closeButtons = document.getElementsByClassName(closeBut);
            views = document.getElementsByClassName(viewName);
            scrollTablesClassNames = scrollTabs;
            subViewsCloseButton = document.getElementsByClassName(subViewCloseBut);
            makeSizes();
            return Layout;
        },
        relayout: function () {
            makeSizes();
            return Layout;
        },
        makeScrollableTableSize: function (id, NoOfTables) {
            // TODO: Maybe there is more than on table
            var scrollTables = document.getElementById(id).getElementsByClassName(scrollTablesClassNames);
            //console.log(scrollTable);
            //var element = document.getElementById(id);
            for(var i = 0; i < scrollTables.length; i++){
                var scrollTable = scrollTables[i];
                //console.log(scrollTable);
                if (scrollTable) {
                    // TODO this does not work
                    var parent = scrollTable.parentNode;
                    while (parent.clientHeight === 0){
                        parent = parent.parentNode;
                    }
                    var style = window.getComputedStyle(parent, null);
                    /*console.log(parent);
                    console.log(parent.clientHeight);
                    console.log(parent.offsetHeight);
                    console.log(style.getPropertyValue("height"));*/
                    var height = parent.offsetHeight;
                    if(NoOfTables){
                        height /= NoOfTables;
                    }
                    //var height = Number(style.getPropertyValue("height").replace("px", "")) - Number(style.getPropertyValue("padding-bottom").replace("px", "")) - Number(style.getPropertyValue("padding-top").replace("px", ""));
                    //console.log(height);
                    scrollTable.getElementsByClassName("tbody")[0].setAttribute("style", "height:" + height/2 + "px;");
                }
            }
        },
        makeDepotTable: function (viewid, tableid){
            var table = document.getElementById(tableid);
            var content = document.getElementById(viewid).getElementsByClassName('content')[0];            
            var header = content.getElementsByClassName('tableHead')[0];            
            table.parentNode.parentNode.setAttribute("style", "height:" + content.clientHeight + "px;");
            table.parentNode.setAttribute("style", "height:" + (content.clientHeight -19 )+ "px;");            
        },
        makeMapGoodChoice: function (viewId, backButtonClass, sendButtonId, removeButtonId, GoodsListId, statusId){
            var view = document.getElementById(viewId);
            var status = document.getElementById(statusId);
            var backButton = view.getElementsByClassName(backButtonClass)[0];
            var sendButton = document.getElementById(sendButtonId);
            var removeButton = document.getElementById(removeButtonId);
            var goodsList = document.getElementById(GoodsListId);
            var spacer = backButton.style.top.replace("px",'');
            var butHeight = backButton.style.height;
            var butWidth = backButton.style.width;
            var width = parseInt(backButton.style.left.replace("px",''))-parseInt(goodsList.style.width.replace("px",''));
            backButton.style.left = width + "px";
            sendButton.style.left = width + "px";
            sendButton.style.top = (2*spacer + parseInt(backButton.style.height.replace("px",''))) + "px";
            sendButton.style.width = butWidth;
            sendButton.style.height = butHeight;
            removeButton.style.width = butWidth;
            removeButton.style.height = butHeight;
            removeButton.style.top = (3*spacer + 2*parseInt(backButton.style.height.replace("px",''))) + "px";
            removeButton.style.left = width + "px";
            // TODO height for status must be specified
            console.log(view.getElementsByTagName('canvas')[0].height);
            console.log(status);
            status.style.top = view.getElementsByTagName('canvas')[0].height - 20 + 'px';
            status.style.width = view.getElementsByTagName('canvas')[0].width * 0.8 + 'px';
            status.style.left = view.getElementsByTagName('canvas')[0].width * 0.1 + 'px';
            goodsList.getElementsByClassName('tbody')[0].style.height = view.getElementsByTagName('canvas')[0].height + 'px';
        }
    };
}(window));

