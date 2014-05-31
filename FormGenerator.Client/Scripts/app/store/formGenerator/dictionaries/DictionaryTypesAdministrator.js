Ext.define('FormGenerator.store.formGenerator.dictionaries.DictionaryTypesAdministrator', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.formGenerator.dictionaries.DictionaryTypesAdministrator',
    groupField:'group',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'Administrator/GetDictionaryTypesAdministratorData'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});
