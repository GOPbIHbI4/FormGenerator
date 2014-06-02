Ext.define('FormGenerator.view.editor.event.EventAction', {
    extend: 'Ext.window.Window',
    alias: 'widget.EventAction',
    name: 'EventAction',
    id: 'winEventAction',

    modal: true,
    constrain: true,
    title: 'Событие',

    height: 300,
    width: 500,
    minHeight: 300,
    minWidth: 500,

    layout: {
        type: 'anchor'
    },

    actions:undefined,
    form:undefined,
    isShowOnly:undefined,

    initComponent: function () {
        var me = this;

        var actionStore = Ext.create('FormGenerator.store.editor.event.Action');

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
                    anchor: '0 0',
                    margin: 5,
                    padding: 2,
                    title:'Действия события',
                    layout:'fit',
                    name: 'fsActions',
                    items:[
                        {
                            xtype: 'gridpanel',
                            name: 'actionGrid',
                            store: actionStore,
                            columns: [
                                {
                                    xtype:'rownumberer',
                                    text:'№'
                                },
                                {
                                    xtype:'gridcolumn',
                                    flex:1,
                                    text:'Действие',
                                    dataIndex:'name'
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
                                            tooltip:'Добавить действие',
                                            action: 'onAddAction'
                                        },
                                        {
                                            xtype:'tbseparator'
                                        },
                                        {
                                            xtype:'button',
                                            scale:'medium',
                                            border:true,
                                            icon:'Scripts/resources/icons/delete.png',
                                            tooltip:'Удалить действие',
                                            action: 'onDeleteAction'
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