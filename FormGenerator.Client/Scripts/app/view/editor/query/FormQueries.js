Ext.define('FormGenerator.view.editor.query.FormQueries', {
    extend: 'Ext.window.Window',
    alias: 'widget.FormQueries',
    name: 'FormQueries',
    id: 'winFormQueries',

    modal: true,
    constrain: true,
    title: 'Запросы формы',

    height: 287,
    width: 715,
    minHeight: 287,
    maxHeight: 287,
    minWidth: 715,
    maxWidth: 715,

    layout: {
        type: 'anchor'
    },

    form:undefined,

    initComponent: function () {
        var me = this;

        var queryStore = Ext.create('FormGenerator.store.editor.Query');
        var paramsStore = Ext.create('FormGenerator.store.editor.Params');

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
                    xtype: 'fieldset',
                    title: 'Запрос',
                    anchor: '0',
                    margin: 5,
                    padding: 2,
                    layout: 'anchor',
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
                                    xtype: 'combobox',
                                    flex: 1,
                                    margin: '0 5 5 5',
                                    labelSeparator: '',
                                    valueField: 'ID',
                                    displayField: 'sqlText',
                                    queryMode: 'local',
                                    editable: false,
                                    fieldLabel: 'Тип запроса',
                                    labelWidth: 75,
                                    name: 'query',
                                    store: queryStore
                                },
                                {
                                    xtype: 'button',
                                    width: 22,
                                    height: 22,
                                    action: 'onViewQueryType',
                                    margin: '0 5 5 0',
                                    border: true,
                                    iconAlign: 'top',
                                    icon: 'Scripts/resources/icons/view_16.png'
                                },
                                {
                                    xtype: 'button',
                                    width: 22,
                                    height: 22,
                                    action: 'onAddQueryType',
                                    margin: '0 5 5 0',
                                    border: true,
                                    iconAlign: 'top',
                                    icon: 'Scripts/resources/icons/add_16.png'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Входные параметры',
                            anchor: '0',
                            margin: '0 0 0 0',
                            padding: 2,
                            height:200,
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    name: 'inParams',
                                    store: paramsStore,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 60,
                                            text: 'Параметр',
                                            dataIndex: 'name'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            flex: 1,
                                            text: 'Значение',
                                            dataIndex: 'value'
                                        }
                                    ],
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'right',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    scale: 'medium',
                                                    border: true,
                                                    icon: 'Scripts/resources/icons/edit.png',
                                                    action: 'onSetParam'
                                                }
                                            ]
                                        }
                                    ]
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