Ext.define('DomainValueTypes', {
    singleton: true,
    init:function() {
        this.String = 1;
        this.Decimal = 2;
        this.Int = 3;
        this.Date = 4;
    },

    String:null,
    Decimal:null,
    Int:null,
    Date:null
});

Ext.define('LogicValueTypes', {
    singleton: true,
    init:function() {
        this.String = 1;
        this.Decimal = 2;
        this.Int = 3;
        this.Date = 4;
    },

    String:null,
    Decimal:null,
    Int:null,
    Date:null
});

DomainValueTypes.init();
LogicValueTypes.init();