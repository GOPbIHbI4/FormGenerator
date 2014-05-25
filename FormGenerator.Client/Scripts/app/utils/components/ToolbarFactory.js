//======================================================================================================================
//                     Генератор группы полей
//======================================================================================================================
toolbarFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    //шаблоны
    return Ext.create('Ext.toolbar.Toolbar', {
        xtype:'toolbar',
        padding:2,
        width: 50,
        minWidth:20,
        minHeight:20,
        dock:'right',
        name:'sencha' + 'toolbar' + getRandomInt(),
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.record.get('properties')['name'] = item.name;
                selectedRecord.set('name', item.name);
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                item.el.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                item.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                item.el.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.removeDocked(item, true);
                    });
                    menu.showAt(e.getXY());
                });
            },
            render: function () {
                afterFirstLayout(this);
            },
            resize: function (item, width, height, eOpts) {
                item.record.get('properties')['width'] = width;
                item.record.get('properties')['height'] = height;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                form.doLayout();
            }
        }
    });
};