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
//    data:[
//        {group:'Все', type:'Тип компонентов'},
//        {group:'Таблицы', type:'Тип компонентов'},
//        {group:'Панели', type:'Тип компонентов'},
//        {group:'Поля', type:'Тип компонентов'},
//        {group:'Контейнеры', type:'Тип компонентов'},
//        {group:'Окна', type:'Тип компонентов'},
//        {group:'Кнопки', type:'Тип компонентов'}
//    ]
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