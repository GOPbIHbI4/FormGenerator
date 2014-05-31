Ext.define('FormGenerator.store.editor.query.QueryFrom', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('FormGenerator.store.editor.query.AllDictionary', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.query.Dictionary',
    autoLoad: false,
    data:[]
});

Ext.define('FormGenerator.store.editor.query.Dictionary', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.query.Dictionary',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetAllDictionaries'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});

Ext.define('FormGenerator.store.editor.query.Field', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.query.Field',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetDictionaryFields'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});