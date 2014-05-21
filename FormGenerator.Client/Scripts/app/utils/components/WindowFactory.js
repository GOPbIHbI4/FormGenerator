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
            afterrender: function (panel) {
                panel.tools['collapse-top'].hide();
                panel.record.get('properties')['name'] = panel.name;
                propertiesGrid.setSource(panel.record.get('properties'));
                selectedRecord.set('name', panel.name);
                var b = panel.body || panel.el || panel;
                b.on('mouseover', function () {
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function () {
                    win.mousedComponents.pop(selectedRecord);
                });
                b.on('contextmenu', function(e) {
                    var focused = FormGenerator.controller.editor.Focused.getFocusedCmp();
                    if (focused.record.get('component').toLowerCase() == 'window') {
                        var menu = getContextMenu();
                        menu.down('menuitem[action=onDelete]').on('click', function(){
                            FormGenerator.controller.editor.Focused.clearFocusedCmp();
                            form.fireEvent('ComponentRemoved', form, cmp, panel);
                            cmp.remove(panel, true);
                        });
                        menu.showAt(e.getXY());
                    }
                });
            },
            resize: function (panel, width, height, eOpts) {
                panel.record.get('properties')['width'] = width;
                panel.record.get('properties')['height'] = height;
                propertiesGrid.setSource(panel.record.get('properties'));
                form.doLayout();
            },
            render: function () {
                afterFirstLayout(this);
            }
        }
    });
};