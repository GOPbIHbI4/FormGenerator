Ext.define('FormGenerator.controller.editor.RenameFormDialog', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.RenameFormDialog'
    ],

    init: function () {
        this.control({
            'RenameFormDialog': {
                afterrender: this.onLoad
            },
            'RenameFormDialog button[action=onRename]': {
                click: this.onRename
            },
            'RenameFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    onLoad:function(win){
        var formName = win.down('textfield[name=formName]');
        if (win.form_name){
            formName.setValue(win.form_name );
        }
    },

    /**
     * Функция открытия выбранной формы
     * @param btn Кнопка "Сохранить", вызвавшая событие
     */
    onRename:function(btn){
        var win = btn.up('window');
        var form = win.down('textfield[name=formName]');
        if (!form.getValue()){
            var error = 'Введите название формы.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            // если форма сохранена, поменять ее имя
            if (win.form_id) {
                win.body.mask('Сохранение...');
                // AJAX запрос на сохранение формы
                // Происходит проверка существования данного названия формы и сохранение формы
                Ext.Ajax.request({
                    url: 'FormEditor/RenameForm',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    params: {
                        form_id: win.form_id + '',
                        form_name: form.getValue()
                    },
                    success: function (objServerResponse) {
                        var jsonResp = Ext.decode(objServerResponse.responseText);
                        win.body.unmask();
                        if (jsonResp.resultCode == 0) {
                            // Сгененировать событие, сообщающее основной форме о том,
                            // что форма переименована успешно
                            win.fireEvent('FormIsReadyToRename', win, form.getValue());
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
            } else {
                win.fireEvent('FormIsReadyToRename', win, form.getValue());
                this.onClose(btn);
            }
        }
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('RenameFormDialog');
        if (win && win.close) {
            win.close();
        }
    }

});