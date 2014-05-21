//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
textFieldFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    //шаблоны
    return Ext.create('Ext.form.field.Text', {
        xtype:'textfield',
        allowBlank:true,
        margin:'5 5 0 5',
        fieldLabel:'My TextField',
        labelWidth:100,
        readOnly:true,
        name:'sencha' + 'textfield' + getRandomInt(),
        width: 200,
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                var iBody = item.body || item;
                iBody.el.on('mouseover', function(){
                    selectedRecord.set('name', item.name);
                    win.mousedComponents.push(selectedRecord);
                });
                iBody.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                iBody.el.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.controller.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.remove(item, true);
                    });
                    menu.showAt(e.getXY());
                });
            }
        }
    });
};