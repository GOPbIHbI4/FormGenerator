Ext.define('FormGenerator.model.editor.dialog.FormParameters', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('FormGenerator.model.editor.dialog.FormParametersIn', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'controlName'
    ]
});

Ext.define('FormGenerator.model.editor.dialog.FormParametersOut', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'controlName'
    ]
});