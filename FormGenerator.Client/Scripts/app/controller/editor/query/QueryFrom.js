Ext.define('FormGenerator.controller.editor.query.QueryFrom', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.query.QueryFrom'
    ],

    models: [
        'FormGenerator.model.editor.query.QueryFrom'
    ],

    stores: [
        'FormGenerator.store.editor.query.QueryFrom'
    ],

    init: function () {
        this.control({
            'QueryFrom': {
                afterrender: this.onLoad
            },
            'QueryFrom combobox[name=addDict], combobox[name=allDict]': {
                change: this.onChangeDictionary
            },
            'QueryFrom button[action=onSave]': {
                click: this.onSave
            },
            'QueryFrom button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var fsDataBinding = win.down('fieldset[name=fsDataBinding]');
        var addDict = win.down('combobox[name=addDict]');
        var allDict = win.down('combobox[name=allDict]');
        var addField = win.down('combobox[name=addField]');
        var allField = win.down('combobox[name=allField]');
        var fl1 = false, fl2 = false;
        var isNew = win.dictionaries == null || win.dictionaries.length == 0;
        win.body.mask('Загрузка...');
        // Новый источник данных
        addDict.getStore().load({
            callback:function(){
                fl1 = true;
                if (fl1 && fl2){
                    win.body.unmask();
                }
            }
        });
        if (isNew){
            fsDataBinding.setDisabled(true);
            addField.setDisabled(true);
        } else {
            // Источник данных для привязки
            allDict.getStore().loadData(win.dictionaries, false);
        }
        fl2 = true;
        if (fl1 && fl2){
            win.body.unmask();
        }
    },

    /**
     * При изменении какого-либо комбобокса с источником данных подгружать поля
     * @param combo Комбо, вызвавший событие
     */
    onChangeDictionary: function (combo) {
        var win = combo.up('window');
        var fs = combo.up('fieldset');
        var comboField = fs.query('combobox')[1];
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
        var allDict = win.down('combobox[name=allDict]');
        var addField = win.down('combobox[name=addField]');
        var allField = win.down('combobox[name=allField]');
        var error = '';
        var isNew = win.dictionaries == null || win.dictionaries.length == 0;
        if (!isNew){
            if (!allField.getValue() || !addField.getValue()){
                error = 'Привяжите новый источник данных к старому по какому-либо полю.';
                FormGenerator.utils.MessageBox.show(error, null, -1);
                return;
            }
        }
        if (!addDict.getValue()){
            error = 'Выберите новый источник данных.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        // Сгененировать событие, сообщающее основной форме о том,
        // что источник данных готов к сохранению
        var newFrom = {
            table:{
                ID:addDict.getValue(),
                name:addDict.getRawValue(),
                tableName:addDict.findRecordByValue(addDict.getValue()).get('tableName'),
                field:{
                    ID:addField.getValue(),
                    name:addField.getRawValue(),
                    columnName:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('columnName') : null,
                    dictionaryID:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('dictionaryID') : null
                }
            },
            anotherTable:{
                ID:allDict.getValue(),
                name:allDict.getRawValue(),
                tableName:allDict.getValue() ? allDict.findRecordByValue(allDict.getValue()).get('tableName') : null,
                field:{
                    ID:allField.getValue(),
                    name:allField.getRawValue(),
                    columnName:allField.getValue() ? allField.findRecordByValue(allField.getValue()).get('columnName') : null,
                    dictionaryID:allField.getValue() ? allField.findRecordByValue(allField.getValue()).get('dictionaryID') : null
                }
            }
        };
        win.fireEvent('QueryFromIsReadyToSave', win, newFrom);
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('QueryFrom');
        if (win && win.close) {
            win.close();
        }
    }

});