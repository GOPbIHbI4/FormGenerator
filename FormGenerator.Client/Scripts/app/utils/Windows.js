Ext.define('FormGenerator.utils.Windows', {
    extend: 'Ext.util.Observable',
    singleton: true,

    open: function (winxtype, options, noMaximize, modal, single, noShow) {
        var me = this;
        var win;
        noShow = noShow || false;
        if (modal) {
            win = Ext.widget(winxtype);
        } else {
            //Ищем существующие окна
            var wins = Ext.ComponentQuery.query('[xtype=' + winxtype + ']');
            //Если окно одиночное
            if (single) {
                //существующее окно выводим на передний план
                if (wins && wins.length > 0) {
                    wins[0].show();
                    wins[0].toFront(true);
                    return;
                } else {
                    //Если окна нет, то создаем его
                    win = Ext.widget(winxtype);
                }
            } else {
                //Если окно не одиночное, то перебираем существующие окна.
                //Ищем максимальный индекс все открытых окон, данного типа
                var index = 0;
                if (wins && (wins.length > 0)) {
                    for (var i = 0; i < wins.length; i++) {
                        if (wins.index > index) index = wins.index;
                    }
                    index++;
                }
                //Создаем окно, с index+1
                win = Ext.widget(winxtype);
                if (index > 0) {
                    win.index = index;
                    win.title = win.title + ' (' + win.index + ')';
                }
            }

            //Опции поведения панели инструментов
            if (noMaximize) {
                win.tools = [];
            } else {
                win.tools = [
                    {
                        type: 'maximize',
                        tooltip: 'Развернуть',
                        handler: function () {
                            this.up('window').toggleMaximize();
                            this.hide();
                            this.up('window').down('tool[type=restore]').show();
                        }
                    },
                    {
                        type: 'restore',
                        tooltip: 'Свернуть в окно',
                        hidden: true,
                        handler: function () {
                            this.up('window').toggleMaximize();
                            this.hide();
                            this.up('window').down('tool[type=maximize]').show();
                        }
                    }
                ];
            }
        }
        //установка дополнительных свойств
        if (options) {
            for (var prop in options) {
                win[prop] = options[prop];
            }
        }

        if (!noShow) {
            win.show();
        }

        return win;
    }
});