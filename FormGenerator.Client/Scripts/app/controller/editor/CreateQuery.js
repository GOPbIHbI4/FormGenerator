Ext.define('FormGenerator.controller.editor.CreateQuery', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.CreateQuery'
    ],

    init: function () {
        this.control({
            'CreateQuery': {
                afterrender: this.onLoad
            },
            'CreateQuery button[action=onSave]': {
                click: this.onSaveQuery
            },
            'CreateQuery button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {

    },

    /**
     * Функция сохранения запроса
     * @param btn Кнопка "Сохранить", вызвавшая событие
     */
    onSaveQuery:function(btn){
        var win = btn.up('window');
        var query = win.down('textareafield[name=query]');
        if (!query.getValue()){
            var error = 'Введите запрос.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            win.body.mask('Сохранение...');
            // AJAX запрос на сохранение запроса
            Ext.Ajax.request({
                url: 'FormEditor/SaveQuery',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                jsonData: {
                    query:query.getValue()
                },
                success: function (objServerResponse) {
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    win.body.unmask();
                    if (jsonResp.resultCode == 0){
                        // Сгененировать событие, сообщающее основной форме о том,
                        // что запрос сохранен
                        win.fireEvent('QuerySaved', win, jsonResp.resultID, query.getValue());
                        this.onClose(btn);
                    } else {
                        FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
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
        var win = btn.up('CreateQuery');
        if (win && win.close) {
            win.close();
        }
    }

});