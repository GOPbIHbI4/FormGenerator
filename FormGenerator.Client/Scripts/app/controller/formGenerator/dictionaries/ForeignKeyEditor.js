Ext.define('FormGenerator.controller.formGenerator.dictionaries.ForeignKeyEditor', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.formGenerator.dictionaries.ForeignKeyEditor'
    ],

    init: function () {
        this.control({
            'ForeignKeyEditor': {
                afterrender: this.onAfterrender
            },
            'ForeignKeyEditor button[name=save]': {
                click: this.onSave
            },
            'ForeignKeyEditor button[name=close]': {
                click: this.onClose
            }
        });
    },

    onAfterrender: function (win) {
        var _this = this;
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        _this.win = win;
        tree_dictionaries.getRootNode().removeAll();
        win.body.mask('Загрузка...');
        Ext.Ajax.request({
            url: 'Dictionaries/GetDictionariesTree',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
            },
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var dictionaries = jsonResp.resultData;
                    var rootNode = tree_dictionaries.getRootNode();
                    rootNode.appendChild(dictionaries);
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    onSave: function (button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        if (!selected || !selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите тип словаря!', null, -1);
            return;
        }

        Ext.Ajax.request({
            url: 'Administrator/SaveForeignKey',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                dictionaryID:selected.raw.ID,
                dictionaryFieldIDSource:win.dictionaryFieldIDSource
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    win.fireEvent('foreignKeySaved');
                    win.close();
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    onClose: function (button) {
        button.up('window').close();
    }
});