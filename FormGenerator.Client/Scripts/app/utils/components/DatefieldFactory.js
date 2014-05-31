//======================================================================================================================
//                     Генератор поля даты
//======================================================================================================================
datefieldFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    return Ext.create('Ext.form.field.Date', {
        xtype:'datefield',
        allowBlank:true,
        margin:'0 5 5 5',
        fieldLabel:'Моя дата',
        labelWidth:100,
        labelSeparator:'',
        value:new Date(),
        format:'d.m.Y',
        submitFormat:'Y-m-dTH:i:s',
        name:'sencha' + 'datefield' + getRandomInt(),
        width: 195,
        readOnly:true,
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
                    if (focused && focused.record.get('component').toLowerCase() == 'datefield' && focused.name == item.name) {
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