//======================================================================================================================
//                     Генератор группы полей
//======================================================================================================================
fieldSetFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
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
                item.el.on('mouseover', function(){
                    selectedRecord.set('name', item.name);
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
                        OSO.controller.editor.Focused.clearFocusedCmp();
                        form.fireEvent('ComponentRemoved', form, cmp, item);
                        cmp.remove(item, true);
                    });
                    menu.showAt(e.getXY());
                });
            },
            render: function () {
                afterFirstLayout(this);
            }
        }
    });
};