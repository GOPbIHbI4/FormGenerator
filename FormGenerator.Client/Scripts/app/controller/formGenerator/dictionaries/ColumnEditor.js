Ext.define('FormGenerator.controller.formGenerator.dictionaries.ColumnEditor', {
    extend: 'Ext.app.Controller',

    models: [
        'FormGenerator.model.formGenerator.dictionaries.ColumnEditor'
    ],
    stores: [
        'FormGenerator.store.formGenerator.dictionaries.ColumnEditor'
    ],
    views: [
        'FormGenerator.view.formGenerator.dictionaries.ColumnEditor'
    ],

    init: function () {
        this.control({
            'ColumnEditor': {
                afterrender: this.onAfterrender
            },
            'ColumnEditor button[name=save]': {
                click: this.onSave
            },
            'ColumnEditor button[name=close]': {
                click: this.onClose
            }
        });
    },

    onAfterrender: function (win) {
        var _this = this;
        var text_name = win.down('textfield[name=text]');
        var text_dbname = win.down('textfield[name=dbname]');
        var combo_value_type = win.down('combobox[name=value_type]');

        if (win.ID > 0) {
            text_dbname.setReadOnly(true);
            combo_value_type.setReadOnly(true);
            win.body.mask('Загрузка...');
            Ext.Ajax.request({
                url: 'Administrator/GetDictionaryFieldByID',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                params: {
                    dictionaryFieldID: win.ID
                },
                success: function (objServerResponse) {
                    win.body.unmask();
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    if (jsonResp.resultCode == 0) {
                        var obj = jsonResp.resultData;
                        text_name.setValue(obj.name);
                        text_dbname.setValue(obj.columnName);
                        combo_value_type.getStore().load({
                            callback: function () {
                                combo_value_type.setValue(obj.domainValueTypeID);
                            }
                        });
                        win.dictionaryID = obj.dictionaryID;
                    } else {
                        FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                    }
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                }
            });
        } else {
            combo_value_type.getStore().load();
        }
    },

    onSave: function (button) {
        var win = button.up('window');
        var text_name = win.down('textfield[name=text]');
        var text_dbname = win.down('textfield[name=dbname]');
        var combo_value_type = win.down('combobox[name=value_type]');
        if (!text_name.getValue() || text_name.getValue() == '') {
            FormGenerator.utils.MessageBox.show('Придумайте название поля!', null, -1);
            return;
        }
        if (!text_dbname.getValue() || text_dbname.getValue() == '') {
            FormGenerator.utils.MessageBox.show('Придумайте имя атрибута, представляющего поле в таблице в БД!', null, -1);
            return;
        }
        if (!combo_value_type.getValue()) {
            FormGenerator.utils.MessageBox.show('Укажите тип данных для поля!', null, -1);
            return;
        }

        Ext.Ajax.request({
            url: 'Administrator/SaveDictionaryField',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                field: {
                    ID: win.ID,
                    name: text_name.getValue(),
                    columnName: text_dbname.getValue(),
                    dictionaryID: win.dictionaryID,
                    domainValueTypeID: combo_value_type.getValue()
                }
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    win.fireEvent('dictionaryFieldSaved');
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