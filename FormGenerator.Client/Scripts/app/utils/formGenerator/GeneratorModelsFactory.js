Ext.define('FormGenerator.utils.formGenerator.GeneratorModelsFactory', {
    requires:[
        'Ext.util.TextMetrics'
    ],
    singleton: true,

    _getGridModelTypeByValueTypeID: function (valueTypeID) {
        switch (valueTypeID) {
            case DomainValueTypes.String:
                return 'string';
                break;
            case DomainValueTypes.Int:
                return 'int';
                break;
            case DomainValueTypes.Decimal:
                return 'float';
                break;
            case DomainValueTypes.Date:
                return 'date';
                break;
            default:
                return 'string';
        }
    },

    _getEditorByValueTypeID: function (valueTypeID) {
        switch (valueTypeID) {
            case DomainValueTypes.String:
                return {
                    xtype:'textfield'
                };
                break;
            case DomainValueTypes.Int:
                return {
                    xtype: 'numberfield'
                };
                break;
            case DomainValueTypes.Decimal:
                return
                return {
                    xtype: 'numberfield'
                };
                break;
            case DomainValueTypes.Date:
                return {
                    xtype: 'datefield',
                    format: 'd.m.Y'
                };
                break;
            default:
                return {
                    xtype:'textfield'
                };
        }
    },

    _getColumnXtypeByValueTypeID: function (valueTypeID) {
        switch (valueTypeID) {
            case DomainValueTypes.String:
                return 'gridcolumn';
                break;
            case DomainValueTypes.Int:
                return 'numbercolumn';
                break;
            case DomainValueTypes.Decimal:
                return 'numbercolumn';
                break;
            case DomainValueTypes.Date:
                return 'datecolumn';
                break;
            default:
                return 'gridcolumn';
        }
    },

    _getColumnFormatByValueTypeID: function (valueTypeID) {
        switch (valueTypeID) {
            case DomainValueTypes.Date:
                return 'd.m.Y';
                break;
            default:
                return null;
        }
    }
});