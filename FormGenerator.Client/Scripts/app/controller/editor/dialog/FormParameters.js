Ext.define('FormGenerator.controller.editor.dialog.FormParameters', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.dialog.FormParameters'
    ],

    stores: [
        'FormGenerator.store.editor.dialog.FormParameters'
    ],

    models: [
        'FormGenerator.model.editor.dialog.FormParameters'
    ],

    init: function () {
        this.control({
            'FormParameters': {
                afterrender: this.onLoad
            },
            'FormParameters button[action=onSave]': {
                click: this.onSave
            },
            'FormParameters button[action=onAddInParam]': {
                click: this.onAddInParam
            },
            'FormParameters button[action=onAddOutParam]': {
                click: this.onAddOutParam
            },
            'FormParameters button[action=onDeleteOutParam]': {
                click: this.onDeleteOutParam
            },
            'FormParameters button[action=onDeleteInParam]': {
                click: this.onDeleteInParam
            },
            'FormParameters button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция загрузки формы (afterrender)
     */
    onLoad:function(win){
        var inParamsGrid = win.down('gridpanel[name=inParamsGrid]');
        var outParamsGrid = win.down('gridpanel[name=outParamsGrid]');
        if (win.inParams){
            inParamsGrid.getStore().loadData(win.inParams, false);
        }
        if (win.outParams){
            outParamsGrid.getStore().loadData(win.outParams, false);
        }
    },

    onAddInParam:function(btn){
        var win = btn.up('window');
        var inParamsGrid = win.down('gridpanel[name=inParamsGrid]');
        var form = win.form;
        if (!form){
            FormGenerator.utils.MessageBox.show('Форме не был передан необходимый объект.', null, -1);
            return;
        }
        var objs = form.query('datefield, combobox, textfield');
        var data = [];
        objs.forEach(function(x){
            var name = x.record.get('properties')['name'];
            var xtype = x.record.get('properties')['xtype'];
            var label = x.record.get('properties')['fieldLabel'];
            var item = {
                ID: name,
                name: xtype + ' (label="' + label + '", name="' + name + '")'
            };
            data.push(item);
        });
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.dialog.FormParametersExplorer');
        var formParametersExplorer = FormGenerator.utils.Windows.open('FormParametersExplorer', {
            data:data
        }, null, true);
        formParametersExplorer.on('ParamSaved', function(winExplorer, combo, comboRaw, text){
            var obj = {
                name:text,
                controlName:combo,
                value:comboRaw
            };
            inParamsGrid.getStore().add(obj);
        });
    },

    onAddOutParam:function(btn){
        var win = btn.up('window');
        var outParamsGrid = win.down('gridpanel[name=outParamsGrid]');
        var form = win.form;
        if (!form){
            FormGenerator.utils.MessageBox.show('Форме не был передан необходимый объект.', null, -1);
            return;
        }
        var objs = form.query('datefield, combobox, textfield');
        var data = [];
        objs.forEach(function(x){
            var name = x.record.get('properties')['name'];
            var xtype = x.record.get('properties')['xtype'];
            var label = x.record.get('properties')['fieldLabel'];
            var item = {
                ID: name,
                name: xtype + ' (label="' + label + '", name="' + name + '")'
            };
            data.push(item);
        });
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.dialog.FormParametersExplorer');
        var formParametersExplorer = FormGenerator.utils.Windows.open('FormParametersExplorer', {
            data:data
        }, null, true);
        formParametersExplorer.on('ParamSaved', function(winExplorer, combo, comboRaw, text){
            var obj = {
                name:text,
                controlName:combo,
                value:comboRaw
            };
            outParamsGrid.getStore().add(obj);
        });
    },

    onDeleteOutParam:function(btn){
        var win = btn.up('window');
        var outParamsGrid = win.down('gridpanel[name=outParamsGrid]');
        var selected = outParamsGrid.getSelectionModel().getSelection()[0];
        if (!selected){
            FormGenerator.utils.MessageBox.show('Не выбран параметр', null, -1);
            return;
        } else {
            outParamsGrid.getStore().remove(selected);
        }
    },

    onDeleteInParam:function(btn){
        var win = btn.up('window');
        var inParamsGrid = win.down('gridpanel[name=inParamsGrid]');
        var selected = inParamsGrid.getSelectionModel().getSelection()[0];
        if (!selected){
            FormGenerator.utils.MessageBox.show('Не выбран параметр', null, -1);
            return;
        } else {
            inParamsGrid.getStore().remove(selected);
        }
    },

    /**
     * Функция сохранения
     * @param btn Кнопка "Открыть", вызвавшая событие
     */
    onSave:function(btn){
        var win = btn.up('window');
        var inParamsGrid = win.down('gridpanel[name=inParamsGrid]');
        var outParamsGrid = win.down('gridpanel[name=outParamsGrid]');
        var inParams = [];
        var outParams= [];
        inParamsGrid.getStore().data.items.forEach(function(item){
            inParams.push(item.data);
        });
        outParamsGrid.getStore().data.items.forEach(function(item){
            outParams.push(item.data);
        });
        // Сгененировать событие, сообщающее основной форме о том,
        // что параметры сохранены
        win.fireEvent('ParamsAreReadyToSave', win, inParams, outParams);
        this.onClose(btn);
    },

    /**
     * Функция закрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('FormParameters');
        if (win && win.close) {
            win.close();
        }
    }

});