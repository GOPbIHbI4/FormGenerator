Ext.application({
    name: 'FormGenerator',
    appFolder: 'Scripts/app',

    controllers: [
        'main.MainForm'
    ],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: {
                xtype: 'MainForm'
            }
        }).show();
    }
});