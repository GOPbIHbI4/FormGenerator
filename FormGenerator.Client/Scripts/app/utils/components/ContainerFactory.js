//======================================================================================================================
//                     Генератор группы полей
//======================================================================================================================
containerFactory = function (win, cmp, selectedRecord, layout) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    return Ext.create('Ext.container.Container', {
        xtype:'container',
        margin:5,
        padding:2,
        border: 1,
        style: {
            borderColor:'#dfe8f6',
            borderStyle:'solid',
            borderWidth:'1px'
        },
        layout:{
            type: layout || 'hbox'
        },
        name:'sencha' + 'container' + FormGenerator.editor.Random.get(),
        width: 200,
        height:100,
        resizable:true,
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                item.el.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                item.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                item.el.on('contextmenu', function(e) {
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
            }
        }
    });
};