//-----------------------------------------------------------------------------------------
// Фиктивное хранилище
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.store.editor.FormEditor', {
    extend:'Ext.data.Store',
    fields:[]
});

//-----------------------------------------------------------------------------------------
// Хранилище для компонентов
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.store.editor.Components', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Components',
    groupField:'group',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'FormEditor/GetControlTypeList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});

//-----------------------------------------------------------------------------------------
// Хранилище для групп компонентов
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.store.editor.Groups', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Groups',
    groupField:'type',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'FormEditor/GetControlTypeGroupList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});


Ext.define('FormGenerator.store.editor.TreeStore', {
    extend:'Ext.data.TreeStore',
    autoLoad:false,
    root:{
        expanded:true,
        name:'root',
        id:'root',
        text:'View',
        icon:'Scripts/resources/icons/editor/w.png',
        children:[]
    }
});

Ext.define('FormGenerator.store.editor.DataBinding', {
    extend:'Ext.data.Store',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name',  type: 'string'}
    ],
    data:[
        { id:1, name:'Запрос'},
        { id:2, name:'Значение'}
    ]
});

Ext.define('FormGenerator.store.editor.Query', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Query',
    groupField:'type',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'FormEditor/GetQueryList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});
Ext.define('FormGenerator.store.editor.QueryField', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.QueryField',
    groupField:'type',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'FormEditor/GetQueryFields'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});
Ext.define('FormGenerator.store.editor.DictionaryField', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.DictionaryField',
    groupField:'type',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'FormEditor/GetDictionaryFields'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});