Ext.define('FormGenerator.controller.formGenerator.dictionaries.NameEditor', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.formGenerator.dictionaries.NameEditor'
    ],

    init: function () {
        this.control({
            'NameEditor': {
                afterrender: this.onAfterrender
            },
            'NameEditor button[name=save]': {
                click: this.onSave
            },
            'NameEditor button[name=close]': {
                click: this.onClose
            }
        });
    },

    onAfterrender: function (win) {
        var _this = this;
        var text_name = win.down('textfield[name=text]');
        text_name.setValue(win.oldName);
    },

    onSave:function(button){
        var win = button.up('window');
        var text_name = win.down('textfield[name=text]');
        win.fireEvent('nameChecked', text_name.getValue());
        win.close();
    },

    onClose: function (button) {
        button.up('window').close();
    }
});