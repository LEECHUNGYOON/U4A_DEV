//Copyright 2017. INFOCG Inc. all rights reserved.

sap.ui.define("u4a.m.RichEditorTinyMCE", [
"sap/ui/richtexteditor/RichTextEditor",
"sap/ui/richtexteditor/RichTextEditorRenderer"

    "use strict";

    var EditorStatus = {
          Initial: "Initial",
          Loading: "Loading",
          Initializing: "Initializing",
          Loaded: "Loaded",
          Ready: "Ready",
          Destroyed: "Destroyed"
    };

    var RichEditor = RichTextEditor.extend("u4a.m.RichEditorTinyMCE", {
        metadata : {
            library : "u4a.m"

        }, /* end of metadata */

        renderer : function(oRm, oControl){

            RichTextEditorRenderer.render(oRm, oControl);

        }, /* end of renderer */

        setValueTinyMCE : function(sValue) {

            switch (this._tinyMCEStatus) {
                case EditorStatus.Initial:
                case EditorStatus.Initializing:
                case EditorStatus.Loading:
                case EditorStatus.Loaded:
                /* Ignored - value will be set when TinyMCE is ready */
                break;

            case EditorStatus.Ready:
                this._oEditor.setContent(sValue);
                /* Reset the undo manager */
                this._oEditor.undoManager.clear();
                this._oEditor.undoManager.add();

                /* if running in readonly mode, update link targets to _blank */
                if (!this.getEditable()) {
                    jQuery.each(this._oEditor.getDoc().getElementsByTagName("a"), function(i, oAnchor) {
                        oAnchor.target = "_blank";
                    });
                }

                break;

            default:
               Log.error("Unknown TinyMCE status: " + this._tinyMCEStatus);
               break;
            }

        } /* end of setValueTinyMCE */        

    });

    return RichEditor;

});