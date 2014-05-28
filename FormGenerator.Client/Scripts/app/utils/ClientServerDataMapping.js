Ext.define('DomainValueTypes', {
    singleton: true,
    init: function () {
        this.String = 1;
        this.Decimal = 2;
        this.Int = 3;
        this.Date = 4;
        this.Bool = 5;
    },

    getFromString: function (object, valueTypeID) {
        if (object == null || typeof object == 'undefined') {
            return null;
        }

        switch (valueTypeID) {
            case DomainValueTypes.String:
                return object.toString();
                break;
            case DomainValueTypes.Decimal:
                return parseFloat(object);
                break;
            case DomainValueTypes.Int:
                return parseInt(object);
                break;
            case DomainValueTypes.Date:
                return Ext.Date.parse(object, 'c');
                break;
            case DomainValueTypes.Bool:
                return object.toString().toLowerCase().trim() == 'true';
                break;
        }
    },

    String: null,
    Decimal: null,
    Int: null,
    Date: null,
    Bool: null
});

DomainValueTypes.init();