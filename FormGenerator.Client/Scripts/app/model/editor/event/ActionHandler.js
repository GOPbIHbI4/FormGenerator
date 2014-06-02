Ext.define('FormGenerator.model.editor.event.ActionHandler', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('FormGenerator.model.editor.event.Handler', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'actionKindID'
    ]
});

Ext.define('FormGenerator.model.editor.event.HandlerParams', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'actionTypeID',
        'domainValueTypeID',
        'controlName'
    ]
});
