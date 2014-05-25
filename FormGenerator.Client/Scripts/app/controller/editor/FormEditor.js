Ext.define('FormGenerator.controller.editor.FormEditor', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.editor.FormEditor'
    ],

    models: [
        'FormGenerator.model.editor.FormEditor'
    ],

    stores: [
        'FormGenerator.store.editor.FormEditor'
    ],

    requires: [
        'FormGenerator.editor.Focused'
    ],

    components: undefined,

    init: function () {
        this.control({
            'FormEditor': {
                afterrender: this.onLoad
            },
            'FormEditor button[action=onSave]': {
                click: this.onSave
            },
            'FormEditor button[action=onOpen]': {
                click: this.onOpenForm
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
            'FormEditor button[action=onClose]': {
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
        var componentsGrid = win.down('gridpanel[name=components]');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesFilter = propertiesPanel.down('textfield[name=propertyFilter]');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var propertiesOwner = win.down('panel[name=propertiesOwner]');
        var form = win.down('form[name=mainPanel]');
        var tree = win.down('treepanel');
        var btnCode = win.down('button[action=onCode]');
        var btnDesign = win.down('button[action=onDesign]');
        var btnCopyToClipboard = win.down('button[action=onCopyToClipboard]');
        var btnSaveOnFile = win.down('button[action=onSaveOnFile]');
        var btnLabel = win.down('button[action=onLabel]');
        this.components = componentsGrid.getStore().data.items;
        componentGroupGrid.getSelectionModel().select(componentGroupGrid.getStore().findRecord('group', 'Everything'));
        btnDesign.toggle(true);

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
            } else if (!FormGenerator.editor.Focused.getFocusedCmp()) {
                propertiesGrid.setSource([]);
                propertiesGrid.customEditors = [];
                propertiesOwner.update('');
                propertiesFilter.setValue('');
                tree.getSelectionModel().deselectAll();
                propertiesPanel.setDisabled(true);
            }
        });

        // При добавлении и удалении элементов формы перерисовываем дерево проекта
        form.on('ComponentAdded', _this.onAddComponent);
        form.on('ComponentRemoved', _this.onRemoveComponent);
        // При закрытии формы дизактивируем объект управления фокусом элементов
        win.on('beforeclose', function(){ Ext.FocusManager.disable(); });
    },

    /**
     * Нарисовать форму, полученную в виде JSON объекта (res)
     * @param win Окно редактора форм
     * @param res Объект формы
     */
    drawForm:function(win, res){
        var _this = this;
        var form = win.down('form[name=mainPanel]');
        var components = win.down('gridpanel[name=components]');
        var store = deepCloneStore(components.getStore());
        // рекурсивная функция создания объектов
        var fn = function(obj, parent){
            if (!obj || !parent) {
                var error = 'При открытии формы на редактирование произошла ошибка: объект пуст.';
                FormGenerator.utils.MessageBox.show(error, null, -1);
                //console.error(error);
                return;
            }
            if (!obj['xtype']){
                var error ='При открытии формы на редактирование произошла ошибка: объект не имеет типа.' + obj['name'] ? obj['name'] : '';
                FormGenerator.utils.MessageBox.show(error, null, -1);
                //console.error(error);
                return;
            }
            // выбираем объект из хранилища компонентов, соответствующий текущему
            var selectedRecord = store.findRecord('component', obj['xtype']);
            // создаем объект с помощью фабрик объектов
            var item = eval(obj['xtype'] + 'Factory(win, parent, selectedRecord);');
            item.name = obj['name'];
            if (item.xtype == 'toolbar') {
                parent.addDocked(item);
            } else if (Ext.Array.contains(['gridcolumn', 'datecolumn', 'numbercolumn'], item.xtype)) {
                parent.headerCt.insert(parent.columns.length, item);
                parent.getView().refresh();
            } else {
                parent.add(item);
            }
            parent.add(item);
            parent.doLayout();
            form.doLayout();
            form.fireEvent('ComponentAdded', form, parent, item);
            // изменяем свойства объекта
            FormGenerator.editor.Focused.setFocusedCmp(item);
            for (var prop in obj) {
                if (!(obj[prop] instanceof Array)){
                    _this.onProperyChange(null, prop, obj[prop]);
                }
            }
            FormGenerator.editor.Focused.clearFocusedCmp();
            // рекурсия
            for (var prop in obj) {
                if ((obj[prop] instanceof Array) && obj[prop].length > 0){
                    obj[prop].forEach(function(i){
                        fn(i, item);
                    });
                }
            }
        };

        fn(res, form);
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
        if (!form.down('[name=senchawin]')){
            console.warn('При попытке показать код создано предупреждение: Форма пустая.');
            return;
        }
        var obj = this.getJsonForm(form);
        form.hide();
        codeText.show();
        codeText.setValue(JSON.stringify(obj, null, '\t'));
        btnLabel.show();
    },

    /**
     * Функция сохранения формы.
     * @param btn
     */
    onSave:function(btn) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        // получить объект, хранящий в себе описание формы
        var obj = this.getJsonForm(form);
        if (obj == null || typeof obj == 'undefined'){
            var error = 'Форма пустая.';
            FormGenerator.utils.MessageBox.show(error, null, 0);
            return;
        }
        // рекурсивная функция сохранения
        var fn = function(item){
            win.body.mask('Сохранение...');
            Ext.Ajax.request({
                url: 'FormEditor/Test',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                params: {
                    obj:item.name + ''
                },
                success: function (objServerResponse) {
                    win.body.unmask();
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    if (jsonResp.resultCode == 0) {
                        for (var prop in item) {
                            if (!(item[prop] instanceof Array)) {
                                // call server
                            }
                        }
                        for (var prop in item) {
                            if (item[prop] instanceof Array) {
                                fn(item[prop]);
                            }
                        }
                    } else {
                        FormGenerator.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                    }
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                }
            });
        };
        // Если форма новая и еще не сохранена
        if (win.form_id == null || typeof (win.form_id) == 'undefined'){
            FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.SaveFormDialog');
            var saveFormDialog = FormGenerator.utils.Windows.open('SaveFormDialog', {}, null, true);
            saveFormDialog.on('FormIsReadyToSave', function(winDialog, form_id, form_name){
                win.form_id = form_id;
                win.form_name = form_name;
                fn(obj);
            });
        } else {
            fn(obj);
        }
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
                case 'value':
                    if (focused.record.get('component').toLowerCase() == 'combobox') {
                        focused.setRawValue(value);
                    } else {
                        focused.setValue(value);
                    }
                    break;
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
            focused.record.get('component').toLowerCase() == 'container' ||
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
                case 'frame':
                    focused.frame = value;
                    break;
                case 'header':
                    if (value) {
                        focused.getHeader().show();
                    } else {
                        focused.getHeader().hide();
                    }
                    break;
                case 'hidden':
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
            if (item == null || typeof item == 'undefined'){
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
            // delete empty properties
            for (var prop in obj) {
                if (obj[prop] == null || typeof obj[prop] == 'undefined' || obj[prop].toString().trim() == '') {
                    delete obj[prop];
                }
            }
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
    clearCurrentForm:function(form){
        form.removeAll();
        form.doLayout();
    },

    /**
     * Функция, открывающее диалоговое окно выбора формы для редактирования.
     * @param btn Кнопка "Открыть", вызвавшая событие
     */
    onOpenForm:function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.OpenFormDialog');
        var openFormDialog = FormGenerator.utils.Windows.open('OpenFormDialog', {}, null, true);
        openFormDialog.on('FormIsReadyToOpen', function(winDialog, form_id){
            _this.clearCurrentForm(form);
            // Ajax запрос на получение формы
            win.body.mask('Загрузка...');
            Ext.Ajax.request({
                url: 'FormEditor/GetFormByID',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                params: {
                    id:form_id
                },
                success: function (objServerResponse) {
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    var res = jsonResp.resultData;
                    // воссоздание формы с помощью рекурсивной функции
                    _this.drawForm(win, res);
                    win.body.unmask();
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                }
            });
        })
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


    //==================================================================================================================
    // Изменение грида "Группы компонентов"
    //==================================================================================================================
    onComponentGroupChange: function (grid) {
        var win = grid.view.up('window');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var componentsGrid = win.down('gridpanel[name=components]');
        var selectedGroup = componentGroupGrid.getSelectionModel().getSelection()[0];
        if (!Ext.isEmpty(selectedGroup) && selectedGroup.get('count') > 0) {
            if (selectedGroup.get('group') == 'Everything') {
                componentsGrid.getStore().loadData(this.components);
            } else {
                var array = [];
                this.components.forEach(function (item) {
                    if (item.get('group') == selectedGroup.get('group')) {
                        array.push(item);
                    }
                });
                componentsGrid.getStore().loadData(array, false);
            }
        } else {
            componentsGrid.getStore().loadData([], false);
        }
    },

    //==================================================================================================================
    // Контекстный поиск
    //==================================================================================================================
    onContextSearch: function (textfield) {
        var win = textfield.up('window');
        var componentsGrid = win.down('gridpanel[name=components]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();
        componentsGrid.getStore().filterBy(function (record) {
            var component = record.get('component').toUpperCase().trim();
            return pattern == '' || component.indexOf(pattern) >= 0;
        });
    },

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
     * Функция акрытия формы графического редактора.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        if (btn && btn.up('FormEditor') && btn.up('FormEditor').close) {
            btn.up('FormEditor').close();
        }
    }

});