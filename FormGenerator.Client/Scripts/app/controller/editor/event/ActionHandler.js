Ext.define('FormGenerator.controller.editor.event.ActionHandler', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.event.ActionHandler'
    ],

    models: [
        'FormGenerator.model.editor.event.ActionHandler'
    ],

    stores: [
        'FormGenerator.store.editor.event.ActionHandler'
    ],

    init: function () {
        this.control({
            'ActionHandler': {
                afterrender: this.onLoad
            },
            'ActionHandler button[action=onSave]': {
                click: this.onSave
            },
            'ActionHandler button[action=onEditParam]': {
                click: this.onEditParam
            },
            'ActionHandler combobox[name=handler]': {
                change: this.onChangeActionType
            },
            'ActionHandler button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var paramsGrid = win.down('gridpanel[name=paramsGrid]');
        var handler = win.down('combobox[name=handler]');
        win.body.mask('Загрузка...');
        handler.getStore().load({
            callback:function(){
                win.body.unmask();
            }
        });
    },

    /**
     * Функция подгрузки таблицы с параметрами при изменении типа действия
     * @param combo
     */
    onChangeActionType:function(combo){
        var win = combo.up('window');
        var paramsGrid = win.down('gridpanel[name=paramsGrid]');
        var handler = win.down('combobox[name=handler]');
        debugger;
        if (!handler.getValue()){
            paramsGrid.getStore().loadData([], false);
        } else {
            paramsGrid.getStore().load({
                params:{
                    ID:handler.getValue() + ''
                }
            });
        }
    },

    /**
     * Функция добавления параметра обработчика
     * @param btn Кнопка "Добавить"
     */
    onEditParam:function(btn){
        var win = btn.up('window');
        var paramsGrid = win.down('gridpanel[name=paramsGrid]');
        var handler = win.down('combobox[name=handler]');
        var selectedParam = paramsGrid.getSelectionModel().getSelection()[0];
        if (!selectedParam){
            FormGenerator.utils.MessageBox.show('Не выбран параметр.', null, -1);
            return;
        }
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
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.common.ComboForm');
        var comboForm = FormGenerator.utils.Windows.open('ComboForm', {
            _data: data,
            _label:'Компонент',
            _title:'Значение параметра'
        }, null, true);
        comboForm.on('ComboSaved', function (winDialog, comboValue, comboRawValue) {
            var sel = paramsGrid.getStore().findRecord('ID', selectedParam.get('ID'));
            sel.set('controlName', comboValue);
            sel.set('value', comboRawValue);
            sel.commit();
        });
    },

    /**
     * Функция сохранения
     */
    onSave:function (btn) {
        var win = btn.up('window');
        var paramsGrid = win.down('gridpanel[name=paramsGrid]');
        var handler = win.down('combobox[name=handler]');
        var error = '';
        if (!handler.getValue()){
            FormGenerator.utils.MessageBox.show('Выберите обработчик события', null, -1);
            return;
        }
        paramsGrid.getStore().data.items.forEach(function(item){
            if (!item.get('value')){
                error = 'Не все значения параметров заполнены.';
            }
        });
        // Если параметры не заполнены, ошибка
        if (error){
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        var actionID = FormGenerator.editor.Random.get();
        var params = [];
        paramsGrid.getStore().data.items.forEach(function(item){
            var newItem = {
                ID:undefined,
                actionID:actionID,
                actionInParamTypeID:item.get('ID'),
                controlID:undefined,
                controlName:item.get('controlName')
            };
            params.push(newItem);
        });

        var obj = {
            ID:actionID,
            orderNumber:undefined,
            eventID:undefined,
            actionTypeID:handler.getValue(),
            name:handler.getRawValue(),
            parameters:params
        };
        // Сгененировать событие, сообщающее основной форме о том,
        // что запрос сохранен
        win.fireEvent('ActionHandlerSaved', win, obj);
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('ActionHandler');
        if (win && win.close) {
            win.close();
        }
    }

});