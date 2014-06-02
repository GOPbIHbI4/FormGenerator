Ext.define('FormGenerator.controller.formGenerator.dictionaries.DictionariesAdministrator', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.TextMetrics',
        'FormGenerator.utils.formGenerator.GeneratorModelsFactory',
        'FormGenerator.utils.formGenerator.dictionaries.DictionariesDynamicGrid'
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
            'DictionariesAdministrator button[name=delete]': {
                click: this.onDelete
            },
            'DictionariesAdministrator button[name=add]': {
                click: this.onAdd
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
        var btn_delte = win.down('button[name=delete]');
        var btn_add = win.down('button[name=add]');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var pnl_main = win.down('panel[name=main]');
        var selectedDictionary = tree_dictionaries.getSelectionModel().getSelection()[0];

        if (!selectedDictionary || !selectedDictionary.raw.leaf) {
            btn_delte.disable();
            btn_add.disable();
            return;
        } else {
            btn_delte.enable();
            btn_add.enable();
        }
        var dictionaryID = selectedDictionary.raw.ID;

        win.body.mask('Загрузка...');
        pnl_main.remove(grid_dictionary, true);
        grid_dictionary = FormGenerator.utils.formGenerator.dictionaries.DictionariesDynamicGrid.getGridPanel(win, dictionaryID, true);
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
    },

    onDelete:function(button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selectedDictionary = tree_dictionaries.getSelectionModel().getSelection()[0];
        var dictionaryID = selectedDictionary.raw.ID;
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var row = grid_dictionary.getSelectionModel().getSelection()[0];

        if (!row) {
            FormGenerator.utils.MessageBox.show('Выберите удаляемую строку!', null, 1);
            return;
        }
        var dataToSave = {};

        grid_dictionary.columns.forEach(function(column) {
            dataToSave[column.dictionaryFieldID] = row.data[column.dataIndex];
        });
        Ext.Ajax.request({
            url: 'Dictionaries/DeleteDictionaryData',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                row: dataToSave,
                dictionaryID: dictionaryID
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    grid_dictionary.getStore().remove(row);
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

    onAdd:function(button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selectedDictionary = tree_dictionaries.getSelectionModel().getSelection()[0];
        var dictionaryID = selectedDictionary.raw.ID;
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var rowEditing = grid_dictionary.getPlugin('rowEditing');

        var newRow = {};
//        grid_dictionary.columns.forEach(function(item) {
//            newRow[item.dataIndex] = null;
//        });

        rowEditing.cancelEdit();
        grid_dictionary.getStore().insert(0, newRow);
        rowEditing.startEdit(0, 0);
    },

    onClose: function (button) {
        button.up('window').close();
    }
});