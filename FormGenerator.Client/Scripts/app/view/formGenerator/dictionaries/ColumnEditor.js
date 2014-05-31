Ext.define('FormGenerator.view.formGenerator.dictionaries.ColumnEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.ColumnEditor',

    modal: true,
    constrain: true,
    title: 'Поле',

    height: 170,
    width: 550,
    minHeight: 170,
    minWidth: 550,
    maxHeight: 170,
    maxWidth: 550,

    ID:null,
    dictionaryID:null,

    layout: {
        type: 'anchor'
    },

    initComponent: function () {
        var me = this;
        var valueTypesStore = Ext.create('FormGenerator.store.formGenerator.dictionaries.ColumnEditor');
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
                    margin: '10 5 0 5',
                    labelSeparator:'',
                    fieldLabel: 'Название поля',
                    labelWidth: 100,
                    name: 'text'
                },
                {
                    xtype: 'textfield',
                    anchor: '0',
                    margin: '5 5 0 5',
                    labelSeparator:'',
                    fieldLabel: 'Атрибут таблицы',
                    maskRe : /[A-Z]/,
                    labelWidth: 100,
                    name: 'dbname'
                },
                {
                    xtype: 'combobox',
                    anchor: '0',
                    margin: '5 5 0 5',
                    labelSeparator:'',
                    fieldLabel: 'Тип значения',
                    editable:false,
                    store:valueTypesStore,
                    queryMode:'local',
                    displayField:'name',
                    valueField:'ID',
                    labelWidth: 100,
                    name: 'value_type'
                }
            ]
        });

        me.callParent(arguments);
    }
});