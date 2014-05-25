//======================================================================================================================
//                     Генератор группы полей
//======================================================================================================================
fieldsetFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    //шаблоны
    return Ext.create('Ext.form.FieldSet', {
        xtype:'fieldset',
        margin:5,
        padding:2,
        collapsible: true,
        title:'My FieldSet',
        name:'sencha' + 'fieldset' + getRandomInt(),
        width: 200,
        height:100,
        form:form,
        resizable:true,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.toggleCmp.hide();
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                item.el.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
//                    console.log(win.mousedComponents);
                });
                item.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
//                    console.log(win.mousedComponents);
                });
                item.el.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.remove(item, true);
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