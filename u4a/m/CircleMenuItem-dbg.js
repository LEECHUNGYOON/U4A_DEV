//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.CircleMenuItem", [
"sap/ui/core/Element"

], function(Element){
    "use strict";

    var CircleMenuItem = Element.extend("u4a.m.CircleMenuItem", {
        metadata : {
            library : "u4a.m",
            properties : {
                icon : {type : "sap.ui.core.URI", defaultValue : null},
                description : { type : "string", defaultValue : null },
            },


        } // end of metadata

    });

    return CircleMenuItem;

});