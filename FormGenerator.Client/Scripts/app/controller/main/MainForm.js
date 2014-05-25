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
        FormGenerator.utils.Windows.open('Test', {}, null, true);
    },

    onTest2: function (button) {
        FormGenerator.utils.ControllerLoader.load('FormGenerator.controller.editor.FormEditor');
        FormGenerator.utils.Windows.open('FormEditor', {}, null, true);
    },

    onTest1: function (button) {
        Ext.Ajax.request({
            url: 'Home/Test',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, 1);
            },
            failure: function (objServerResponse) {
                FormGenerator.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    }
});