Ext.define('FormGenerator.view.editor.OpenFormDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.OpenFormDialog',
    name: 'OpenFormDialog',
    id: 'winOpenFormDialog',

    modal: true,
    constrain: true,
    title: 'Открытие формы для редактирования',

    height: 140,
    width: 450,
    minHeight: 140,
    minWidth: 450,
    maxHeight: 140,
    maxWidth: 450,

    dictionaryID:undefined,

    layout: {
        type: 'anchor'
    },

    initComponent: function () {
        var me = this;

        var formStore = Ext.create('FormGenerator.store.editor.Form');

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
                            text: 'Открыть',
                            action: 'onOpen',
                            border: true,
                            icon: 'Scripts/resources/icons/open3.png',
                            iconAlign: 'top'
                        }
                    ]
                }
            ],

            items: [
                {
                    xtype: 'combobox',
                    anchor: '0',
                    margin: '10 5 5 10',
                    labelSeparator:'',
                    valueField: 'ID',
                    displayField: 'name',
                    queryMode: 'local',
                    editable: false,
                    fieldLabel: 'Форма',
                    labelWidth: 50,
                    emptyText: 'Выберите форму для редактирования...',
                    name: 'form',
                    store: formStore
                },
                {
                    xtype: 'textfield',
                    anchor: '0',
                    margin: '0 5 5 10',
                    labelSeparator:'',
                    readOnly: true,
                    fieldLabel: 'Словарь',
                    labelWidth: 50,
                    emptyText: 'Форма не связана ни с одним словарем...',
                    name: 'dictionary'
                }
            ]
        });

        me.callParent(arguments);
    }
});