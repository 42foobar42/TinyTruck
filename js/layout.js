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
        makeScrollableTableSize: function (id) {
            // TODO: Maybe there is more than on table
            var scrollTable = document.getElementById(id).getElementsByClassName(scrollTablesClassNames)[0];
            var element = document.getElementById(id);
            if (element) {
                if (scrollTable) {                    
                    var parent = scrollTable.parentNode;
                    var style = window.getComputedStyle(parent, null);
                    var height = Number(style.getPropertyValue("height").replace("px", "")) - Number(style.getPropertyValue("padding-bottom").replace("px", "")) - Number(style.getPropertyValue("padding-top").replace("px", ""));
                    scrollTable.getElementsByClassName("tbody")[0].setAttribute("style", "height:" + height + "px;");
                }
            }
        }
    };
}(window));
