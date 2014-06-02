Ext.define('FormGenerator.model.editor.event.ComponentEvent', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'controlTypeID',
        'eventTypeID',
        'hasHandler',
        'actions',
        'controlID',
        'controlName'
    ]
});