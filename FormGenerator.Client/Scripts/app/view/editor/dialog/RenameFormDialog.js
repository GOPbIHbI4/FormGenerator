Ext.define('FormGenerator.view.editor.dialog.RenameFormDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.RenameFormDialog',
    name: 'RenameFormDialog',
    id: 'winRenameFormDialog',

    modal: true,
    constrain: true,
    title: 'Переименование формы',

    height: 140,
    width: 450,
    minHeight: 140,
    minWidth: 450,
    maxHeight: 140,
    maxWidth: 450,

    layout: {
        type: 'anchor'
    },

    form_id:undefined,
    form_name:undefined,

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
                            action: 'onRename',
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