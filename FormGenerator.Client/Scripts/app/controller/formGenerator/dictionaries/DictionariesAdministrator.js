Ext.define('FormGenerator.controller.formGenerator.dictionaries.DictionariesAdministrator', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.formGenerator.dictionaries.DictionariesAdministrator'
    ],

    init: function () {
        this.control({
            'DictionariesAdministrator button[name=close]': {
                click: this.onClose
            },
            'DictionariesAdministrator': {
                afterrender: this.onAfterrender
            },
            'DictionariesAdministrator treepanel[name=dictionaries]': {
                selectionchange: this.onDictionariesSelectionChange
            },
            'DictionariesAdministrator button[name=test]': {
                click: this.onTest
            }
        });
    },

    win: null,

    onAfterrender: function (win) {
        var _this = this;
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        _this.win = win;

        win.body.mask('Загрузка...');
        Ext.Ajax.request({
            url: 'Dictionaries/GetAllDictionaries',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
            },
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var rootNode = tree_dictionaries.getRootNode();
                    var dictionaries = jsonResp.resultData;
                    dictionaries.forEach(function (item) {
                        rootNode.appendChild({
                            text: item.name,
                            leaf: true,
                            dictionaryModel: item
                        });
                    });
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

    onDictionariesSelectionChange: function () {
        var _this = this;
        var win = _this.win;
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selectedDictionary = tree_dictionaries.getSelectionModel().getSelection()[0];

        if (!selectedDictionary) {
            return;
        }
        var dictionaryID = selectedDictionary.raw.dictionaryModel.ID;
        win.body.mask('Загрузка...');
        Ext.Ajax.request({
            url: 'Dictionaries/GetDictionaryFieldsByDictionaryID',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
                dictionaryID: dictionaryID
            },
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var gridModel = [];
                    var dictionaryFields = jsonResp.resultData;
                    dictionaryFields.forEach(function (item) {
                        gridModel.push({
                            header: item.name,
                            dataIndex: item.relationFieldName,
                            name: item.relationFieldName,
                            dictionaryFieldModel: item
                        });
                    });

                    grid_dictionary.reconfigure(null, gridModel);
                    grid_dictionary.getView().refresh();
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                FormGenerator.utils.MessageBox.show(objServerResponse.response.responseText, null, jsonResp.resultCode);
            }
        });
    },

    onTest:function() {
        Ext.Ajax.request({
            url: 'Home/TestPost',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: {
                model: {
                    requestString:'test1',
                    requestID:2,
                    requestDate:new Date()
                }
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {


                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    onClose: function (button) {
        button.up('window').close();
    },

    onTest1: function (button) {
        Ext.Ajax.request({
            url: 'Home/Test',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, 1);
            },
            failure: function (objServerResponse) {
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    }
});