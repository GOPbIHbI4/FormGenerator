Ext.define('FormGenerator.model.formGenerator.dictionaries.DictionaryTypesAdministrator', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'dictionaryID',
        'domainValueTypeID',
        'pkID',
        'fkID',
        'name',
        'columnName',
        'domainValueTypeName',
        'primaryKey',
        'fkDictionaryFieldName',
        'fkDictionaryName'
    ]
});
