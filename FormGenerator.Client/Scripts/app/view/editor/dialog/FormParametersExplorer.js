Ext.define('FormGenerator.view.editor.dialog.FormParametersExplorer', {
    extend: 'Ext.window.Window',
    alias: 'widget.FormParametersExplorer',
    name: 'FormParametersExplorer',
    id: 'winFormParametersExplorer',

    modal: true,
    constrain: true,

    height: 140,
    width: 500,
    minHeight: 140,
    minWidth: 500,
    maxWidth: 500,
    maxHeight: 140,

    title:'Параметр',

    layout: {
        type: 'anchor'
    },

    data:undefined,

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
                            text: 'Выбрать',
                            action: 'onSave',
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
                    margin: '10 5 5 5',
                    labelSeparator:'',
                    fieldLabel: 'Параметр',
                    labelWidth: 70,
                    emptyText: 'Введите название параметра...',
                    name: 'param'
                },
                {
                    xtype: 'combobox',
                    anchor: '0',
                    margin: '5 5 5 5',
                    labelSeparator: '',
                    valueField: 'ID',
                    displayField: 'name',
                    queryMode: 'local',
                    editable: false,
                    fieldLabel: 'Компонент',
                    labelWidth: 70,
                    name: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['ID', 'name'],
                        data: []
                    })
                }
            ]
        });

        me.callParent(arguments);
    }
});