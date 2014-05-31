Ext.define('FormGenerator.controller.editor.dialog.SaveFormDialog', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.dialog.SaveFormDialog'
    ],

    init: function () {
        this.control({
            'SaveFormDialog button[action=onSave]': {
                click: this.onSave
            },
            'SaveFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция открытия выбранной формы
     * @param btn Кнопка "Открыть", вызвавшая событие
     */
    onSave:function(btn){
        var win = btn.up('window');
        var form = win.down('textfield[name=formName]');
        if (!form.getValue()){
            var error = 'Введите название сохраняемой формы.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            win.body.mask('Сохранение...');
            // AJAX запрос на сохранение формы
            // Происходит проверка существования данного названия формы и сохранение формы
            Ext.Ajax.request({
                url: 'FormEditor/SaveForm',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                params: {
                    form_name:form.getValue()
                },
                success: function (objServerResponse) {
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    win.body.unmask();
                    if (jsonResp.resultCode == 0){
                        // Сгененировать событие, сообщающее основной форме о том,
                        // что форма сохранена (как элемент в целом) и можно сохранять все компоненты формы
                        win.fireEvent('FormIsReadyToSave', win, jsonResp.resultID, form.getValue());
                        this.onClose(btn);
                    } else {
                        FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                    }
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                }
            });
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
            dictionary.setValue(null);
        } else {
            dictionary.setValue(records[0].get('dictionary'));
        }
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('SaveFormDialog');
        if (win && win.close) {
            win.close();
        }
    }

});