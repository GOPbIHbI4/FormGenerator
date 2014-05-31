Ext.define('FormGenerator.controller.formGenerator.dictionaries.DictionaryTypesAdministrator', {
    extend: 'Ext.app.Controller',

    models: [
        'FormGenerator.model.formGenerator.dictionaries.DictionaryTypesAdministrator'
    ],
    stores: [
        'FormGenerator.store.formGenerator.dictionaries.DictionaryTypesAdministrator'
    ],
    views: [
        'FormGenerator.view.formGenerator.dictionaries.DictionaryTypesAdministrator'
    ],

    init: function () {
        this.control({
            'DictionaryTypesAdministrator button[name=close]': {
                click: this.onClose
            },
            'DictionaryTypesAdministrator': {
                afterrender: this.onAfterrender
            },
            //--------------------Группы таблиц---------------------
            'DictionaryTypesAdministrator menuitem[name=add_group]': {
                click: function (btn) {
                    this.onAddEditGroup(btn, false, false);
                }
            },
            'DictionaryTypesAdministrator menuitem[name=add_group_root]': {
                click: function (btn) {
                    this.onAddEditGroup(btn, false, true);
                }
            },
            'DictionaryTypesAdministrator menuitem[name=edit_group]': {
                click: function (btn) {
                    this.onAddEditGroup(btn, true, false);
                }
            },
            'DictionaryTypesAdministrator menuitem[name=delete_group]': {
                click: this.onDeleteGroup
            },
            //--------------------Таблицы---------------------
            'DictionaryTypesAdministrator menuitem[name=add_dictionary]': {
                click: function (btn) {
                    this.onAddEditDictionary(btn, false);
                }
            },
            'DictionaryTypesAdministrator menuitem[name=delete_dictionary]': {
                click: this.onDeleteDictionary
            },
            //--------------------Поля таблиц---------------------
            'DictionaryTypesAdministrator menuitem[name=add_field]': {
                click: function (btn) {
                    this.onAddEditField(btn, false);
                }
            },
            'DictionaryTypesAdministrator menuitem[name=edit_field]': {
                click: function (btn) {
                    this.onAddEditField(btn, true);
                }
            },
            'DictionaryTypesAdministrator menuitem[name=delete_field]': {
                click: this.onDeleteDictionaryField
            },
            //--------------------Поля таблиц---------------------
            'DictionaryTypesAdministrator menuitem[name=add_fk]': {
                click: this.onAddForeignKey
            },
            'DictionaryTypesAdministrator menuitem[name=delete_fk]': {
                click: this.onDeleteForeignKey
            },


            //------------------Изменение тыка по контролам------------------
            'DictionaryTypesAdministrator treepanel[name=dictionaries]': {
                selectionchange: this.onDictionarySelectionChange
            },
            'DictionaryTypesAdministrator gridpanel[name=dictionary]': {
                selectionchange: this.onDictionaryFieldSelecctionChange
            }
        });
    },

    win: null,

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

    onDictionarySelectionChange: function () {
        var _this = this;
        var win = _this.win;
        var btn_dictionary_groups = win.down('button[name=dictionary_groups]');
        var btn_dictionaries = win.down('button[name=dictionaries]');
        var btn_fields = win.down('button[name=fields]');
        var btn_fk = win.down('button[name=fk]');
        var mi_add_dictionary = win.down('menuitem[name=add_dictionary]');
        var mi_delete_dictionary = win.down('menuitem[name=delete_dictionary]');
        var mi_edit_field = win.down('menuitem[name=edit_field]');
        var mi_delete_field = win.down('menuitem[name=delete_field]');

        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var selectedField = grid_dictionary.getSelectionModel().getSelection()[0];

        if (!selected) {
            btn_dictionary_groups.disable();
            btn_dictionaries.disable();
            btn_fields.disable();
            btn_fk.disable();
            grid_dictionary.getStore().loadData([], false);
            return;
        } else if (!selected.raw.leaf) {
            btn_dictionaries.enable();
            btn_dictionary_groups.enable();
            btn_fields.disable();
            btn_fk.disable();
            grid_dictionary.getStore().loadData([], false);
            return;
        } else {
            btn_dictionary_groups.disable();
            btn_dictionaries.enable();
            btn_fk.enable();
            btn_fields.enable();
            if (!selectedField) {
                mi_edit_field.disable();
                mi_delete_field.disable();
                btn_fk.disable();
            } else {
                mi_edit_field.enable();
                mi_delete_field.enable();
                btn_fk.enable();
            }
        }
        var dictionaryID = selected.raw.ID;

        win.body.mask('Загрузка...');
        grid_dictionary.getStore().load({
            params: {
                dictionaryID: dictionaryID
            },
            callback: function () {
                win.body.unmask();
            }
        });
    },

    onDictionaryFieldSelecctionChange:function() {
        var _this = this;
        var win = _this.win;
        var btn_fk = win.down('button[name=fk]');
        var mi_edit_field = win.down('menuitem[name=edit_field]');
        var mi_add_fk = win.down('menuitem[name=add_fk]');
        var mi_delete_fk = win.down('menuitem[name=delete_fk]');
        var mi_delete_field = win.down('menuitem[name=delete_field]');
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selectedField = grid_dictionary.getSelectionModel().getSelection()[0];

        if (!selectedField) {
            mi_edit_field.disable();
            mi_delete_field.disable();
            btn_fk.disable();
            mi_delete_fk.disable();
            mi_add_fk.disable();
        } else {
            btn_fk.enable();
            mi_edit_field.enable();
            if (selectedField.get('primaryKey') || selectedField.get('fkID') > 0
                || selectedField.get('domainValueTypeID') != 3) {
                mi_add_fk.disable();
            } else {
                mi_add_fk.enable();
            }

            if (selectedField.get('fkID') > 0) {
                mi_delete_fk.enable();
            } else {
                mi_delete_fk.disable();
            }

            if (selectedField.get('primaryKey')) {
                mi_delete_field.disable();
            } else {
                mi_delete_field.enable();
            }
        }
    },

    onAddForeignKey: function (button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var dictionaryID = selected.raw.ID;
        var parentID = selected.parentNode ? selected.parentNode.raw.ID : null;
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selectedField = grid_dictionary.getSelectionModel().getSelection()[0];
        if (!selectedField) {
            FormGenerator.utils.MessageBox.show('Выберите поле!', null, 1);
            return;
        }
        if (selectedField.get('domainValueTypeID') != 3) {
            FormGenerator.utils.MessageBox.show('Тип значения поля должен быть "Целое число",' +
                ' чтобы сделать его внешним ключом!', null, 1);
            return;
        }
        if (selectedField.get('fkID')) {
            FormGenerator.utils.MessageBox.show('Данное поле уже имеет ограничение внешнего ключа!', null, 1);
            return;
        }
        if (selectedField.get('primaryKey')) {
            FormGenerator.utils.MessageBox.show('Данное поле является первичным ключом!', null, 1);
            return;
        }

        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.formGenerator.dictionaries.ForeignKeyEditor');
        var newWin = FormGenerator.utils.Windows.open('ForeignKeyEditor', {
            dictionaryFieldIDSource: selectedField.get('ID')
        }, true, true);
        newWin.on('foreignKeySaved', function (out) {
            win.body.mask('Загрузка...');
            grid_dictionary.getStore().load({
                params: {
                    dictionaryID: dictionaryID
                },
                callback: function () {
                    win.body.unmask();
                }
            });
        });
    },

    onDeleteForeignKey: function (button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var dictionaryID = selected.raw.ID;
        var parentID = selected.parentNode ? selected.parentNode.raw.ID : null;
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selectedField = grid_dictionary.getSelectionModel().getSelection()[0];
        if (!selectedField) {
            FormGenerator.utils.MessageBox.show('Выберите поле!', null, 1);
            return;
        }
        if (!selectedField.get('fkID') || selectedField.get('fkID') <= 0) {
            FormGenerator.utils.MessageBox.show('У выбранного поля и так нет ограничения на внешний ключ!', null, 1);
            return;
        }
        win.body.mask('Удаление...');
        Ext.Ajax.request({
            url: 'Administrator/DeleteForeignKey',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                foreignKeyID: selectedField.get('fkID')
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    grid_dictionary.getStore().load({
                        params: {
                            dictionaryID: dictionaryID
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

    onAddEditField: function (button, isEdit) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var dictionaryID = selected.raw.ID;
        var parentID = selected.parentNode ? selected.parentNode.raw.ID : null;
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selectedField = grid_dictionary.getSelectionModel().getSelection()[0];
        if (!selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите словарь!', null, 1);
            return;
        }

        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.formGenerator.dictionaries.ColumnEditor');
        var newWin = FormGenerator.utils.Windows.open('ColumnEditor', {
            ID: isEdit ? selectedField.get('ID') : 0,
            dictionaryID: dictionaryID
        }, true, true);
        newWin.on('dictionaryFieldSaved', function (out) {
            win.body.mask('Загрузка...');
            grid_dictionary.getStore().load({
                params: {
                    dictionaryID: dictionaryID
                },
                callback: function () {
                    win.body.unmask();
                }
            });
        });
    },

    onDeleteDictionaryField: function (button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var dictionaryID = selected.raw.ID;
        var parentID = selected.parentNode ? selected.parentNode.raw.ID : null;
        var grid_dictionary = win.down('gridpanel[name=dictionary]');
        var selectedField = grid_dictionary.getSelectionModel().getSelection()[0];
        if (!selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите словарь!', null, 1);
            return;
        }
        win.body.mask('Удаление...');
        Ext.Ajax.request({
            url: 'Administrator/DeleteDictionaryField',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                dictionaryFieldID: selectedField.get('ID')
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    grid_dictionary.getStore().remove(selected);
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

    onAddEditDictionary: function (button, isEdit) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var groupID = selected.raw.ID;
        var parentID = selected.parentNode ? selected.parentNode.raw.ID : null;

        if (!isEdit && selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите группу словарей!', null, 1);
            return;
        } else if (isEdit && !selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите словарь!', null, 1);
            return;
        }

        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.formGenerator.dictionaries.TableEditor');
        var newWin = FormGenerator.utils.Windows.open('TableEditor', {
            oldName: isEdit ? selected.raw.text : '',
            oldDbName: ''
        }, true, true);
        newWin.on('nameChecked', function (out) {
            var name = out.name;
            var dbName = out.dbname;
            Ext.Ajax.request({
                url: 'Administrator/SaveDictionary',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                jsonData: preparePostParameter({
                    dictionary: {
                        ID: isEdit ? groupID : 0,
                        name: name,
                        tableName: dbName,
                        dictionaryGroupID: isEdit ? parentID : groupID
                    }
                }),
                success: function (objServerResponse) {
                    win.body.unmask();
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    if (jsonResp.resultCode == 0) {
                        selected.appendChild({
                            ID: jsonResp.resultID,
                            text: name,
                            leaf: true
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
        });
    },

    onDeleteDictionary: function (button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var groupID = selected.raw.ID;

        if (!selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите словарь!', null, 1);
            return;
        }
        win.body.mask('Удаление...');
        Ext.Ajax.request({
            url: 'Administrator/DeleteDictionary',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                dictionaryID: groupID
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    selected.remove(true);
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

    onAddEditGroup: function (button, isEdit, isRoot) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var groupID = selected.raw.ID;
        var parentID = selected.parentNode ? selected.parentNode.raw.ID : null;

        if (selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите группу словарей!', null, 1);
            return;
        }

        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.formGenerator.dictionaries.NameEditor');
        var newWin = FormGenerator.utils.Windows.open('NameEditor', {
            oldName: isEdit ? selected.raw.text : ''
        }, true, true);
        newWin.on('nameChecked', function (name) {
            Ext.Ajax.request({
                url: 'Administrator/SaveDictionaryGroup',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                jsonData: preparePostParameter({
                    group: {
                        ID: isEdit ? groupID : 0,
                        name: name,
                        dictionaryGroupID_Parent: isRoot ? null : (isEdit ? parentID : groupID)
                    }
                }),
                success: function (objServerResponse) {
                    win.body.unmask();
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    if (jsonResp.resultCode == 0) {
                        if (isRoot) {
                            tree_dictionaries.getRootNode().appendChild({
                                ID: jsonResp.resultID,
                                text: name,
                                leaf: false
                            });
                        } else if (isEdit) {
                            selected.set('text', name);
                            selected.commit();
                        } else {
                            selected.appendChild({
                                ID: jsonResp.resultID,
                                text: name,
                                leaf: false
                            });
                        }
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
    },

    onDeleteGroup: function (button) {
        var _this = this;
        var win = button.up('window');
        var tree_dictionaries = win.down('treepanel[name=dictionaries]');
        var selected = tree_dictionaries.getSelectionModel().getSelection()[0];
        var groupID = selected.raw.ID;

        if (selected.raw.leaf) {
            FormGenerator.utils.MessageBox.show('Выберите группу словарей!', null, 1);
            return;
        }

        Ext.Ajax.request({
            url: 'Administrator/DeleteDictionaryGroup',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                dictionaryGroupID: groupID
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    selected.remove(true);
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