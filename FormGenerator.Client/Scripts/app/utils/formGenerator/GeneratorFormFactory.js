Ext.define('FormGenerator.utils.formGenerator.GeneratorFormFactory', {
    singleton: true,
    requires:[
        'FormGenerator.utils.formGenerator.GeneratorEventsFactory'
    ],

    createWindow: function (formID, formInParameters) {
        var _this = this;
        formInParameters = formInParameters || [];
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
                    console.log(window);
                    window = _this._parseBuildFormResult(window, formInParameters);
                    _this._initializeDictionaryObject(window);
                    window.query('combobox, textfield, datefield, gridpanel').forEach(function (item) {
                        _this._initializeControl(window, item);
                    });
                    FormGenerator.utils.formGenerator.GeneratorEventsFactory.addEvents(window);
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

    _parseBuildFormResult: function (window, formInParameters) {
        var _this = this;
        var WindowObject = _this._buildControl(window.window);
        WindowObject.DICTIONARY = window.dictionary;
        WindowObject.DICTIONARY_OBJECT = null;
        WindowObject.FORM_ID = window.ID;
        WindowObject.QUERIES = window.queries;
        WindowObject.IN_PARAMETERS = window.inParameters;
        WindowObject.OUT_PARAMETERS = window.outParameters;
        WindowObject.IN_PARAMETERS.forEach(function (item) {
            item.value = null;
            formInParameters.forEach(function (param) {
                if (item.name == param.name) {
                    item.value = param.value;
                }
            });
            if (item.value == null) {
                console.log('Параметр ' + item.name + ' не инициализирован!');
            }
        });
        WindowObject.OUT_PARAMETERS.forEach(function (item) {
            item.value = null;
        });

        WindowObject.layout = {
            type: 'anchor'
        };
        var win = Ext.create('Ext.window.Window', WindowObject);
        return win;
    },

    _buildControl: function (control) {
        var _this = this;
        var result = {};
        result.CONTROL_ID = control.ID;
        result.CONTROL_TYPE_ID = control.controlTypeID;
        result.QUERY_MAPPINGS = control.controlQueryMappings;
        result.DICTIONARY_MAPPINGS = control.controlDictionaryMappings;
        result.EVENTS = control.events;
        result.items = [];
        result.dockedItems = [];
        result.columns = [];

        control.properties.forEach(function (property) {
            result[property.name] = DomainValueTypes.getFromString(property.value.value, property.domainValueTypeID);
        });

        control.children.forEach(function (child) {
            var array = ControlTypes.getArrayNameByChildID(child.controlTypeID);
            result[array].push(_this._buildControl(child));
        });

        if (result.CONTROL_TYPE_ID == ControlTypes.ComboBox) {
            result.store = _this._createComboboxStore(result);
            result.valueField = 'key';
            result.displayField = 'value';
        } else if (result.CONTROL_TYPE_ID == ControlTypes.TextField || result.CONTROL_TYPE_ID == ControlTypes.DateField) {
            if (result.QUERY_MAPPINGS && result.QUERY_MAPPINGS.length > 0) {
                result.store = _this._createFieldStore(result);
                result.getStore = function () {
                    return result.store;
                };
            }
        } else if (result.CONTROL_TYPE_ID == ControlTypes.GridPanel) {
            result.store = _this._createGridpanelStore(result);
        }

        return result;
    },

    _initializeDictionaryObject: function (window) {
        var _this = this;
        if (!window.DICTIONARY) {
            return;
        }
        var pkField = _this.getDictionaryPrimaryKeyField(window.DICTIONARY);
        var pkFormField = _this._getFormDictionaryFieldByDictionaryFieldID(window, pkField.ID);
        var pkValue = null;
        if (pkFormField == null) {
            return;
        }

        window.IN_PARAMETERS.forEach(function (item) {
            if (pkFormField.CONTROL_ID == item.controlID) {
                pkValue = item.value;
            }
        });
        if (pkValue == null || isNaN(parseInt(pkValue)) || parseInt(pkValue) <= 0) {
            console.log('Создаем новый объект для дикшинари');
            return;
        }
        Ext.Ajax.request({
            url: 'Forms/GetDictionaryObjectByID',
            method: 'GET',
            async: false,
            headers: { 'Content-Type': 'application/json' },
            params: {
                dictionaryID: window.DICTIONARY.ID,
                pkValue: parseInt(pkValue)
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var obj = jsonResp.resultData;
                    window.DICTIONARY_OBJECT = obj;
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    _getFormDictionaryFieldByDictionaryFieldID: function (window, dictionaryFieldID) {
        var _this = this;
        var result = null;
        var formFields = _this.getFormDictionaryFields(window);
        formFields.forEach(function (item) {
            if (item.DICTIONARY_MAPPINGS[0].dictionaryFieldID == dictionaryFieldID) {
                result = item;
            }
        });
        return result;
    },

    getFormDictionaryFields: function (window) {
        var _this = this;
        var result = [];
        window.query('component').forEach(function (item) {
            if (item.DICTIONARY_MAPPINGS != null && item.DICTIONARY_MAPPINGS.length > 0) {
                result.push(item);
            }
        });
        return result;
    },

    getDictionaryPrimaryKeyField: function (dictionary) {
        var _this = this;
        var pk = null;
        dictionary.fields.forEach(function (item) {
            if (item.primaryKey) {
                pk = item;
            }
        });
        return pk;
    },

    getControlByID: function (window, controlID) {
        var _this = this;
        var result = null;
        window.query('component').forEach(function (item) {
            if (item.CONTROL_ID == controlID) {
                result = item;
            }
        });
        return result;
    },

    _initializeControl: function (window, control) {
        var _this = this;
        if (control.initialized) {
            return;
        }
        debugger;

        if (control.QUERY_MAPPINGS != null && control.QUERY_MAPPINGS.length > 0) {
            switch (control.CONTROL_TYPE_ID) {
                case ControlTypes.ComboBox:
                    control.getStore().loadSync(control, function () {
                        if (control.DICTIONARY_MAPPINGS != null && control.DICTIONARY_MAPPINGS.length > 0) {
                            if (!window.DICTIONARY_OBJECT) {
                                _this._initializeDictionaryObject(window);
                            }
                            if (window.DICTIONARY_OBJECT) {
                                control.setValue(window.DICTIONARY_OBJECT[control.DICTIONARY_MAPPINGS[0].dictionaryFieldID]);
                            }
                            return;
                        }
                        window.IN_PARAMETERS.forEach(function (item) {
                            if (item.controlID == control.CONTROL_ID) {
                                var value = item.value;
                                control.setValue(value);
                            }
                        });
                    });
                    break;
                case ControlTypes.GridPanel:
                    control.getStore().loadSync(control);
                    break;
                case ControlTypes.GridColumn:
                case ControlTypes.DateColumn:
                case ControlTypes.NumberColumn:
                    break;
                case ControlTypes.TextField:
                case ControlTypes.DateField:
                    control.getStore().loadSync(control);
                    break;
            }
        } else if (control.DICTIONARY_MAPPINGS != null && control.DICTIONARY_MAPPINGS.length > 0) {
            //текстовое поле или дата, связанные со столбцами в таблице
            if (!window.DICTIONARY_OBJECT) {
                _this._initializeDictionaryObject(window);
            }
            if (window.DICTIONARY_OBJECT) {
                var value = window.DICTIONARY_OBJECT[control.DICTIONARY_MAPPINGS[0].dictionaryFieldID];
                if (control.CONTROL_TYPE_ID == ControlTypes.DateField && value && !(value instanceof Date)) {
                    value = Ext.Date.parse(value.toString(), 'c');
                }
                control.setValue(value);
            }
        } else {
            //что-то из входных параметров формы
            window.IN_PARAMETERS.forEach(function (item) {
                if (item.controlID == control.CONTROL_ID) {
                    var value = item.value;
                    if (control.CONTROL_TYPE_ID == ControlTypes.DateField && value && !(value instanceof Date)) {
                        value = Ext.Date.parse(value.toString(), 'c');
                    }
                    control.setValue(value);
                }
            });
        }
        control.initialized = true;
    },

    //======================Подгружаемые данные============================
    _getQueryParameters: function (win, queryID) {
        var _this = this;
        var queryType = null;
        var queryInParams = {};
        win.QUERIES.forEach(function (item) {
            if (item.queryID == queryID) {
                queryType = item;
            }
        });

        queryType.inParametersMapping.forEach(function (item) {
            var controlParameter = _this.getControlByID(win, item.controlID);
            _this._initializeControl(win, controlParameter);
            queryInParams[item.queryInParameterID] = controlParameter.getValue();
        });
        return queryInParams;
    },

    _createComboboxStore: function (control) {
        var _this = this;
        var queryMappings = [];
        var queryOutParameterKeyID = null;
        var queryOutParameterValueID = null;
        if (!control.QUERY_MAPPINGS || control.QUERY_MAPPINGS.length != 2) {
            console.log('Ошибка в задании параметров к комбобоксу! ' + control);
            return;
        }

        queryMappings = control.QUERY_MAPPINGS;
        queryMappings.forEach(function (item) {
            switch (item.queryMappingRoleID) {
                case 1:
                    queryOutParameterValueID = item.queryOutParameterID;
                    break;
                case 2:
                    queryOutParameterKeyID = item.queryOutParameterID;
                    break;
            }
        });

        var store = Ext.create('Ext.data.Store', {
            initialized: false,
            fields: ['key', 'value'],
            autoLoad: false,
            proxy: {
                type: 'ajax',
                api: {
                    read: 'Queries/ExecuteComboboxQuery'
                },
                reader: {
                    type: 'json',
                    root: 'resultData',
                    successProperty: 'resultCode'
                }
            }
        });
        store.loadSync = function (control, callback) {
            var win = control.up('window');
            var params = _this._getQueryParameters(win, queryMappings[0].queryID);
            store.load({
                async: false,
                params: {
                    parameters: params,
                    queryID: queryMappings[0].queryID,
                    queryOutParameterKeyID: queryOutParameterKeyID,
                    queryOutParameterValueID: queryOutParameterValueID
                },
                callback: callback
            });
        };

        return store;
    },

    _createGridpanelStore: function (control) {
        var _this = this;
        var gridModel = [];
        var queryID = 0;
        control.columns.forEach(function (column) {
            if (column.CONTROL_TYPE_ID != ControlTypes.DateColumn
                && column.CONTROL_TYPE_ID != ControlTypes.GridColumn
                && column.CONTROL_TYPE_ID != ControlTypes.NumberColumn) {
                return;
            }

            if (!column.QUERY_MAPPINGS || column.QUERY_MAPPINGS.length != 1) {
                console.log('Ошибка в задании параметров к колонке грида! ' + control);
                return;
            }
            var queryMapping = column.QUERY_MAPPINGS[0];
            queryID = queryMapping.queryID;
            column.dataIndex = queryMapping.queryOutParameterID;
            var modelEntity = {
                type: column.CONTROL_TYPE_ID == ControlTypes.DateColumn ? 'date' : 'string',
                name: queryMapping.queryOutParameterID,
                allowBlank: true,
                useNull: true,
                dateFormat: column.CONTROL_TYPE_ID == ControlTypes.DateColumn ? 'c' : null
            };

            gridModel.push(modelEntity);
        });

        var store = Ext.create('Ext.data.Store', {
            initialized: false,
            fields: gridModel,
            autoLoad: false,
            proxy: {
                type: 'ajax',
                api: {
                    read: 'Queries/ExecuteGridpanelQuery'
                },
                reader: {
                    type: 'json',
                    root: 'resultData',
                    successProperty: 'resultCode'
                }
            }
        });
        store.loadSync = function (control, callback) {
            var win = control.up('window');
            var params = _this._getQueryParameters(win, queryID);
            store.load({
                async: false,
                params: {
                    parameters: params,
                    queryID: queryID
                },
                callback: callback
            });
        };

        return store;
    },

    _createFieldStore: function (control) {
        var _this = this;
        var queryMapping = null;
        if (!control.QUERY_MAPPINGS || control.QUERY_MAPPINGS.length != 1) {
            console.log('Ошибка в задании параметров к комбобоксу!' + control);
            return;
        }
        queryMapping = control.QUERY_MAPPINGS[0];

        var store = {};
        store.loadSync = function (control, callback) {
            var win = control.up('window');
            var queryID = queryMapping.queryID;
            var queryInParams = _this._getQueryParameters(win, queryID);
            var result = _this.executeQuery(queryID, queryInParams);
            if (result == null || result.length == 0) {
                control.setValue(null);
                if (callback) {
                    callback(null);
                }
            } else {
                var row = result[0];
                row.forEach(function (item) {
                    if (item.ID = queryMapping.queryOutParameterID) {
                        var value = item.value.value;
                        if (control.CONTROL_TYPE_ID == ControlTypes.DateField && value && !(value instanceof Date)) {
                            value = Ext.Date.parse(value.toString(), 'c');
                        }
                        control.setValue(value);
                    }
                });
                if (callback) {
                    callback(row);
                }
            }
        };

        return store;
    },

    executeQuery: function (queryID, parameters) {
        var _this = this;
        var result = null;
        Ext.Ajax.request({
            url: 'Queries/ExecuteQuery',
            method: 'GET',
            async: false,
            headers: { 'Content-Type': 'application/json' },
            params: {
                parameters: JSON.stringify(parameters),
                queryID: queryID
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    result = jsonResp.resultData;
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
        return result;
    }
})
;