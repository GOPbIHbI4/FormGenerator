Ext.define('FormGenerator.controller.editor.query.QuerySelect', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.query.QuerySelect'
    ],

    models: [
        'FormGenerator.model.editor.query.QueryFrom'
    ],

    stores: [
        'FormGenerator.store.editor.query.QueryFrom'
    ],

    init: function () {
        this.control({
            'QuerySelect': {
                afterrender: this.onLoad
            },
            'QuerySelect combobox[name=addDict]': {
                change: this.onChangeDictionary
            },
            'QuerySelect button[action=onSave]': {
                click: this.onSave
            },
            'QuerySelect button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var addDict = win.down('combobox[name=addDict]');
        var addField = win.down('combobox[name=addField]');
        win.body.mask('Загрузка...');
        addDict.getStore().loadData(win.dictionaries, false);
        win.body.unmask();
    },

    /**
     * При изменении какого-либо комбобокса с источником данных подгружать поля
     * @param combo Комбо, вызвавший событие
     */
    onChangeDictionary: function (combo) {
        var win = combo.up('window');
        var comboField = win.down('combobox[name=addField]');
        comboField.setValue(null);
        if (!combo.getValue()){
            comboField.getStore().loadData([], false);
        } else {
            win.body.mask('Загрузка...');
            comboField.getStore().load({
                params:{
                    dictionaryID:combo.getValue() + ''
                },
                callback:function(){
                    win.body.unmask();
                }
            });
        }
    },

    /**
     * Функция сохранения источника данных
     * @param btn Кнопка "Сохранить", вызвавшая событие
     */
    onSave:function(btn){
        var win = btn.up('window');
        var addDict = win.down('combobox[name=addDict]');
        var addField = win.down('combobox[name=addField]');
        var error = '';
        if (!addDict.getValue()){
            error = 'Выберите источник данных.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }
        if (!addField.getValue()){
            error = 'Выберите поле.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        // Сгененировать событие, сообщающее основной форме о том,
        // что источник данных готов к сохранению
        var newSelect = {
            table:{
                ID:addDict.getValue(),
                name:addDict.getRawValue(),
                tableName:addDict.findRecordByValue(addDict.getValue()).get('tableName'),
                field:{
                    ID:addField.getValue(),
                    name:addField.getRawValue(),
                    columnName:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('columnName') : null,
                    domainValueTypeID:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('domainValueTypeID') : null,
                    dictionaryID:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('dictionaryID') : null
                }
            }
        };
        win.fireEvent('QuerySelectIsReadyToSave', win, newSelect);
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('QuerySelect');
        if (win && win.close) {
            win.close();
        }
    }

});