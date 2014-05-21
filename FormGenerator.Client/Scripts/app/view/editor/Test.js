Ext.override(Ext.view.DragZone, {
    getDragText: function () {
        if (this.dragField) {
            var fieldValue = this.dragData.records[0].get(this.dragField);
            var iconValue = renderIcon(this.dragData.records[0].get(this.iconField));
            return Ext.String.format(this.dragText, '&nbsp&nbsp' + iconValue + '&nbsp&nbsp' + fieldValue);
        } else {
            return '';
        }
    }
});

Ext.override(Ext.grid.plugin.DragDrop, {
    onViewRender: function (view) {
        var me = this;

        if (me.enableDrag) {
            me.dragZone = Ext.create('Ext.view.DragZone', {
                view: view,
                ddGroup: me.dragGroup || me.ddGroup,
                dragText: me.dragText,
                dragField: me.dragField,
                iconField: me.iconField
            });
            view.dragZone = me.dragZone;
        }

        if (me.enableDrop) {
            me.dropZone = Ext.create('Ext.grid.ViewDropZone', {
                view: view,
                ddGroup: me.dropGroup || me.ddGroup
            });
            view.dragZone = me.dropZone;
        }
    }
});

Ext.define('My.App.Overrides', {}, function () {
    Ext.require([
        'Ext.window.Window'
    ], function () {
        Ext.window.Window.override({
            initDraggable: function () {
                this.callOverridden(arguments);
                Ext.Window.prototype.floating = { shadow: false };
                this.dd.on('drag', function () {
                    this.ghostPanel.setZIndex(Ext.WindowManager.getActive().getEl().dom.style.zIndex);
                }, this);
            }
        });
    });
});

//Ext.define('FormGenerator.view.editor.Moused', {
//    singleton: true,
//    moused:undefined,
//    getMoused:function(){
//        return this.moused;
//    },
//    setMoused:function(m){
//        this.moused = m;
//    },
//    checkMoused:function(m){
//        var newMoused = null;
//        if (!this.moused || this.moused.name != m.name){
//            newMoused = m;
//            this.setMoused(m);
//        }
//        return newMoused;
//    }
//});

Ext.define('FormGenerator.view.editor.Test', {
        extend: 'Ext.window.Window',
        alias: 'widget.Test',
        name: 'Test',
        id: 'winTest',

        modal: true,
        constrain: true,

        height: 800,
        width: 1200,
        minHeight: 800,
        minWidth: 1200,

        mousedComponents: [],

        layout: {
            type: 'border'
        },

        requires: [
            'Scripts.app.utils.ux.ClearButton'
//            'FormGenerator.utils.components.Moused'
        ],

        initComponent: function () {
            var me = this;

            var componentsStore = Ext.create('FormGenerator.store.editor.Components');
            var componentsStore2 = Ext.create('FormGenerator.store.editor.Components');

//        var groupsStore = Ext.create('OSO.store.sencha.Groups');
//        var treeStore = Ext.create('OSO.store.sencha.TreeStore');

            Ext.applyIf(me, {

                dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'button',
                                scale: 'medium',
                                text: 'Сохранить',
                                action: 'onSave',
                                border: true,
                                icon: 'Scripts/resources/icons/save.png',
                                iconAlign: 'top'
                            },
                            {
                                xtype: 'tbseparator'
                            },
                            {
                                xtype: 'button',
                                scale: 'medium',
                                text: 'Настройки',
                                action: 'onEdit',
                                border: true,
                                icon: 'Scripts/resources/icons/edit.png',
                                iconAlign: 'top'
                            },
                            {
                                xtype: 'tbseparator'
                            },
                            {
                                xtype: 'button',
                                scale: 'medium',
                                text: 'Закрыть',
                                action: 'onClose',
                                border: true,
                                icon: 'Scripts/resources/icons/close.png',
                                iconAlign: 'top'
                            }
                        ]
                    }
                ],

                items: [
//======================================================================================================================
//                                               Компоненты
//======================================================================================================================
                    {
                        xtype: 'panel',
                        name: 'componentsPanel',
                        title: 'Компоненты',
                        region: 'west',
                        collapsible: true,
                        collapsed: false,
                        split: true,
                        width: 300,
                        layout: 'border',
                        items: [
//------------------------------------------------Компоненты------------------------------------------------------------
                            {
                                xtype: 'gridpanel',
                                name: 'components',
                                region: 'center',
                                split: true,
                                hideHeaders: true,
                                flex: 1,

                                // Драг и Дроп
                                enableDragDrop: true,
                                viewConfig: {
                                    plugins: [
                                        {
                                            ptype: 'gridviewdragdrop',
                                            dragText: '{0}',
                                            dragField: 'component',
                                            iconField: 'icon',
                                            enableDrop: false,
                                            ddGroup: 'grid-to-window'
                                        }
                                    ]
                                },
                                requires: [
                                    'Ext.grid.feature.Grouping'
                                ],
                                // группы
                                store: componentsStore,
                                selModel: Ext.create('Ext.selection.RowModel', { mode: "SINGLE", ignoreRightMouseSelection: true }),
                                listeners: {
                                    beforeselect: function (_grid, record, index, eOpts) {
                                        var obj = this.getView().dragZone.groups;
                                        for (var field in obj) {
                                            this.getView().dragZone.removeFromGroup(field);
                                        }
//                                        this.getView().dragZone.addToGroup('sdfsdf');
//                                        this.getView().dragZone.addToGroup('grid-to-panel');
                                        this.getView().dragZone.addToGroup('grid-to-' + record.get('component').toLowerCase());
                                    }
                                },

//                            plugins: [
//                                {
//                                    ptype: 'rowexpander',
//                                    rowBodyTpl : new Ext.XTemplate(
//                                        '<p><b>Name:</b> {component}</p>',
//                                        '<p><b>Group:</b> {group}</p><br>',
//                                        '<p><b>Summary:</b> {desc}</p>'
//                                    )
//                                }
//                            ],
                                features: [
                                    {
                                        ftype: 'grouping',
                                        groupHeaderTpl: '{groupValue}',
                                        startCollapsed: false,
                                        id: 'componentsGrouping'
                                    }
                                ],
                                // колонки
                                infoIcon: 'Scripts/resources/icons/editor/info.png',
//                                whiteIcon: 'Scripts/resources/icons/editor/white.gif',
                                columns: [
                                    {
                                        width: 25,
                                        dataIndex: 'icon',
                                        align: 'left',
                                        renderer: renderIcon
                                    },
                                    {
                                        flex: 1,
                                        dataIndex: 'component',
                                        renderer: function (val) {
                                            return '<span style="vertical-align: bottom;">' + val + '</span>';
                                        }
                                    },
                                    {
                                        width: 30,
                                        dataIndex: 'infoIcon',
                                        align: 'center',
                                        renderer: function (value, metaData, record, row, col, store, gridView) {
                                            var grid = this;
                                            var name = '<b>Name:</b> ' + record.get('component') + '<br>';
                                            var group = '<b>Group:</b> ' + record.get('group') + '<br>';
                                            var desc = '<b>Descrition:</b> ' + record.get('desc') + '';
                                            metaData.tdAttr = 'data-qtip="' + name + group + desc + '"';
                                            return renderIcon(grid.infoIcon);
                                        }
                                    }
                                ]
//                            listeners: {
//                                selectionchange: function(view, record, item, index, e, options)
//                                {
//                                    var win = view.up('window');
//                                    var grid = win.down('gridpanel[name=components]');
//                                    var selection = grid.getSelectionModel().getSelection()[0];
//                                    if (selection) {
//                                        debugger;
//                                        grid.getPlugin('ddid').dragText = selection.get('icon') + ' ' + selection.get('component');
//                                    } else {
//                                        grid.getPlugin('ddid').dragText = '';
//                                    }
//                                }
//                                itemmouseenter: function(view, record, item, index, e, options)
//                                {
//                                    var win = view.up('window');
//                                    record.set('infoIcon', win.infoIcon);
//                                },
//                                itemmouseleave: function(view, record, item, index, e, options)
//                                {
//                                    var win = view.up('window');
//                                    record.set('infoIcon', win.whiteIcon);
//                                }
//                            }
                            }
//                            {
//                                xtype:'gridpanel',
//                                name:'components2',
//                                region:'east',
//                                split:true,
//                                hideHeaders:true,
//                                flex:1,
//
//                                // Драг и Дроп
//                                enableDragDrop:true,
//                                viewConfig:{
//                                    plugins:[
//                                        {
//                                            ptype:'gridviewdragdrop',
//                                            dragText:'{0}',
//                                            dragField:'component',
//                                            iconField:'icon',
//                                            enableDrop:false,
//                                            ddGroup:'grid-to-panel2'
//                                        }
//                                    ]
//                                },
//
//                                // группы
//                                store:componentsStore2,
//                                requires:[
//                                    'Ext.grid.feature.Grouping'
//                                ],
//                                features:[
//                                    {
//                                        ftype:'grouping',
//                                        groupHeaderTpl:'{groupValue}',
//                                        startCollapsed:false,
//                                        id:'componentsGrouping'
//                                    }
//                                ],
//                                // колонки
//                                infoIcon:'Scripts/resources/icons/editor/sencha/info.png',
//                                whiteIcon:'Scripts/resources/icons/editor/sencha/white.gif',
//                                columns:[
//                                    {
//                                        width:25,
//                                        dataIndex:'icon',
//                                        align:'left',
//                                        renderer:renderIcon
//                                    },
//                                    {
//                                        flex:1,
//                                        dataIndex:'component',
//                                        renderer:function (val) {
//                                            return '<span style="vertical-align: bottom;">' + val + '</span>';
//                                        }
//                                    },
//                                    {
//                                        width:30,
//                                        dataIndex:'infoIcon',
//                                        align:'center',
//                                        renderer:function (value, metaData, record, row, col, store, gridView) {
//                                            var grid = this;
//                                            var name = '<b>Name:</b> ' + record.get('component') + '<br>';
//                                            var group = '<b>Group:</b> ' + record.get('group') + '<br>';
//                                            var desc = '<b>Descrition:</b> ' + record.get('desc') + '';
//                                            metaData.tdAttr = 'data-qtip="' + name + group + desc + '"';
//                                            return renderIcon(grid.infoIcon);
//                                        }
//                                    }
//                                ]
//                            }
                        ]
                    },
//======================================================================================================================
//                                   Главная панель
//======================================================================================================================
                    {
                        xtype: 'form',
                        name: 'mainPanel',
                        region: 'center',
                        split: true,
                        autoScroll: true,
//                        layout:'anchor',
                        flex: 1,
                        listeners: {
                            render: function (form) {
                                var _this = this;
//                                _this.callParent(arguments);
//                                var form = this.down('form[name=mainPanel]');
                                var body = form.body;
                                var _win = form.up('window');
                                var gridComponents = _win.down('gridpanel[name=components]');

                                _this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
                                    ddGroup: 'grid-to-panel2',
                                    notifyEnter: function (ddSource, e, data) {
                                        //Add some flare to invite drop.
//                                        body.stopAnimation();
//                                        body.highlight();
                                    },
                                    notifyDrop: function (ddSource, e, data) {
                                        // new Store
                                        var store = deepCloneStore(ddSource.view.getStore());
                                        var selectedRecord = store.findRecord('component', ddSource.dragData.records[0].get('component'));
                                        var item;
                                        switch (selectedRecord.get('component')) {
                                            case 'Window':
                                                item = Ext.create('Ext.panel.Panel', {
//                                                  autoShow: true,
                                                    xtype: 'window',
                                                    name: 'sencha' + 'win',
                                                    form: form,
                                                    width: 500,
                                                    height: 300,
                                                    minWidth: 200,
                                                    minHeight: 200,
                                                    margin: 5,
                                                    resizable: true,
                                                    draggable: false,
                                                    constrain: true,
                                                    renderTo: body,
                                                    mainWindow: true,
                                                    closable: false,
                                                    collapsible: true,
                                                    record: selectedRecord,
                                                    title: 'My Window',
                                                    items: [
//                                {
//                                    xtype:'toolbar',
//                                    record:store.findRecord('component', 'toolbar'),
//                                    name:'sencha' + 'toolbar',
//                                    items:[
//                                        {
//                                            xtype:'button',
//                                            record:store.findRecord('component', 'button'),
//                                            border:true,
//                                            name:'sencha' + 'button'
//                                        }
//                                    ]
//                                },
//                                {
//                                    xtype:'fieldset',
//                                    record:store.findRecord('component', 'fieldset'),
//                                    anchor:'100%',
//                                    margin:5,
//                                    padding:2,
//                                    title:'Общие данные',
//                                    name:'sencha' + 'fs',
//                                    border:true,
//                                    items:[
//                                        {
//                                            xtype:'textfield',
//                                            record:store.findRecord('component', 'textfield'),
//                                            readOnly:true,
//                                            name:'sencha' + 'txt'
//                                        }
//                                    ]
//                                }
                                                    ],
                                                    tools: [
                                                        {
                                                            type: 'maximize',
                                                            tooltip: 'Развернуть',
                                                            handler: function () {
                                                                return false;
                                                            }
                                                        },
                                                        {
                                                            type: 'close',
                                                            tooltip: 'Закрыть',
                                                            handler: function () {
                                                                return false;
                                                            }
                                                        }
                                                    ],
                                                    listeners: {
                                                        afterrender: function (win) {
                                                            // отменить нажатие на кнопку "Свернуть"
                                                            win.tools['collapse-top'].hide();
                                                            var b = win.body || win;
                                                            b.on('mouseover', function () {
                                                                selectedRecord.set('name', win.name);
                                                                _win.mousedComponents.push(selectedRecord);
//                                                                 console.log(_win.mousedComponents);
                                                            });
                                                            b.on('mouseout', function () {
                                                                _win.mousedComponents.pop(selectedRecord);
                                                                if (_win.mousedComponents.length == 0){
//                                                                    FormGenerator.view.editor.Moused.setMoused(null);
                                                                }
//                                                                  console.log(_win.mousedComponents);
                                                            });
                                                        },
                                                        resize: function (win, width, height, eOpts) {
                                                            win.record.get('properties')['width'] = width;
                                                            win.record.get('properties')['height'] = height;
                        //                                    propertiesGrid.setSource(win.record.get('properties'));
                                                        },
                                                        render: function () {
//                                        var _this = this;
//                                        var form = _this.form;
//                                        var body = _this.body;
//                                        _this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
//                                            ddGroup:'grid-to-panel',
//                                            allowDrop:false,
//                                            notifyEnter:function (ddSource, e, data) {
//                                                //Add some flare to invite drop.
//                                                body.stopAnimation();
//                                                body.highlight();
//                                            },
//                                            notifyDrop:function (ddSource, e, data) {
////                                            if (this.allowDrop) {
//                                                var store = deepCloneStore(ddSource.view.getStore());
//                                                var selectedRecord = store.findRecord('component', ddSource.dragData.records[0].get('component'));
//                                                alert(selectedRecord.get('component'));
//                                                return true;
////                                            } else {
////                                                return false;
////                                            }
//                                            }
//                                        });
                                                            afterFirstLayout(this);
                                                        }
                                                    }
                                                });
                                                form.add(item.show());
                                                form.doLayout();
                                                form.fireEvent('ComponentAdded', form, item);
                                                _this.formPanelDropTarget.unreg();
                                                _this.formPanelDropTarget = null;
                                                break;
                                            default:
                                                return false;
                                                break;
                                        }
                                        return true;
                                    }
                                });
                                _this.formPanelDropTarget.addToGroup('grid-to-window');

                            }
                        }
                    }
                ]
            });

            me.callParent(arguments);
        }
    }
);