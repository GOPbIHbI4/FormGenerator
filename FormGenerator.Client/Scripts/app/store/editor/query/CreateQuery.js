Ext.define('FormGenerator.store.editor.query.CreateQuery', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('FormGenerator.store.editor.query.From', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.query.From',
    autoLoad: false,
    data:[]
});

Ext.define('FormGenerator.store.editor.query.Select', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.query.Select',
    autoLoad: false,
    data:[]
});

Ext.define('FormGenerator.store.editor.query.Where', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.query.Where',
    autoLoad: false,
    data:[]
});