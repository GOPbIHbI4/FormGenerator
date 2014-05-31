Ext.define('FormGenerator.controller.main.MainForm', {
    extend: 'Ext.app.Controller',
    requires:[
        'FormGenerator.utils.formGenerator.GeneratorFormFactory'
    ],

    views: [
        'FormGenerator.view.main.MainForm'
    ],

    init: function () {
        this.control({
            'MainForm button[action=onTest]': {
                click: this.onTest2
            },
            'MainForm button[action=onTest1]': {
                click: this.onTest1
            },
            'MainForm button[action=onTest2]': {
                click: this.onTest
            }
        });
    },

    onTest: function (button) {
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.query.FormQueries');
        var queryFrom = FormGenerator.utils.Windows.open('FormQueries', { }, null, true);
    },

    onTest2: function (button) {
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.FormEditor');
        FormGenerator.utils.Windows.open('FormEditor', {}, null, true);
    },

    onTest1: function (button) {
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.formGenerator.dictionaries.DictionariesAdministrator');
        FormGenerator.utils.Windows.open('DictionariesAdministrator', {});
    }
});