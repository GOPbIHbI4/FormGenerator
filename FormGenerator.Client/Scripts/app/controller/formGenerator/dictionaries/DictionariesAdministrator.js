Ext.define('FormGenerator.controller.formGenerator.dictionaries.DictionariesAdministrator', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.TextMetrics',
        'FormGenerator.utils.formGenerator.GeneratorModelsFactory'
    ],
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

    onDictionariesSelectionChange: function () {
        var _this = this;
        var win = _this.win;
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var pnl_main = win.down('panel[name=main]');
        var selectedDictionary = tree_dictionaries.getSelectionModel().getSelection()[0];

        if (!selectedDictionary || !selectedDictionary.raw.leaf) {
            return;
        }
        var dictionaryID = selectedDictionary.raw.ID;
        win.body.mask('Загрузка...');
        Ext.Ajax.request({
            url: 'Dictionaries/GetDictionaryFieldsViewModel',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
                dictionaryID: dictionaryID
            },
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var dictionaryFields = jsonResp.resultData;
                    win.body.mask('Загрузка...');
                    pnl_main.remove(grid_dictionary, true);
                    grid_dictionary = _this.buildGridPanel(dictionaryFields, dictionaryID);
                    pnl_main.add(grid_dictionary);
                    pnl_main.doLayout();
                    grid_dictionary.getStore().load({
                        params: {
                            dictionaryID: dictionaryID
                        },
                        callback: function () {
                            win.body.unmask();
                        }
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


    //================================Функции для генерации грида, его колонок и строа=================================
    buildGridPanel: function (dictionaryFields, dictionaryID) {
        var _this = this;
        var win = _this.win;
        var gridModel = _this._getGridColumns(dictionaryFields);
        var gridStore = _this._getGridStore(dictionaryFields, 'Dictionaries/GetDictionaryData');

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        var grid = Ext.create('Ext.grid.Panel', {
            xtype: 'gridpanel',
            name: 'dictionary',
            border: true,
            columnLines: true,
            autoScroll: true,
            columns: gridModel,
            store: gridStore,
            plugins: [rowEditing]
        });

        grid.on('edit', function (editor, row) {
            win.body.mask('Сохранение...');
            Ext.Ajax.request({
                url: 'Dictionaries/SaveDictionaryData',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                jsonData: preparePostParameter({
                    row: row.record.data,
                    dictionaryID:dictionaryID
                }),
                success: function (objServerResponse) {
                    win.body.unmask();
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    if (jsonResp.resultCode == 0) {
                        e.record.commit();
                    } else {
                        FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                    }
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                }
            });
        });

        return grid;
    },
    _getGridColumns: function (dictionaryFields) {
        var _this = this;
        if (!isArray(dictionaryFields)) {
            return null;
        }
        var model = [];
        dictionaryFields.forEach(function (item) {
            model.push(_this._getGridColumnByDictionaryField(item));
        });
        model[model.length - 1].flex = 1;
        return model;
    },
    _getGridModel: function (dictionaryFields) {
        var _this = this;
        if (!isArray(dictionaryFields)) {
            return null;
        }
        var model = [];
        dictionaryFields.forEach(function (item) {
            model.push(_this._getGridModelByDictionaryField(item));
        });
        return model;
    },
    _getGridStore: function (dictionaryFields, actionApi) {
        var _this = this;
        if (!isArray(dictionaryFields)) {
            return null;
        }
        var store = Ext.create('Ext.data.Store', {
            fields: _this._getGridModel(dictionaryFields),
            autoLoad: false,
            proxy: {
                type: 'ajax',
                api: {
                    read: actionApi
                },
                reader: {
                    type: 'json',
                    root: 'resultData',
                    successProperty: 'resultCode'
                }
            }
        });
        return store;
    },
    _getGridModelByDictionaryField: function (field) {
        var _this = this;
        var modelsFactory = FormGenerator.utils.formGenerator.GeneratorModelsFactory;
        var column = {
            type: modelsFactory._getGridModelTypeByValueTypeID(field.domainValueTypeID),
            name: field.columnName,
            dateFormat: field.domainValueTypeID == DomainValueTypes.Date ? 'c' : null
        };
        return column;
    },
    _getGridColumnByDictionaryField: function (field) {
        var _this = this;
        var textMetrics = new Ext.util.TextMetrics();
        var modelsFactory = FormGenerator.utils.formGenerator.GeneratorModelsFactory;
        var column = {
            xtype: modelsFactory._getColumnXtypeByValueTypeID(field.domainValueTypeID),
            minWidth: textMetrics.getWidth(field.name),
            header: field.name,
            dataIndex: field.columnName,
            format: modelsFactory._getColumnFormatByValueTypeID(field.domainValueTypeID),
            editor: field.primaryKey ? null : modelsFactory._getEditorByValueTypeID(field.domainValueTypeID)
        };
        return column;
    },
    //================================Функции для генерации грида, его колонок и строа=================================

    onClose: function (button) {
        button.up('window').close();
    },

    onTest: function () {
        var _this = this;
        var win = _this.win;
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selectedDictionary = tree_dictionaries.getSelectionModel().getSelection()[0];

//        Ext.Ajax.request({
//            url: 'Home/TestPost',
//            method: 'POST',
//            headers: { 'Content-Type': 'application/json' },
//            jsonData: {
//                model: {
//                    requestString: 'test1',
//                    requestID: 2,
//                    requestDate: new Date()
//                }
//            },
//            success: function (objServerResponse) {
//                var jsonResp = Ext.decode(objServerResponse.responseText);
//                if (jsonResp.resultCode == 0) {
//
//
//                } else {
//                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
//                }
//            },
//            failure: function (objServerResponse) {
//                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
//            }
//        });
    }
});