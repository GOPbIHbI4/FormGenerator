﻿//-----------------------------------------------------------------------------------------
// Фиктивная модель
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.model.editor.FormEditor', {
    extend: 'Ext.data.Model',
    fields: []
});

//-----------------------------------------------------------------------------------------
// Модель для компонентов
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.model.editor.Components', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'group',
        'component',
        'icon',
        'description',
        'path',
        'properties',
        'queryParams',
        'childComponents'
    ]
});

//-----------------------------------------------------------------------------------------
// Модель для групп компонентов
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.model.editor.Groups', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'type'
    ]
});

Ext.define('FormGenerator.model.editor.Query', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name'
    ]
});

Ext.define('FormGenerator.model.editor.QueryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name'
    ]
});

Ext.define('FormGenerator.model.editor.DictionaryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name'
    ]
});