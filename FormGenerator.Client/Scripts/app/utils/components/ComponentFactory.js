function afterFirstLayout(cmp) {
    var _this = cmp;
    var body = cmp.body || cmp.el || cmp;     // body of component
    var form = _this.form;          // form with window
    var win = form.up('window');    // main window
    var gridComponents = win.down('gridpanel[name=components]');

    _this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
        ddGroup: 'grid-to-' + cmp.record.get('component').toLowerCase(),
        allowDrop: true,
        notifyOver: function (ddSource, e, data) {
            // Решить, является ли данный элемент нашей группой
            var isOK = false; var target = null;
            var draggedCmp = ddSource.dragData.records[0];
            if (win.mousedComponents.length > 0) {
                var dragOn = win.mousedComponents[0].get('component');
                var moused = win.mousedComponents[0];
                var cmpType = moused.get('name') == 'senchawin' ? 'panel' : moused.get('component').toLowerCase();
                target = win.query(cmpType + '[name=' + moused.get('name') + ']')[0];
                var dragOnChildren = gridComponents.getStore().findRecord('component', dragOn).get('childComponents');
                if (contains(dragOnChildren, draggedCmp.get('component'))) isOK = true;
            }
            if (isOK) {
                this.allowDrop = true;
//                if (target && FormGenerator.view.editor.Moused.checkMoused(target)) {
//                    (target.body || target).stopAnimation();
//                    (target.body || target).highlight();
//                }
                return Ext.baseCSSPrefix + 'dd-drop-ok';
            } else {
                this.allowDrop = false;
                return Ext.baseCSSPrefix + 'dd-drop-nodrop';
            }
        },
        notifyEnter: function (ddSource, e, data) {
            //Add some flare to invite drop.
//            body.stopAnimation();
//            body.highlight();
        },
        notifyDrop: function (ddSource, e, data) {
            if (!this.allowDrop || win.mousedComponents.length == 0) return false;
            var moused = win.mousedComponents[0];
            var cmpType = moused.get('name') == 'senchawin' ? 'panel' : moused.get('component').toLowerCase();
            var target = win.query(cmpType + '[name=' + moused.get('name') + ']')[0];
            var store = deepCloneStore(ddSource.view.getStore());
            var selectedRecord = store.findRecord('component', ddSource.dragData.records[0].get('component'));
            var item;
            var isDocked = false;
            var isColumn = false;
            switch (selectedRecord.get('component').toLowerCase()) {
                case 'panel':
                    item = panelFactory(win, target, selectedRecord);
                    break;
                case 'tabpanel':
                    item = tabPanelFactory(win, target, selectedRecord);
                    break;
                case 'newtab':
                    item = tabFactory(win, target, selectedRecord);
                    break;
                case 'gridpanel':
                    item = gridPanelFactory(win, target, selectedRecord);
                    break;
                case 'gridcolumn':
                    item = gridColumnFactory(win, target, selectedRecord);
                    isColumn = true;
                    break;
                case 'datecolumn':
                    item = dateColumnFactory(win, target, selectedRecord);
                    isColumn = true;
                    break;
                case 'numbercolumn':
                    item = numberColumnFactory(win, target, selectedRecord);
                    isColumn = true;
                    break;
                case 'textfield':
                    item = textFieldFactory(win, target, selectedRecord);
                    break;
                case 'fieldset':
                    item = fieldSetFactory(win, target, selectedRecord);
                    break;
                case 'container':
                    item = containerFactory(win, target, selectedRecord);
                    break;
                case 'datefield':
                    item = dateFieldFactory(win, target, selectedRecord);
                    break;
                case 'numberfield':
                    item = numberFieldFactory(win, target, selectedRecord);
                    break;
                case 'combobox':
                    item = comboBoxFactory(win, target, selectedRecord);
                    break;
                case 'button':
                    item = buttonFactory(win, target, selectedRecord);
                    break;
                case 'toolbar':
                    item = toolBarFactory(win, target, selectedRecord);
                    isDocked = true;
                    break;
                default:
                    return false;
            }
            if (target) {
                if (isDocked) {
                    target.addDocked(item);
                } else if (isColumn) {
                    target.headerCt.insert(target.columns.length, item);
                    target.getView().refresh();
                } else {
                    target.add(item);
                }
                target.doLayout();
                form.doLayout();
                form.fireEvent('ComponentAdded', form, target, item);
                return true;
            } else {
                return false;
            }
        }
    });
    _this.formPanelDropTarget.removeFromGroup('grid-to-' + cmp.record.get('component').toLowerCase());
    cmp.record.get('childComponents').forEach(function (item) {
        _this.formPanelDropTarget.addToGroup('grid-to-' + item.toLowerCase());
    });
}

function getContextMenu(){
    return new Ext.menu.Menu({
        items: [
            {
                xtype:'menuitem',
                icon: 'Scripts/resources/icons/delete_16.png',
                border: true,
                iconAlign: 'left',
                scale: 'medium',
                action:'onDelete',
                text: 'Delete'
            }
        ]
    });
}


function setMargin(obj, value){
    if (!value || value.toString().trim() == ''){
        obj.setStyle({'margin' : '0px'});
        return;
    }
    var array = value.split(' ');
    if (!array || array.length != 1 && array.length != 4) {
        console.log('Margin of ' + obj.record.get('component').toLowerCase() + ' is incorrect. (Margin = [' + value + ']).');
        return;
    }

    if (array.length == 1){
        if (!isNumber(array[0])){
            console.log('Margin of ' + obj.record.get('component').toLowerCase() + ' is incorrect. (Margin = [' + value + ']).');
        } else {
            obj.setStyle({'margin': array[0] + 'px'});
        }
    } else {
        for(var i = 0; i < 4; i++){
            if (!isNumber(array[i])){
                console.log('Margin of ' + obj.record.get('component').toLowerCase() + ' is incorrect. (Margin = [' + value + ']).');
                return;
            }
        }
        obj.setStyle({'margin-top': array[0] + 'px'});
        obj.setStyle({'margin-right': array[1] + 'px'});
        obj.setStyle({'margin-bottom': array[2] + 'px'});
        obj.setStyle({'margin-left': array[3] + 'px'});
    }
}

function setPadding(obj, value){
    if (!value || value.toString().trim() == ''){
        obj.setStyle({'padding' : '0px'});
        return;
    }
    var array = value.split(' ');
    if (!array || array.length != 1 && array.length != 4) {
        console.log('Padding of ' + obj.record.get('component').toLowerCase() + ' is incorrect. (Padding = [' + value + ']).');
        return;
    }

    if (array.length == 1){
        if (!isNumber(array[0])){
            console.log('Padding of ' + obj.record.get('component').toLowerCase() + ' is incorrect. (Padding = [' + value + ']).');
        } else {
            obj.setStyle({'padding': array[0] + 'px'});
        }
    } else {
        for(var i = 0; i < 4; i++){
            if (!isNumber(array[i])){
                console.log('Padding of ' + obj.record.get('component').toLowerCase() + ' is incorrect. (Padding = [' + value + ']).');
                return;
            }
        }
        obj.setStyle({'padding-top': array[0] + 'px'});
        obj.setStyle({'padding-right': array[1] + 'px'});
        obj.setStyle({'padding-bottom': array[2] + 'px'});
        obj.setStyle({'padding-left': array[3] + 'px'});
    }
}