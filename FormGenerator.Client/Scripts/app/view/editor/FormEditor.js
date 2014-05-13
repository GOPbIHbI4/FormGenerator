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
        }

        if (me.enableDrop) {
            me.dropZone = Ext.create('Ext.grid.ViewDropZone', {
                view:view,
                ddGroup:me.dropGroup || me.ddGroup
            });
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

Ext.define('FormGenerator.view.editor.FormEditor', {
    extend:'Ext.window.Window',
    alias:'widget.FormEditor',
    name:'FormEditor',
    id:'winFormEditor',

    modal:true,
    constrain:true,
    maximizable:true,

    height:800,
    width:1200,
    minHeight:800,
    minWidth:1200,

    layout:{
        type:'border'
    },

    requires:[
        'FormGenerator.utils.ClearButton'
    ],

    initComponent:function () {
        var me = this;

        var componentsStore = Ext.create('FormGenerator.store.editor.Components');
        var groupsStore = Ext.create('FormGenerator.store.editor.Groups');
        var treeStore = Ext.create('FormGenerator.store.editor.TreeStore');

        Ext.applyIf(me, {

            dockedItems:[
                {
                    xtype:'toolbar',
                    dock:'top',
                    items:[
                        {
                            xtype:'button',
                            scale:'medium',
                            text:'Сохранить',
                            action:'onSave',
                            border:true,
                            icon:'Scripts/ext/icons/save.png',
                            iconAlign:'top'
                        },
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'button',
                            scale:'medium',
                            text:'Настройки',
                            action:'onEdit',
                            border:true,
                            icon:'Scripts/ext/icons/Sencha/edit.png',
                            iconAlign:'top'
                        },
                        {
                            xtype:'tbseparator'
                        },
                        {
                            xtype:'button',
                            scale:'medium',
                            text:'Закрыть',
                            action:'onClose',
                            border:true,
                            icon:'Scripts/ext/icons/close.png',
                            iconAlign:'top'
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
                            width:100,
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
                                },
                                {
                                    width:30,
                                    align:'right',
                                    dataIndex:'count'
                                }
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
                                        ddGroup:'grid-to-panel'
                                    }
                                ]
                            },

                            // группы
                            store:componentsStore,
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
                            // колонки
                            infoIcon:'Scripts/ext/icons/sencha/info.png',
                            whiteIcon:'Scripts/ext/icons/sencha/white.gif',
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
                    ]
                },
//======================================================================================================================
//                                   Главная панель
//======================================================================================================================
                {
                    xtype:'form',
                    name:'mainPanel',
                    region:'center',
                    split:true,
                    autoScroll:true,
                    layout:'anchor',
                    flex:1
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
                    width:250,
                    items:[
                        {
                            xtype:'treepanel',
                            name:'projectTree',
                            region:'center',
                            split:true,
                            useArrows: true,
                            multiSelect: false,
                            singleExpand: false,
                            allowDeselect: true,
                            flex:1,
                            rootVisible:false,

                            // Drag and Drop
                            viewConfig:{
                                plugins:{
                                    ddGroup:'grid-to-panel',
                                    ptype:'treeviewdragdrop'
                                },
                                listeners:{
                                    beforedrop:function (nodeEl, data) {
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
                                        var selectedRecord = data.records[0];
                                        FormGenerator.utils.MessageBox.show('Dragged ' + selectedRecord.get('component'));
                                        return true;
                                    }
                                }
                            },

                            store:treeStore
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
                            height:300,
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
//                                    requires:[
//                                        'Ext.grid.feature.Grouping'
//                                    ],
//                                    features:[
//                                        {
//                                            ftype:'grouping',
//                                            groupHeaderTpl:'{group}',
//                                            startCollapsed:false,
//                                            collapsible:false,
//                                            id:'propertiesGrouping'
//                                        }
//                                    ],
                                    source:{
                                        "Created":Ext.Date.parse('10/15/2006', 'm/d/Y'),
                                        "Available":true,
                                        "Version":"sdfsdfsdfsdf",
                                        "Description":12
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    afterFirstLayout:function () {
        var _this = this;
        this.callParent(arguments);
        var form = this.down('form[name=mainPanel]');
        var body = form.body;
        var _win = form.up('window');
        var gridComponents = _win.down('gridpanel[name=components]');
        var propertiesGrid = _win.down('propertygrid[name=properties]');

        this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
            ddGroup:'grid-to-panel',
            notifyEnter:function (ddSource, e, data) {
                //Add some flare to invite drop.
                body.stopAnimation();
                body.highlight();
            },
            notifyDrop:function (ddSource, e, data) {
                // new Store
                var store = deepCloneStore(ddSource.view.getStore());
                var selectedRecord = store.findRecord('component', ddSource.dragData.records[0].get('component'));
                var item;
                switch (selectedRecord.get('component')) {
                    case 'Panel':

                        break;
                    case 'Window':
                        item = Ext.create('Ext.window.Window', {
                            autoShow:true,
                            name:'sencha' + 'win',
                            width:200,
                            height:200,
                            minWidth:200,
                            minHeight:200,
                            margin:5,
                            resizable:true,
                            draggable:true,
                            constrain:true,
                            renderTo:body,
                            mainWindow:true,
                            closable:true,
                            collapsible:true,
                            record:selectedRecord,
                            title:'My Window',
                            items:[
                                {
                                    xtype:'toolbar',
                                    record:store.findRecord('component', 'toolbar'),
                                    name:'sencha' + 'toolbar',
                                    items:[
                                        {
                                            xtype:'button',
                                            record:store.findRecord('component', 'button'),
                                            border:true,
                                            name:'sencha' + 'button'
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldset',
                                    record:store.findRecord('component', 'fieldset'),
                                    anchor:'100%',
                                    margin:5,
                                    padding:2,
                                    title:'Общие данные',
                                    name:'sencha' + 'fs',
                                    border:true,
                                    items:[
                                        {
                                            xtype:'textfield',
                                            record:store.findRecord('component', 'textfield'),
                                            readOnly:true,
                                            name:'sencha' + 'txt'
                                        }
                                    ]
                                }
                            ],
                            listeners:{
                                afterrender:function (win) {
//                                    // отменить нажатие на кнопку "Закрыть"
                                    win.tools.close.clearListeners();
                                    win.tools.close.clearManagedListeners();
                                    win.tools['collapse-top'].hide();
                                },
                                resize:function( win, width, height, eOpts ){
                                    win.record.get('properties')['width'] = width;
                                    win.record.get('properties')['height'] = height;
                                    propertiesGrid.setSource(win.record.get('properties'));
                                }
                            }
                        });
                        form.add(item);
                        form.doLayout();
                        _this.formPanelDropTarget.unreg();
                        _this.formPanelDropTarget = null;
                        form.fireEvent('ComponentAdded', form, item);
                        break;
                    default:
                        break;
                }
                return true;
            }
        });
    },

    beforeDestroy:function () {
        var target = this.formPanelDropTarget;
        if (target) {
            target.unreg();
            this.formPanelDropTarget = null;
        }
        this.callParent();
    }
});

/**
 * Функция для рендеринга изображения
 * @param val url изображения
 * @return {String} строка с тегом <img> дял рендеринга изображения
 */
function renderIcon(val) {
    if (val) return '<img style="vertical-align: middle" src="' + val + '">'; else return '';
}

/**
 * Deep clone store
 * @param source old Store
 * @return {*} new Store
 */
function deepCloneStore (source) {
    var target = Ext.create ('Ext.data.Store', {
        model: source.model
    });
    Ext.each (source.getRange (), function (record) {
        var newRecordData = Ext.clone (record.copy().data);
        var model = new source.model (newRecordData, newRecordData.id);
        target.add (model);
    });
    return target;
}