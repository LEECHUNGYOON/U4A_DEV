sap.ui.define("u4a.charts.am.AmPieChart",["sap/ui/core/Control"],function(t){"use strict";return t.extend("u4a.charts.am.AmPieChart",{metadata:{library:"u4a.charts.am",properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",defaultValue:"320px"},title:{type:"string",defaultValue:""},visible:{type:"boolean",defaultValue:!0},styleClass:{type:"string",defaultValue:""},showLegend:{type:"boolean",defaultValue:!0},innerRadius:{type:"int",defaultValue:null},labelRadius:{type:"int",defaultValue:null},outlineAlpha:{type:"float",defaultValue:null},outlineColor:{type:"sap.ui.core.CSSColor",defaultValue:null},outlineThickness:{type:"int",defaultValue:null},startDuration:{type:"float",defaultValue:null},legendPosition:{type:"string",defaultValue:"bottom"},legendAlign:{type:"string",defaultValue:"center"},LegendFontSize:{type:"int",defaultValue:11},fontSize:{type:"int",defaultValue:11},radius:{type:"string",defaultValue:null},marginTop:{type:"int",defaultValue:10},marginLeft:{type:"int",defaultValue:null},marginRight:{type:"int",defaultValue:null},marginBottom:{type:"int",defaultValue:10},autoMargins:{type:"boolean",defaultValue:!0},showRadiusText:{type:"boolean",defaultValue:!0},angle:{type:"int",defaultValue:null},depth3D:{type:"int",defaultValue:null},backgroundAlpha:{type:"float",defaultValue:0},backgroundColor:{type:"sap.ui.core.CSSColor",defaultValue:"#FFFFFF"},borderAlpha:{type:"float",defaultValue:0},borderColor:{type:"sap.ui.core.CSSColor",defaultValue:"#000000"},textColor:{type:"sap.ui.core.CSSColor",defaultValue:"#000000"},legendTextColor:{type:"sap.ui.core.CSSColor",defaultValue:"#000000"},showLegendValueText:{type:"boolean",defaultValue:!0},legendMarkerSize:{type:"int",defaultValue:16},legendValueWidth:{type:"int",defaultValue:50},legendVerticalGap:{type:"int",defaultValue:10},legendHorizontalGap:{type:"int",defaultValue:0}},events:{init:{allowPreventDefault:!0},clickSlice:{allowPreventDefault:!0},pullInSlice:{allowPreventDefault:!0},pullOutSlice:{allowPreventDefault:!0},rollOverSlice:{allowPreventDefault:!0}}},init:function(){try{void 0===AmCharts.AmPieChart&&jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/pie.js",function(){})}catch(t){jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/amcharts.js",function(){}),jQuery.u4aJSloadAsync("/zu4a_imp/tools/amchart/v343/amcharts/pie.js",function(){})}this._c=new AmCharts.AmPieChart,this._setChartEvent()},renderer:function(t,e){t.write("<div"),t.writeControlData(e),t.addStyle("width",e.getWidth()),t.addStyle("height",e.getHeight()),t.writeStyles(),t.write(">"),t.write("</div>")},onBeforeRendering:function(){},onAfterRendering:function(){this._createChart()},exit:function(){},_setChart:function(){this._c.creditsPosition="top-right",this._setTitle(this.getTitle()),this.getVisible()||(document.getElementById(this.getId()).hidden=!0),this._setStyleClass(this.getStyleClass()),this._setLegend(this.getShowLegend()),this._c.innerRadius=this.getInnerRadius(),void 0!==this._c.innerRadius&&null!==this._c.innerRadius&&""!==this._c.innerRadius||(this._c.innerRadius=0),this._c.labelRadius=this.getLabelRadius(),this._c.outlineAlpha=this.getOutlineAlpha(),this._c.outlineColor=this.getOutlineColor(),this._c.outlineThickness=this.getOutlineThickness(),this._c.fontSize=this.getFontSize(),this._c.marginTop=this.getMarginTop(),this._c.marginBottom=this.getMarginBottom(),this._c.marginLeft=this.getMarginLeft(),this._c.marginRight=this.getMarginRight(),this._c.autoMargins=this.getAutoMargins(),!(this._c.labelText="[[title]]: [[percents]]%")===this.getShowRadiusText()&&(this._c.labelText=""),this._c.radius=this.getRadius(),this._c.angle=this.getAngle(),this._c.depth3D=this.getDepth3D(),this._c.backgroundAlpha=this.getBackgroundAlpha(),this._c.backgroundColor=this.getBackgroundColor(),this._c.borderAlpha=this.getBorderAlpha(),this._c.borderColor=this.getBorderColor(),this._c.color=this.getTextColor(),this._c.validateData(),this._c.validateNow()},_createChart:function(){if(2===this._c.events.init.length)return this._c.write(this.getId()),this._c.validateData(),void this._c.validateNow();this._c.addListener("init",function(){this._setChart()}.bind(this)),this._c.write(this.getId())},_setChartEvent:function(){var e;this._c&&((e=this)._c.addListener("init",function(t){e.fireInit(t)}),this._c.addListener("clickSlice",function(t){e.fireClickSlice(t)}),this._c.addListener("pullInSlice",function(t){e.firePullInSlice(t)}),this._c.addListener("pullOutSlice",function(t){e.firePullOutSlice(t)}),this._c.addListener("rightClickGraphItem",function(t){e.fireRightClickGraphItem(t)}),this._c.addListener("rollOverSlice",function(t){e.fireRollOverSlice(t)}))},_setLegend:function(t,e){var i;this._c&&(this._c.removeLegend(),(i=new AmCharts.AmLegend).enabled=t,i.align=this.getLegendAlign(),i.position=this.getLegendPosition(),""===i.position&&(i.position="bottom"),i.fontSize=this.getLegendFontSize(),i.color=this.getLegendTextColor(),!(i.valueText="")===this.getShowLegendValueText()&&(i.valueText="[[value]]"),i.valueWidth=this.getLegendValueWidth(),i.verticalGap=this.getLegendVerticalGap(),i.horizontalGap=this.getLegendHorizontalGap(),i.markerSize=this.getLegendMarkerSize(),this._c.addLegend(i),e&&(this._c.validateData(),this._c.validateNow()))},_setChartProp:function(t,e){this._c&&(this._c[t]=e,this._c.validateNow())},_setStyleClass:function(t){if(!this.aCustomStyleClasses)return null==t?void 0:void this.addStyleClass(t);for(var e=this.aCustomStyleClasses.length,i=0;i<e;i++)this.removeStyleClass(this.aCustomStyleClasses[0]);null!=t&&this.addStyleClass(t)},_setTitle:function(t,e){this._c&&(this._c.titles=[],null!=t&&""!==t&&this._c.addTitle(t,20),e&&this._c.validateNow())},setWidth:function(t){this.setProperty("width",t,!0),this._c&&this._c.div&&this._c.div.style&&(this._c.div.style.width=t,this._c.validateNow())},setHeight:function(t){this.setProperty("height",t,!0),this._c&&this._c.div&&this._c.div.style&&(this._c.div.style.height=t,this._c.validateNow())},setStyleClass:function(t){this.setProperty("styleClass",t,!0),this._setStyleClass(t)},setTitle:function(t){this.setProperty("title",t,!0),this._setTitle(t,!0)},setVisible:function(t){this.setProperty("visible",t,!0),this._c&&this._c.div&&(t=!t,this._c.div.hidden=t,this._c.validateNow())},setShowLegend:function(t){this.setProperty("showLegend",t,!0),this._setLegend(t,!0)},setInnerRadius:function(t){this.setProperty("innerRadius",t,!0),this._c&&(null!=(this._c.innerRadius=t)&&""!==t||(this._c.innerRadius=0),this._c.validateNow())},setLabelRadius:function(t){this.setProperty("labelRadius",t,!0),this._setChartProp("labelRadius",t)},setOutlineAlpha:function(t){this.setProperty("outlineAlpha",t,!0),this._setChartProp("outlineAlpha",t)},setOutlineColor:function(t){this.setProperty("outlineColor",t,!0),this._setChartProp("outlineColor",t)},setOutlineThickness:function(t){this.setProperty("outlineThickness",t,!0),this._setChartProp("outlineThickness",t)},setStartDuration:function(t){this.setProperty("startDuration",t,!0),this._setChartProp("startDuration",t)},setLegendPosition:function(t){this.setProperty("legendPosition",t,!0),this._c&&this._c.legend&&(this._c.legend.position=t,""===this._c.legend.position&&(this._c.legend.position="bottom"),this._c.validateNow())},setLegendAlign:function(t){this.setProperty("legendAlign",t,!0),this._c&&this._c.legend&&(this._c.legend.align=t,this._c.validateNow())},setLegendFontSize:function(t){this.setProperty("LegendFontSize",t,!0),this._c&&this._c.legend&&(this._c.legend.fontSize=t,this._c.validateNow())},setFontSize:function(t){this.setProperty("fontSize",t,!0),this._setChartProp("fontSize",t)},setRadius:function(t){this.setProperty("radius",t,!0),this._setChartProp("radius",t)},setMarginTop:function(t){this.setProperty("marginTop",t,!0),this._setChartProp("marginTop",t)},setMarginBottom:function(t){this.setProperty("marginBottom",t,!0),this._setChartProp("marginBottom",t)},setMarginLeft:function(t){this.setProperty("marginLeft",t,!0),this._setChartProp("marginLeft",t)},setMarginRight:function(t){this.setProperty("marginRight",t,!0),this._setChartProp("marginRight",t)},setAutoMargins:function(t){this.setProperty("autoMargins",t,!0),this._setChartProp("autoMargins",t)},setShowRadiusText:function(t){this.setProperty("showRadiusText",t,!0),this._c&&(t=!1===t?"":"[[title]]: [[percents]]%",this._c.labelText=t,this._c.validateNow())},setAngle:function(t){this.setProperty("angle",t,!0),this._setChartProp("angle",t)},setDepth3D:function(t){this.setProperty("depth3D",t,!0),this._setChartProp("depth3D",t)},setBackgroundAlpha:function(t){this.setProperty("backgroundAlpha",t,!0),this._setChartProp("backgroundAlpha",t)},setBackgroundColor:function(t){this.setProperty("backgroundColor",t,!0),this._setChartProp("backgroundColor",t)},setBorderAlpha:function(t){this.setProperty("borderAlpha",t,!0),this._setChartProp("borderAlpha",t)},setBorderColor:function(t){this.setProperty("borderColor",t,!0),this._setChartProp("borderColor",t)},setTextColor:function(t){this.setProperty("textColor",t,!0),this._setChartProp("color",t)},setLegendTextColor:function(t){this.setProperty("legendTextColor",t,!0),this._c&&this._c.legend&&(this._c.legend.color=t,this._c.validateNow())},setShowLegendValueText:function(t){this.setProperty("showLegendValueText",t,!0),this._c&&this._c.legend&&(!(this._c.legend.valueText="")===t&&(this._c.legend.valueText="[[value]]"),this._c.validateNow())},setLegendMarkerSize:function(t){this.setProperty("legendMarkerSize",t,!0),this._c&&this._c.legend&&(this._c.legend.markerSize=t,this._c.validateNow())},setLegendValueWidth:function(t){this.setProperty("legendValueWidth",t,!0),this._c&&this._c.legend&&(this._c.legend.valueWidth=t,this._c.validateNow())},setLegendVerticalGap:function(t){this.setProperty("legendVerticalGap",t,!0),this._c&&this._c.legend&&(this._c.legend.verticalGap=t,this._c.validateNow())},setLegendHorizontalGap:function(t){this.setProperty("legendHorizontalGap",t,!0),this._c&&this._c.legend&&(this._c.legend.horizontalGap=t,this._c.validateNow())}})});