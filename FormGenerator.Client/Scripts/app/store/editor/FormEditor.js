Ext.define('FormGenerator.store.editor.FormEditor', {
    extend:'Ext.data.Store',
    fields:[]
});

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

Ext.define('FormGenerator.store.editor.Query', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Query',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetQueryTypeList'
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
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetQueryOutParamsList'
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

Ext.define('FormGenerator.store.editor.Params', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Params',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetQueryInParamsList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});