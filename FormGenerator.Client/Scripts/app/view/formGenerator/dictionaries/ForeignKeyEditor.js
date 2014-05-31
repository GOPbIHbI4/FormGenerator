Ext.define('FormGenerator.view.formGenerator.dictionaries.ForeignKeyEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.ForeignKeyEditor',

    modal: true,
    constrain: true,
    title: 'Поле',

    height: 270,
    width: 550,
    minHeight: 270,
    minWidth: 550,
    maxHeight: 270,
    maxWidth: 550,

    dictionaryFieldIDSource:null,
    layout: {
        type: 'fit'
    },

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
                            xtype: 'tbseparator'
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Сохранить',
                            name:'save',
                            border: true,
                            icon: 'Scripts/resources/icons/save.png',
                            iconAlign: 'top'
                        }
                    ]
                }
            ],

            items: [
                {
                    xtype: 'treepanel',
                    name: 'dictionaries',
                    title: 'Типы словарей',
                    rootVisible: false,
                    viewConfig: {
//                        width: 160
                    },
                    store: Ext.create('Ext.data.TreeStore', {
                        root: {
                            expanded: true,
                            name: 'root',
                            children: [
                            ]
                        }
                    })
                }
            ]
        });

        me.callParent(arguments);
    }
});