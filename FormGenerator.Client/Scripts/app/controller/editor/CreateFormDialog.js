Ext.define('FormGenerator.controller.editor.CreateFormDialog', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.CreateFormDialog'
    ],

    init: function () {
        this.control({
            'CreateFormDialog button[action=onCreate]': {
                click: this.onCreateForm
            },
            'CreateFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция открытия выбранной формы
     * @param btn Кнопка "Открыть", вызвавшая событие
     */
    onCreateForm:function(btn){
        var win = btn.up('window');
        var formName = win.down('textfield[name=formName]');
        if (!formName.getValue()){
            var error = 'Введите название новой формы.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            // Сгененировать событие, сообщающее основной форме о том,
            // что форма готова к созданию
            win.fireEvent('FormIsReadyToCreate', win, formName.getValue());
            this.onClose(btn);
        }
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('CreateFormDialog');
        if (win && win.close) {
            win.close();
        }
    }

});