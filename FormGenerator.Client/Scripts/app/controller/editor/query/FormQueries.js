Ext.define('FormGenerator.controller.editor.query.FormQueries', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.query.FormQueries'
    ],

    models: [
        'FormGenerator.model.editor.FormEditor'
    ],

    stores: [
        'FormGenerator.store.editor.FormEditor'
    ],

    init: function () {
        this.control({
            'FormQueries': {
                afterrender: this.onLoad
            },
            'FormQueries button[action=onAddDictionary]': {
                click: this.onAddDictionary
            },
            'FormQueries button[action=onSave]': {
                click: this.onSave
            },
            'FormQueries button[action=onAddQueryType]': {
                click: this.onAddQueryType
            },
            'FormQueries button[action=onViewQueryType]': {
                click: this.onViewQueryType
            },
            'FormQueries button[action=onSetParam]': {
                click: this.onSetParam
            },
            'FormQueries combobox[name=query]': {
                change: this.onQueryTypeSelectionChange
            },
            'FormQueries button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var queryTypes = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        queryTypes.getStore().load();
    },

    /**
     * Задать параметр запроса
     * @param btn
     */
    onSetParam:function(btn){
        var win = btn.up('window');
        var form = win.form;
        var query = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        var selection = inParams.getSelectionModel().getSelection()[0];
        if (!selection){
            var error = 'Выберите параметр.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
        } else {
            var objs = form.query('datefield, combobox, textfield');
            var data = [];
            objs.forEach(function(x){
                var name = x.record.get('properties')['name'];
                var xtype = x.record.get('properties')['xtype'];
                var label = x.record.get('properties')['fieldLabel'];
                var item = {
                    ID: name,
                    name: xtype + ' (label="' + label + '", name="' + name + '")'
                };
                data.push(item);
            });
            FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.common.ComboForm');
            var comboDialog = FormGenerator.utils.Windows.open('ComboForm', {
                _data: data,
                _label:'Компонент',
                _title:'Значение входного параметра'
            }, null, true);
            comboDialog.on('ComboSaved', function (winDialog, combo, combo_raw) {
                var items = inParams.getStore().data.items;
                items.forEach(function (item) {
                    if (item.get('ID') == selection.get('ID')) {
                        item.set('rawValue', combo_raw); // строка с name
                        item.set('value', combo); // name компонента
                        item.commit();
                    }
                });
            });
        }
    },

    /**
     * Перегрузить таблицу параметров при выборе типа запроса
     * @param combo Комбо типа запроса
     */
    onQueryTypeSelectionChange:function(combo){
        var win = combo.up('window');
        var query = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        if (!query.getValue()){
            inParams.getStore().loadData([], false);
        } else {
            inParams.getStore().load({
                params: {
                    ID: query.getValue()
                }
            });
        }
    },

    /**
     * Функция добавления нового запроса к существующим
     * @param btn Кнопка "+", вызвавшая событие
     */
    onAddQueryType:function(btn){
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.query.CreateQuery');
        var createQuery = FormGenerator.utils.Windows.open('CreateQuery',{}, null, true);
        createQuery.on('QuerySaved', function (winQuery, query_id) {
            // перегрузить комбо с запросами
            query.getStore().load({
                callback:function(){
                    var newQuery = query.getStore().findRecord('ID', query_id);
                    if (newQuery) {
                        query.getSelectionModel().select(query);
                    }
                }
            });
        });
    },

    /**
     * Функция редактирования типа запроса
     * @param btn Кнопка, вызвавшая событие
     */
    onViewQueryType:function(btn){
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        if (!query.getValue()){
            var error = 'Не выбран тип запроса';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.query.CreateQuery');
        var createQuery = FormGenerator.utils.Windows.open('CreateQuery',{
            queryTypeID:query.getValue()
        }, null, true);
        createQuery.on('QuerySaved', function (winQuery, query_id) {
            // перегрузить комбо с запросами
            query.getStore().load({
                callback:function(){
                    var newQuery = query.getStore().findRecord('ID', query_id);
                    if (newQuery) {
                        query.getSelectionModel().select(query);
                    }
                }
            });
        });
    },

    /**
     * Функция сохранения запроса
     */
    onSave:function (btn) {
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        var error = '';
        inParams.getStore().data.items.forEach(function(item){
            if (!item.get('value')){
                error = 'Не все значения входных параметров заполнены.';
            }
        });
        // Если параметры не заполнены, ошибка
        if (error){
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        var obj = {
            _ID:FormGenerator.editor.Queries.getFreeID(), //getRandomInt(), // случайный не настоящий ID   FormGenerator.editor.Queries.getFreeID()
            queryTypeID:query.getValue(),
            queryType:query.getRawValue(),
            queryInParams:inParams.getStore().data.items
        };
        // Сгененировать событие, сообщающее основной форме о том,
        // что запрос сохранен
        win.fireEvent('FormQuerySaved', win, obj);
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('FormQueries');
        if (win && win.close) {
            win.close();
        }
    }

});