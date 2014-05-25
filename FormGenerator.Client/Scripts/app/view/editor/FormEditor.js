Ext.override(Ext.resizer.Resizer, {
    transparent: true
});

Ext.override(Ext.view.DragZone, {
    getDragText:function () {
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
    onViewRender:function (view) {
        var me = this;

        if (me.enableDrag) {
            me.dragZone = Ext.create('Ext.view.DragZone', {
                view:view,
                ddGroup:me.dragGroup || me.ddGroup,
                dragText:me.dragText,
                dragField:me.dragField,
                iconField:me.iconField
            });
            view.dragZone = me.dragZone;
        }

        if (me.enableDrop) {
            me.dropZone = Ext.create('Ext.grid.ViewDropZone', {
                view:view,
                ddGroup:me.dropGroup || me.ddGroup
            });
            view.dragZone = me.dropZone;
        }
    }
});

//Ext.define('My.App.Overrides', {}, function () {
//    Ext.require([
//        'Ext.window.Window'
//    ], function () {
//        Ext.window.Window.override({
//            initDraggable: function () {
//                this.callOverridden(arguments);
//                Ext.Window.prototype.floating = { shadow: false };
//                this.dd.on('drag', function () {
//                    this.ghostPanel.setZIndex(Ext.WindowManager.getActive().getEl().dom.style.zIndex);
//                }, this);
//            }
//        });
//    });
//});

Ext.define('FormGenerator.view.editor.FormEditor', {
    extend:'Ext.window.Window',
    alias:'widget.FormEditor',
    name:'FormEditor',
    id:'winFormEditor',

    modal:true,
    constrain:true,

    height:700,
    width:1200,
    minHeight:700,
    minWidth:1200,

    mousedComponents: [],
    form_id:undefined,
    form_name:undefined,

    layout:{
        type:'border'
    },

    requires:[
        'Scripts.app.utils.ux.ClearButton'
    ],

    initComponent:function () {
        var me = this;

        var componentsStore = Ext.create('FormGenerator.store.editor.Components');
        var groupsStore = Ext.create('FormGenerator.store.editor.Groups');
        var treeStore = Ext.create('FormGenerator.store.editor.TreeStore');

        Ext.applyIf(me, {

            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Открыть',
                            action: 'onOpen',
                            border: true,
                            icon: 'Scripts/resources/icons/open3.png',
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
                        },
                        {
                            xtype: 'tbseparator'
                        },
//                        {
//                            xtype: 'button',
//                            scale: 'medium',
//                            text: 'Настройки',
//                            action: 'onEdit',
//                            border: true,
//                            icon: 'Scripts/resources/icons/edit.png',
//                            iconAlign: 'top'
//                        },
//                        {
//                            xtype: 'tbseparator'
//                        },
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

            items:[
//======================================================================================================================
//                                               Компоненты
//======================================================================================================================
                {
                    xtype:'panel',
                    name:'componentsPanel',
                    title:'Компоненты',
                    region:'west',
                    collapsible:true,
                    collapsed:false,
                    split:true,
                    width:300,
                    layout:'border',
                    items:[
//------------------------------------------------Фильтр----------------------------------------------------------------
                        {
                            xtype:'panel',
                            padding:5,
                            region:'north',
                            layout:'fit',
                            items:[
                                {
                                    xtype:'textfield',
                                    name:'filter',
                                    emptyText:'Фильтр...',
                                    plugins:['clearbutton']
                                }
                            ]
                        },
//------------------------------------------------Группы компонентов----------------------------------------------------
                        {
                            xtype:'gridpanel',
                            name:'componentsGroups',
                            region:'west',
                            split:true,
                            width:110,
                            hideHeaders:true,

                            collapsible:true,
                            collapsed:false,
                            collapseMode:'mini',
                            animCollapse:true,
                            header:false,
                            hideCollapseTool:true,

                            store:groupsStore,
                            requires:[
                                'Ext.grid.feature.Grouping'
                            ],
                            features:[
                                {
                                    ftype:'grouping',
                                    groupHeaderTpl:'{groupValue}',
                                    startCollapsed:false,
                                    collapsible:false,
                                    id:'groupsGrouping'
                                }
                            ],

                            columns:[
                                {
                                    flex:1,
                                    dataIndex:'group'
                                }
//                                {
//                                    width:30,
//                                    align:'right',
//                                    dataIndex:'count'
//                                }
                            ]
                        },
//------------------------------------------------Компоненты------------------------------------------------------------
                        {
                            xtype:'gridpanel',
                            name:'components',
                            region:'center',
                            split:true,
                            hideHeaders:true,
                            flex:1,

                            // Драг и Дроп
                            enableDragDrop:true,
                            viewConfig:{
                                plugins:[
                                    {
                                        ptype:'gridviewdragdrop',
                                        dragText:'{0}',
                                        dragField:'component',
                                        iconField:'icon',
                                        enableDrop:false,
                                        ddGroup:'grid-to-window'
                                    }
                                ]
                            },

                            // выбор строки, изменение dragZone
                            store:componentsStore,
                            selModel: Ext.create('Ext.selection.RowModel', { mode: "SINGLE", ignoreRightMouseSelection: true }),
                            listeners: {
                                beforeselect: function (_grid, record, index, eOpts) {
                                    var obj = this.getView().dragZone.groups;
                                    for (var field in obj) {
                                        this.getView().dragZone.removeFromGroup(field);
                                    }
                                    this.getView().dragZone.addToGroup('grid-to-' + record.get('component').toLowerCase());
                                }
                            },

                            // группы
                            requires:[
                                'Ext.grid.feature.Grouping'
                            ],
                            features:[
                                {
                                    ftype:'grouping',
                                    groupHeaderTpl:'{groupValue}',
                                    startCollapsed:false,
                                    id:'componentsGrouping'
                                }
                            ],
                            // колонки
                            infoIcon:'Scripts/resources/icons/editor/info.png',
                            columns:[
                                {
                                    width:25,
                                    dataIndex:'icon',
                                    align:'left',
                                    renderer:renderIcon
                                },
                                {
                                    flex:1,
                                    dataIndex:'component',
                                    renderer:function (val) {
                                        return '<span style="vertical-align: bottom;">' + val + '</span>';
                                    }
                                },
                                {
                                    width:30,
                                    dataIndex:'infoIcon',
                                    align:'center',
                                    renderer:function (value, metaData, record, row, col, store, gridView) {
                                        var grid = this;
                                        var name = '<b>Name:</b> ' + record.get('component') + '<br>';
                                        var group = '<b>Group:</b> ' + record.get('group') + '<br>';
                                        var desc = '<b>Descrition:</b> ' + record.get('desc') + '';
                                        metaData.tdAttr = 'data-qtip="' + name + group + desc + '"';
                                        return renderIcon(grid.infoIcon);
                                    }
                                }
                            ]
                        }
                    ]
                },
//======================================================================================================================
//                                   Главная панель
//======================================================================================================================
                {
                    xtype:'form',
                    name:'mainContainer',
                    region:'center',
                    split:true,
                    flex:1,
                    layout:'anchor',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            defaults:{
                                style:{
                                    'border-color':'#9FC6F9'
                                }
                            },
                            items: [
                                {
                                    xtype:'button',
                                    scale: 'small',
                                    action: 'onLabel',
                                    text:'Сгенерированное JSON представление',
                                    hidden:true,
                                    readOnly:true,
                                    border:false
                                },
                                {
                                    xtype:'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'small',
                                    text: 'Дизайн',
                                    action: 'onDesign',
                                    enableToggle: true,
                                    toggleGroup:'DesignOrCode',
                                    border: true
                                },
                                {
                                    xtype: 'button',
                                    scale: 'small',
                                    text: 'Код',
                                    action: 'onCode',
                                    enableToggle: true,
                                    toggleGroup:'DesignOrCode',
                                    border: true
                                }
                            ]
                        }
                    ],
                    items:[
                        {
                            xtype:'form',
                            name:'mainPanel',
                            border:false,
                            anchor:'0 0',
                            autoScroll:true,
                            listeners: {
                                render: function (form) {
                                    var _this = this;
                                    var body = form.body;
                                    var win = form.up('window');
                                    var gridComponents = win.down('gridpanel[name=components]');
                                    var propertiesGrid = win.down('propertygrid[name=properties]');
                                    _this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
                                        ddGroup: 'grid-to-window',
                                        allowDrop: true,
                                        notifyOver:function(ddSource, e, data){
                                            var isOK = true; var target = null;
                                            var draggedCmp = ddSource.dragData.records[0];
                                            if (draggedCmp.get('component').toLowerCase() == 'window' && form.down('[name=senchawin]')){
                                                isOK = false;
                                            }
                                            if (isOK) {
                                                this.allowDrop = true;
                                                return Ext.baseCSSPrefix + 'dd-drop-ok';
                                            } else {
                                                this.allowDrop = false;
                                                return Ext.baseCSSPrefix + 'dd-drop-nodrop';
                                            }
                                        },
                                        notifyEnter: function (ddSource, e, data) {
                                            //Add some flare to invite drop.
//                                        body.stopAnimation();
//                                        body.highlight();
                                        },
                                        notifyDrop: function (ddSource, e, data) {
                                            if (!this.allowDrop) return false;
                                            var store = deepCloneStore(ddSource.view.getStore());
                                            var selectedRecord = store.findRecord('component', ddSource.dragData.records[0].get('component'));
                                            var item;
                                            switch (selectedRecord.get('component')) {
                                                case 'Window':
                                                    item = windowFactory(win, form, selectedRecord);
                                                    form.add(item.show());
                                                    form.doLayout();
                                                    form.fireEvent('ComponentAdded', form, form, item);
                                                    return true;
                                                default:
                                                    return false;
                                            }
                                        }
                                    });
                                } // end of render
                            } // end of listeners
                        },
                        {
                            xtype:'textareafield',
                            hidden:true,
                            readOnly:true,
                            border:false,
                            margin:'-3 0 -3 0',
                            fieldLabel:'',
                            grow:true,
                            name:'codeText',
                            anchor:'0 0'
                        }
                    ]
                },

//======================================================================================================================
//                                   Инспектор проекта
//======================================================================================================================
                {
                    xtype:'panel',
                    name:'projectPanel',
                    title:'Инспектор проекта',
                    region:'east',
                    layout:'border',
                    split:true,
                    width:270,
                    items:[
                        {
                            xtype:'treepanel',
                            name:'projectTree',
                            region:'center',
                            split:true,
                            useArrows: true,
                            flex:1,
                            rootVisible:true,
                            store:treeStore,
                            listeners: {
                                itemclick: function(tree, record, item, index, e, eOpts) {
                                    try {
                                        var name = record.get('id');
                                        var win = tree.up('window[name=FormEditor]');
                                        var form = win.down('form[name=mainPanel]');
                                        var element = form.query('component[name=' + name + ']')[0];
                                        if (element) {
                                            Ext.FocusManager.fireEvent('componentfocus', Ext.FocusManager, element);
                                        }
                                    } catch(ex) {
                                        console.log('Tree item click error. Element to focus :' + element + ' Error info: ' + ex);
                                    }
                                }
                            }

//                            // Drag and Drop
//                            viewConfig:{
//                                plugins:{
//                                    ddGroup:'grid-to-panel',
//                                    ptype:'treeviewdragdrop'
//                                },
//                                listeners:{
//                                    beforedrop:function (nodeEl, data) {
//                                        debugger;
//                                        var record = data.records[0];
//                                        if (record.store !== this.getStore()) {
//                                            // Record from the grid. Take a copy ourselves
//                                            // because the built-in copying messes it up.
//                                            var copy = {children: []};
//
//                                            record.fields.each(function(field) {
//                                                copy[field.name] = record.get(field.name);
//                                            });
//
//                                            data.records = [copy];
//                                        }
////                                        var selectedRecord = data.records[0];
////                                        OSO.utils.MessageBox.show('Dragged ' + selectedRecord.get('component'));
//                                        return true;
//                                    }
//                                }
//                            },

//                            listeners:{
//                                itemclick:function (tree, record, item, index, e, options) {
//
//                                }
//                            }
                        },
//------------------------------------------------Свойства--------------------------------------------------------------
                        {
                            xtype:'panel',
                            name:'propertiesPanel',
                            region:'south',
                            split:true,
                            frame:false,
                            height:350,
                            layout:'anchor',
                            items:[
//------------------------------------------------Фильтр----------------------------------------------------------------
                                {
                                    xtype:'panel',
                                    name:'propertiesOwner',
                                    anchor:'0',
                                    layout:'fit',
                                    minHeight:23,
                                    style:{
                                        background:'#dfe8f6'
                                    },
                                    bodyStyle:{
                                        'background-color':'#dfe8f6',
                                        'border-width':'0 0 1 0'
                                    }
                                },
                                {
                                    xtype:'panel',
                                    padding:5,
                                    anchor:'0',
                                    layout:'fit',
                                    style:{
                                        background:'#dfe8f6'
                                    },
                                    items:[
                                        {
                                            xtype:'textfield',
                                            name:'propertyFilter',
                                            emptyText:'Фильтр...',
                                            plugins:['clearbutton']
                                        }
                                    ]
                                },
//------------------------------------------------Сами свойства---------------------------------------------------------
                                {
                                    xtype:'propertygrid',
                                    name:'properties',
                                    flex:1,
                                    anchor:'0 -57',
                                    bodyStyle:{
                                        'border-width':'1 0 0 0'
                                    },
                                    source:{}
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