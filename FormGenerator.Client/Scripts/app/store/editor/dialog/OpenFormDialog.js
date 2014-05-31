Ext.define('FormGenerator.store.editor.dialog.OpenFormDialog', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('FormGenerator.store.editor.dialog.Form', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.dialog.Form',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'Form/GetFormsList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});