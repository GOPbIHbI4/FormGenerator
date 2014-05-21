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
        'group',
        'name',
        'component',
        'icon',
        'desc',
        'path',
        'properties',
        'sourceConfig',
        'childComponents',
        'infoIcon'
    ]
});

//-----------------------------------------------------------------------------------------
// Модель для групп компонентов
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.model.editor.Groups', {
    extend: 'Ext.data.Model',
    fields: [
        'group',
        'type',
        'count'
    ]
});