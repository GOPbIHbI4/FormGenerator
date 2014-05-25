//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
windowFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    return Ext.create('Ext.panel.Panel', {
        xtype: 'window',
        name: 'sencha' + 'win',
        form: form,
        width: 500,
        height: 300,
        minWidth: 200,
        maxWidth:1000,
        minHeight: 200,
        maxHeight:1000,
        margin: 5,
        resizable: true,
        draggable: false,
        constrain: true,
        renderTo: body,
        layout:'anchor',
        mainWindow: true,
        closable: false,
        collapsible: true,
        record: selectedRecord,
        title: 'My Window',
        items: [],
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
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                var b = item.body || item.el || item;
                b.on('mouseover', function () {
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function () {
                    win.mousedComponents.pop(selectedRecord);
                });
                b.on('contextmenu', function(e) {
                    var focused = FormGenerator.editor.Focused.getFocusedCmp();
                    if (focused.record.get('component').toLowerCase() == 'window') {
                        var menu = getContextMenu();
                        menu.down('menuitem[action=onDelete]').on('click', function(){
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
            render: function () {
                afterFirstLayout(this);
            }
        }
    });
};