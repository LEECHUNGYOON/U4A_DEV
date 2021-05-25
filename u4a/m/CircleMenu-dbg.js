//Copyright 2017. INFOCG Inc. all rights reserved.
u4a.m.CircleMenuPosition = { LEFT : "Left", CENTER : "Center", RIGHT : "Right" };

sap.ui.define("u4a.m.CircleMenu", [
"sap/ui/core/Control",
"sap/ui/core/Icon",
"sap/m/Label",
"sap/ui/core/Popup"

], function(Control, Icon, Label, Popup){
    "use strict";

    var CircleMenu = Control.extend("u4a.m.CircleMenu", {
        metadata : {
            library : "u4a.m",
            properties : {
                expanded : { type : "boolean", defaultValue : false },
                position : { type : "u4a.m.CircleMenuPosition",  defaultValue : u4a.m.CircleMenuPosition.CENTER }
            },

            defaultAggregation : "items",
            aggregations : {
                "items" : { type : "u4a.m.CircleMenuItem", multiple : true, singularName : "item" },
                "_popup" : { type : "sap.ui.core.Popup", multiple : false, visibility: "hidden" },
            },

            events : {
                itemPress : {}
            }

        }, // end of metadata

        init : function(){

            this.setAggregation("_popup", new Popup());

            // 현재 디바이스 & 브라우저 정보를 구한다.
            this.bIsDeskTop = sap.ui.Device.system.desktop;
            this.sBrowserName = sap.ui.Device.browser.name;
            this.bIsSafari = (this.sBrowserName == sap.ui.Device.browser.BROWSER.SAFARI ? true : false);
            this.bIsIE = (this.sBrowserName == sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER ? true : false);

            // 원형 메뉴 드래그 여부 Flag
            this._bIsCircleDrag = false;

            // 원형 메뉴 드래그 시 마지막 위치
            this._iBeforeRotateX = 0;

            // 원형 메뉴 초기 각도
            this._iInitDegreeStart = 255;

            // 각 메뉴의 각도 gap
            this._iDegreeGap = 36;

        },

        renderer : function(oRm, oCircleMenu){

            var sId = oCircleMenu.getId(),
                oPop = oCircleMenu.getAggregation("_popup"),
                iNextZindex = oPop.getNextZIndex(),
                sIconSrc = (oCircleMenu.getExpanded() == false ? "sap-icon://menu2" : "sap-icon://decline");

                oCircleMenu._oToggleBtnIcon = new Icon({ src: sIconSrc });
				
                //oToggleBtnIcon = new Icon(sId + "-ToggleBtnIcon", { src: sIconSrc });
                oCircleMenu._oToggleBtnIcon.addStyleClass("u4aMCircleMenuToggleBtnIcon");

            oRm.openStart("div", oCircleMenu);
            oRm.class("u4aMCircleMenu");
            oRm.style("z-index", iNextZindex + 1);

            if(!oCircleMenu.getExpanded()){
                oRm.class("u4aMCircleMenuInactive");
            }

            oCircleMenu.removeStyleClass("u4aMCircleMenuLeft");
            oCircleMenu.removeStyleClass("u4aMCircleMenuRight");

            switch(oCircleMenu.getPosition()){
                case u4a.m.CircleMenuPosition.LEFT :
                    oRm.class("u4aMCircleMenuLeft");
                    break;

                case u4a.m.CircleMenuPosition.RIGHT :
                    oRm.class("u4aMCircleMenuRight");
                    break;

            }

            oRm.openEnd();

            oRm.openStart("div", sId + "-ToggleBtn");
            oRm.class("u4aMCircleMenuToggleBtn");
            oRm.style("z-index", iNextZindex + 2);
            oRm.openEnd();

            oRm.openStart("div", sId + "-ToggleBtnIconArea");
            oRm.openEnd();

            oRm.renderControl(oCircleMenu._oToggleBtnIcon);

            oRm.close("div"); // end of ToggleBtnIconArea

            oRm.close("div"); // end of ToggleBtn

            oRm.openStart("div", sId + "-ListItemArea");
            oRm.class("u4aMCircleMenuListItemArea");
            oRm.style("z-index", iNextZindex + 1);

            if(oCircleMenu.getExpanded()){
                oRm.class("u4aMCircleMenuToggleBtnActive");
            }

            oRm.openEnd();

            // Circle
            oRm.openStart("ul", sId + "-Circle");
            oRm.class("u4aMCircleMenuCircle");
            oRm.openEnd();

            // MenuItem Rendering
            oCircleMenu._renderItems(oRm, oCircleMenu);

            oRm.close("ul"); // end of Circle

            oRm.close("div"); // end of ListItemArea

            oRm.close("div"); // end of oCircleMenu

            // CircleMenu Expanded 시 Background에 펼쳐지는 Block
            var sBlockLayerId = sId + "-BlockLayer",
                oBlockLayer = document.getElementById(sBlockLayerId);

            if(oBlockLayer){
                $(oBlockLayer).remove();
            }

            oRm.openStart("div", sId + "-BlockLayer");
            oRm.attr("tabindex", "0");
            oRm.style("zIndex", iNextZindex);
            oRm.class("u4aMCircleMenuBlockLayer");

            if(oCircleMenu.getExpanded()){
                oRm.class("u4aMCircleMenuBlockLayerActive");
            }

            oRm.openEnd();
            oRm.close("div"); // end of BlockLayer

        }, // end of renderer

        onAfterRendering : function(){
            
            // CSS FILE LOAD
            this._getCssLoad();            
            
            var sId = this.getId(),

            oCircleMenu = document.getElementById(sId),
            oCircleArea = document.getElementById(sId + "-Circle"),
            oToggleBtn = document.getElementById(sId + "-ToggleBtn"),
            oListItemArea = document.getElementById(sId + "-ListItemArea"),
            oBlockLayer = document.getElementById(sId + "-BlockLayer");

            /* // DeskTop or mobile에 따른 Event Handle
            * @ notice!!!!!
            * 모바일의 사파리 브라우저에서 Device check 해보면
            * Desktop으로 인식하여 모바일 이벤트를 걸어주기 위해
            * 체크로직 넣어줌
            */
            if(this.bIsDeskTop && this.sBrowserName != sap.ui.Device.browser.BROWSER.SAFARI){
                oCircleMenu.addEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
                oCircleArea.addEventListener("mousedown", this._circleRotateMouseClickStartHandle.bind(this));
                oToggleBtn.addEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
                oListItemArea.addEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
                oBlockLayer.addEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
            }
            else {
                oCircleMenu.addEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));
                oCircleArea.addEventListener("touchstart", this._circleRotateMouseClickStartHandle.bind(this));
                oToggleBtn.addEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));
                oListItemArea.addEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));
                oBlockLayer.addEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));
            }


            // 메뉴 아이템 이벤트 등록
            this.attachMenuItemEvent();

        }, // end of onAfterRendering
        
        _getCssLoad : function(){
            
            // Letter Style이 로드 되었는지 확인한다.
            var sStyleId = 'u4aMCircleMenu_style',
                oStyleDiv = document.getElementById(sStyleId);
            
            if(oStyleDiv){                
                return;
            }

            var sCssUrl = '/zu4a_imp/u4a_lib/v1000/css/m/u4aMCircleMenu.css';
            
            jQuery.ajax({
                url: sCssUrl,
                dataType: "text",
                async: false,
                mimeType : "text/css",
                success: function(cssData){

                    if(cssData == ""){
                        throw new Error('[U4AIDE] Load Fail to CircleMenu css files');
                    }
                  
                    $("<style id='" + sStyleId + "'></style>").appendTo("head").html(cssData);

                },
                error : function(e){
                    throw new Error('[U4AIDE] Load Fail to CircleMenu css files');
                }
            });            
          
        },        

        setPosition: function(sPos){

            this.setProperty("position", sPos, true);

            this.$().removeClass("u4aMCircleMenuLeft");
            this.$().removeClass("u4aMCircleMenuRight");

            switch(sPos){
                case u4a.m.CircleMenuPosition.LEFT :
                    this.addStyleClass("u4aMCircleMenuLeft");
                    break;

                case u4a.m.CircleMenuPosition.RIGHT :
                    this.addStyleClass("u4aMCircleMenuRight");
                    break;

            }

        },

        setExpanded : function(bIsExpanded){

            this.setProperty("expanded", bIsExpanded, true);

            this._setExpanded(bIsExpanded);

        },

        attachMenuItemEvent : function(){

            var aMenuItem = this.getItems(),
                iItemLen = aMenuItem.length;

            if(iItemLen == 0){
                return;
            }

            var that = this;

            // 각 Menu Item에 click Event 적용
            for(var i = 0; i < iItemLen; i++){

                var sId = aMenuItem[i].getId(),
                    oItemDom = document.getElementById(sId);

                if(!oItemDom){
                    continue;
                }

                var fn_itemClick = function(oEvent){

                  // Drag 여부 Flag
                  if(that._bIsCircleDrag){
                      that._bIsCircleDrag = false;
                      return;
                  }

                  var oItem = sap.ui.getCore().byId(this.id);

                     that.fireItemPress({ selectedItem : oItem });

                     that.setExpanded(!that.getExpanded());

                }; // end of oItemDom.onclick

                // 현재 디바이스 & 브라우저별 마우스 or 터치 이벤트 걸기
                if(this.bIsDeskTop && this.sBrowserName != sap.ui.Device.browser.BROWSER.SAFARI){
                    oItemDom.addEventListener("mouseup", fn_itemClick);
                }
                else {
                    oItemDom.addEventListener("touchend", fn_itemClick);
                }

            } // end of for

        }, // end of attachMenuItemEvent

        // 마우스 클릭 이벤트
        _circleRotateMouseClickStartHandle : function(oEvent){

            // 이벤트 전파 방지
            oEvent.preventDefault();
            oEvent.stopPropagation();

            // Drag 여부 Flag
            this._bIsCircleDrag = false;

            // mouseup Event function
            this._circleRotateMouseClickEnd = this._circleRotateMouseClickEndHandle.bind(this);
            this._circleRotateMouseClickMove = this._circleRotateMouseMoveHandle.bind(this);

            // 현재 디바이스 & 브라우저별 마우스 or 터치 이벤트 걸기
            if(this.bIsDeskTop && this.sBrowserName != sap.ui.Device.browser.BROWSER.SAFARI){
                document.addEventListener("mouseup", this._circleRotateMouseClickEnd);
                document.addEventListener("mousemove", this._circleRotateMouseClickMove);

                // 마우스 클릭 위치
                this._clientX = oEvent.clientX;
            }
            else {
                document.addEventListener("touchend", this._circleRotateMouseClickEnd);
                document.addEventListener("touchmove", this._circleRotateMouseClickMove);

                // 모바일 touchEvent용 마우스 클릭 위치
                this._mclientX = oEvent.changedTouches[0].clientX;
            }

        },

        _circleRotateMouseMoveHandle : function(oEvent){

            // 현재 디바이스 & 브라우저 정보를 구한다.
            var bIsDeskTop = this.bIsDeskTop,
                bIsSafari = this.bIsSafari,
                bIsIE = this.bIsIE,

            // 디바이스 & 브라우저 별 현재 & 이전 X 좌표값 구하기
            iBeforeClientX = (bIsDeskTop && !bIsSafari ? this._clientX : this._mclientX),
            iCurrClientX = (bIsDeskTop && !bIsSafari ? oEvent.clientX : oEvent.changedTouches[0].clientX),

            // 이전과 현재의 X 좌표의 차이 값 구하기
            iDeffX = iCurrClientX - iBeforeClientX;

            if(iDeffX == 0){
                return;
            }

            // 이전 X 좌표값 구하기
            var iBeforeDeg = this._iBeforeRotateX,

            // 회전할 각도 계산
            iDeg = (iDeffX + iBeforeDeg) / 3;

            // 메뉴에 회전 각도 적용
            var oCircleArea = document.getElementById(this.getId() + "-Circle"),
                oCss = {
                    transform : "rotate(" + iDeg + "deg)",
                };

            $(oCircleArea).css(oCss);

            // Drag 여부 Flag
            this._bIsCircleDrag = true;

        },

        _circleRotateMouseClickEndHandle : function(oEvent){

            // 현재 디바이스 & 브라우저 정보를 구한다.
            var bIsDeskTop = this.bIsDeskTop,
                sBrowserName = this.sBrowserName,
                bIsSafari = this.bIsSafari,
                bIsIE = this.bIsIE,

            // 디바이스 & 브라우저 별 현재 & 이전 X 좌표값 구하기
            iBeforeClientX = (bIsDeskTop && !bIsSafari ? this._clientX : this._mclientX),
            iCurrClientX = (bIsDeskTop && !bIsSafari ? oEvent.clientX : oEvent.changedTouches[0].clientX),

            // 이전과 현재의 X 좌표의 차이 값 구하기
            iDeffX = iCurrClientX - iBeforeClientX;

            // 차이값을 이전값으로 지정
            this._iBeforeRotateX += iDeffX;

            // 마우스로 클릭한 좌표값의 이전 데이터 초기화
            this._clientX = null;
            this._mclientX = null;

            // 마우스 이벤트 핸들 리스너 삭제
            document.removeEventListener("mouseup", this._circleRotateMouseClickEnd);
            document.removeEventListener("mousemove", this._circleRotateMouseClickMove);
            document.removeEventListener("touchend", this._circleRotateMouseClickEnd);
            document.removeEventListener("touchmove", this._circleRotateMouseClickMove);

            // mousedown, mousemove Event Handle 초기화
            this._circleRotateMouseClickEnd = null;
            this._circleRotateMouseClickMove = null;

            // Drag 여부 Flag
            if(this._bIsCircleDrag){
                this._bIsCircleDrag = false;
                return;
            }

        },

        _renderItems : function(oRm, oCircleMenu){

            var aItems = oCircleMenu.getItems(),
                iItemLength = aItems.length;

            if(iItemLength == 0){
                return;
            }

            var iDeg = this._iInitDegreeStart, // 원형 메뉴 초기 각도
                iDegGap = this._iDegreeGap;    // 각 메뉴의 각도 gap

            for(var i = 0; i < iItemLength; i++){

                // 메뉴 갯수 제한
                if(i == 10){
                    break;
                }

                var oItem = aItems[i],
                    sId = oItem.getId(),
                    sItemCssName = "u4aMCircleMenuItem u4aMCircleMenuItem" + i;

                oRm.openStart("li", sId + "-menuItem" + i);
                oRm.class("u4aMCircleMenuItem");
                oRm.class("u4aMCircleMenuItem" + i);

                if(this.bIsIE){
                    oRm.style("transform","rotate(" + iDeg + "deg) skewY(-55.01deg)");
                }
                else {
                    oRm.style("transform","rotate(" + iDeg + "deg) skewY(-55deg)");
                }

                oRm.openEnd();

                iDeg += iDegGap;

                if(iDeg >= 360){
                    iDeg -= 360;
                }

                oRm.openStart("div", sId + "-placeholder" + i);
                oRm.class("u4aMCircleMenuItemPlaceHolder");
                oRm.openEnd();

                oRm.openStart("div", sId + "-upside" + i);
                oRm.class("u4aMCircleMenuItemUpside");
                oRm.openEnd();

                // Menu Item Link
                oRm.openStart("a", oItem);
                //oRm.openStart("a", sId + "-link" + i);
                oRm.class("u4aMCircleMenuItemLink");
                oRm.openEnd();

                oRm.renderControl(
                    new Icon({ size: "30px", src: oItem.getIcon() }).addStyleClass("u4aMCircleMenuItemIcon")
                );

                oRm.renderControl(
                    new Label({
                        design : "Bold", wrapping: true, width : "70px", textAlign: "Center", text : oItem.getDescription()
                    }).addStyleClass("u4aMCircleMenuItemLabel")
                );

                oRm.close("a"); // end of ItemLink

                oRm.close("div"); // end of upside

                oRm.close("div"); // end of placeholder

                oRm.close("li"); // end of item

            }

        },

        _setExpanded : function(bIsExpanded){

            var sId = this.getId(),
                oPop = this.getAggregation("_popup"),
                iNextZindex = oPop.getNextZIndex(),

                sToggleBtn = sId + "-ToggleBtn",
                sToggleBtnIconUrl = "",
                sToggleBtnIconId = sId + "-ToggleBtnIcon",
                sListItemId = sId + "-ListItemArea",
                sBlockLayerId = sId + "-BlockLayer",

                oToggleBtn = document.getElementById(sToggleBtn),
                oToggleBtnIcon = this._oToggleBtnIcon,
                //oToggleBtnIcon = sap.ui.getCore().byId(sToggleBtnIconId),
                oListItemArea = document.getElementById(sListItemId),
                oBlockLayer = document.getElementById(sBlockLayerId);

            if(!oToggleBtnIcon && !oListItemArea && !oBlockLayer){
                return;
            }

            $(oListItemArea).removeClass("u4aMCircleMenuToggleBtnActive");
            $(oBlockLayer).removeClass("u4aMCircleMenuBlockLayerActive");

            // 키보드 이벤트 (TAB) 키 방지 해제
            document.removeEventListener("keydown", this._KeydownEventHandle);

            if(bIsExpanded){

                // 키보드 이벤트 (TAB) 키 방지 적용
                document.addEventListener("keydown", this._KeydownEventHandle);

                // 메뉴 햄버거 아이콘 변경
                sToggleBtnIconUrl = "sap-icon://decline";

                // 메뉴를 펼치고 막을 씌운다
                this.$().removeClass("u4aMCircleMenuInactive");
                $(oListItemArea).addClass("u4aMCircleMenuToggleBtnActive");
                $(oBlockLayer).addClass("u4aMCircleMenuBlockLayerActive");

                // Zindex 적용
                this.$().css("zIndex", iNextZindex + 1);
                $(oToggleBtn).css("zIndex", iNextZindex + 2);
                $(oListItemArea).css("zIndex", iNextZindex + 1);
                $(oBlockLayer).css("zIndex", iNextZindex);

            }
            else {
                this.$().addClass("u4aMCircleMenuInactive");
                sToggleBtnIconUrl = "sap-icon://menu2";
            }

            oToggleBtnIcon.setSrc(sToggleBtnIconUrl);

        },

        _ToggleBtnClickHandle : function(oEvent){

            // 커서 포커스 해제
            document.activeElement.blur();

            // 이벤트 전파 방지
            oEvent.preventDefault();
            oEvent.stopPropagation();

            // 현재 클릭한 위치를 구한다
            var $oTarget = jQuery(oEvent.target),

            $oCircleMenu = $oTarget.closest(".u4aMCircleMenu"),
            $oListItemArea = $oTarget.closest(".u4aMCircleMenuListItemArea"),
            $oToggleBtn = $oTarget.closest(".u4aMCircleMenuToggleBtn"),
            $oPlaceHolder = $oTarget.closest(".u4aMCircleMenuItemPlaceHolder"),
            $oBlockLayer = $oTarget.closest(".u4aMCircleMenuBlockLayerActive");

            // Toggle 버튼이 아니면 메뉴 활성/비활성 막기
            if(!$oToggleBtn.length && !$oBlockLayer.length && !$oCircleMenu.length){
                return;
            }

            if($oCircleMenu.length != 1 && $oToggleBtn.length != 1 && $oBlockLayer.length != 1){
                return;
            }

            this.setExpanded(!this.getExpanded());

        }, // end of _ToggleBtnClickHandle

        _KeydownEventHandle : function(oEvent){

            if(event.keyCode == 9){
				// 커서 포커스 해제
				document.activeElement.blur();
                event.preventDefault();
                event.stopPropagation();
                return false;
            }

        },

        exit : function(){

            var oPop = this.getAggregation("_popup");
            if(oPop){
                oPop.destroy();
            }

            this.bIsDeskTop = null;
            delete this.bIsDeskTop;

            this.sBrowserName = null;
            delete this.sBrowserName;

            this.bIsSafari = null;
            delete this.bIsSafari;

            this.bIsIE = null;
            delete this.bIsIE;

            this._bIsCircleDrag = null;
            delete this._bIsCircleDrag;

            this._iBeforeRotateX = null;
            delete this._iBeforeRotateX;

            this._iInitDegreeStart = null;
            delete this._iInitDegreeStart;

            this._iDegreeGap = null;
            delete this._iDegreeGap;

            var sId = this.getId(),
                oCircleMenu = document.getElementById(sId),
                oCircleArea = document.getElementById(sId + "-Circle"),
                oToggleBtn = document.getElementById(sId + "-ToggleBtn"),
                oListItemArea = document.getElementById(sId + "-ListItemArea"),
                oBlockLayer = document.getElementById(sId + "-BlockLayer");

            oCircleMenu.removeEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
            oCircleArea.removeEventListener("mousedown", this._circleRotateMouseClickStartHandle.bind(this));
            oToggleBtn.removeEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
            oListItemArea.removeEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
            oBlockLayer.removeEventListener("mousedown", this._ToggleBtnClickHandle.bind(this));
            oCircleMenu.removeEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));
            oCircleArea.removeEventListener("touchstart", this._circleRotateMouseClickStartHandle.bind(this));
            oToggleBtn.removeEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));
            oListItemArea.removeEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));
            oBlockLayer.removeEventListener("touchstart", this._ToggleBtnClickHandle.bind(this));

        } /* end of exit */

    });

    return CircleMenu;

});