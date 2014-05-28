Ext.define('FormGenerator.model.editor.OpenFormDialog', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('FormGenerator.model.editor.Form', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'dictionaryID',
        'dictionary'
    ]
});