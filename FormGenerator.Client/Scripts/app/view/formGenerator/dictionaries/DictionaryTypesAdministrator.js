Ext.define('FormGenerator.view.formGenerator.dictionaries.DictionaryTypesAdministrator', {
    extend: 'Ext.window.Window',
    alias: 'widget.DictionaryTypesAdministrator',
    requires: [
        'Ext.ux.CheckColumn'
    ],

    modal: true,
    constrain: true,
    maximizable: true,

    height: 500,
    width: 800,
    minHeight: 500,
    minWidth: 800,

    layout: {
        type: 'border'
    },
    //----------------------------------------------------------
    initComponent: function () {
        var me = this;
        var dictionaryFieldsStore = Ext.create('FormGenerator.store.formGenerator.dictionaries.DictionaryTypesAdministrator');

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'right',
                    items: [
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Закрыть',
                            name: 'close',
                            border: true,
                            icon: 'Scripts/resources/icons/close.png',
                            iconAlign: 'top'
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Группы<br>словарей',
                            border: true,
                            name:'dictionary_groups',
                            disabled:true,
                            icon: 'Scripts/resources/icons/add.png',
                            iconAlign: 'top',
                            menu: [
                                {
                                    text: 'Корневой',
                                    name: 'add_group_root',
                                    border: true
                                },
                                {
                                    text: 'Добавить',
                                    name: 'add_group',
                                    border: true
                                },
                                {
                                    text: 'Изменить',
                                    name: 'edit_group',
                                    border: true
                                },
                                {
                                    text: 'Удалить',
                                    name: 'delete_group',
                                    border: true
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Словари',
                            border: true,
                            name:'dictionaries',
                            disabled:true,
                            icon: 'Scripts/resources/icons/add.png',
                            iconAlign: 'top',
                            menu: [
                                {
                                    text: 'Добавить',
                                    name: 'add_dictionary',
                                    border: true
                                },
                                {
                                    text: 'Удалить',
                                    name: 'delete_dictionary',
                                    border: true
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Поля',
                            border: true,
                            name:'fields',
                            disabled:true,
                            icon: 'Scripts/resources/icons/add.png',
                            iconAlign: 'top',
                            menu: [
                                {
                                    text: 'Добавить',
                                    name: 'add_field',
                                    border: true
                                },
                                {
                                    text: 'Изменить',
                                    name: 'edit_field',
                                    border: true
                                },
                                {
                                    text: 'Удалить',
                                    name: 'delete_field',
                                    border: true
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: 'Внешние<br>ключи',
                            border: true,
                            name:'fk',
                            disabled:true,
                            icon: 'Scripts/resources/icons/add.png',
                            iconAlign: 'top',
                            menu: [
                                {
                                    text: 'Добавить',
                                    name: 'add_fk',
                                    border: true
                                },
                                {
                                    text: 'Удалить',
                                    name: 'delete_fk',
                                    border: true
                                }
                            ]
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'treepanel',
                    name: 'dictionaries',
                    title: 'Типы словарей',
                    region: 'west',
                    split: true,
                    collapsible: true,
                    collapsed: false,
                    collapseDirection: 'left',
                    rootVisible: false,
                    viewConfig: {
                        width: 160
                    },
                    store: Ext.create('Ext.data.TreeStore', {
                        root: {
                            expanded: true,
                            name: 'root',
                            children: [
                            ]
                        }
                    })
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    name: 'main',
                    layout: {
                        type: 'fit'
                    },
                    items: [
                        {
                            xtype: 'gridpanel',
                            name: 'dictionary',
                            border: true,
                            columnLines: true,
                            autoScroll: true,
                            title: 'Поля',
                            store: dictionaryFieldsStore,
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'ID',
                                    hidden: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'dictionaryID',
                                    hidden: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'domainValueTypeID',
                                    hidden: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'pkID',
                                    hidden: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'fkID',
                                    hidden: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 100,
                                    flex: 1,
                                    text: 'Название',
                                    dataIndex: 'name'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 100,
                                    text: 'Атрибут таблицы БД',
                                    dataIndex: 'columnName'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 100,
                                    text: 'Тип значения',
                                    dataIndex: 'domainValueTypeName'
                                },
                                {
                                    xtype: 'checkcolumn',
                                    width: 100,
                                    text: 'Первичный ключ',
                                    dataIndex: 'primaryKey'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: 100,
                                    text: 'Внешний ключ',
                                    flex: 1,
                                    dataIndex: 'fkDictionaryFieldName',
                                    renderer: function (value, metaData, record) {
                                        if (!record.get('fkID')) {
                                            return null;
                                        }
                                        return record.get('fkDictionaryName') + '.' + record.get('fkDictionaryFieldName');
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});