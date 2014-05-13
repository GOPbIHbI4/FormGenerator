Ext.define('FormGenerator.view.main.MainForm', {
    extend:'Ext.panel.Panel',
    alias:'widget.MainForm',

    border:false,
    autoShow:false,
    ajaxTimeout:600000,

    margin:0,
    layout:{
        type:'absolute'
    },
    //----------------------------------------------------------
    initComponent:function () {
        var me = this;

        Ext.applyIf(me, {
            items:[
                {
                    xtype:'container',
                    layout:{
                        type:'anchor'
                    },
                    items:[
                        {
                            xtype:'container',
                            margin:'20 0 0 40',
                            name:'level0',
                            layout:{
                                align:'stretch',
                                type:'hbox'
                            },
                            items:[
                                {
                                    xtype:'button',
                                    width:100,
                                    text:'Поиск',
                                    iconAlign:'top',
                                    action:'onTest',
                                    icon:'Scripts/resources/icons/process.png'
                                },
                                {
                                    xtype:'button',
                                    width:100,
                                    text:'Test',
                                    iconAlign:'top',
                                    action:'onTest1',
                                    icon:'Scripts/resources/icons/process.png'
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