Ext.define('FormGenerator.controller.editor.FormEditor', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.FormEditor'
    ],

    models: [
        'FormGenerator.model.editor.FormEditor',
        'FormGenerator.model.editor.query.FormQuery',
        'FormGenerator.model.editor.query.QueryFrom'
    ],

    stores: [
        'FormGenerator.store.editor.FormEditor',
        'FormGenerator.store.editor.query.FormQuery',
        'FormGenerator.store.editor.query.QueryFrom'
    ],

    requires: [
        'FormGenerator.editor.Focused',
        'FormGenerator.editor.Queries'
    ],

    components: undefined,

    init: function () {
        this.control({
            'FormEditor': {
                afterrender: this.onLoad
            },
            'FormEditor menuitem[action=onSaveForm], button[action=onSaveForm]': {
                click: function(btn){
                    this.onSaveForm(btn, false);
                }
            },
            'FormEditor menuitem[action=onNewForm], button[action=onNewForm]': {
                click: this.onNewFormQuestion
            },
            'FormEditor menuitem[action=onOpenForm], button[action=onOpenForm]': {
                click: this.onOpenFormQuestion
            },
            'FormEditor menuitem[action=onRenameForm]': {
                click: this.onRenameForm
            },
            'FormEditor button[action=onCode]': {
                click: this.onCode
            },
            'FormEditor button[action=onDesign]': {
                click: this.onDesign
            },
            'FormEditor gridpanel[name=componentsGroups]': {
                selectionchange: this.onComponentGroupChange
            },
            'FormEditor textfield[name=filter]': {
                change: this.onContextSearch
            },
            'FormEditor textfield[name=propertyFilter]': {
                change: this.onContextPropertySearch
            },
            'FormEditor propertygrid[name=properties]': {
                propertychange: this.onProperyChange
            },
            'FormEditor button[action=onAddQuery]': {
                click: this.onAddQuery
            },
            'FormEditor button[action=onSetParam]': {
                click: this.onSetParam
            },
            'FormEditor combobox[name=query]': {
                change: this.onQueryTypeSelectionChange
            },
            'FormEditor button[action=onClose], menuitem[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы графического редактора. Вызывается сразу после загрузке формы (afterrender).
     * В данной функции происходит установка исходных положений и значений всех элементов формы,
     * активация объекта управления фокусом элементов (Ext.FocusManager) и управление его поведением,
     * добавление классу String функции startsWith,
     * описание логики визуального выделения элемента с фокусом на панели редактирования формы (обработка события componentfocus объекта Ext.FocusManager),
     * обработка событий добавления и удаления элементов формы
     * @param win
     */
    onLoad: function (win) {
        Ext.FocusManager.enable();
        Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
        var _this = this;
        var componentsPanel = win.down('panel[name=componentsPanel]');
        var projectPanel = win.down('panel[name=projectPanel]');
        var componentsGrid = win.down('gridpanel[name=components]');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesFilter = propertiesPanel.down('textfield[name=propertyFilter]');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var propertiesOwner = win.down('panel[name=propertiesOwner]');
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var tree = win.down('treepanel');
        var btnCode = win.down('button[action=onCode]');
        var btnDesign = win.down('button[action=onDesign]');
        var btnCopyToClipboard = win.down('button[action=onCopyToClipboard]');
        var btnSaveOnFile = win.down('button[action=onSaveOnFile]');
        var btnLabel = win.down('button[action=onLabel]');
        // данные
        var dataPanel = win.down('panel[action=data]');
        var query = win.down('combobox[name=query]');
        var queryField = win.down('combobox[name=queryField]');
        var queryKeyField = win.down('combobox[name=queryKeyField]');

        // disable компоненты
        componentsPanel.setDisabled(true);
        projectPanel.setDisabled(true);
        btnDesign.toggle(true);
        // запросы на форме
        FormGenerator.editor.Queries.init();

        // Добавить функцию startsWith классу String
        /**
         * Функция возвращает логическое значение, определяющее, начинается ли текущая строка со строки str
         * @param str Начальная подстрока для проверки
         */
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        // Загружаем таблицу гпупп компонентов и самих компонентов
        componentGroupGrid.getStore().load({
            callback: function () {
                componentsGrid.getStore().load({
                    callback: function () {
                        // выделяем группу "Все"
                        _this.components = componentsGrid.getStore().data.items;
                        componentGroupGrid.getSelectionModel().select(componentGroupGrid.getStore().findRecord('ID', '99'));
                    }
                });
            }
        });

        // Фокус элементов основной формы
        FormGenerator.editor.Focused.clearFocusedCmp();
        // создаем css стиль z-focused-element для выделения компонента с фокусом
        Ext.util.CSS.createStyleSheet('.z-focused-element { border-style:double ; border-width:1px; border-color: rgb(0,100,255); -webkit-box-shadow:0px 0px 30px 0px rgb(0,100,255); -moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);' +
            ' box-shadow:-moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);  }', 'z-focused-element');
        // При фокусе одного из компонентов формы выделяем его
        Ext.FocusManager.clearListeners();
        Ext.FocusManager.on('componentfocus', function (fm, cmp, previousCmp) {
            var focused = null;
            if (cmp.name && cmp.name.substr(0, 6) == 'sencha') {
                focused = cmp;
            } else if (cmp.componentCls.indexOf('fieldset-header') > -1 && cmp.up().xtype == 'fieldset'
                && cmp.up().name.substr(0, 6) == 'sencha') {
                focused = cmp.up();
            } else if (cmp.xtype == 'gridview' && cmp.up().xtype == 'gridpanel'
                && cmp.up().name.substr(0, 6) == 'sencha') {
                focused = cmp.up();
            } else if (cmp.componentCls.indexOf('tab-bar') > 1 && cmp.up().xtype == 'tabpanel'
                && cmp.up().name.substr(0, 6) == 'sencha') {
                focused = cmp.up();
            } else if (cmp.xtype == 'header' && cmp.up().name && cmp.up().name.substr(0, 6) == 'sencha' &&
                (cmp.up().xtype == 'panel' || cmp.up().xtype == 'window' || cmp.up().xtype == 'tabpanel' || cmp.up().xtype == 'gridpanel')) {
                focused = cmp.up();
            }
            propertiesPanel = win.down('panel[name=propertiesPanel]');
            if (focused) {
                FormGenerator.editor.Focused.setFocusedCmp(focused);
                propertiesOwner.update('<span style="margin:3px;position:absolute;">' + renderIcon(focused.record.get('icon')) + '&nbsp' +
                    focused.record.get('component') + '&nbsp&nbsp' + '<i>' + focused.record.get('path') + '</i>&nbsp' + '</span>');
                propertiesGrid.setSource(focused.record.get('properties'));
                propertiesGrid.customEditors = focused.record.get('sourceConfig');
                var treeEl = tree.getRootNode().findChild('id', focused.name, true);
                if (treeEl) {
                    tree.getSelectionModel().select(treeEl);
                }
                propertiesPanel.setDisabled(false);
                // данные
                var panel = win.down('panel[name=data]');
                var loaded1 = false, loaded2 = false;
                if (panel.el) panel.el.mask('Загрузка...');
                if (focused.xtype == 'combobox') {
                    queryKeyField.show();
                } else {
                    queryKeyField.hide();
                }
                var data = focused.record.get('data');
                query.setValue(data['queryID']);
                if (!query.getValue()) {
                    queryField.getStore().loadData([], false);
                    queryKeyField.getStore().loadData([], false);
                    if (panel.el) panel.el.unmask();
                } else {
                    queryField.getStore().load({
                        params: {
                            ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
                        },
                        callback: function () {
                            if (data['queryOutValueID']) queryField.setValue(data['queryOutValueID']);
                            loaded1 = true;
                            if (panel.el && loaded2) panel.el.unmask();
                        }
                    });
                    queryKeyField.getStore().load({
                        params: {
                            ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
                        },
                        callback: function () {
                            if (data['queryOutKeyID']) queryKeyField.setValue(data['queryOutKeyID']);
                            loaded2 = true;
                            if (panel.el && loaded1) panel.el.unmask();
                        }
                    });
                }
                dictionaryField.setValue(data['saveField']);
            } else if (!FormGenerator.editor.Focused.getFocusedCmp()) {
                propertiesGrid.setSource([]);
                propertiesGrid.customEditors = [];
                propertiesOwner.update('');
                propertiesFilter.setValue('');
                tree.getSelectionModel().deselectAll();
                propertiesPanel.setDisabled(true);
                queryField.clearValue();
                queryKeyField.clearValue();
                query.clearValue();
                dictionaryField.clearValue();
            }
        });

        // При изменении данных синхранизировать вкладку "Данные" с компонентом
        query.on('change', function (comboChanged) {
            var focused = FormGenerator.editor.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['queryID'] = query.getValue();
            }
        });
        queryField.on('change', function (comboChanged) {
            var focused = FormGenerator.editor.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['queryOutValueID'] = queryField.getValue();
            }
        });
        queryKeyField.on('change', function (comboChanged) {
            var focused = FormGenerator.editor.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['queryOutKeyID'] = queryKeyField.getValue();
            }
        });
        dictionaryField.on('change', function (comboChanged) {
            var focused = FormGenerator.editor.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['saveField'] = dictionaryField.getValue();
            }
        });

        // При добавлении и удалении элементов формы перерисовываем дерево проекта
        form.on('ComponentAdded', _this.onAddComponent);
        form.on('ComponentRemoved', _this.onRemoveComponent);
        // При закрытии формы дизактивируем объект управления фокусом элементов
        win.on('beforeclose', function () {
            Ext.FocusManager.disable();
        });
    },

    //==============================================Сохранить форму==============================================

    /**
     * Функция сохранения формы.
     * @param btn
     */
    onSaveForm: function (btn, close) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var _this = this;
        // получить объект, хранящий в себе описание формы
        var obj = this.getJsonForm(form);
        if (!win.form_name) {
            var error = 'Форма еще не создана.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }
        if (obj == null || typeof obj == 'undefined') {
            var error = 'Форма пустая.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }

        var queryInParams = FormGenerator.editor.Queries.getInParams();
        var queries = FormGenerator.editor.Queries.get();

        // рекурсивная функция сохранения
        var orderNumber = 0;
        var deleteID = [];
        var fn = function (item, parent) {
            orderNumber++;
            var current = {
                control: {
                    ID: item.id ? item.id + '' : '-1',
                    controlTypeID: item['controlTypeID'] ? item['controlTypeID'] + '' : '',
                    controlIDParent: parent ? parent['id'] + '' : '',
                    formID: win.form_id ? win.form_id + '' : '',
                    orderNumber: orderNumber + ''
                },
                name: item['name'],
                items: [],
                properties: [],
                queries: queries,
                queryInParams: queryInParams,
                data: item['data']
            };
            // сохраняем свойства объекта
            for (var prop in item) {
                if (!(item[prop] instanceof Array) && prop != 'controlTypeID' && prop != 'data') {
                    var property = {
                        controlID: item.id ? item.id + '' : '',
                        controlTypeID: item['controlTypeID'] ? item['controlTypeID'] + '' : '',
                        property: prop,
                        value: item[prop]
                    };
                    current.properties.push(property);
                }
            }
            for (var prop in item) {
                if (item[prop] instanceof Array) {
                    item[prop].forEach(function (x) {
                        current.items.push(fn(x, item));
                    });
                }
            }
            return current;
        };

        // Функция задания id компонентам после сохранения, т.к все на сервере происходит
        // @deprecated
        var setID = function (item) {
            var el = form.query('component[name=' + item['name'] + ']')[0];
            if (el) {
                el.record.get('properties')['id'] = item.control['ID'];
            }
            if (item.items && item.items instanceof Array) {
                item.items.forEach(function (x) {
                    setID(x);
                });
            }
        };

        win.body.mask('Сохранение...');
        // AJAX запрос на сохранение формы
        // Происходит проверка существования данного названия формы и сохранение формы
        Ext.Ajax.timeout = 1000000;
        Ext.Ajax.request({
            url: 'FormEditor/SaveForm',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            timeout: 1000000,
            jsonData: {
                form: {
                    ID: win.form_id ? win.form_id + '' : '',
                    name: win.form_name,
                    dictionaryID: win.form_dictionary_id ? win.form_dictionary_id + '' : ''
                }
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    // Форма сохранена
                    win.form_id = jsonResp.resultID;
                    var newFormObj = fn(obj, null);
                    Ext.Ajax.request({
                        url: 'FormEditor/SaveAllForm',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        jsonData: {
                            form: newFormObj,
                            formID: win.form_id + ''
                        },
                        success: function (objServerResponse) {
                            var jsonResp = Ext.decode(objServerResponse.responseText);
                            if (jsonResp.resultCode == 0) {
                                if (close){
                                    win.body.unmask();
                                    win.close();
                                    return;
                                }
                                var newForm = jsonResp.resultData;
                                // Удаляем компоненты с формы
                                if (form.down('[name=senchawin]')) {
                                    form.fireEvent('ComponentRemoved', form, form, form.down('[name=senchawin]'));
                                }
                                form.removeAll();
                                form.doLayout();
                                FormGenerator.editor.Queries.clear();
                                win.body.unmask();
                                // открываем текущую форму
                                _this.openForm(win);
                            } else {
                                win.body.unmask();
                                FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                            }
                        },
                        failure: function (objServerResponse) {
                            win.body.unmask();
                            FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                        }
                    });
                } else {
                    win.body.unmask();
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    //==============================================Открыть форму==============================================

    /**
     * Функция создания диалога "Сохранить форму?" при открытии формы
     * @param btn
     */
    onOpenFormQuestion: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (win.form_name || win.form_id) {
            FormGenerator.utils.MessageBox.question('Сохранить форму ' + (win.form_name ? ('"' + win.form_name + '"') : '') + '?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res);
                    _this.clearCurrentForm(form);
                    _this.onOpenForm(btn);
                } else if (res == 'no') {
                    _this.clearCurrentForm(form);
                    _this.onOpenForm(btn);
                } else {
                    return;
                }
            }, Ext.Msg.YESNOCANCEL);
        } else {
            _this.clearCurrentForm(form);
            _this.onOpenForm(btn);
        }
    },

    /**
     * Функция, открывающее диалоговое окно выбора формы для редактирования.
     * @param btn Кнопка "Открыть", вызвавшая событие
     */
    onOpenForm: function (btn) {
        var _this = this;
        var win = btn.up('window');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.dialog.OpenFormDialog');
        var openFormDialog = FormGenerator.utils.Windows.open('OpenFormDialog', {}, null, true);
        openFormDialog.on('FormIsReadyToOpen', function (winDialog, form_id, form_name, form_dictionary_id) {
            win.form_id = form_id;
            win.form_name = form_name;
            win.form_dictionary_id = form_dictionary_id;
            _this.openForm(win);
        })
    },

    /**
     * Функция, открывающая форму
     * @param win
     */
    openForm:function(win){
        var _this = this;
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var dictionaryFieldSet = dictionaryField.up('fieldset');
        // Ajax запрос на получение формы
        win.body.mask('Загрузка...');
        Ext.Ajax.request({
            url: 'FormEditor/GetFormByID',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
                id: win.form_id + ''
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.resultCode == 0) {
                    var res = jsonResp.resultData;
                    // воссоздание формы с помощью рекурсивной функции
                    _this.drawForm(win, res);
                    win.setTitle('Визуальный редактор форм. ' + win.form_name);
                    _this.setEnabledComponents(win);
                    // загрузить комбо "Поле" во вкладке "Данные"
                    if (win.form_dictionary_id) {
                        dictionaryFieldSet.expand();
                        dictionaryField.setReadOnly(false);
                        dictionaryField.getStore().load({
                            params: {
                                dictionaryID: win.form_dictionary_id + ''
                            }
                        });
                    } else {
                        dictionaryField.setReadOnly(true);
                        dictionaryField.clearValue();
                        dictionaryFieldSet.collapse();
                    }
                    win.body.unmask();
                } else {
                    FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                    win.body.unmask();
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    //==============================================Новая форма==============================================

    /**
     * Функция создания новой формы
     * @param btn
     */
    onNewFormQuestion: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (win.form_name || win.form_id) {
            FormGenerator.utils.MessageBox.question('Сохранить форму ' + (win.form_name ? ('"' + win.form_name + '"') : '') + '?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res);
                    _this.clearCurrentForm(form);
                    _this.onNewForm(btn);
                } else if (res == 'no') {
                    _this.clearCurrentForm(form);
                    _this.onNewForm(btn);
                } else {
                    return;
                }
            }, Ext.Msg.YESNOCANCEL);
        } else {
            _this.clearCurrentForm(form);
            _this.onNewForm(btn);
        }
    },

    /**
     * Функция, вызывающаяся после диалога "Сохранить форму?" при создании новой формы
     * @param btn
     */
    onNewForm: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var dictionaryFieldSet = dictionaryField.up('fieldset');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.dialog.CreateFormDialog');
        var createFormDialog = FormGenerator.utils.Windows.open('CreateFormDialog', {}, null, true);
        createFormDialog.on('FormIsReadyToCreate', function (winDialog, form_name, dictionary_id) {
            win.form_name = form_name;
            win.form_id = undefined;
            win.form_dictionary_id = dictionary_id;
            _this.setEnabledComponents(win);
            // загрузить комбо "Поле" во вкладке "Данные"
            if (win.form_dictionary_id) {
                dictionaryFieldSet.expand();
                dictionaryField.setReadOnly(false);
                dictionaryField.getStore().load({
                    params: {
                        dictionaryID: win.form_dictionary_id + ''
                    }
                });
            } else {
                dictionaryField.setReadOnly(true);
                dictionaryField.clearValue();
                dictionaryFieldSet.collapse();
            }
            win.setTitle('Визуальный редактор форм. ' + form_name);
        });
    },

    //==============================================Переименовать форму==============================================

    /**
     * Функция, переименовывающая форму
     * @param btn
     */
    onRenameForm: function (btn) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (!win.form_name) {
            var error = 'Форма еще не создана.';
            FormGenerator.utils.MessageBox.show(error, null, -1);
            return;
        }
        // открываем окно переименования формы
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.dialog.RenameFormDialog');
        var createFormDialog = FormGenerator.utils.Windows.open('RenameFormDialog', { form_id: win.form_id, form_name: win.form_name }, null, true);
        createFormDialog.on('FormIsReadyToRename', function (winDialog, form_name) {
            win.form_name = form_name;
            win.setTitle('Визуальный редактор форм. ' + form_name);
        });
    },


    //==================================================================================================================
    //===================================================Утилиты========================================================
    //==================================================================================================================

    /**
     * Получить JSON объект формы
     * @private
     * @param form форма
     * @return {*} JSON объект
     */
    getJsonForm: function (form) {
        var win = form.up('window');
        var localWindow = form.down('[name=senchawin]');
        var availableComponents = ['button', 'combobox', 'container', 'datecolumn', 'datefield', 'fieldset', 'gridcolumn', 'gridpanel', 'numbercolumn', 'numberfield',
            'panel', 'tab', 'tabpanel', 'textfield', 'toolbar'];

        var fn = function (item) {
            if (item == null || typeof item == 'undefined') {
                return null;
            }
            var items = [];
            var dockedItems = [];
            var query = [];
            if (item.query) {
                query = item.query('> component');
                if (item.xtype == 'gridpanel') {
                    query = query.concat(item.columnManager.columns);
                }
                // query all children
                query.forEach(function (child) {
                    if (child.xtype && Ext.Array.contains(availableComponents, child.xtype) && child.name && child.name.startsWith('sencha')) {
                        if (child.xtype == 'toolbar') {
                            dockedItems.push(child);
                        } else {
                            items.push(child);
                        }
                    }
                });
            }
            // create obj
            var obj = JSON.parse(JSON.stringify(item.record.get('properties')));
            var data = JSON.parse(JSON.stringify(item.record.get('data')));
            obj.controlTypeID = item.record.get('ID');
            obj.data = data;

            // recursion
            if (items.length > 0) {
                if (item.xtype == 'gridpanel') {
                    obj.columns = [];
                    items.forEach(function (i) {
                        obj.columns.push(fn(i));
                    });
                } else {
                    obj.items = [];
                    items.forEach(function (i) {
                        obj.items.push(fn(i));
                    });
                }
            }
            if (dockedItems.length > 0) {
                obj.dockedItems = [];
                dockedItems.forEach(function (i) {
                    obj.dockedItems.push(fn(i));
                });
            }

            return obj;
        };

        var obj = fn(localWindow);
        return obj;
    },

    /**
     * Функция, очищающая текущую редактируемую фрму.
     * @param form Форма
     */
    clearCurrentForm: function (form) {
        var win = form.up('window');
        if (form.down('[name=senchawin]')) {
            form.fireEvent('ComponentRemoved', form, form, form.down('[name=senchawin]'));
        }
        form.removeAll();
        form.doLayout();
        FormGenerator.editor.Queries.clear();
        win.form_id = undefined;
        win.form_dictionary_id = undefined;
        win.form_name = undefined;
        win.setTitle('Визуальный редактор форм');
    },

    /**
     * Отрисовать новую вершину дерева при добавлении компонента на форму
     * @param form Форма, на которой расположены все компоненты
     * @param parent Родительский элемент для нового
     * @param addedItem Добавляемый элемент
     */
    onAddComponent: function (form, parent, addedItem) {
        var win = form.up('window');
        var tree = win.down('treepanel');
        var parentNode = tree.getRootNode().findChild('id', parent.name, true);
        if (!parentNode && parent.name == form.name) {
            parentNode = tree.getRootNode();
        }
        if (parentNode) {
            var newNode = {
                text: addedItem.record.get('component'),
                name: addedItem.name,
                expanded: true,
                id: addedItem.name,
                icon: addedItem.record.get('icon'),
                children: []
            };
            parentNode.appendChild(newNode, false, true);
            tree.doLayout();
        } else {
            console.log('Adding node error. Cant find parent node: ' + parent);
        }
    },

    /**
     * Удалить вершину дерева при удалении компонента с формы
     * @param form Форма, на которой расположены все компоненты
     * @param parent Родительский элемент для удаляемго
     * @param removedItem Удаляемый элемент
     */
    onRemoveComponent: function (form, parent, removedItem) {
        var win = form.up('window');
        var tree = win.down('treepanel');
        var parentNode = tree.getRootNode().findChild('id', parent.name, true);
        var removedNode = tree.getRootNode().findChild('id', removedItem.name, true);
        if (!parentNode && parent.name == form.name) {
            parentNode = tree.getRootNode()
        }
        if (!parentNode) {
            console.log('Removing node error. Cant find parent node: ' + parent);
        } else if (!removedNode) {
            console.log('Removing node error. Cant find node to remove : ' + removedItem);
        } else {
            parentNode.removeChild(removedNode);
            tree.doLayout();
        }
    },

    //================================================== Запросы ==================================================

    /**
     * Функция добавления нового запроса к существующим
     * @param btn Кнопка "+", вызвавшая событие
     */
    onAddQuery: function (btn) {
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        var form = win.down('form[name=mainPanel]');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.query.FormQueries');
        var createQuery = FormGenerator.utils.Windows.open('FormQueries', {
            form: form
        }, null, true);
        createQuery.on('FormQuerySaved', function (winQuery, obj) {
//        obj = {
//            _ID:getRandomInt(),
//            queryTypeID:query.getValue(),
//            queryType:query.getRawValue(),
//            queryInParams:inParams.getStore().data.items
//        };
            FormGenerator.editor.Queries.add(obj);
            // перегрузить комбо с запросами
            query.getStore().loadData(FormGenerator.editor.Queries.get(), false);
            var newQuery = query.getStore().findRecord('_ID', obj._ID);
            if (newQuery) {
                query.select(newQuery);
            }
        });
    },

    /**
     * Перегрузить таблицу параметров при выборе запроса
     * @param combo Комбо запрос
     */
    onQueryTypeSelectionChange: function (combo) {
        var win = combo.up('window');
        var query = win.down('combobox[name=query]');
        var queryField = win.down('combobox[name=queryField]');
        var queryKeyField = win.down('combobox[name=queryKeyField]');
        queryField.clearValue();
        queryKeyField.clearValue();
        if (!query.getValue()) {
            queryField.getStore().loadData([], false);
            queryKeyField.getStore().loadData([], false);
        } else {
            queryField.getStore().load({
                params: {
                    ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
                }
            });
            queryKeyField.getStore().load({
                params: {
                    ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
                }
            });
        }
    },

    //===================================================Левые функции==================================================

    /**
     * Нарисовать форму, полученную в виде JSON объекта (res)
     * @param win Окно редактора форм
     * @param res Объект формы
     */
    drawForm: function (win, res) {
        var _this = this;
        var form = win.down('form[name=mainPanel]');
        var components = win.down('gridpanel[name=components]');
        var store = deepCloneStore(components.getStore());
        if (!res.root) {
            var error = 'Форма пуста.';
            console.warn(error);
            return;
        }
        // рекурсивная функция создания объектов
        // obj typeof OpenControlModel
        var fn = function (obj, parent) {
            if (!obj || !parent || !obj.properties) {
                var error = 'При открытии формы на редактирование произошла ошибка: объект пуст.';
                FormGenerator.utils.MessageBox.show(error, null, -1);
                return;
            }
            var xtype, layout;
            obj.properties.forEach(function (x) {
                if (x.property.toLowerCase() == 'xtype') {
                    xtype = x.value.toLowerCase();
                }
                if (x.property.toLowerCase() == 'layout') {
                    layout = x.value.toLowerCase();
                }
            });
            if (!xtype) {
                var error = 'При открытии формы на редактирование произошла ошибка: объект не имеет типа.' + obj['name'] ? obj['name'] : '';
                FormGenerator.utils.MessageBox.show(error, null, -1);
                return;
            }
            // выбираем объект из хранилища компонентов, соответствующий текущему
            var controlType = obj.control['controlType'];
            var selectedRecord = store.findRecord('component', controlType.toLowerCase());
            var item;
            // создаем объект с помощью фабрик объектов
            if (xtype == 'container') {
                item = eval(xtype.toLowerCase() + 'Factory(win, parent, selectedRecord, layout);');
            } else {
                item = eval(controlType.toLowerCase() + 'Factory(win, parent, selectedRecord);');
            }
            item.name = obj['name'];

            if (item.xtype == 'toolbar') {
                parent.addDocked(item);
            } else if (Ext.Array.contains(['gridcolumn', 'datecolumn', 'numbercolumn'], item.xtype)) {
                parent.headerCt.insert(parent.columns.length, item);
                parent.getView().refresh();
            } else {
                parent.add(item);
            }
            parent.doLayout();
            form.doLayout();
            form.fireEvent('ComponentAdded', form, parent, item);
            // изменяем свойства объекта
            FormGenerator.editor.Focused.setFocusedCmp(item);
            obj.properties.forEach(function (prop) {
                _this.onProperyChange(null, prop['property'], prop['_value']);
            });
            FormGenerator.editor.Focused.clearFocusedCmp();
            // рекурсия
            if (obj.items && obj.items instanceof Array && obj.items.length > 0) {
                obj.items.forEach(function (i) {
                    fn(i, item);
                });
            }
        };

        fn(res.root, form);
    },

    /**
     * Сгенерировать JSON код построенной формы
     * @param btn
     */
    onCode: function (btn) {
        var win = btn.up('window');
        var mainContainer = win.down('form[name=mainContainer]');
        var form = mainContainer.down('form[name=mainPanel]');
        var codeText = mainContainer.down('textareafield[name=codeText]');
        var btnLabel = win.down('button[action=onLabel]');
        if (!form.down('[name=senchawin]')) {
            console.warn('При попытке показать код создано предупреждение: Форма пустая.');
            return;
        }
        // delete empty properties function
        var fnDeleteEmptyProperties = function (item) {
            debugger;
            delete item['data'];
            for (var prop in item) {
                if (!(item[prop] instanceof Array)) {
                    if (item[prop] == null || typeof item[prop] == 'undefined' || item[prop].toString().trim() == ''
                        || prop == 'controlTypeID' || prop == 'id') {
                        delete item[prop];
                    }
                }
            }
            for (var prop in item) {
                if (item[prop] instanceof Array) {
                    if (item[prop] != null || item[prop].length > 0) {
                        item[prop].forEach(function (x) {
                            fnDeleteEmptyProperties(x);
                        });
                    }
                }
            }
        };
        // JSON объект
        var obj = this.getJsonForm(form);
        fnDeleteEmptyProperties(obj);

        form.hide();
        codeText.show();
        codeText.setValue(JSON.stringify(obj, null, '\t'));
        btnLabel.show();
    },

    /**
     * Показать представление формы
     * @param btn
     */
    onDesign: function (btn) {
        var win = btn.up('window');
        var mainContainer = win.down('form[name=mainContainer]');
        var form = mainContainer.down('form[name=mainPanel]');
        var codeText = mainContainer.down('textareafield[name=codeText]');
        var btnLabel = win.down('button[action=onLabel]');
        codeText.hide();
        form.show();
        btnLabel.hide();
    },

    /**
     * Change any property in propertygrid
     * @param source The source data object for the grid (corresponds to the same object passed in as the source config property).
     * @param recordId The record's id in the data store
     * @param value The current edited property value
     * @param oldValue The original property value prior to editing
     * @param eOpts The options object passed to Ext.util.Observable.addListener.
     */
    onProperyChange: function (source, recordId, value, oldValue, eOpts) {
        var focused = FormGenerator.editor.Focused.getFocusedCmp();
        var win = focused.up('window[name=FormEditor]');
        var form = win.down('form[name=mainPanel]');
        focused.record.get('properties')[recordId] = value;
        var componentName = focused.record.get('component').toLowerCase();

        // поля
        if (focused.record.get('component').toLowerCase() == 'textfield' ||
            focused.record.get('component').toLowerCase() == 'datefield' ||
            focused.record.get('component').toLowerCase() == 'numberfield' ||
            focused.record.get('component').toLowerCase() == 'combobox') {
            switch (recordId) {
                case 'anchor':
                    if (!value || value.toString().trim() == '') {
                        focused.anchor = undefined;  // set anchor
                        delete focused.anchorSpec;   // remove the grid's anchor cache
                    } else {
                        focused.anchor = value;
                    }
                    break;
                case 'allowBlank':
                    break;
                case 'allowExponential':
                    break;
                case 'allowDecimals':
                    break;
                case 'blankText':
                    break;
                case 'caseSensitive':
                    break;
                case 'disabled':
                    break;
                case 'decimalPrecision':
                    break;
                case 'displayField':
                    break;
                case 'emptyText':
                    break;
                case 'editable':
                    break;
                case 'fieldLabel':
                    focused.setFieldLabel(value);
                    break;
                case 'format':
                    break;
                case 'flex':
                    focused.flex = value;
                    break;
                case 'hidden':
                    if (value) {
                        focused.hide();
                    } else {
                        focused.show();
                    }
                    break;
                case 'invalidText':
                    break;
                case 'labelSeparator':
                    focused.labelSeparator = value;
                    focused.setFieldLabel(focused.getFieldLabel());
                    break;
                case 'labelWidth':
                    focused.labelWidth = value;
                    focused.labelCell.setWidth(focused.labelWidth);
                    break;
                case 'margin':
                    setMargin(focused.getEl(), value);
                    break;
                case 'maskRe':
                    break;
                case 'maxWidth':
                    focused.maxWidth = value;
                    break;
                case 'minWidth':
                    focused.minWidth = value;
                    break;
                case 'minText':
                    break;
                case 'maxText':
                    break;
                case 'minValue':
                    break;
                case 'maxValue':
                    break;
                case 'mouseWheelEnabled':
                    break;
                case 'multiSelect':
                    break;
                case 'queryMode':
                    break;
                case 'nanText':
                    break;
                case 'step':
                    break;
                case 'readOnly':
                    focused.setReadOnly(value);
                    break;
//                case 'value':
//                    if (focused.record.get('component').toLowerCase() == 'combobox') {
//                        focused.setRawValue(value);
//                    } else {
//                        focused.setValue(value);
//                    }
//                    break;
                case 'valueField':
                    break;
                case 'width':
                    focused.setWidth(value);
                    break;
                default:
                    break;
            }
        }

        // колонки
        if (focused.record.get('component').toLowerCase() == 'gridcolumn' ||
            focused.record.get('component').toLowerCase() == 'datecolumn' ||
            focused.record.get('component').toLowerCase() == 'numbercolumn') {
            var gridpanel = focused.up('gridpanel');
            switch (recordId) {
                case 'align':
                    focused.align = value;
                    break;
                case 'dataIndex':
                    break;
                case 'disabled':
                    break;
                case 'draggable':
                    focused.draggable = value;
                    break;
                case 'emptyCellText':
                    focused.emptyCellText = value;
                    break;
                case 'flex':
                    focused.flex = value;
                    break;
                case 'format':
                    focused.format = value;
                    break;
                case 'hideable':
                    focused.hideable = value;
                    break;
                case 'hidden':
                    if (value) {
                        focused.hide();
                    } else {
                        focused.show();
                    }
                    break;
                case 'locked':
                    focused.locked = value;
                    break;
                case 'maxWidth':
                    focused.maxWidth = value;
                    break;
                case 'minWidth':
                    focused.minWidth = value;
                    break;
                case 'menuDisabled':
                    focused.menuDisabled = value;
                    break;
                case 'resizable':
                    focused.resizable = value;
                    break;
                case 'sortable':
                    focused.sortable = value;
                    break;
                case 'text':
                    focused.setText(value);
                    break;
                case 'width':
                    focused.setWidth(value);
                    break;
                default:
                    break;
            }
            gridpanel.getView().refresh();
            focused.doLayout();
        }

        // окно, панель, табпанель, табка, таблица, тулбар, контейнер, филдсет, кнопка
        if (focused.record.get('component').toLowerCase() == 'window' ||
            focused.record.get('component').toLowerCase() == 'panel' ||
            focused.record.get('component').toLowerCase() == 'tabpanel' ||
            focused.record.get('component').toLowerCase() == 'newtab' ||
            focused.record.get('component').toLowerCase() == 'gridpanel' ||
            focused.record.get('component').toLowerCase() == 'toolbar' ||
            focused.record.get('component').toLowerCase() == 'container (hbox)' ||
            focused.record.get('component').toLowerCase() == 'container (vbox)' ||
            focused.record.get('component').toLowerCase() == 'fieldset' ||
            focused.record.get('component').toLowerCase() == 'button') {
            switch (recordId) {
                case 'activeTab':
                    focused.setActiveTab(value);
                    break;
                case 'anchor':
                    if (!value || value.toString().trim() == '') {
                        focused.anchor = undefined;  // set anchor
                        delete focused.anchorSpec;   // remove the grid's anchor cache
                    } else {
                        focused.anchor = value;
                    }
                    break;
                case 'allowDeselect':
                    break;
                case 'autoScroll':
                    focused.setAutoScroll(value);
                    break;
                case 'animCollapse':
                    focused.animCollapse = value;
                    break;
                case 'bodyPadding':
                    setPadding(focused.body, value);
                    break;
                case 'columnLines':
                    focused.columnLines = value;
                    break;
                case 'collapsible':
                    var collapseTool = componentName == 'fieldset' ? focused.toggleCmp : focused.tools['collapse-top'];
                    if (value) {
                        collapseTool.show();
                    } else {
                        collapseTool.hide();
                    }
                    break;
                case 'closable':
                    var closeTool = componentName == 'newtab' ? focused.tab.closeEl : focused.tools['close'];
                    if (value) {
                        closeTool.show();
                    } else {
                        closeTool.hide();
                    }
                    break;
                case 'constrain':
                    focused.constrain = value;
                    break;
                case 'disabled':
                    break;
                case 'disableSelection':
                    break;
                case 'draggable':
                    break;
                case 'dock':
                    focused.setDocked(value, true);
                    break;
                case 'enableColumnMove':
                    break;
                case 'header':
                    if (value) {
                        focused.getHeader().show();
                    } else {
                        focused.getHeader().hide();
                    }
                    break;
                case 'hidden':
                    if (value) {
                        focused.hide();
                    } else {
                        focused.show();
                    }
                    break;
                case 'hideHeaders':
                    break;
                case 'height':
                    focused.setHeight(value);
                    break;
                case 'icon':
                    focused.setIcon(value);
                    break;
                case 'margin':
                    setMargin(focused.getEl(), value);
                    break;
                case 'maxWidth':
                    focused.maxWidth = value;
                    break;
                case 'minWidth':
                    focused.minWidth = value;
                    break;
                case 'maxHeight':
                    focused.maxHeight = value;
                    break;
                case 'minHeight':
                    focused.minHeight = value;
                    break;
                case 'maximizable':
                    if (value) {
                        focused.tools['maximize'].show();
                    } else {
                        focused.tools['maximize'].hide();
                    }
                    break;
                case 'minimizable':
                    if (value) {
                        focused.tools['minimize'].show();
                    } else {
                        focused.tools['minimize'].hide();
                    }
                    break;
                case 'modal':
                    break;
                case 'resizable':
                    break;
                case 'rowLines':
                    focused.rowLines = value;
                    break;
                case 'scale':
                    if (!Ext.Array.contains(focused.allowedScales, value)) {
                        console.log(componentName + ' "scale" property change error. Scale must be an allowed scale (' + focused.allowedScales.join(', ') + ')');
                    } else {
                        focused.setScale(value);
                    }
                    break;
                case 'title':
                    focused.setTitle(value);
                    break;
                case 'text':
                    focused.setText(value);

                    focused.setMargin(value);
                    break;
                case 'tooltip':
                    focused.setTooltip(value);
                    break;
                case 'width':
                    focused.setWidth(value);
                    break;
                default:
                    break;
            }
            if (componentName != 'button') {
                focused.doLayout();
            }
        }

        // refresh layout for all components on form
        form.doLayout();
    },

    /**
     * Функция подгрузки группы компонентов при выборе типа компонентов
     * @param grid Таблица "Тип компонентов"
     */
    onComponentGroupChange: function (grid) {
        var _this = this;
        var win = grid.view.up('window');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var componentsGrid = win.down('gridpanel[name=components]');
        var selectedGroup = componentGroupGrid.getSelectionModel().getSelection()[0];
        if (!Ext.isEmpty(selectedGroup)) {
            if (selectedGroup.get('ID') == 99) { // all
                componentsGrid.getStore().loadData(this.components);
            } else {
                var array = [];
                _this.components.forEach(function (item) {
                    if (item.get('group') == selectedGroup.get('name')) {
                        array.push(item);
                    }
                });
                componentsGrid.getStore().loadData(array, false);
            }
        } else {
            componentsGrid.getStore().loadData([], false);
        }
    },

    /**
     * Функция контекстного поиска для компонентов
     * @param textfield Текстовое поле фильтра
     */
    onContextSearch: function (textfield) {
        var win = textfield.up('window');
        var componentsGrid = win.down('gridpanel[name=components]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();
        componentsGrid.getStore().filterBy(function (record) {
            var component = record.get('component').toUpperCase().trim();
            return pattern == '' || component.indexOf(pattern) >= 0;
        });
    },

    /**
     * Функция контекстного поиска для свойств
     * @param textfield Текстовое поле фильтра
     */
    onContextPropertySearch: function (textfield) {
        var win = textfield.up('window');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();
        propertiesGrid.getStore().filterBy(function (record) {
            var component = record.get('name').toUpperCase().trim();
            return pattern == '' || component.indexOf(pattern) >= 0;
        });
    },

    /**
     * Функция, открывающая панели "Компоненты" и "Инспектор проекта"
     * @param win Окно редактора форм
     */
    setEnabledComponents: function (win) {
        var componentsPanel = win.down('panel[name=componentsPanel]');
        var projectPanel = win.down('panel[name=projectPanel]');
        componentsPanel.setDisabled(false);
        projectPanel.setDisabled(false);
    },

    onNewFormQuestion: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (win.form_name || win.form_id) {
            FormGenerator.utils.MessageBox.question('Сохранить форму ' + (win.form_name ? ('"' + win.form_name + '"') : '') + '?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res);
                    _this.clearCurrentForm(form);
                    _this.onNewForm(btn);
                } else if (res == 'no') {
                    _this.clearCurrentForm(form);
                    _this.onNewForm(btn);
                } else {
                    return;
                }
            }, Ext.Msg.YESNOCANCEL);
        } else {
            _this.clearCurrentForm(form);
            _this.onNewForm(btn);
        }
    },

    /**
     * Функция акрытия формы графического редактора.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (win.form_name || win.form_id) {
            FormGenerator.utils.MessageBox.question('Сохранить форму ' + (win.form_name ? ('"' + win.form_name + '"') : '') + '?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res, true);
                } else if (res == 'no') {
                    win.close();
                } else {
                    return;
                }
            }, Ext.Msg.YESNOCANCEL);
        } else {
            win.close();
        }
    }

});