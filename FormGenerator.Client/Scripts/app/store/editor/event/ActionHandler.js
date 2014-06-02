Ext.define('FormGenerator.store.editor.event.ActionHandler', {
    extend:'Ext.data.Store',
    fields:[]
});

// Список действий события
Ext.define('FormGenerator.store.editor.event.Handler', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.event.Handler',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'EventEditor/GetHandlerTypeList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});

Ext.define('FormGenerator.store.editor.event.HandlerParams', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.event.HandlerParams',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'EventEditor/GetParamTypeList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});