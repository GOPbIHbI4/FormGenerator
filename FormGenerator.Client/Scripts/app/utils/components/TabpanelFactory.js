//======================================================================================================================
//                     Генератор панели со вложенными табами
//======================================================================================================================
tabPanelFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var num = getRandomInt();
    //шаблоны
    return Ext.create('Ext.tab.Panel', {
        xtype: 'tabpanel',
        activeTab: 0,
        name: 'sencha' + 'tabpanel' + num,
        width: 300,
        height: 200,
        minWidth: 200,
        minHeight: 200,
        resizable: true,
        closable: false,
        collapsible: true,
        title: 'MyTabPanel',
        form: form,
        record: selectedRecord,
        listeners: {
            afterrender: function (panel) {
                var b = panel.body || panel.el || panel;
                selectedRecord.set('name', panel.name);
                b.on('mouseover', function () {
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function () {
                    win.mousedComponents.pop(selectedRecord);
                });
                panel.tabBar.el.on('contextmenu', function (e) {
                    if (FormGenerator.controller.editor.Focused.getFocusedCmp().record.get('component').toLowerCase() == 'tabpanel') {
                        var menu = getContextMenu();
                        menu.down('menuitem[action=onDelete]').on('click', function () {
                            FormGenerator.controller.editor.Focused.clearFocusedCmp();
                            form.fireEvent('ComponentRemoved', form, cmp, panel);
                            cmp.remove(panel, true);
                        });
                        menu.showAt(e.getXY());
                    }
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