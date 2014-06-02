Ext.define('FormGenerator.view.editor.event.ActionHandler', {
    extend: 'Ext.window.Window',
    alias: 'widget.ActionHandler',
    name: 'ActionHandler',
    id: 'winActionHandler',

    modal: true,
    constrain: true,
    title: 'Обработчик события',

    height: 300,
    width: 500,
    minHeight: 300,
    minWidth: 500,

    layout: {
        type: 'anchor'
    },

    form:undefined,

    initComponent: function () {
        var me = this;

        var handlerStore = Ext.create('FormGenerator.store.editor.event.Handler');
        var paramsStore = Ext.create('FormGenerator.store.editor.event.HandlerParams');

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
                    xtype: 'combobox',
                    anchor: '0',
                    margin: '8 5 5 5',
                    labelSeparator: '',
                    valueField: 'ID',
                    displayField: 'name',
                    queryMode: 'local',
                    editable: false,
                    fieldLabel: 'Обработчик',
                    labelWidth: 70,
                    name: 'handler',
                    store: handlerStore,
                    //триггеры
                    trigger1Cls:'x-form-arrow-trigger',
                    trigger2Cls:'x-form-clear-trigger',
                    //триггер отмены всего
                    onTrigger2Click:function () {
                        this.clearValue();
                    }
                },
                {
                    xtype: 'fieldset',
                    anchor: '0 -27',
                    margin: 5,
                    padding: 2,
                    title:'Параметры',
                    layout:'fit',
                    name: 'fsParams',
                    items:[
                        {
                            xtype: 'gridpanel',
                            name: 'paramsGrid',
                            store: paramsStore,
                            columns: [
                                {
                                    xtype:'gridcolumn',
                                    width:80,
                                    text:'Параметр',
                                    dataIndex:'name'
                                },
                                {
                                    xtype:'gridcolumn',
                                    flex:1,
                                    text:'Значение',
                                    dataIndex:'value'
                                }
                            ],
                            dockedItems:[
                                {
                                    xtype:'toolbar',
                                    dock:'right',
                                    items:[
                                        {
                                            xtype:'button',
                                            scale:'medium',
                                            border:true,
                                            icon:'Scripts/resources/icons/edit.png',
                                            tooltip:'Редактировать параметр',
                                            action: 'onEditParam'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});