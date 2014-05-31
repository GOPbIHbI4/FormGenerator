Ext.define('FormGenerator.view.editor.query.QueryFrom', {
    extend: 'Ext.window.Window',
    alias: 'widget.QueryFrom',
    name: 'QueryFrom',
    id: 'winQueryFrom',

    modal: true,
    constrain: true,
    title: 'Источники данных',

    height: 140,
    width: 600,
    minHeight: 140,
    minWidth: 600,
    maxWidth: 600,
    maxHeight: 140,

    layout: {
        type: 'anchor'
    },

    dictionaries:undefined,

    initComponent: function () {
        var me = this;

        var allDictionaryStore = Ext.create('FormGenerator.store.editor.query.AllDictionary');
        var dictionaryStore = Ext.create('FormGenerator.store.editor.query.Dictionary');
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
                            title: 'Новый источник данных',
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
                            xtype: 'fieldset',
                            flex: 1,
                            margin:'5 5 5 0',
                            padding:2,
                            name:'fsDataBinding',
                            layout: {
                                type: 'anchor'
                            },
                            title: 'Источник данных для привязки',
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