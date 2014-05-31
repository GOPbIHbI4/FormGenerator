Ext.define('FormGenerator.controller.editor.dialog.OpenFormDialog', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.dialog.OpenFormDialog'
    ],

    models: [
        'FormGenerator.model.editor.dialog.OpenFormDialog'
    ],

    stores: [
        'FormGenerator.store.editor.dialog.OpenFormDialog'
    ],

    init: function () {
        this.control({
            'OpenFormDialog': {
                afterrender: this.onLoad
            },
            'OpenFormDialog combobox[name=form]': {
                select: this.onFormChange
            },
            'OpenFormDialog button[action=onOpen]': {
                click: this.onOpenForm
            },
            'OpenFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var form = win.down('combobox[name=form]');
        var dictionary = win.down('textfield[name=dictionary]');
        win.body.mask('Загрузка...');
        form.getStore().load({
            callback:function(){
                win.body.unmask();
            }
        });
    },

    /**
     * Функция открытия выбранной формы
     * @param btn Кнопка "Открыть", вызвавшая событие
     */
    onOpenForm:function(btn){
        var win = btn.up('window');
        var form = win.down('combobox[name=form]');
        if (!form.getValue()){
            var error = 'Выберите форму, которую Вы хотите отредактировать.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
//            console.error(error);
        } else {
            // Сгененировать событие, сообщающее основной форме о том,
            // что форма для открытия на редактирование выбрана
            win.fireEvent('FormIsReadyToOpen', win, form.getValue(), form.getRawValue(), win.dictionaryID);
            this.onClose(btn);
        }
    },

    /**
     * Функция, подгружающая словарь формы при изменении выбора формы
     * @param combo Комбобокс, вызвавший событие
     * @param records Массив записей, выбранных в комбобоксе
     */
    onFormChange:function(combo, records){
        var win = combo.up('window');
        var dictionary = win.down('textfield[name=dictionary]');
        if (!combo.getValue()){
            win.dictionaryID = null;
            dictionary.setValue(null);
        } else {
            dictionary.setValue(records[0].get('dictionary'));
            win.dictionaryID = records[0].get('dictionaryID');
        }
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('OpenFormDialog');
        if (win && win.close) {
            win.close();
        }
    }

});