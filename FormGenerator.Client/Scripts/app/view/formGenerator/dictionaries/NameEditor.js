Ext.define('FormGenerator.view.formGenerator.dictionaries.NameEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.NameEditor',

    modal: true,
    constrain: true,
    title: 'Название',

    height: 140,
    width: 450,
    minHeight: 140,
    minWidth: 450,
    maxHeight: 140,
    maxWidth: 450,

    oldName:null,

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
                    xtype: 'textfield',
                    anchor: '0',
                    margin: '10 5 5 10',
                    labelSeparator:'',
                    fieldLabel: 'Название',
                    labelWidth: 50,
                    name: 'text'
                }
            ]
        });

        me.callParent(arguments);
    }
});