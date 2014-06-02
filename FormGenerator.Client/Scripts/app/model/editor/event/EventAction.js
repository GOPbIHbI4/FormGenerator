Ext.define('FormGenerator.model.editor.event.EventAction', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('FormGenerator.model.editor.event.Action', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'orderNumber',
        'eventID',
        'actionTypeID',
        'parameters'
    ]
});
