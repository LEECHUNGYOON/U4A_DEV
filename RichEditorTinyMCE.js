﻿sap.ui.define("u4a.m.RichEditorTinyMCE",["sap/ui/richtexteditor/RichTextEditor","sap/ui/richtexteditor/RichTextEditorRenderer"],function(t,i){"use strict";var e="Initial",a="Loading",n="Initializing",r="Loaded",o="Ready";return t.extend("u4a.m.RichEditorTinyMCE",{metadata:{library:"u4a.m"},renderer:function(t,e){i.render(t,e)},setValueTinyMCE:function(t){switch(this._tinyMCEStatus){case e:case n:case a:case r:break;case o:this._oEditor.setContent(t),this._oEditor.undoManager.clear(),this._oEditor.undoManager.add(),this.getEditable()||jQuery.each(this._oEditor.getDoc().getElementsByTagName("a"),function(t,e){e.target="_blank"});break;default:Log.error("Unknown TinyMCE status: "+this._tinyMCEStatus)}}})});