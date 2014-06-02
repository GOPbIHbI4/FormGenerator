Ext.define('FormGenerator.controller.editor.query.CreateQuery', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.query.CreateQuery'
    ],

    models: [
        'FormGenerator.model.editor.query.CreateQuery'
    ],

    stores: [
        'FormGenerator.store.editor.query.CreateQuery'
    ],

    init: function () {
        this.control({
            'CreateQuery': {
                afterrender: this.onLoad
            },
            'CreateQuery button[action=onAddDictionary]': {
                click: this.onAddDictionary
            },
            'CreateQuery button[action=onDeleteDictionary]': {
                click: this.onDeleteDictionary
            },
            'CreateQuery button[action=onAddField]': {
                click: this.onAddField
            },
            'CreateQuery button[action=onDeleteField]': {
                click: this.onDeleteField
            },
            'CreateQuery button[action=onAddConditionAnd], button[action=onAddConditionOr]': {
                click: this.onAddCondition
            },
            'CreateQuery button[action=onDeleteCondition]': {
                click: this.onDeleteCondition
            },
            'CreateQuery button[action=onRefreshSQL]': {
                click: this.onRefreshSQL
            },
            'CreateQuery button[action=onSave]': {
                click: this.onSave
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
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var condGrid = win.down('gridpanel[name=whereGrid]');
        var query = win.down('textareafield[name=query]');
        var btnSave = win.down('button[action=onSave]');
        var btnRefresh = win.down('button[action=onRefreshSQL]');
        if (win.queryTypeID){
            fieldsGrid.up('fieldset').setDisabled(true);
            dictsGrid.up('fieldset').setDisabled(true);
            condGrid.up('fieldset').setDisabled(true);
            query.setReadOnly(true);
            btnSave.disable();
            btnRefresh.disable();
            Ext.Ajax.request({
                url: 'QueryEditor/GetFullQueryType',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                params: {
                    ID:win.queryTypeID + ''
                },
                success: function (objServerResponse) {
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    win.body.unmask();
                    if (jsonResp.resultCode == 0){
                        var obj = jsonResp.resultData;
                        query.setValue(obj.queryType['sqlText']);
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
     * Получить объект для сохранения запроса
     * @param win Окно
     * @returns {{queryType: {SQL: string, ID: number}, queryInParameters: Array, queryOutParameters: Array}}
     */
    getObject:function(win){
        var _this = this;
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var condGrid = win.down('gridpanel[name=whereGrid]');
        var query = win.down('textareafield[name=query]');
        var SQL = _this.getQuery(win.down('button'));
        var inParams = [], outParams = [];

        fieldsGrid.getStore().data.items.forEach(function(item){
            var obj = item.get('obj');
            var outParam = {
                ID:-1,
                queryTypeID:-1,
                name:obj.table.field['columnName'], //obj.table['tableName'] + '.' + obj.table.field['columnName'];
                domainValueTypeID:item.get('domainValueTypeID')
            };
            outParams.push(outParam);
        });

        // where
        condGrid.getStore().data.items.forEach(function(item){
            var obj = item.get('obj');
            if (obj['condition'] != 'is null' && obj['condition'] != 'is not null'){
                if (obj['isValue']){
                    var inParam = {
                        ID:-1,
                        queryTypeID:-1,
                        name:replaceBrucket(obj.secondField['value']),
                        domainValueTypeID:item.get('domainValueTypeID')
                    };
                    inParams.push(inParam);
                }
            }
        });

        var obj = {
            queryType:{
                sqlText:SQL,
                ID:-1
            },
            queryInParameters:inParams,
            queryOutParameters:outParams
        };
        return obj;
    },

    /**
     * Функция сохранения запроса
     */
    onSave:function (btn) {
        var _this = this;
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var condGrid = win.down('gridpanel[name=whereGrid]');
        // объект запроса
        var obj = this.getObject(win);
        if (fieldsGrid.getStore().getCount() == 0){
            var error = 'Задайте хотя бы одно поле, выбираемое запросом.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }
        if (dictsGrid.getStore().getCount() == 0){
            var error = 'Задайте хотя бы один источник данных.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        win.body.mask('Сохранение...');
        // AJAX запрос на сохранение
        Ext.Ajax.request({
            url: 'QueryEditor/SaveQueryType',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            jsonData: {
                queryType:obj.queryType,
                queryInParameters:obj.queryInParameters,
                queryOutParameters:obj.queryOutParameters
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                win.body.unmask();
                if (jsonResp.resultCode == 0){
                    // Сгененировать событие, сообщающее основной форме о том,
                    // что запрос сохранен
                    win.fireEvent('QuerySaved', win, jsonResp.resultID);
                    _this.onClose(btn);
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    /**
     * Функция добавления Источника данных
     * @param btn Кнопка "Добавить"
     */
    onAddDictionary: function (btn) {
        var win = btn.up('window');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.query.QueryFrom');
        var queryFrom = FormGenerator.utils.Windows.open('QueryFrom',
            {
                dictionaries: dictsGrid.getStore().data.items
            }, null, true);
        queryFrom.on('QueryFromIsReadyToSave', function (winDialog, query) {
            var condition = '';
            if (dictsGrid.getStore().data.items != null && dictsGrid.getStore().data.items.length > 0) {
                condition = query.table['name'] + '.' + query.table.field['name'];
                condition += ' = ';
                condition += query.anotherTable['name'] + '.' + query.anotherTable.field['name'];
            }
            var newFrom = {
                ID: query.table['ID'],
                name: query.table['name'],
                tableName:query.table['tableName'],
                condition: condition,
                obj: query
            };
            dictsGrid.getStore().add(newFrom);
        });
    },

    /**
     * Функция удаления Источника данных
     * @param btn Кнопка "Удалить"
     */
    onDeleteDictionary: function (btn) {
        var win = btn.up('window');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var selection = dictsGrid.getSelectionModel().getSelection()[0];
        if (!selection){
            var error = 'Выберите источник данных для удаления.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            var ID = selection.get('ID');
            var record = dictsGrid.getStore().findRecord('ID', ID);
            dictsGrid.getStore().remove(record);
        }
    },

    /**
     * Функция добавления Поля
     * @param btn Кнопка "Добавить"
     */
    onAddField: function (btn) {
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.query.QuerySelect');
        var queryFrom = FormGenerator.utils.Windows.open('QuerySelect',
            {
                dictionaries: dictsGrid.getStore().data.items
            }, null, true);
        queryFrom.on('QuerySelectIsReadyToSave', function (winDialog, query) {
            var newSelect = {
                ID: query.table.field['ID'],
                field: query.table.field['name'],
                columnName:query.table.field['columnName'],
                domainValueTypeID:query.table.field['domainValueTypeID'],
                dictionary:query.table['name'],
                obj: query
            };
            fieldsGrid.getStore().add(newSelect);
        });
    },

    /**
     * Функция удаления Источника данных
     * @param btn Кнопка "Удалить"
     */
    onDeleteField: function (btn) {
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var selection = fieldsGrid.getSelectionModel().getSelection()[0];
        if (!selection){
            var error = 'Выберите поле для удаления.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            var ID = selection.get('ID');
            var record = fieldsGrid.getStore().findRecord('ID', ID);
            fieldsGrid.getStore().remove(record);
        }
    },

    /**
     * Функция добавления условия
     * @param btn Кнопка "Добавить"
     */
    onAddCondition: function (btn) {
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var condGrid = win.down('gridpanel[name=whereGrid]');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.query.QueryWhere');
        var queryWhere = FormGenerator.utils.Windows.open('QueryWhere',
            {
                dictionaries: dictsGrid.getStore().data.items
            }, null, true);
        queryWhere.on('QueryWhereIsReadyToSave', function (winDialog, query) {
            var operation = btn.action == 'onAddConditionAnd' ? 'AND' : 'OR';
            var newWhere = {
                ID: query['ID'],
                operation: operation,
                condition:query['conditionStr'],
                domainValueTypeID:query.firstField.field['domainValueTypeID'],
                obj: query
            };
            condGrid.getStore().add(newWhere);
        });
    },

    /**
     * Функция удаления условия
     * @param btn Кнопка "Удалить"
     */
    onDeleteCondition: function (btn) {
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var condGrid = win.down('gridpanel[name=whereGrid]');
        var selection = condGrid.getSelectionModel().getSelection()[0];
        if (!selection){
            var error = 'Выберите условие для удаления.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            var ID = selection.get('ID');
            var record = condGrid.getStore().findRecord('ID', ID);
            condGrid.getStore().remove(record);
        }
    },

    /**
     * Обновить текстовое поле с SQL
     * @param btn Кнопка "Обновить"
     */
    onRefreshSQL:function(btn){
        var win = btn.up('window');
        var _this = this;
        var query = win.down('textareafield[name=query]');
        var SQL = _this.getQuery(btn);
        query.setValue(SQL);
    },

    /**
     * Функция получения выборки SQL
     * @param btn Кнопка формы
     * @returns {string} выборка SQL
     */
    getQuery:function (btn) {
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=selectGrid]');
        var dictsGrid = win.down('gridpanel[name=fromGrid]');
        var condGrid = win.down('gridpanel[name=whereGrid]');
        var query = win.down('textareafield[name=query]');
        var SQL = '', select = '', from = '', where = '';
        fieldsGrid.getStore().data.items.forEach(function(item){
            var obj = item.get('obj');
            select += select == '' ? '' : ', ';
            select += obj.table['tableName'] + '.' + obj.table.field['columnName'];
        });
        select = 'SELECT ' + select;
        select += '\n';
        dictsGrid.getStore().data.items.forEach(function(item){
            var obj = item.get('obj');
            var str = '';
            // если идет join
            if (obj.anotherTable['tableName']){
                str += 'LEFT JOIN ' + obj.table['tableName'] + ' on ';
                str += obj.table['tableName'] + '.' + obj.table.field['columnName'] + ' = ';
                str += obj.anotherTable['tableName'] + '.' + obj.anotherTable.field['columnName'];
            } else {
                str += obj.table['tableName'];
            }
            from += str + '\n';
        });
        from = 'FROM ' + from;
        // where
        condGrid.getStore().data.items.forEach(function(item){
            var obj = item.get('obj');
            var str = item.get('operation') ? (item.get('operation') + ' ') : '';
            str += obj.firstField.table['tableName'] + '.' + obj.firstField.field['columnName'];
            str += ' ' + obj['condition'].toUpperCase();
            // если не is null || is not null
            if (obj['condition'] != 'is null' && obj['condition'] != 'is not null'){
                if (obj['isValue']){
                    str += ' ' + obj.secondField['value'];
                } else {
                    str += ' ' + obj.secondField.table['tableName'] + '.' + obj.secondField.field['columnName'];
                }
            }
            where += str + '\n';
        });
        where = 'WHERE 1=1 ' + where;

        SQL = select + from + where;
        return SQL;
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