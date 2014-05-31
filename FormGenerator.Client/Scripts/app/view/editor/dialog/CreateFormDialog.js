Ext.define('FormGenerator.view.editor.dialog.CreateFormDialog', {
    extend: 'Ext.window.Window',
    alias: 'widget.CreateFormDialog',
    name: 'CreateFormDialog',
    id: 'winCreateFormDialog',

    modal: true,
    constrain: true,
    title: 'Создание формы',

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

        var dictionaryStore = Ext.create('FormGenerator.store.editor.query.Dictionary');

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
                            text: 'Создать',
                            action: 'onCreate',
                            border: true,
                            icon: 'Scripts/resources/icons/check.png',
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
                    labelWidth: 100,
                    emptyText: 'Введите название формы...',
                    name: 'formName'
                },
                {
                    xtype: 'combobox',
                    anchor: '0',
                    margin: '0 5 5 10',
                    labelSeparator:'',
                    valueField: 'ID',
                    displayField: 'name',
                    queryMode: 'local',
                    editable: false,
                    fieldLabel: 'Источник данных',
                    labelWidth: 100,
                    emptyText: 'Выберите источник данных...',
                    name: 'dictionary',
                    store: dictionaryStore,
                    //триггеры
                    trigger1Cls:'x-form-arrow-trigger',
                    trigger2Cls:'x-form-clear-trigger',
                    //триггер отмены всего
                    onTrigger2Click:function () {
                        this.clearValue();
                    }
                }
            ]
        });

        me.callParent(arguments);
    }
});