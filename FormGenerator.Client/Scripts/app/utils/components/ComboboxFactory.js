//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
comboboxFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    return Ext.create('Ext.form.field.ComboBox', {
        xtype:'combobox',
        margin:'5 5 0 5',

        valueField:'key',
        displayField:'value',
        queryMode:'local',
        editable:false,

        fieldLabel:'Мой комбобокс',
        labelWidth:100,
        emptyText:'MyCombobox...',
        name:'sencha' + 'combobox' + FormGenerator.editor.Random.get(),
        width: 300,

        //второй триггер очистки комбобокса
        trigger2Cls : 'x-form-clear-trigger',

        form:form,
        record:selectedRecord,
        listeners:{
            onTrigger2Click:function () {
                var me = this;
                me.clearValue();
            },
            afterrender: function (item) {
                var iBody = item.body || item;
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                iBody.el.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
//                    console.log(win.mousedComponents);
                });
                iBody.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
//                    console.log(win.mousedComponents);
                });
                iBody.el.on('contextmenu', function(e) {
                    var focused = FormGenerator.editor.Focused.getFocusedCmp();
                    if (focused && focused.record.get('component').toLowerCase() == 'combobox' && focused.name == item.name) {
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
            }
        }
    });

};