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
            afterrender: function (panel) {
                var b = panel.body || panel.el || panel;
                selectedRecord.set('name', panel.name);
                b.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                panel.tab.el.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.controller.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, panel);
                        cmp.remove(panel, true);
                    });
                    menu.showAt(e.getXY());
                });
                panel.tab.on('click', function(){
                    Ext.FocusManager.fireEvent('componentfocus', Ext.FocusManager, panel);
                });
            },
            beforeclose:function(){
                return false;
            },
            render: function (panel) {
                afterFirstLayout(this);
            }
        }
    });
};