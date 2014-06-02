Ext.define('FormGenerator.controller.editor.dialog.FormParametersExplorer', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.dialog.FormParametersExplorer'
    ],

    init: function () {
        this.control({
            'FormParametersExplorer': {
                afterrender: this.onLoad
            },
            'FormParametersExplorer button[action=onSave]': {
                click: this.onSave
            },
            'FormParametersExplorer button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
       var combo = win.down('combobox[name=combo]');
       var param = win.down('textfield[name=param]');
       if (win.data && win.data.length > 0){
           combo.getStore().loadData(win.data, false);
       }
    },

    /**
     * Функция сохранения
     * @param btn Кнопка "Сохранить", вызвавшая событие
     */
    onSave:function(btn){
        var win = btn.up('window');
        var combo = win.down('combobox[name=combo]');
        var param = win.down('textfield[name=param]');
        if (!param.getValue()){
            var error = 'Выберите параметр.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }
        if (!combo.getValue()){
            var error = 'Выберите значение.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        // Сгененировать событие, сообщающее основной форме о том,
        // что источник данных готов к сохранению
        win.fireEvent('ParamSaved', win, combo.getValue(), combo.getRawValue(), param.getValue());
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('FormParametersExplorer');
        if (win && win.close) {
            win.close();
        }
    }

});