Ext.define('FormGenerator.view.formGenerator.dictionaries.DictionariesAdministrator', {
    extend: 'Ext.window.Window',
    alias: 'widget.DictionariesAdministrator',

    modal: true,
    constrain: true,
    maximizable: true,

    height: 500,
    width: 800,
    minHeight: 500,
    minWidth: 800,

    layout: {
        type: 'border'
    },
    //----------------------------------------------------------
    initComponent: function () {
        var me = this;

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
                            name: 'close',
                            border: true,
                            icon: 'Scripts/resources/icons/close.png',
                            iconAlign: 'top'
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Добавить',
                            name: 'add',
                            disabled:true,
                            border: true,
                            icon: 'Scripts/resources/icons/add.png',
                            iconAlign: 'top'
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Удалить',
                            name: 'delete',
                            disabled:true,
                            border: true,
                            icon: 'Scripts/resources/icons/delete.png',
                            iconAlign: 'top'
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'treepanel',
                    name: 'dictionaries',
                    title: 'Словари',
                    region: 'west',
                    split: true,
                    collapsible: true,
                    collapsed: false,
                    collapseDirection: 'left',
                    rootVisible: false,
                    viewConfig: {
                        width: 160
                    },
                    store: Ext.create('Ext.data.TreeStore', {
                        root: {
                            expanded: true,
                            name: 'root',
                            children: [
                            ]
                        }
                    })
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    name: 'main',
                    layout: {
                        type: 'fit'
                    },
                    items: [
                        {
                            xtype: 'gridpanel',
                            name: 'dictionary',
                            border: true,
                            columnLines: true,
                            autoScroll: true,
                            title:'Данные',
                            columns: [
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});