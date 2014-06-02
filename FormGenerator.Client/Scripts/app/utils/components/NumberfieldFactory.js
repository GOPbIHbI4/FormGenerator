//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
numberfieldFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    //шаблоны
    return Ext.create('Ext.form.field.Number', {
        xtype:'numberfield',
        allowDecimals:false,
        maxValue: 99,
        minValue: 0,
        allowExponential:false,
        allowBlank:true,
        margin:'0 5 5 5',
        fieldLabel:'Мое число',
        labelWidth:100,
        keyNavEnabled:false,
        mouseWheelEnabled:false,
        labelSeparator:':',
        readOnly:true,
        name:'sencha' + 'numberfield' + FormGenerator.editor.Random.get(),
        width: 200,
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.triggerCell.show();
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                var iBody = item.body || item;
                iBody.el.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                iBody.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                iBody.el.on('contextmenu', function(e) {
                    var focused = FormGenerator.editor.Focused.getFocusedCmp();
                    if (focused && focused.record.get('component').toLowerCase() == selectedRecord.get('component').toLowerCase() && focused.name == item.name) {
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
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                form.doLayout();
            }
        }
    });
};