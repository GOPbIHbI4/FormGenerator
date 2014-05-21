//======================================================================================================================
//                     Генератор текстового поля/поля даты
//======================================================================================================================
comboBoxFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    return Ext.create('Ext.form.field.ComboBox', {
        xtype:'combobox',
        margin:'5 5 0 5',

        valueField:'key',
        displayField:'value',
        queryMode:'local',
        editable:false,

        fieldLabel:'MyCombobox',
        labelWidth:100,
        emptyText:'MyCombobox...',
        name:'sencha' + 'combobox' + getRandomInt(),
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