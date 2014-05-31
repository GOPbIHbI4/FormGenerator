Ext.define('FormGenerator.store.formGenerator.dictionaries.ColumnEditor', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.formGenerator.dictionaries.ColumnEditor',
    groupField:'group',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'Administrator/GetDomainValueTypes'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});
