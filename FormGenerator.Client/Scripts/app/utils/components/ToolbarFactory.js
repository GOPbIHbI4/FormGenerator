//======================================================================================================================
//                     Генератор группы полей
//======================================================================================================================
toolBarFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
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
                item.el.on('mouseover', function(){
                    selectedRecord.set('name', item.name);
                    win.mousedComponents.push(selectedRecord);
                });
                item.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                item.el.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.controller.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.removeDocked(item, true);
                    });
                    menu.showAt(e.getXY());
                });
            },
            render: function () {
                afterFirstLayout(this);
            }
        }
    });
};