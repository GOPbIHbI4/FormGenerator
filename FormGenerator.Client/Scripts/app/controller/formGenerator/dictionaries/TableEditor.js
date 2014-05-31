Ext.define('FormGenerator.controller.formGenerator.dictionaries.TableEditor', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.formGenerator.dictionaries.TableEditor'
    ],

    init: function () {
        this.control({
            'TableEditor': {
                afterrender: this.onAfterrender
            },
            'TableEditor button[name=save]': {
                click: this.onSave
            },
            'TableEditor button[name=close]': {
                click: this.onClose
            }
        });
    },

    onAfterrender: function (win) {
        var _this = this;
        var text_name = win.down('textfield[name=text]');
        var text_dbname = win.down('textfield[name=dbname]');
        text_name.setValue(win.oldName);
        text_dbname.setValue(win.oldDbName);
    },

    onSave:function(button){
        var win = button.up('window');
        var text_name = win.down('textfield[name=text]');
        var text_dbname = win.down('textfield[name=dbname]');

        if (!text_name.getValue() || text_name.getValue() == '') {
            FormGenerator.utils.MessageBox.show('Придумайте название таблицы!', null, -1);
            return;
        }
        if (!text_dbname.getValue() || text_dbname.getValue() == ''){
            FormGenerator.utils.MessageBox.show('Придумайте имя таблицы в БД!', null, -1);
            return;
        }

        win.fireEvent('nameChecked', {
            name: text_name.getValue(),
            dbname: text_dbname.getValue()
        });
        win.close();
    },

    onClose: function (button) {
        button.up('window').close();
    }
});