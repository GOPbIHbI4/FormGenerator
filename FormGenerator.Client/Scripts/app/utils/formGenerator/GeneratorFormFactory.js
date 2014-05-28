Ext.define('FormGenerator.utils.formGenerator.GeneratorFormFactory', {
    singleton: true,

    createWindow: function (formID) {
        var _this = this;
        Ext.Ajax.request({
            url: 'Forms/BuildForm',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
                formID: formID
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var window = jsonResp.resultData;
                    window = _this._parseBuildFormResult(window);
                    window.show();
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    _parseBuildFormResult: function (window) {
        var _this = this;
        var WindowObject = _this._buildControl(window.window);
        var win = Ext.create('Ext.window.Window', WindowObject);
        return win;
    },

    _buildControl:function(control){
        var _this = this;
        var result = {};
        result.CONTROL_ID = control.ID;
        result.items = [];

        control.properties.forEach(function(property){
            result[property.name] = DomainValueTypes.getFromString(property.value.value, property.domainValueTypeID);
        });

        control.children.forEach(function(child){
            result.items.push(_this._buildControl(child));
        });

        return result;
    },

    _parseProperty: function (property) {
        var _this = this;
        var result = {};
        result[property.name] = DomainValueTypes.getFromString(property.value.value, property.domainValueTypeID);
        return result;
    }
});