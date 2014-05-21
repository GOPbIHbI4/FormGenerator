//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
panelFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var num = getRandomInt();
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
        title: 'My Panel',
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
            afterrender: function (panel) {
                panel.tools['collapse-top'].hide();
                panel.tools['close'].hide();
                panel.tools['maximize'].hide();
                panel.tools['minimize'].hide();
                var b = panel.body || panel;
                selectedRecord.set('name', panel.name);
                b.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                b.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.controller.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, panel);
                        cmp.remove(panel, true);
                    });
                    menu.showAt(e.getXY());
                });
            },
            resize: function (win, width, height, eOpts) {
                win.record.get('properties')['width'] = width;
                win.record.get('properties')['height'] = height;
                propertiesGrid.setSource(win.record.get('properties'));
                form.doLayout();
            },
            render: function (panel) {
                afterFirstLayout(this);
            }
        }
    });
};