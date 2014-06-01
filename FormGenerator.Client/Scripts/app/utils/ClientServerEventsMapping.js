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
    },

    OpenForm: null
});
ActionKinds.init();

Ext.define('Actions', {
    singleton: true,
    requires: [
        'FormGenerator.utils.formGenerator.GeneratorFormFactory'
    ],
    init: function () {
        this.Click = 1;
        this.Change = 2;
    },

    getEventHandler: function (control, actionTypeID, actionKindID, parameters, properties) {
        var _this = this;
        var win = control.up('window');
        var handler = null;
        switch (actionKindID) {
            case ActionKinds.OpenForm:
                if (properties && properties.length == 1 && properties[0].value > 0) {
                    var FormID = properties[0].value;
                    handler = function () {
                        var formParams = _this.getFormParameters(control, parameters);
                        FormGenerator.utils.formGenerator.GeneratorFormFactory.createWindow(FormID, formParams);
                    };
                } else {
                    console.log('Неверно задано событие открытия формы! Потерян ключ формы!');
                }
                return handler;
                break;
        }
    },

    getFormParameters:function(control, parameters){
        var formsFactory = FormGenerator.utils.formGenerator.GeneratorFormFactory;
        var win = control.up('window');
        var formParams = [];
        parameters.forEach(function (param) {
            var controlID = formsFactory.getControlByID(win, param.controlID);
            formParams.push({
                name: param.name,
                value: controlID.getValue()
            });
        });
        return formParams;
    },

    Click: null,
    Change: null
});
Actions.init();