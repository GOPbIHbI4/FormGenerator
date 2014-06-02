Ext.define('FormGenerator.view.editor.dialog.FormParameters', {
    extend: 'Ext.window.Window',
    alias: 'widget.FormParameters',
    name: 'FormParameters',
    id: 'winFormParameters',

    modal: true,
    constrain: true,
    title: 'Параметры формы',

    height: 350,
    width: 450,
    minHeight: 350,
    minWidth: 450,

    layout: {
        type: 'anchor'
    },

    inParams:undefined,
    outParams:undefined,
    form:undefined,

    initComponent: function () {
        var me = this;

        var inParamsStore = Ext.create('FormGenerator.store.editor.dialog.FormParametersIn');
        var outParamsStore = Ext.create('FormGenerator.store.editor.dialog.FormParametersOut');

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
                    anchor: '0',
                    margin: 5,
                    padding: 2,
                    title:'Входные параметры',
                    layout:'fit',
                    items:[
                        {
                            xtype: 'gridpanel',
                            height:130,
                            name: 'inParamsGrid',
                            store: inParamsStore,
                            columns: [
                                {
                                    xtype:'gridcolumn',
                                    width:100,
                                    text:'Парметр',
                                    dataIndex:'name'
                                },
                                {
                                    xtype:'gridcolumn',
                                    flex:1,
                                    text:'Значение',
                                    dataIndex:'value'
                                }
                            ],
                            dockedItems:[
                                {
                                    xtype:'toolbar',
                                    dock:'right',
                                    items:[
                                        {
                                            xtype:'button',
                                            scale:'medium',
                                            border:true,
                                            icon:'Scripts/resources/icons/add.png',
                                            tooltip:'Добавить параметр',
                                            action: 'onAddInParam'
                                        },
                                        {
                                            xtype:'tbseparator'
                                        },
                                        {
                                            xtype:'button',
                                            scale:'medium',
                                            border:true,
                                            icon:'Scripts/resources/icons/delete.png',
                                            tooltip:'Удалить параметр',
                                            action: 'onDeleteInParam'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    anchor: '0 -156',
                    margin: 5,
                    padding: 2,
                    title:'Выходные параметры',
                    layout:'fit',
                    items:[
                        {
                            xtype: 'gridpanel',
                            name: 'outParamsGrid',
                            store: outParamsStore,
                            columns: [
                                {
                                    xtype:'gridcolumn',
                                    width:100,
                                    text:'Парметр',
                                    dataIndex:'name'
                                },
                                {
                                    xtype:'gridcolumn',
                                    flex:1,
                                    text:'Значение',
                                    dataIndex:'value'
                                }
                            ],
                            dockedItems:[
                                {
                                    xtype:'toolbar',
                                    dock:'right',
                                    items:[
                                        {
                                            xtype:'button',
                                            scale:'medium',
                                            border:true,
                                            icon:'Scripts/resources/icons/add.png',
                                            tooltip:'Добавить параметр',
                                            action: 'onAddOutParam'
                                        },
                                        {
                                            xtype:'tbseparator'
                                        },
                                        {
                                            xtype:'button',
                                            scale:'medium',
                                            border:true,
                                            icon:'Scripts/resources/icons/delete.png',
                                            tooltip:'Удалить параметр',
                                            action: 'onDeleteOutParam'
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