Ext.define('FormGenerator.controller.editor.dialog.CreateFormDialog', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.dialog.CreateFormDialog'
    ],

    stores: [
        'FormGenerator.store.editor.query.QueryFrom'
    ],

    models: [
        'FormGenerator.model.editor.query.QueryFrom'
    ],

    init: function () {
        this.control({
            'CreateFormDialog': {
                afterrender: this.onLoad
            },
            'CreateFormDialog button[action=onCreate]': {
                click: this.onCreateForm
            },
            'CreateFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция загрузки формы (afterrender)
     */
    onLoad:function(win){
        var dictionary = win.down('combobox[name=dictionary]');
        win.body.mask('Загрузка...');
        dictionary.getStore().load({
            callback:function(){
                win.body.unmask();
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
        var dictionary = win.down('combobox[name=dictionary]');
        if (!formName.getValue()){
            var error = 'Введите название новой формы.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            // Сгененировать событие, сообщающее основной форме о том,
            // что форма готова к созданию
            win.fireEvent('FormIsReadyToCreate', win, formName.getValue(), dictionary.getValue());
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