Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': 'Scripts/app/utils/ux'
    }
});

Ext.Loader.setPath({
    'Ext.ux': 'Scripts/app/utils/ux'
});

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