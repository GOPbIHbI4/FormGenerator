Ext.define('EventTypes', {
    singleton: true,
    init: function () {
        this.Click = 1;
        this.Change = 2;
    },

    getEventNameByTypeID: function (eventTypeID) {
        switch (eventTypeID) {
            case this.Click:
                return 'click';
            case this.Change:
                return 'change';
        }
    },

    Click: null,
    Change: null
});
EventTypes.init();

Ext.define('ActionKinds', {
    singleton: true,
    init: function () {
        this.OpenForm = 1;
        this.SaveForm = 2;
        this.RefreshState = 3;
        this.Enable = 4;
        this.Disable = 5;
        this.CloseUnsuccessfull = 6;
        this.CloseSuccessfull = 7;
    },

    OpenForm: null,
    SaveForm: null,
    RefreshState: null,
    Enable: null,
    Disable: null,
    CloseUnsuccessfull: null,
    CloseSuccessfull: null
});
ActionKinds.init();

Ext.define('Actions', {
    singleton: true,
    requires: [
        'FormGenerator.utils.formGenerator.GeneratorFormFactory'
    ],

    getEventHandler: function (control, actionTypeID, actionKindID, parameters, properties, eventName) {
        var _this = this;
        var win = control.up('window');
        switch (actionKindID) {
            case ActionKinds.OpenForm:
                var handler = null;
                if (properties && properties.length == 1 && properties[0].value > 0) {
                    var FormID = properties[0].value;
                    handler = function () {
                        win.body.mask('Загрузка...');
                        var formFactory = FormGenerator.utils.formGenerator.GeneratorFormFactory;
                        var formParams = _this.getFormParameters(control, parameters);
                        var newWin = formFactory.createWindow(FormID, formParams);
                        newWin.on('successfullyClosed', function (out) {
                            out.forEach(function (outParam) {
                                var name = outParam.name;
                                var value = outParam.value;
                                parameters.forEach(function (param) {
                                    if (param.name == name) {
                                        var control = formFactory.getControlByID(win, param.controlID);
                                        control.setValue(value);
                                    }
                                });
                            });
                        });
                        newWin.on('close', function () {
                            control.fireEvent(eventName + 'EventExecuted');
                        });
                        win.body.unmask();
                    };
                } else {
                    console.log('Неверно задано событие открытия формы! Потерян ключ формы!');
                }
                return handler;
                break;
            case ActionKinds.SaveForm:
                var handler = null;
                handler = function () {
                    _this.saveFormDictionary(control);
                    control.fireEvent(eventName + 'EventExecuted')
                };
                return handler;
                break;
            case ActionKinds.RefreshState:
                var handler = null;
                handler = function () {
                    if (control.getStore && control.getStore().loadSync) {
                        control.getStore().loadSync();
                    } else if (control.CONTROL_TYPE_ID == ControlTypes.GridColumn ||
                        control.CONTROL_TYPE_ID == ControlTypes.DateColumn ||
                        control.CONTROL_TYPE_ID == ControlTypes.NumberColumn) {
                        control.up('gridpanel').getStore().loadSync();
                    }
                    control.fireEvent(eventName + 'EventExecuted')
                };
                return handler;
                break;
            case ActionKinds.Enable:
                var handler = null;
                handler = function () {
                    control.enable();
                    control.fireEvent(eventName + 'EventExecuted')
                };
                return handler;
                break;
            case ActionKinds.CloseUnsuccessfull:
                var handler = null;
                handler = function () {
                    control.up('window').close();
                    control.fireEvent(eventName + 'EventExecuted')
                };
                return handler;
                break;
            case ActionKinds.CloseSuccessfull:
                var handler = null;
                handler = function () {
                    var out = [];
                    win.OUT_PARAMETERS.forEach(function (param) {
                        var control = FormGenerator.utils.formGenerator.GeneratorFormFactory.getControlByID(win, param.controlID);
                        out.push({
                            name: param.name,
                            value: control.getValue()
                        });
                    });
                    win.fireEvent('successfullyClosed', out);
                    win.close();
                    control.fireEvent(eventName + 'EventExecuted')
                };
                return handler;
                break;
        }
    },

    saveFormDictionary: function (control) {
        var formsFactory = FormGenerator.utils.formGenerator.GeneratorFormFactory;
        var win = control.up('window');
        if (!win.DICTIONARY) {
            console.log('Откуда взялось событие сохранения формы без словаря на форме?!');
            return;
        }

        win.body.mask('Сохранение...');
        var row = {};
        var fields = formsFactory.getFormDictionaryFields(win);
        var pkField = formsFactory.getDictionaryPrimaryKeyField(win.DICTIONARY);
        var pkFormField = formsFactory._getFormDictionaryFieldByDictionaryFieldID(win, pkField.ID);
        fields.forEach(function (field) {
            var mapping = field.DICTIONARY_MAPPINGS[0];
            row[mapping.dictionaryFieldID] = field.getValue();
        });

        Ext.Ajax.request({
            url: 'Dictionaries/SaveDictionaryData',
            method: 'POST',
            async: false,
            headers: { 'Content-Type': 'application/json' },
            jsonData: preparePostParameter({
                row: row,
                dictionaryID: win.DICTIONARY.ID
            }),
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    pkFormField.setValue(jsonResp.resultID);
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, jsonResp.resultCode);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                win.fireEvent('EventExecuted');
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    getFormParameters: function (control, parameters) {
        var formsFactory = FormGenerator.utils.formGenerator.GeneratorFormFactory;
        var win = control.up('window');
        var formParams = [];
        parameters.forEach(function (param) {
            var value = null;
            var controlID = formsFactory.getControlByID(win, param.controlID);
            if (control.CONTROL_TYPE_ID == ControlTypes.GridColumn ||
                control.CONTROL_TYPE_ID == ControlTypes.DateColumn ||
                control.CONTROL_TYPE_ID == ControlTypes.NumberColumn) {
                var grid = control.up('gridpanel');
                var selection = grid.getSelectionModel().getSelection()[0];
                if (selection) {
                    value = selection.get(control.dataIndex);
                }
            } else if (control.getValue) {
                value = control.getValue();
            }
            formParams.push({
                name: param.name,
                value: value
            });
        });
        return formParams;
    }
});