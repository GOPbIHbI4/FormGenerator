//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
numberFieldFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    //шаблоны
    return Ext.create('Ext.form.field.Number', {
        xtype:'numberfield',
        allowDecimals:false,
        maxValue: 99,
        minValue: 0,
        allowExponential:false,
        allowBlank:true,
        margin:'5 5 0 5',
        fieldLabel:'MyNumberField',
        labelWidth:100,
        keyNavEnabled:false,
        mouseWheelEnabled:false,
        labelSeparator:'',
        readOnly:true,
        name:'sencha' + 'numberfield' + getRandomInt(),
        width: 200,
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.triggerCell.show();
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