//======================================================================================================================
//                     Генератор панели со вложенными табами
//======================================================================================================================
tabpanelFactory = function (win, cmp, selectedRecord) {
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
            afterrender: function (item) {
                var b = item.body || item.el || item;
                selectedRecord.set('name', item.name);
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                b.on('mouseover', function () {
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function () {
                    win.mousedComponents.pop(selectedRecord);
                });
                item.tabBar.el.on('contextmenu', function (e) {
                    if (FormGenerator.editor.Focused.getFocusedCmp().record.get('component').toLowerCase() == 'tabpanel') {
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