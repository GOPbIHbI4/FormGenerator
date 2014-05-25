//======================================================================================================================
//                     Генератор панели со вложенными табами
//======================================================================================================================
tabFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var num = getRandomInt();
    //шаблоны
    return Ext.create('Ext.panel.Panel', {
        xtype: 'panel',
        activeTab: 0,
        name: 'sencha' + 'tab' + num,
        closable: true,
        title: 'My TabPanel',
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
                b.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                item.tab.el.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.remove(item, true);
                    });
                    menu.showAt(e.getXY());
                });
                item.tab.on('click', function(){
                    Ext.FocusManager.fireEvent('componentfocus', Ext.FocusManager, item);
                });
            },
            beforeclose:function(){
                return false;
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