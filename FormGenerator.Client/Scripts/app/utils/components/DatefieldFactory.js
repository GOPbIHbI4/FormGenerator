//======================================================================================================================
//                     Генератор поля даты
//======================================================================================================================
dateFieldFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    return Ext.create('Ext.form.field.Date', {
        xtype:'datefield',
        allowBlank:true,
        margin:'5 5 0 5',
        fieldLabel:'MyDateField',
        labelWidth:100,
        labelSeparator:'',
        value:new Date(),
        format:'d.m.Y',
        submitFormat:'Y-m-dTH:i:s',
        name:'sencha' + 'datefield' + getRandomInt(),
        width: 195,
        readOnly:true,
//        height:20,
//        minWidth: 120,
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.triggerCell.show();
                var iBody = item.body || item;
                iBody.el.on('mouseover', function(){
                    selectedRecord.set('name', item.name);
                    win.mousedComponents.push(selectedRecord);
//                    console.log(win.mousedComponents);
                });
                iBody.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
//                    console.log(win.mousedComponents);
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