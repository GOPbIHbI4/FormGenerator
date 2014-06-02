Ext.define('FormGenerator.controller.editor.query.QueryWhere', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.query.QueryWhere'
    ],

    models: [
        'FormGenerator.model.editor.query.QueryFrom'
    ],

    stores: [
        'FormGenerator.store.editor.query.QueryFrom'
    ],

    init: function () {
        this.control({
            'QueryWhere': {
                afterrender: this.onLoad
            },
            'QueryWhere combobox[name=addDict], combobox[name=allDict]': {
                change: this.onChangeDictionary
            },
            'QueryWhere combobox[name=cond]': {
                change: this.onChangeCondition
            },
            'QueryWhere radiofield[name=data]':{
                change:this.onChangeRadioData
            },
            'QueryWhere button[action=onSave]': {
                click: this.onSave
            },
            'QueryWhere button[action=onClose]': {
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
        var allDict = win.down('combobox[name=allDict]');
        var addField = win.down('combobox[name=addField]');
        var allField = win.down('combobox[name=allField]');
        var radio = win.down('radiogroup[name=rbData]');
        var value = win.down('textfield[name=value]');
        var condition = win.down('combobox[name=cond]');
        radio.setValue({'data':1});
        if (win.dictionaries && win.dictionaries.length > 0) {
            win.body.mask('Загрузка...');
            allDict.getStore().loadData(win.dictionaries, false);
            addDict.getStore().loadData(win.dictionaries, false);
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
     * Функция изменения радио группы 2-ой части условия
     * @param radio Радиогруппа
     */
    onChangeRadioData:function(radio){
        var win = radio.up('window');
        var allDict = win.down('combobox[name=allDict]');
        var allField = win.down('combobox[name=allField]');
        var value = win.down('textfield[name=value]');
        var rbField = win.down('radiofield[action=rbField]');
        var rbValue = win.down('radiofield[action=rbValue]');

        if (rbField.checked){
            allDict.setDisabled(false);
            allField.setDisabled(false);
            value.setDisabled(true);
        } else {
            allDict.setDisabled(true);
            allField.setDisabled(true);
            value.setDisabled(false);
        }
    },

    /**
     * Функция изменения знака условия
     * @param combo Комбо
     */
    onChangeCondition: function (combo) {
        var win = combo.up('window');
        var condition = win.down('combobox[name=cond]');
        var fs = win.down('fieldset[name=fsSecond]');
        if (condition.getValue() == 'is null' || condition.getValue() == 'is not null'){
            fs.setDisabled(true);
        } else {
            fs.setDisabled(false);
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
        var condition = win.down('combobox[name=cond]');
        var rbField = win.down('radiofield[action=rbField]');
        var rbValue = win.down('radiofield[action=rbValue]');
        var value = win.down('textfield[name=value]');
        var error = '';
        if (!addField.getValue() || !condition.getValue()){
            error = 'Задайте условие.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }
        var conditionStr = addDict.getRawValue() + '.' + addField.getRawValue();
        conditionStr += ' ' + condition.getValue();
        if (condition.getValue() != 'is null' && condition.getValue() != 'is not null'){
            if (rbField.checked){
                if (!allField.getValue()){
                    error = 'Задайте условие.';
                    FormGenerator.utils.MessageBox.show(error, null, -1);
                    return;
                }
                conditionStr += ' ' + allDict.getRawValue() + '.' + allField.getRawValue();
            } else {
                if (!value.getValue()){
                    error = 'Задайте условие.';
                    FormGenerator.utils.MessageBox.show(error, null, -1);
                    return;
                }
                conditionStr += ' ' + value.getValue();
            }
        }

        // Сгененировать событие, сообщающее основной форме о том,
        // что условие готово к сохранению
        var newWhere = {
            ID:FormGenerator.editor.Random.get(),
            firstField:{
                table:{
                    ID:addDict.getValue(),
                    name:addDict.getRawValue(),
                    tableName:addDict.findRecordByValue(addDict.getValue()).get('tableName')
                },
                field:{
                    ID:addField.getValue(),
                    name:addField.getRawValue(),
                    columnName:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('columnName') : null,
                    domainValueTypeID:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('domainValueTypeID') : null,
                    dictionaryID:addField.getValue() ? addField.findRecordByValue(addField.getValue()).get('dictionaryID') : null
                }
            },
            condition:condition.getValue(),
            isValue:rbValue.checked,
            conditionStr:conditionStr,
            secondField:{
                table:{
                    ID:allDict.getValue(),
                    name:allDict.getRawValue(),
                    tableName:allDict.getValue() ? allDict.findRecordByValue(allDict.getValue()).get('tableName') : null
                },
                field:{
                    ID:allField.getValue(),
                    name:allField.getRawValue(),
                    columnName:allField.getValue() ? allField.findRecordByValue(allField.getValue()).get('columnName') : null,
                    domainValueTypeID:allField.getValue() ? allField.findRecordByValue(allField.getValue()).get('domainValueTypeID') : null,
                    dictionaryID:allField.getValue() ? allField.findRecordByValue(allField.getValue()).get('dictionaryID') : null
                },
                value:value.getValue()
            }
        };
        win.fireEvent('QueryWhereIsReadyToSave', win, newWhere);
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('QueryWhere');
        if (win && win.close) {
            win.close();
        }
    }

});