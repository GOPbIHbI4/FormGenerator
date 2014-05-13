Ext.define('FormGenerator.controller.editor.FormEditor', {
    extend:'Ext.app.Controller',

    views:[
        'FormGenerator.view.editor.FormEditor'
    ],

    models:[
        'FormGenerator.model.editor.FormEditor'
    ],

    stores:[
        'FormGenerator.store.editor.FormEditor'
    ],

    components:undefined,
    focusedCmp:undefined,

    init:function () {
        this.control({
            'FormEditor':{
                afterrender: this.onLoad
            },
            'FormEditor gridpanel[name=componentsGroups]':{
                selectionchange: this.onComponentGroupChange
            },
            'FormEditor gridpanel[name=components]':{
                selectionchange: this.onComponentsChange
            },
            'FormEditor textfield[name=filter]':{
                change: this.onContextSearch
            },
            'FormEditor textfield[name=propertyFilter]':{
                change: this.onContextPropertySearch
            },
            'FormEditor propertygrid[name=properties]':{
                propertychange: this.onProperyChange
            }
        });
    },

    //==================================================================================================================
    // Загрузка формы
    //==================================================================================================================
    onLoad:function(win){
        Ext.FocusManager.enable();
        var _this = this;
        var componentsGrid = win.down('gridpanel[name=components]');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var propertiesOwner = win.down('panel[name=propertiesOwner]');
        var form = win.down('form[name=mainPanel]');
        propertiesPanel.disable();
        this.components = componentsGrid.getStore().data.items;
        componentGroupGrid.getSelectionModel().select(componentGroupGrid.getStore().findRecord('group', 'Everything'));

        // Фокус элементов основной формы
        _this.focusedCmp = undefined;
        // rgb(153,188,232) - наша тема
        Ext.util.CSS.createStyleSheet('.z-focused-element { border-style:double ; border-width:1px; border-color: rgb(0,100,255); -webkit-box-shadow:0px 0px 30px 0px rgb(0,100,255); -moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);' +
            ' box-shadow:-moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);  }', 'z-focused-element');
        Ext.FocusManager.on('componentfocus', function(fm, cmp, previousCmp){
            if (cmp.name && cmp.name.substr(0, 6) == 'FormEditor') {
                if (_this.focusedCmp) {
                    _this.focusedCmp.removeCls('z-focused-element');
                }
                cmp.addCls('z-focused-element');
                _this.focusedCmp = cmp;
                if (propertiesPanel && propertiesPanel.disabled) propertiesPanel.enable();
                propertiesOwner.update('<span style="margin:3;position:absolute;">' + _this.renderIcon(cmp.record.get('icon')) + '&nbsp' +
                    cmp.record.get('component') + '&nbsp&nbsp' + '<i>' + cmp.record.get('path') + '</i>&nbsp' + '</span>');
                propertiesGrid.setSource(cmp.record.get('properties'));
                propertiesGrid.customEditors = cmp.record.get('sourceConfig');
            }
        });

        // onChangeForm
//        form.on('ComponentAdded', _this.onFormChanged);
    },

    /**
     * Change any property in propertygrid
     * @param source The source data object for the grid (corresponds to the same object passed in as the source config property).
     * @param recordId The record's id in the data store
     * @param value The current edited property value
     * @param oldValue The original property value prior to editing
     * @param eOpts The options object passed to Ext.util.Observable.addListener.
     */
    onProperyChange:function( source, recordId, value, oldValue, eOpts ){
        var focused = this.focusedCmp;
        focused.record.get('properties')[recordId] = value;
        switch(recordId){
            case 'title':
                focused.setTitle(value);
                break;
            case 'width':
                focused.setWidth(value);
                break;
            case 'height':
                focused.setHeight(value);
                break;
            case 'collapsible':
                if (value){
                    focused.tools['collapse-top'].show();
                } else {
                    focused.tools['collapse-top'].hide();
                }
                break;
            case 'animCollapse':
                focused.animCollapse = value;
                break;
            case 'collapseDirection':
                focused.collapseDirection = value;
                break;
            case 'closable':
                if (value){
                    focused.tools['close'].show();
                } else {
                    focused.tools['close'].hide();
                }
                break;
            case 'constrain':
                focused.constrain = value;
                break;
            case 'frame':
                focused.frame = value;
                break;
            case 'header':
                if (value) {
                    focused.getHeader().show();
                } else {
                    focused.getHeader().hide();
                }
                break;
            default:
                break;
        }
        focused.doLayout();
    },

    onFormChanged:function(form){
        var win = form.up('window');
        var tree = win.down('treepanel');
        tree.getStore().removeAll();
        tree.getStore().setRootNode({
            text:'View',
            name:'mainView',
            leaf:false,
            expanded:true,
            children:[]
        });

        add = function(item, parent){
            switch(item.xtype){
                case "window" :
                    item.record.text = renderIcon(item.record.get('icon')) + '&ndsp' + item.record.get('component');
                    item.record.expanded = true;
                    item.record.leaf = false;
                    var child = parent.appendChild(item.record);
                    for(var i = 0; i < item.items.items.length; i++){
                        add(item.items.items[i], child);
                    }
                    break;
                default:
                    break;
            }
        };
        if (form.items.items.length > 0) {
            add(form.items.items[0], tree.getStore().getRootNode());
        }
        tree.doLayout();
    },



    //==================================================================================================================
    // Изменение грида "Компоненты"
    //==================================================================================================================
    onComponentsChange:function(grid){
        var _this = this;
        var win = grid.view.up('window');
        var componentsGrid = win.down('gridpanel[name=components]');
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesOwner = win.down('panel[name=propertiesOwner]');
        var selected = componentsGrid.getSelectionModel().getSelection()[0];
//        if (isEmpty(selected)){
//            propertiesPanel.disable();
//            propertiesOwner.update('');
//        } else {
//            propertiesPanel.enable();
//            propertiesOwner.update('<span style="margin:3;position:absolute;">' + _this.renderIcon(selected.get('icon')) + '&nbsp' +
//                selected.get('component') + '&nbsp&nbsp' + '<i>' + selected.get('path') + '</i>&nbsp' + '</span>');
//        }
    },

    //==================================================================================================================
    // Изменение грида "Группы компонентов"
    //==================================================================================================================
    onComponentGroupChange:function(grid){
        var win = grid.view.up('window');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var componentsGrid = win.down('gridpanel[name=components]');
        var selectedGroup = componentGroupGrid.getSelectionModel().getSelection()[0];
        if (!Ext.isEmpty(selectedGroup) && selectedGroup.get('count') > 0) {
            if (selectedGroup.get('group') == 'Everything') {
                componentsGrid.getStore().loadData(this.components);
            } else {
                var array = [];
                this.components.forEach(function(item){
                    if (item.get('group') == selectedGroup.get('group')){
                        array.push(item);
                    }
                });
                componentsGrid.getStore().loadData(array, false);
            }
        } else {
            componentsGrid.getStore().loadData([], false);
        }
    },

    //==================================================================================================================
    // Контекстный поиск
    //==================================================================================================================
    onContextSearch:function (textfield) {
        var win = textfield.up('window');
        var componentsGrid = win.down('gridpanel[name=components]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();
        componentsGrid.getStore().filterBy(function (record) {
            var component = record.get('component').toUpperCase().trim();
            return pattern == '' || component.indexOf(pattern) >= 0;
        });
    },

    onContextPropertySearch:function (textfield) {
        var win = textfield.up('window');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();
        propertiesGrid.getStore().filterBy(function (record) {
            var component = record.get('name').toUpperCase().trim();
            return pattern == '' || component.indexOf(pattern) >= 0;
        });
    },

    //==================================================================================================================
    // Функция рендера изображения
    //==================================================================================================================
    renderIcon: function(val) {
        if (val) return '<img style="vertical-align: top" src="' + val + '">'; else return '';
    }
});
