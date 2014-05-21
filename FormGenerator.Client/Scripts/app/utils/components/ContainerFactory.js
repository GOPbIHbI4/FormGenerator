//======================================================================================================================
//                     Генератор группы полей
//======================================================================================================================
containerFactory = function (win, cmp, selectedRecord) {
    var body = cmp.body || cmp;
    var form = win.down('form[name=mainPanel]');
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
            type:'hbox'
        },
        name:'sencha' + 'container' + getRandomInt(),
        width: 200,
        height:100,
        resizable:true,
        form:form,
        record:selectedRecord,
        listeners:{
            afterrender: function (item) {
                item.el.on('mouseover', function(){
                    selectedRecord.set('name', item.name);
                    win.mousedComponents.push(selectedRecord);
                });
                item.el.on('mouseout', function(){
                    win.mousedComponents.pop(selectedRecord);
                });
                item.el.on('contextmenu', function(e) {
                    var menu = getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function(){
                        FormGenerator.controller.editor.Focused.clearFocusedCmp();
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