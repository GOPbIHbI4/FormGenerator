Ext.define('FormGenerator.model.editor.query.QueryFrom', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('FormGenerator.model.editor.query.Dictionary', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'tableName'
    ]
});

Ext.define('FormGenerator.model.editor.query.Field', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'columnName',
        'domainValueTypeID',
        'dictionaryID'
    ]
});