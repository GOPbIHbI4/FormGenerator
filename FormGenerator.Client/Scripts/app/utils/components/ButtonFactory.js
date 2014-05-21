//======================================================================================================================
//                                            Генератор кнопки
//======================================================================================================================
buttonFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var num = getRandomInt();
    return Ext.create('Ext.button.Button', {
        xtype: 'button',
        scale:'small',
        border:true,
        icon:'Scripts/resources/icons/save_16.png',
//        width:22,
//        height:22,
        name: 'sencha' + 'button' + num,
        padding:2,
        margin:5,
        text: 'My Button',
        form: form,
        record: selectedRecord,
        listeners: {
            afterrender: function (item) {
                var b = item.body || item.el || item;
                selectedRecord.set('name', item.name);
                b.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                b.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                b.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        OSO.controller.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.remove(item, true);
                    });
                    menu.showAt(e.getXY());
                });
            },
            resize: function (win, width, height, eOpts) {
                win.record.get('properties')['width'] = width;
                win.record.get('properties')['height'] = height;
//                propertiesGrid.setSource(win.record.get('properties'));
            }
        }
    });
};