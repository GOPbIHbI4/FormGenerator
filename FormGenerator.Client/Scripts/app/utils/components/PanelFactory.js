//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
panelFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var num = FormGenerator.editor.Random.get();
    //шаблоны
    return Ext.create('Ext.panel.Panel', {
        xtype: 'panel',
        name: 'sencha' + 'panel' + num,
        width: 200,
        height: 200,
        minWidth: 200,
        minHeight: 200,
        margin: 5,
        resizable: true,
        mainWindow: false,
        closable: false,
        collapsible: true,
        title: 'Моя панель',
        layout:'anchor',
        form: form,
//        renderTo: body,
        record: selectedRecord,
        tools: [
            {
                type: 'minimize',
                tooltip: 'Свернуть',
                handler: function () {
                    return false;
                }
            },
            {
                type: 'maximize',
                tooltip: 'Развернуть',
                handler: function () {
                    return false;
                }
            },
            {
                type: 'close',
                tooltip: 'Закрыть',
                handler: function () {
                    return false;
                }
            }
        ],

        listeners: {
            afterrender: function (item) {
                item.tools['collapse-top'].hide();
                item.tools['close'].hide();
                item.tools['maximize'].hide();
                item.tools['minimize'].hide();
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                var b = item.body || item;
                selectedRecord.set('name', item.name);
                b.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                b.on('contextmenu', function(e) {
                    var focused = FormGenerator.editor.Focused.getFocusedCmp();
                    if (focused && focused.record.get('component').toLowerCase() == selectedRecord.get('component').toLowerCase() && focused.name == item.name) {
                        var menu = getContextMenu();
                        menu.down('menuitem[action=onDelete]').on('click', function () {
                            FormGenerator.editor.Focused.clearFocusedCmp();
                            form.fireEvent('ComponentRemoved', form, cmp, item);
                            cmp.remove(item, true);
                        });
                        menu.showAt(e.getXY());
                    }
                });
            },
            resize: function (item, width, height, eOpts) {
                item.record.get('properties')['width'] = width;
                item.record.get('properties')['height'] = height;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                form.doLayout();
            },
            render: function (item) {
                afterFirstLayout(this);
            }
        }
    });
};