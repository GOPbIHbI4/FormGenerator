//======================================================================================================================
//                     Генератор таблицы
//======================================================================================================================
gridpanelFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var store = Ext.create('Ext.data.SimpleStore', {
        fields:[],
        data: []
    });
    return Ext.create('Ext.grid.Panel', {
        xtype:'gridpanel',
        title: 'Моя таблица',
        height:150,
        width:200,
        minWidth:50,
        minHeight:50,
        margin:5,
        resizable:true,
        columnLines:true,
        collapsible:true,
        columns:[],
        viewConfig:{
            loadingText:'Загрузка...'
        },
//        features:[{
//            ftype:'summary',
//            id: 'summ',
//            showSummaryRow: false
//        }],
        name:'sencha' + 'gridpanel' + getRandomInt(),
        form:form,
        store:store,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.tools['collapse-top'].hide();
                item.record.get('properties')['name'] = item.name;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                selectedRecord.set('name', item.name);
                var i = item.body || item.el || item;
                i.on('mouseover', function(){
                    win.mousedComponents.push(selectedRecord);
                });
                i.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                i.on('contextmenu', function(e) {
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
                item.record.get('properties')['height'] = height;
                var focusedCmp = FormGenerator.editor.Focused.getFocusedCmp();
                if (focusedCmp && focusedCmp.name && focusedCmp.name == item.name) {
                    propertiesGrid.setSource(item.record.get('properties'));
                }
                form.doLayout();
            },
            render: function () {
                afterFirstLayout(this);
            }
        }
    });
};