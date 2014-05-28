Ext.define('FormGenerator.view.editor.CreateQuery', {
    extend: 'Ext.window.Window',
    alias: 'widget.CreateQuery',
    name: 'CreateQuery',
    id: 'winCreateQuery',

    modal: true,
    constrain: true,
    title: 'Запрос',

    height: 350,
    width: 600,
    minHeight: 350,
    minWidth: 600,

    layout: {
        type: 'anchor'
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
                    title:'Запрос',
                    layout:'fit',
                    name: 'fsQuery',
                    items:[
                        {
                            xtype: 'textareafield',
                            name: 'query'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});