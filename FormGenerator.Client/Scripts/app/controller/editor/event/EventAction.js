Ext.define('FormGenerator.controller.editor.event.EventAction', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.event.EventAction'
    ],

    models: [
        'FormGenerator.model.editor.event.EventAction'
    ],

    stores: [
        'FormGenerator.store.editor.event.EventAction'
    ],

    init: function () {
        this.control({
            'EventAction': {
                afterrender: this.onLoad
            },
            'EventAction button[action=onAddAction]': {
                click: this.onAddAction
            },
            'EventAction button[action=onDeleteAction]': {
                click: this.onDeleteAction
            },
            'EventAction button[action=onSave]': {
                click: this.onSave
            },
            'EventAction button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var actionGrid = win.down('gridpanel[name=actionGrid]');
        var btnSave = win.down('button[action=onSave]');
        var btnDel = win.down('button[action=onDeleteAction]');
        var btnAdd = win.down('button[action=onAddAction]');
        if (win.isShowOnly){
            btnSave.disable();
            btnDel.disable();
            btnAdd.disable();
        }
        if (win.actions) {
            actionGrid.getStore().loadData(win.actions, false);
        }
    },

    /**
     * Функция сохранения обработчика события
     * @param btn Кнопка "Сохранить"
     */
    onSave: function (btn) {
        var win = btn.up('window');
        var actionGrid = win.down('gridpanel[name=actionGrid]');
        if (actionGrid.getStore().getCount() == 0){
            FormGenerator.utils.MessageBox.show('Задайте хотя бы одно действие событию.', null, -1);
            return;
        }
        var obj = [];
        actionGrid.getStore().data.items.forEach(function(item){
            var newObj = {
                ID:item.get('ID'),
                orderNumber:actionGrid.getStore().getCount() + 1,
                eventID:item.get('eventID'),
                actionTypeID:item.get('actionTypeID'),
                name:item.get('name'),
                parameters:item.get('parameters')
            };
            obj.push(newObj);
        });
        win.fireEvent('EventActionIsReadyToSave', win, obj);
        this.onClose(btn);
    },

    /**
     * Функция добавления обработчика события
     * @param btn Кнопка "Добавить"
     */
    onAddAction: function (btn) {
        var win = btn.up('window');
        var actionGrid = win.down('gridpanel[name=actionGrid]');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.event.ActionHandler');
        var actionHandler = FormGenerator.utils.Windows.open('ActionHandler', {
            params:undefined,
            form:win.form
        }, null, true);
        actionHandler.on('ActionHandlerSaved', function (winDialog, obj) {
//            var obj = {
//                ID:actionID, // не реальный
//                orderNumber:undefined,
//                actionTypeID:handler.getValue(),
//                eventID:undefined,
//                parameters:params
//            };
            actionGrid.getStore().add(obj);
        });
    },

    /**
     * Функция удаления обработчика события
     * @param btn Кнопка "Удалить"
     */
    onDeleteAction: function (btn) {
        var win = btn.up('window');
        var actionGrid = win.down('gridpanel[name=actionGrid]');
        var selected = actionGrid.getSelectionModel().getSelection()[0];
        if (!selected){
            FormGenerator.utils.MessageBox.show('Не выбрано действие.', null, -1);
        } else {
            var record = actionGrid.getStore().findRecord('ID', selected.get('ID'));
            if (record) actionGrid.getStore().remove(record);
        }
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('EventAction');
        if (win && win.close) {
            win.close();
        }
    }

});