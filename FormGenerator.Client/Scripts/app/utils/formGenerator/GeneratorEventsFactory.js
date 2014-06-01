Ext.define('FormGenerator.utils.formGenerator.GeneratorEventsFactory', {
    singleton: true,

    addEvents: function (window) {
        var _this = this;
        window.query('component').forEach(function (item) {
            if (item.EVENTS && item.EVENTS.length > 0) {
                _this.addEventHandlers(item);
            }
        });
    },

    addEventHandlers: function (control) {
        var _this = this;
        var win = control.up('window');
        control.EVENTS.forEach(function (event) {
            var handlersList = [];
            event.actions.forEach(function (action) {
                var handler = Actions.getEventHandler(control, action.actionTypeID, action.actionKindID, action.parameters, action.properties);
                handlersList.push(handler);
            });

            control.on(EventTypes.getEventNameByTypeID(event.eventTypeID), function () {
                handlersList.forEach(function (func) {
                    func();
                });
            });
        });
    }
});