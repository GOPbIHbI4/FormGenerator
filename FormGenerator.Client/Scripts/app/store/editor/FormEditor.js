//-----------------------------------------------------------------------------------------
// Фиктивное хранилище
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.store.editor.FormEditor', {
    extend:'Ext.data.Store',
    fields:[]
});

//-----------------------------------------------------------------------------------------
// Хранилище для компонентов
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.store.editor.Components', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Components',
    groupField:'group',
    data:[
        {group:'Grid', component:'GridPanel', icon:'Scripts/resources/icons/editor/grid.png', path:'Ext.grid.Panel',
            desc:'Grids are an excellent way of showing large amounts of tabular data on the client side.' +
                ' Essentially a supercharged <table>, GridPanel makes it easy to fetch, sort and filter large amounts of data.' +
                'Grids are composed of two main pieces - a Store full of data and a set of columns to render.',
            childComponents:[
                'gridcolumn',
                'toolbar',
                'numbercolumn',
                'datecolumn'
            ],
            properties:{
                "anchor":'',
                "animCollapse":true,
                "autoScroll":false,
                "allowDeselect":false,
                "bodyPadding":'0 0 0 0',
                "collapsible":false,
                "columnLines":true,
                "constrain":true,
                "disabled":false,
                "disableSelection":false,
                "draggable":true,
                "enableColumnMove":false,
                "frame":true,
                "header":true,
                "hidden":false,
                "hideHeaders":false,
                "height":200,
                "margin":'5 5 5 5',
                "maxWidth":1000,
                "minWidth":100,
                "maxHeight":1000,
                "minHeight":100,
                "resizable":false,
                "rowLines":true,
                "title":'My Panel',
                "width":200
            }
        },
        {group:'Grid', component:'GridColumn', icon:'Scripts/resources/icons/editor/column.png', path:'Ext.grid.column.Column',
            childComponents:[],
            properties:{
                "align":'left',
                "dataIndex":'',
                "disabled":false,
                "draggable":true,
                "emptyCellText":'',
                "hideable":true,
                "hidden":false,
                "locked":false,
                "maxWidth":1000,
                "minWidth":100,
                "menuDisabled":false,
                "resizable":true,
                "sortable":true,
                "text":'My GridColumn',
                "flex":'',
                "width":200
            }
        },
        {group:'Grid', component:'DateColumn', icon:'Scripts/resources/icons/editor/datecolumn.png', path:'Ext.grid.column.Date',
            childComponents:[],
            properties:{
                "align":'center',
                "dataIndex":'',
                "disabled":false,
                "draggable":true,
                "emptyCellText":'',
                "format": 'd.m.Y',
                "flex":'',
                "hideable":true,
                "hidden":false,
                "locked":false,
                "maxWidth":1000,
                "minWidth":50,
                "menuDisabled":false,
                "resizable":false,
                "sortable":true,
                "text":'My DateColumn',
                "width":90
            }
        },
        {group:'Grid', component:'NumberColumn', icon:'Scripts/resources/icons/editor/numbercolumn.png', path:'Ext.grid.column.Number',
            childComponents:[],
            properties:{
                "align":'right',
                "dataIndex":'',
                "disabled":false,
                "draggable":true,
                "emptyCellText":'',
                "format": '0.00',
                "flex":'',
                "hideable":true,
                "hidden":false,
                "locked":false,
                "maxWidth":1000,
                "minWidth":50,
                "menuDisabled":false,
                "resizable":true,
                "sortable":true,
                "text":'My NumberColumn',
                "width":100
            }
        },

        {group:'Panel', component:'Panel', icon:'Scripts/resources/icons/editor/panel.png', path:'Ext.panel.Panel',
            childComponents:[
                'fieldset',
                'panel'
            ],
            properties:{
                "anchor":'',
                "animCollapse":true,
                "autoScroll":false,
                "bodyPadding":'0 0 0 0',
                "collapsible":false,
                "closable":false,
                "constrain":true,
                "disabled":false,
                "draggable":true,
                "frame":true,
                "header":true,
                "hidden":false,
                "height":200,
                "margin":'5 5 5 5',
                "maxWidth":1000,
                "minWidth":100,
                "maxHeight":1000,
                "minHeight":100,
                "maximizable":false,
                "minimizable":false,
                "resizable":true,
                "title":'My Panel',
                "width":200
            }
        },

        {group:'Panel', component:'TabPanel', icon:'Scripts/resources/icons/editor/tabpanel.png', path:'Ext.tab.Panel',
            childComponents:[
                'newtab'
            ],
            properties:{
                "activeTab":0,
                "anchor":'',
                "autoScroll":false,
                "animCollapse":true,
                "bodyPadding":'0 0 0 0',
                "collapsible":false,
                "constrain":true,
                "disabled":false,
                "draggable":true,
                "frame":true,
                "header":true,
                "hidden":false,
                "height":200,
                "margin":'5 5 5 5',
                "maxWidth":1000,
                "minWidth":100,
                "maxHeight":1000,
                "minHeight":100,
                "resizable":true,
                "title":'My Panel',
                "width":200
            }
        },
        {group:'Panel', component:'NewTab', icon:'Scripts/resources/icons/editor/tab.png', path:'Ext.panel.Panel',
            childComponents:[

            ],
            properties:{
                "autoScroll":false,
                "bodyPadding":'0 0 0 0',
                "closable":true,
                "constrain":true,
                "disabled":false,
                "frame":true,
                "hidden":false,
                "margin":'0 0 0 0',
                "title":'My TabPanel'
            }
        },

        // window
        {group:'Panel', component:'Window', icon:'Scripts/resources/icons/editor/window.png', path:'Ext.window.Window',
            childComponents:[
                'fieldset',
                'textfield',
                'datefield',
                'numberfield',
                'combobox',
                'button',
                'container',
                'toolbar',
                'gridpanel',
                'tabpanel',
                'panel'
            ],
            properties:{
                "animCollapse":true,
                "autoScroll":false,
                "bodyPadding":'0 0 0 0',
                "collapsible":false,
                "closable":true,
                "constrain":true,
                "disabled":false,
                "draggable":true,
                "frame":true,
                "header":true,
                "hidden":false,
                "height":300,
                "margin":'5 5 5 5',
                "maxWidth":1000,
                "minWidth":200,
                "maxHeight":1000,
                "minHeight":200,
                "maximizable":true,
                "minimizable":true,
                "modal":true,
                "name":'',
                "resizable":true,
                "title":'My Window',
                "width":500,
                "xtype":'window'
            },
            sourceConfig:{
//                collapseDirection: new Ext.form.field.ComboBox({
//                    typeAhead: true,
//                    store: [
//                        ['top','top'],
//                        ['bottom','bottom'],
//                        ['left','left'],
//                        ['right','right']
//                    ]
//                }),
                name: new Ext.form.TextField({readOnly :true }),
                xtype: new Ext.form.TextField({readOnly :true })
            }
        },

        //===============================Fields==============================
        {group:'Fields', component:'Textfield', icon:'Scripts/resources/icons/editor/textfield.png', path:'Ext.form.field.Text',
            childComponents:[],
            properties:{
                "anchor":'',
                "allowBlank":true,
                "blankText":'Данное поле обязательно к заполнению',
                "disabled":false,
                "emptyText":'',
                "fieldLabel":'My TextField',
                "flex":'',
                "hidden":false,
                "invalidText":'Значение поля некорректно',
                "labelSeparator":':',
                "labelWidth":100,
                "margin":'5 5 0 5',
                "maskRe":'',
                "maxWidth":1000,
                "minWidth":100,
                "readOnly":false,
                "value":'',
                "width":200
            }
        },
        {group:'Fields', component:'Datefield', icon:'Scripts/resources/icons/editor/datefield.png', path:'Ext.form.field.Date',
            childComponents:[],
            properties:{
                "anchor":'',
                "allowBlank":true,
                "blankText":'Данное поле обязательно к заполнению',
                "disabled":false,
                "emptyText":'',
                "fieldLabel":'MyDateField',
                "format":'d.m.Y',
                "flex":'',
                "hidden":false,
                "invalidText":'Значение поля некорректно',
                "labelSeparator":':',
                "labelWidth":100,
                "margin":'5 5 0 5',
                "maskRe":'',
                "maxWidth":1000,
                "minWidth":95,
                "minValue":new Date(1990, 0, 1),
                "maxValue":new Date(4000, 0, 1),
                "minText":'Значение поля должно быть больше или равно {0}',
                "maxText":'Значение поля должно быть меньше или равно {0}',
                "readOnly":false,
                "value":'',
                "width":95
            }
        },
        {group:'Fields', component:'Numberfield', icon:'Scripts/resources/icons/editor/numberfield.png', path:'Ext.form.field.Date',
            childComponents:[],
            properties:{
                "anchor":'',
                "allowDecimals":false,
                "allowExponential":false,
                "allowBlank":true,
                "blankText":'Данное поле обязательно к заполнению',
                "disabled":false,
                "decimalPrecision":2,
                "emptyText":'',
                "fieldLabel":'My NumberField',
                "format":'0.00',
                "flex":'',
                "hidden":false,
                "invalidText":'Значение поля некорректно',
                "labelSeparator":':',
                "labelWidth":100,
                "margin":'5 5 0 5',
                "maskRe":'',
                "maxWidth":1000,
                "minWidth":95,
                "minValue":Number.NEGATIVE_INFINITY,
                "maxValue":Number.MAX_VALUE,
                "minText":'Значение поля должно быть больше или равно {0}',
                "maxText":'Значение поля должно быть меньше или равно {0}',
                "mouseWheelEnabled":true,
                "nanText":'Значение поля некорректно',
                "step":1,
                "readOnly":false,
                "value":'',
                "width":95
            }
        },
        {group:'Fields', component:'Combobox', icon:'Scripts/resources/icons/editor/combobox.png', path:'Ext.form.field.ComboBox',
            childComponents:[],
            properties:{
                "anchor":'',
                "allowBlank":true,
                "blankText":'Данное поле обязательно к заполнению',
                "caseSensitive":false,
                "disabled":false,
                "displayField":'text',
                "emptyText":'',
                "editable":false,
                "fieldLabel":'My NumberField',
                "flex":'',
                "hidden":false,
                "invalidText":'Значение поля некорректно',
                "labelSeparator":':',
                "labelWidth":100,
                "margin":'5 5 0 5',
                "maskRe":'',
                "maxWidth":1000,
                "minWidth":100,
                "multiSelect":false,
                "queryMode":'local',
                "readOnly":false,
                "value":'',
                "valueField":'value',
                "width":300
            }
        },

        //==============================Containers===========================
        {group:'Containers', component:'FieldSet', icon:'Scripts/resources/icons/editor/fieldset.png', path:'Ext.form.FieldSet',
            childComponents:[
                'fieldset',
                'textfield',
                'panel'
            ],
            properties:{
                "anchor":'',
                "constrain":false,
                "collapsible":false,
                "disabled":false,
                "hidden":false,
                "height":50,
                "margin":'5 5 5 5',
                "maxWidth":1000,
                "minWidth":20,
                "maxHeight":1000,
                "minHeight":20,
                "padding":'2 2 2 2',
                "title":'My FieldSet',
                "width":50
            }
        },

        {group:'Containers', component:'Container', icon:'Scripts/resources/icons/editor/container.png', path:'Ext.container.Container',
            childComponents:[
                'fieldset',
                'textfield',
                'panel'
            ],
            properties:{
                "anchor":'',
                "constrain":false,
                "disabled":false,
                "hidden":false,
                "height":50,
                "margin":'5 5 5 5',
                "maxWidth":1000,
                "minWidth":20,
                "maxHeight":1000,
                "minHeight":20,
                "padding":'2 2 2 2',
                "width":50
            }
        },
        {group:'Containers', component:'Toolbar', icon:'Scripts/resources/icons/editor/toolbar.png', path:'Ext.toolbar.Toolbar',
            childComponents:[
                'textfield',
                'datefield',
                'button'
            ],
            properties:{
                "dock":'right',
                "disabled":false,
                "hidden":false,
                "height":50,
                "margin":'0 0 0 0',
                "maxWidth":1000,
                "minWidth":20,
                "maxHeight":1000,
                "minHeight":20,
                "padding":'2 2 2 2',
                "width":50
            }
        },

        {group:'Buttons', component:'Button', icon:'Scripts/resources/icons/editor/button.png', path:'Ext.button.Button',
            properties:{
                "disabled":false,
                "hidden":false,
                "height":50,
                "icon":'',
                "margin":'5 5 5 5',
                "maxWidth":1000,
                "minWidth":20,
                "maxHeight":1000,
                "minHeight":20,
                "padding":'2 2 2 2',
                "scale":'small',
                "text":'My Button',
                "tooltip":'My Button',
                "width":50
            }
        }
    ]
});

//-----------------------------------------------------------------------------------------
// Хранилище для групп компонентов
//-----------------------------------------------------------------------------------------
Ext.define('FormGenerator.store.editor.Groups', {
    extend:'Ext.data.Store',
    model:'FormGenerator.model.editor.Groups',
    groupField:'type',
    data:[
        {group:'Everything', count:8, type:'Default'},
        {group:'Grid', count:3, type:'Default'},
        {group:'Panel', count:5, type:'Default'},
        {group:'Fields', count:1, type:'Default'},
        {group:'Containers', count:1, type:'Default'},
        {group:'Buttons', count:1, type:'Default'},
        {group:'New', count:-1, type:'Custom'}
    ]
});


Ext.define('FormGenerator.store.editor.TreeStore', {
    extend:'Ext.data.TreeStore',
    autoLoad:false,
    root:{
        expanded:true,
        name:'root',
        id:'root',
        text:'View',
        icon:'Scripts/resources/icons/editor/w.png',
        children:[]
    }
});