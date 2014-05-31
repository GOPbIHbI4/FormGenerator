Ext.define('FormGenerator.model.editor.FormEditor', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('FormGenerator.model.editor.Components', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'group',
        'component',
        'icon',
        'description',
        'path',
        'properties',
        'queryParams',
        'childComponents',
        'data' // данные
    ]
});

Ext.define('FormGenerator.model.editor.Groups', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'type'
    ]
});

Ext.define('FormGenerator.model.editor.Query', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'sqlText'
    ]
});

Ext.define('FormGenerator.model.editor.QueryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'queryTypeID',
        'domainValueTypeID'
    ]
});

Ext.define('FormGenerator.model.editor.DictionaryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name'
    ]
});

Ext.define('FormGenerator.model.editor.Events', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name'
    ]
});

Ext.define('FormGenerator.model.editor.Params', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'queryTypeID',
        'domainValueTypeID',
        'value',
        'rawValue'
    ]
});