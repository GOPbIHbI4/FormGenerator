Ext.define('ControlTypes', {
    singleton: true,
    init: function () {
        this.Window = 1;
        this.HboxContainer = 2;
        this.FieldSet = 3;
        this.ToolBar = 4;
        this.Panel = 5;
        this.TabPanel = 6;
        this.Tab = 7;
        this.GridPanel = 8;
        this.GridColumn = 9;
        this.DateColumn = 10;
        this.NumberColumn = 11;
        this.TextField = 12;
        this.DateField = 13;
        this.NumberField = 14;
        this.ComboBox = 15;
        this.Button = 16;
        this.VboxContainer = 19;
    },

    getArrayNameByChildID:function(controlTypeID) {
        switch (controlTypeID) {
            case this.GridColumn:
            case this.NumberColumn:
            case this.DateColumn:
                return 'columns';
                break;
            case this.ToolBar:
                return 'dockedItems';
            break;
            default:
                return 'items';
                break;
        }
    },

    Window: null,
    HboxContainer: null,
    FieldSet: null,
    ToolBar: null,
    Panel: null,
    TabPanel: null,
    Tab: null,
    GridPanel: null,
    GridColumn: null,
    DateColumn: null,
    NumberColumn: null,
    TextField: null,
    DateField: null,
    NumberField: null,
    ComboBox: null,
    Button: null,
    VboxContainer: null
});

ControlTypes.init();