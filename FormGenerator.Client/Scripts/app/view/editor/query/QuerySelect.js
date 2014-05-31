Ext.define('FormGenerator.view.editor.query.QuerySelect', {
    extend: 'Ext.window.Window',
    alias: 'widget.QuerySelect',
    name: 'QuerySelect',
    id: 'winQuerySelect',

    modal: true,
    constrain: true,
    title: 'Поля',

    height: 140,
    width: 600,
    minHeight: 140,
    minWidth: 600,
    maxWidth: 600,
    maxHeight: 140,

    layout: {
        type: 'anchor'
    },

    dictionaries:undefined,

    initComponent: function () {
        var me = this;

        var dictionaryStore = Ext.create('FormGenerator.store.editor.query.AllDictionary');
        var fieldStore = Ext.create('FormGenerator.store.editor.query.Field');

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
                    margin:'5 5 5 5',
                    padding:2,
                    title: 'Новое поле',
                    items: [
                        {
                            xtype: 'combobox',
                            anchor:'0',
                            margin: '5 5 5 5',
                            labelSeparator: '',
                            valueField: 'ID',
                            displayField: 'name',
                            queryMode: 'local',
                            editable: false,
                            fieldLabel: 'Источник',
                            labelWidth: 55,
                            name: 'addDict',
                            store: dictionaryStore
                        },
                        {
                            xtype: 'combobox',
                            anchor:'0',
                            margin: '5 5 5 5',
                            labelSeparator: '',
                            valueField: 'ID',
                            displayField: 'name',
                            queryMode: 'local',
                            editable: false,
                            fieldLabel: 'Поле',
                            labelWidth: 55,
                            name: 'addField',
                            store: fieldStore
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});