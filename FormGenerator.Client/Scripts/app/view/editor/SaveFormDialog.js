Ext.define('FormGenerator.view.editor.SaveFormDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.SaveFormDialog',
    name: 'SaveFormDialog',
    id: 'winSaveFormDialog',

    modal: true,
    constrain: true,
    title: 'Сохранение формы',

    height: 140,
    width: 450,
    minHeight: 140,
    minWidth: 450,
    maxHeight: 140,
    maxWidth: 450,

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
                    xtype: 'textfield',
                    anchor: '0',
                    margin: '10 5 5 10',
                    labelSeparator:'',
                    fieldLabel: 'Форма',
                    labelWidth: 50,
                    emptyText: 'Введите название формы...',
                    name: 'formName'
                }
            ]
        });

        me.callParent(arguments);
    }
});