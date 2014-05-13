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
                'Grids are composed of two main pieces - a Store full of data and a set of columns to render.'},
        {group:'Grid', component:'GridColumn', icon:'Scripts/resources/icons/editor/column.png', path:'Ext.grid.column.Column'},
        {group:'Panel', component:'TreePanel', icon:'Scripts/resources/icons/editor/tree.png', path:'Ext.tree.Panel'},
        {group:'Panel', component:'Panel', icon:'Scripts/resources/icons/editor/panel.png', path:'Ext.panel.Panel'},
        // window
        {group:'Panel', component:'Window', icon:'Scripts/resources/icons/editor/window.png', path:'Ext.window.Window',
            properties:{
                "animCollapse":true,
                "collapsible":false,
                "closable":true,
                "collapseDirection":'top',
                "constrain":true,
                "disabled":false,
                "draggable":true,
                "frame":true,
                "header":true,
                "hidden":false,
                "margin":'',
                "maxWidth":1000,
                "minWidth":200,
                "maxHeight":1000,
                "minHeight":200,
                "padding":'',
                "width":200,
                "height":100,
                "name":'sencha' + 'win',
                "title":'MyWindow'
            },
            sourceConfig:{
                collapseDirection: new Ext.form.field.ComboBox({
                    typeAhead: true,
                    store: [
                        ['top','top'],
                        ['bottom','bottom'],
                        ['Sun or Shade','Sun or Shade'],
                        ['left','left'],
                        ['right','right']
                    ]
                })
            }
        },

        {group:'Buttons', component:'Button', icon:'Scripts/resources/icons/editor/button.png', path:'Ext.button.Button',
            properties:{
                "Text":'OK',
                "Enabled":true,
                "Scale":'medium',
                "EnableToggle":true
            }
        },
        {group:'Fields', component:'Textfield', icon:'Scripts/resources/icons/editor/textfield.png', path:'Ext.form.field.Text',
            properties:{
                "Text":'',
                "AllowBlank":false,
                "FieldLabel":'Label',
                "LabelWidth":100
            }
        },
        {group:'Containers', component:'FieldSet', icon:'Scripts/resources/icons/editor/fieldset.png', path:'Ext.form.FieldSet',
            properties:{
                "Title":'MyFieldset',
                "Collapsible":false,
                "Layout":'anchor'
            }
        },
        {group:'Containers', component:'Toolbar', icon:'Scripts/resources/icons/editor/toolbar.png', path:'Ext.toolbar.Toolbar',
            properties:{
                "Name":'MyToolbar',
                "Dock":'bottom',
                "Layout":'anchor'
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
    model:'FormGenerator.model.editor.Components',
    autoLoad:false,
    root:{
        expanded:true,
        name:'root',
        children:[
            {
                text:'View',
                name:'mainView',
                expanded:true,
                children:[]
            }
        ]
    }
});