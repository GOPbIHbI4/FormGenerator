Ext.define('FormGenerator.store.editor.dialog.FormParameters', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('FormGenerator.store.editor.dialog.FormParametersIn', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.dialog.FormParametersIn',
    autoLoad: false,
    data:[]
});

Ext.define('FormGenerator.store.editor.dialog.FormParametersOut', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.dialog.FormParametersOut',
    autoLoad: false,
    data:[]
});