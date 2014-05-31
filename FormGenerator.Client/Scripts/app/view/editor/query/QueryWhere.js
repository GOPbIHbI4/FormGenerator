Ext.define('FormGenerator.view.editor.query.QueryWhere', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryWhere',
    name: 'QueryWhere',
    id: 'winQueryWhere',

    modal: true,
    constrain: true,
    title: 'Условие',

    height: 175,
    width: 600,
    minHeight: 175,
    minWidth: 600,
    maxWidth: 600,
    maxHeight: 175,

    layout: {
        type: 'anchor'
    },

    dictionaries:undefined,

    initComponent: function () {
        var me = this;

        var allDictionaryStore = Ext.create('FormGenerator.store.editor.query.AllDictionary');
        var dictionaryStore = Ext.create('FormGenerator.store.editor.query.AllDictionary');
        var allFieldStore = Ext.create('FormGenerator.store.editor.query.Field');
        var fieldStore = Ext.create('FormGenerator.store.editor.query.Field');

        Ext.applyIf(me, {

            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'right',
                    items: [
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Закрыть',
                            action: 'onClose',
                            border: true,
                            icon: 'Scripts/resources/icons/close.png',
                            iconAlign: 'top'
                        },
                        {
                            xtype: 'tbseparator'
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Сохранить',
                            action: 'onSave',
                            border: true,
                            icon: 'Scripts/resources/icons/save.png',
                            iconAlign: 'top'
                        }
                    ]
                }
            ],

            items: [
                {
                    xtype: 'container',
                    anchor: '0',
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            flex: 1,
                            margin:'5 5 5 5',
                            padding:2,
                            title: 'Первый член условия',
                            items: [
                                {
                                    xtype: 'combobox',
                                    anchor:'0',
                                    margin: '5 5 5 5',
                                    labelSeparator: '',
                                    valueField: 'ID',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    fieldLabel: 'Источник',
                                    labelWidth: 55,
                                    name: 'addDict',
                                    store: dictionaryStore
                                },
                                {
                                    xtype: 'combobox',
                                    anchor:'0',
                                    margin: '5 5 5 5',
                                    labelSeparator: '',
                                    valueField: 'ID',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    fieldLabel: 'Поле',
                                    labelWidth: 55,
                                    name: 'addField',
                                    store: fieldStore
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            anchor: '0 0',
                            layout: {
                                align: 'stretch',
                                type: 'vbox'
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    width: 80,
                                    margin:'60 5 0 0',
                                    valueField: 'name',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    name: 'cond',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['ID', 'name'],
                                        data: [
                                            {"ID": "1", "name": ">"},
                                            {"ID": "2", "name": "<"},
                                            {"ID": "3", "name": "="},
                                            {"ID": "4", "name": "!="},
                                            {"ID": "5", "name": "is null"},
                                            {"ID": "6", "name": "is not null"}
                                        ]
                                    })
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            flex: 1,
                            margin:'5 5 5 0',
                            padding:2,
                            name:'fsSecond',
                            layout: {
                                type: 'anchor'
                            },
                            title: 'Второй член условия',
                            items: [
                                {
                                    xtype: 'container',
                                    anchor: '0',
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'radiogroup',
                                            name:'rbData',
                                            margin: '0 5 5 5',
                                            flex:1,
                                            items: [
                                                {
                                                    xtype: 'radiofield',
                                                    flex:1,
                                                    action: 'rbField',
                                                    boxLabel: 'Поле',
                                                    name: 'data',
                                                    inputValue: '1'
                                                },
                                                {
                                                    xtype: 'radiofield',
                                                    width: 130,
                                                    action: 'rbValue',
                                                    boxLabel: 'Параметр',
                                                    name: 'data',
                                                    inputValue: '2'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combobox',
                                    anchor:'0',
                                    margin: '5 5 5 5',
                                    labelSeparator: '',
                                    valueField: 'ID',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    fieldLabel: 'Источник',
                                    labelWidth: 55,
                                    name: 'allDict',
                                    store: allDictionaryStore
                                },
                                {
                                    xtype: 'combobox',
                                    anchor:'0',
                                    margin: '5 5 5 5',
                                    labelSeparator: '',
                                    valueField: 'ID',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    editable: false,
                                    fieldLabel: 'Поле',
                                    labelWidth: 55,
                                    name: 'allField',
                                    store: allFieldStore
                                },
                                {
                                    xtype: 'textfield',
                                    anchor:'0',
                                    margin: '5 5 5 5',
                                    labelSeparator: '',
                                    fieldLabel: 'Параметр',
                                    labelWidth: 55,
                                    name: 'value'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});