Ext.define('FormGenerator.model.editor.query.FormQuery', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        '_ID',
        'queryTypeID',
        'sqlText',
        'queryInParams'
    ]
});
