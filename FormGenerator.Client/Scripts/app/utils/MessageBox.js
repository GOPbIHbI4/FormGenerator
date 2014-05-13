Ext.define('FormGenerator.utils.MessageBox', {
    extend: 'Ext.window.MessageBox',
    singleton: true,

    init: function () {
        this.addEvents(['confirm', 'ok', 'abort', 'cancel']);
        var me = this;
        me.callParent(arguments);
    },

    show: function (message, bt, resultCode) {
        var buttons = bt || Ext.Msg.OK;
        var title;
        var icon;
        switch (resultCode) {
            case 1:
                icon = Ext.MessageBox.WARNING;
                title = 'Предупреждение';
                break;
            case -1:
                icon = Ext.MessageBox.ERROR;
                title = 'Ошибка';
                break;
            case 0:
            default :
                icon = Ext.MessageBox.INFO;
                title = 'Сообщение';
        }

        Ext.Msg.on('show', function () {
            Ext.Msg.doComponentLayout();
            Ext.Msg.doLayout();
        }, this, {single: true});

        return Ext.Msg.show({
            title: title,
            msg: message,
            buttons: buttons,
            icon: icon
        });
    },

    question: function (msg, fn, bt) {
        bt = bt || Ext.Msg.YESNO;
        return Ext.Msg.show({
            title: 'Подтверждение',
            msg: msg,
            buttons: bt,
            icon: Ext.Msg.QUESTION,
            fn: function (res) {
                if (fn != undefined) {
                    fn(res);
                }
            }
        });
    }
});