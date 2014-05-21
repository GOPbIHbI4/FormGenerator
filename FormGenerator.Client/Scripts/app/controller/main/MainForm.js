Ext.define('FormGenerator.controller.main.MainForm', {
    extend: 'Ext.app.Controller',

    views: [
        'FormGenerator.view.main.MainForm'
    ],

    init: function () {
        this.control({
            'MainForm button[action=onTest]': {
                click: this.onTest2
            },
            'MainForm button[action=onTest1]': {
                click: this.onTest
            }
        });
    },

    onTest: function (button) {
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.Test');
        FormGenerator.utils.Windows.open('Test', {});
    },

    onTest2: function (button) {
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.FormEditor');
        FormGenerator.utils.Windows.open('FormEditor', {});
    },

    onTest1: function (button) {
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.formGenerator.dictionaries.DictionariesAdministrator');
        FormGenerator.utils.Windows.open('DictionariesAdministrator', {});
    }
});