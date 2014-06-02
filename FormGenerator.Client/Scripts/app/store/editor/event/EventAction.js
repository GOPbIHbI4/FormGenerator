Ext.define('FormGenerator.store.editor.event.EventAction', {
    extend:'Ext.data.Store',
    fields:[]
});

// Список действий события
Ext.define('FormGenerator.store.editor.event.Action', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.event.Action',
    autoLoad: false,
    data:[]
});