Ext.define('FormGenerator.controller.editor.common.ComboForm', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.common.ComboForm'
    ],

    init: function () {
        this.control({
            'ComboForm': {
                afterrender: this.onLoad
            },
            'ComboForm button[action=onSave]': {
                click: this.onSave
            },
            'ComboForm button[action=onClose]': {
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
       if (win._title){
           win.setTitle(win._title);
       }
       if (win._label){
           combo.setFieldLabel(win._label);
       }
       if (win._data && win._data.length > 0){
           combo.getStore().loadData(win._data, false);
       } else {
           console.warn('Форме ComboForm передан пустой массив данных для комбобокса.');
       }
    },

    /**
     * Функция сохранения
     * @param btn Кнопка "Сохранить", вызвавшая событие
     */
    onSave:function(btn){
        var win = btn.up('window');
        var combo = win.down('combobox[name=combo]');
        if (!combo.getValue()){
            var error = 'Выберите значение.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        // Сгененировать событие, сообщающее основной форме о том,
        // что источник данных готов к сохранению
        win.fireEvent('ComboSaved', win, combo.getValue(), combo.getRawValue());
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('ComboForm');
        if (win && win.close) {
            win.close();
        }
    }

});