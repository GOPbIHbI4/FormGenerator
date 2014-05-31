Ext.define('FormGenerator.model.editor.query.CreateQuery', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('FormGenerator.model.editor.query.From', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'condition',
        'tableName',
        'obj'
    ]
});

Ext.define('FormGenerator.model.editor.query.Select', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'dictionary',
        'field',
        'domainValueTypeID',
        'columnName',
        'obj'
    ]
});

Ext.define('FormGenerator.model.editor.query.Where', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'operation',
        'condition',
        'domainValueTypeID',
        'obj'
    ]
});