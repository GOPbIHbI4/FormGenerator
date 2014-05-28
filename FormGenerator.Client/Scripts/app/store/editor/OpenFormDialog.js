Ext.define('FormGenerator.store.editor.OpenFormDialog', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('FormGenerator.store.editor.Form', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Form',
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