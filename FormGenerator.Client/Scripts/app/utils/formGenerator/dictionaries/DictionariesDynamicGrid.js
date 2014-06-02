Ext.define('FormGenerator.utils.formGenerator.dictionaries.DictionariesDynamicGrid', {
    requires: [
        'Ext.util.TextMetrics',
        'FormGenerator.utils.formGenerator.GeneratorModelsFactory'
    ],
    singleton: true,

    getGridPanel: function (win, dictionaryID, isEditable) {
        var _this = this;
        var grid_dictionary = null;
        win.body.mask('Загрузка...');
        Ext.Ajax.request({
            url: 'Dictionaries/GetDictionaryFieldsViewModel',
            method: 'GET',
            async: false,
            headers: { 'Content-Type': 'application/json' },
            params: {
                dictionaryID: dictionaryID
            },
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var dictionaryFields = jsonResp.resultData;
                    grid_dictionary = _this.buildGridPanel(win, dictionaryFields, dictionaryID, isEditable);
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
        return grid_dictionary;
    },
    //================================Функции для генерации грида, его колонок и строа=================================
    buildGridPanel: function (win, dictionaryFields, dictionaryID, isEditable) {
        var _this = this;
        var gridModel = _this._getGridColumns(dictionaryFields, win);
        var gridStore = _this._getGridStore(dictionaryFields, 'Dictionaries/GetDictionaryData');

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false,
            pluginId: 'rowEditing'
        });
        var grid = Ext.create('Ext.grid.Panel', {
            xtype: 'gridpanel',
            name: 'dictionary',
            border: true,
            columnLines: true,
            autoScroll: true,
            columns: gridModel,
            store: gridStore,
            title:'Данные',
            plugins: isEditable ? [rowEditing] : []
        });

        grid.on('edit', function (editor, e) {
            var result = false;
            win.body.mask('Сохранение...');
            var dataToSave = {};

            grid.columns.forEach(function(column) {
                dataToSave[column.dictionaryFieldID] = e.record.data[column.dataIndex];
            });

            Ext.Ajax.request({
                url: 'Dictionaries/SaveDictionaryData',
                method: 'POST',
                async:false,
                headers: { 'Content-Type': 'application/json' },
                jsonData: preparePostParameter({
                    row: dataToSave,
                    dictionaryID: dictionaryID
                }),
                success: function (objServerResponse) {
                    win.body.unmask();
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    if (jsonResp.resultCode == 0) {
                        grid.getStore().load({
                            params: {
                                dictionaryID: dictionaryID
                            }
                        });
                        result = true;
                    } else {
                        FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                    }
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                }
            });
            return result;
        });
        grid.on('canceledit', function (editor, e) {
            e.record.reject();
            this.getStore().each(function (record) {
                if (record.phantom) {
                    this.getStore().remove(record);
                    return false;
                }
            }, this);
            this.getStore().sync();
        });
        return grid;
    },
    _getGridColumns: function (dictionaryFields, win) {
        var _this = this;
        if (!isArray(dictionaryFields)) {
            return null;
        }
        var model = [];
        dictionaryFields.forEach(function (item) {
            model.push(_this._getGridColumnByDictionaryField(item, win));
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
            allowBlank: true,
            useNull: true,
            dateFormat: field.domainValueTypeID == DomainValueTypes.Date ? 'c' : null
        };
        return column;
    },
    _getGridColumnByDictionaryField: function (field, win) {
        var _this = this;
        var textMetrics = new Ext.util.TextMetrics();
        var modelsFactory = FormGenerator.utils.formGenerator.GeneratorModelsFactory;
        var column = {
            dictionaryFieldID:field.ID,
            xtype: modelsFactory._getColumnXtypeByValueTypeID(field.domainValueTypeID),
            minWidth: textMetrics.getWidth(field.name),
            header: field.name,
            dataIndex: field.columnName,
            allowBlank: true,
            format: modelsFactory._getColumnFormatByValueTypeID(field.domainValueTypeID),
            editor: field.primaryKey ? null : modelsFactory._getEditorByValueTypeID(field.domainValueTypeID),
            dictionaryField: field
        };
        if (field.primaryKey) {
            column.editor = null;
        } else if (field.foreignKey) {
            column.editor = {
                xtype: 'combobox',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name',
                editable: false,
                allowBlank: true,
                trigger1Cls: 'x-form-search-trigger',
                trigger2Cls: 'x-form-clear-trigger',
                onTrigger1Click: function () {
                    var _combo = this;
                    var editorWin = _this._createDictionarySelectWindow(win, field.foreignKey.dictionaryID)
                    editorWin.show();
                    editorWin.on('ItemSelected', function (selected) {
                        _combo.setValue(selected.get(field.foreignKey.columnName));
                    });
                },
                onTrigger2Click: function () {
                    this.setValue(null);
                }
            };
        }

        column.allowBlank = true;
        return column;
    },

    _createDictionarySelectWindow: function (win, dictionaryID) {
        var grid_dictionary = FormGenerator.utils.formGenerator.dictionaries.DictionariesDynamicGrid.getGridPanel(win, dictionaryID, false);
        var newWin = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            maximizable: true,

            height: 400,
            width: 600,
            minHeight: 400,
            minWidth: 600,
            layout: {
                type: 'fit'
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'right',
                    items: [
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Закрыть',
                            name: 'close',
                            border: true,
                            icon: 'Scripts/resources/icons/close.png',
                            iconAlign: 'top'
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Выбрать',
                            name: 'select',
                            border: true,
                            icon: 'Scripts/resources/icons/check.png',
                            iconAlign: 'top'
                        }
                    ]
                }
            ],
            items: [
                grid_dictionary
            ]
        });
        grid_dictionary.getStore().load({
            params: {
                dictionaryID: dictionaryID
            }
        });
        var btn_close = newWin.down('button[name=close]');
        var btn_select = newWin.down('button[name=select]');
        btn_select.on('click', function (button) {
            newWin.fireEvent('ItemSelected', grid_dictionary.getSelectionModel().getSelection()[0]);
            newWin.close();
        });
        btn_close.on('click', function (button) {
            newWin.close();
        });
        return newWin;
    }
//================================Функции для генерации грида, его колонок и строа=================================

})
;