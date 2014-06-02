//======================================================================================================================
//                     Генератор колонки таблицы
//======================================================================================================================
gridcolumnFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var num = FormGenerator.editor.Random.get();
    return Ext.create('Ext.grid.column.Column', {
        xtype:'gridcolumn',
        header: 'Моя колонка',
        width:150,
        sortable:true,
        minWidth:50,
        dataIndex:'sencha' + 'gridcolumn' + num,
        name:'sencha' + 'gridcolumn' + num,
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                var i = item.body || item.el || item;
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                i.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                i.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                i.on('contextmenu', function(e) {
                    var focused = FormGenerator.editor.Focused.getFocusedCmp();
                    if (focused && focused.record.get('component').toLowerCase() == 'gridcolumn' && focused.name == item.name) {
                        var menu = getContextMenu();
                        menu.down('menuitem[action=onDelete]').on('click', function () {
                            FormGenerator.editor.Focused.clearFocusedCmp();
                            form.fireEvent('ComponentRemoved', form, cmp, item);
                            cmp.headerCt.remove(item, true);
                            cmp.getView().refresh();
                        });
                        menu.showAt(e.getXY());
                    }
                });
                item.on('headerclick', function(ct, column, e, t, eOpts){
                    Ext.FocusManager.fireEvent('componentfocus', Ext.FocusManager, item);
                });
            },
            resize: function (col, width, height, oldWidth, oldHeight, eOpts) {
                col.record.get('properties')['width'] = width;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == col.name) {
                    propertiesGrid.setSource(col.record.get('properties'));
                }
                form.doLayout();
            }
        }
    });
};