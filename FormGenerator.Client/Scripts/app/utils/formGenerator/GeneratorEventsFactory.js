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
        debugger;
        control.EVENTS.forEach(function (event) {
            var handlersList = [];
            var eventName = EventTypes.getEventNameByTypeID(event.eventTypeID);
            if (event.actions && event.actions.length == 0) {
                return;
            }
            event.actions.forEach(function (action) {
                var handler = Actions.getEventHandler(control, action.actionTypeID, action.actionKindID,
                    action.parameters, action.properties, eventName);
                handlersList.push(handler);
            });

            var i = 0;
            var executeHandler = null;
            //ФАКИН ЩИТ!!!11
            executeHandler = function () {
                var handler = handlersList[i];
                if (!handler) {
                    return;
                }
                handler();
                control.on(eventName + 'EventExecuted', function () {
                    i++;
                    executeHandler();
                });
            }
            control.on(eventName, executeHandler);
        });
    }
});