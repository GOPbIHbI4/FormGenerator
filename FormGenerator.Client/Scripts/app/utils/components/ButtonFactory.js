//======================================================================================================================
//                                            Генератор кнопки
//======================================================================================================================
buttonFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var num = FormGenerator.editor.Random.get();
    return Ext.create('Ext.button.Button', {
        xtype: 'button',
        scale:'small',
        border:true,
        icon:'Scripts/resources/icons/save_16.png',
        name: 'sencha' + 'button' + num,
        padding:2,
        margin:5,
        text: 'Моя кнопка',
        form: form,
        record: selectedRecord,
        listeners: {
            afterrender: function (item) {
                var b = item.body || item.el || item;
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                b.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                b.on('contextmenu', function(e) {
                    var focused = FormGenerator.editor.Focused.getFocusedCmp();
                    if (focused && focused.record.get('component').toLowerCase() == 'button' && focused.name == item.name) {
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
                item.record.get('properties')['height'] = height;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
            }
        }
    });
};