//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
textfieldFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
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
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
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
                        FormGenerator.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.remove(item, true);
                    });
                    menu.showAt(e.getXY());
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
            }
        }
    });
};