//Ext.define('FormGenerator.controller.editor.Focused', {
//    singleton: true,
//    focusedCmp:undefined,
//    getFocusedCmp:function(){
//        return this.focusedCmp;
//    },
//    setFocusedCmp:function(cmp){
//        if (cmp) {
//            var _this = this;
//            _this.clearFocusedCmp();
//            _this.focusedCmp = cmp;
//            _this.focusedCmp.addCls('z-focused-element');
//        }
//    },
//    clearFocusedCmp:function(){
//        try {
//            if (this.focusedCmp) {
//                this.focusedCmp.removeCls('z-focused-element');
//            }
//        } catch (ex){
//            console.log('Deleted focusedCmp is empty. ' + ex + ' Focused component: ' + this.focusedCmp);
//        }
//        this.focusedCmp = null;
//    }
//});

Ext.define('FormGenerator.controller.editor.Test', {
    extend:'Ext.app.Controller',

    views:[
        'FormGenerator.view.editor.Test'
    ],

    models:[
        'FormGenerator.model.editor.FormEditor'
    ],

    stores:[
        'FormGenerator.store.editor.FormEditor'
    ],

    requires:[
        'FormGenerator.controller.editor.Focused'
    ],

    components:undefined,
//    focusedCmp:undefined,

    init:function () {
        this.control({
            'Test':{
                afterrender: this.onLoad
            }
        });
    },

    //==================================================================================================================
    // Загрузка формы
    //==================================================================================================================
    onLoad:function(win){
        Ext.FocusManager.enable();
        Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
        var _this = this;
        var componentsGrid = win.down('gridpanel[name=components]');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var propertiesOwner = win.down('panel[name=propertiesOwner]');
        var form = win.down('form[name=mainPanel]');
//        propertiesPanel.disable();
        this.components = componentsGrid.getStore().data.items;
//        componentGroupGrid.getSelectionModel().select(componentGroupGrid.getStore().findRecord('group', 'Everything'));

        // Фокус элементов основной формы
//        _this.focusedCmp = undefined;
        FormGenerator.controller.editor.Focused.clearFocusedCmp();
        // rgb(153,188,232) - наша тема
        Ext.util.CSS.createStyleSheet('.z-focused-element { border-style:double ; border-width:1px; border-color: rgb(0,100,255); -webkit-box-shadow:0px 0px 30px 0px rgb(0,100,255); -moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);' +
            ' box-shadow:-moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);  }', 'z-focused-element');
        Ext.FocusManager.on('componentfocus', function(fm, cmp, previousCmp){
            if (cmp.name && cmp.name.substr(0, 6) == 'sencha') {
                FormGenerator.controller.editor.Focused.setFocusedCmp(cmp);
//                if (propertiesPanel && propertiesPanel.disabled) propertiesPanel.enable();
//                propertiesOwner.update('<span style="margin:3;position:absolute;">' + _this.renderIcon(cmp.record.get('icon')) + '&nbsp' +
//                    cmp.record.get('component') + '&nbsp&nbsp' + '<i>' + cmp.record.get('path') + '</i>&nbsp' + '</span>');
//                propertiesGrid.setSource(cmp.record.get('properties'));
//                propertiesGrid.customEditors = cmp.record.get('sourceConfig');
            }
            if (cmp.componentCls.indexOf('fieldset-header') > -1 && cmp.up().xtype == 'fieldset'
                    && cmp.up().name.substr(0, 6) == 'sencha' ){
                FormGenerator.controller.editor.Focused.setFocusedCmp(cmp.up());
                //                if (propertiesPanel && propertiesPanel.disabled) propertiesPanel.enable();
//                propertiesOwner.update('<span style="margin:3;position:absolute;">' + _this.renderIcon(cmp.record.get('icon')) + '&nbsp' +
//                    cmp.record.get('component') + '&nbsp&nbsp' + '<i>' + cmp.record.get('path') + '</i>&nbsp' + '</span>');
//                propertiesGrid.setSource(cmp.record.get('properties'));
//                propertiesGrid.customEditors = cmp.record.get('sourceConfig');
            }

//            if (cmp.name && cmp.name.substr(0, 6) == 'sencha') {
//                if (_this.focusedCmp) {
//                    _this.focusedCmp.removeCls('z-focused-element');
//                }
//                cmp.addCls('z-focused-element');
//                _this.focusedCmp = cmp;
////                if (propertiesPanel && propertiesPanel.disabled) propertiesPanel.enable();
////                propertiesOwner.update('<span style="margin:3;position:absolute;">' + _this.renderIcon(cmp.record.get('icon')) + '&nbsp' +
////                    cmp.record.get('component') + '&nbsp&nbsp' + '<i>' + cmp.record.get('path') + '</i>&nbsp' + '</span>');
////                propertiesGrid.setSource(cmp.record.get('properties'));
////                propertiesGrid.customEditors = cmp.record.get('sourceConfig');
//            }
//            if (cmp.componentCls.indexOf('fieldset-header') > -1 && cmp.up().xtype == 'fieldset'
//                && cmp.up().name.substr(0, 6) == 'sencha' ){
//                if (_this.focusedCmp) {
//                    _this.focusedCmp.removeCls('z-focused-element');
//                }
//                cmp.up().addCls('z-focused-element');
//                _this.focusedCmp = cmp.up();
//                //                if (propertiesPanel && propertiesPanel.disabled) propertiesPanel.enable();
////                propertiesOwner.update('<span style="margin:3;position:absolute;">' + _this.renderIcon(cmp.record.get('icon')) + '&nbsp' +
////                    cmp.record.get('component') + '&nbsp&nbsp' + '<i>' + cmp.record.get('path') + '</i>&nbsp' + '</span>');
////                propertiesGrid.setSource(cmp.record.get('properties'));
////                propertiesGrid.customEditors = cmp.record.get('sourceConfig');
//            }
        });

        // onChangeForm
//        form.on('ComponentAdded', _this.onFormChanged);
    }
});
