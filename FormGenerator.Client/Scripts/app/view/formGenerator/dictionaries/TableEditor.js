Ext.define('FormGenerator.view.formGenerator.dictionaries.TableEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.TableEditor',

    modal: true,
    constrain: true,
    title: 'Таблица',

    height: 170,
    width: 450,
    minHeight: 170,
    minWidth: 450,
    maxHeight: 170,
    maxWidth: 450,

    oldName:null,
    oldDbName:null,

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
                    labelWidth: 60,
                    name: 'text'
                },
                {
                    xtype: 'textfield',
                    anchor: '0',
                    margin: '10 5 5 10',
                    labelSeparator:'',
                    fieldLabel: 'Имя в БД',
                    labelWidth: 60,
                    name: 'dbname'
                }
            ]
        });

        me.callParent(arguments);
    }
});