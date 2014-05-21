//======================================================================================================================
//                     Генератор таблицы
//======================================================================================================================
gridPanelFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
    var propertiesGrid = win.down('propertygrid[name=properties]');
    var store = Ext.create('Ext.data.SimpleStore', {
        fields:[],
        data: []
    });
    return Ext.create('Ext.grid.Panel', {
        xtype:'gridpanel',
        title: 'MyGridPanel',
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
                var i = item.body || item.el || item;
                i.on('mouseover', function(){
                    selectedRecord.set('name', item.name);
                    win.mousedComponents.push(selectedRecord);
                });
                i.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                i.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.controller.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.remove(item, true);
                    });
                    menu.showAt(e.getXY());
                });
            },
            resize: function (win, width, height, eOpts) {
                win.record.get('properties')['width'] = width;
                win.record.get('properties')['height'] = height;
                propertiesGrid.setSource(win.record.get('properties'));
                form.doLayout();
            },
            render: function () {
                afterFirstLayout(this);
            }
        }
    });
};