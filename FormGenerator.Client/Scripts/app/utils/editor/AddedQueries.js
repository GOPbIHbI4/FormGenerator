Ext.define('FormGenerator.editor.Queries', {
    singleton: true,
    queries: undefined,
    init:function(){
        this.queries = [];
    },
    get: function () {
        return this.queries;
    },
    getInParams:function(){
        var array = [];
        if (this.queries){
            this.queries.forEach(function(item){
                if (item.queryInParams){
                    item.queryInParams.forEach(function(subItem){
                        array.push(subItem);
                    });
                }
            });
        }
        return array;
    },
    add: function (query) {
        var array = [];
        if (query.queryInParams){
            query.queryInParams.forEach(function(item){
                var i = {
                    ID:undefined,
                    queryInParameterID:item.get('ID'),
                    queryInParameterName:item.get('name'),
                    queryTypeID:item.get('queryTypeID'),
                    queryID:undefined,
                    query_ID:query['_ID'], // случайный не настоящий ID
                    controlName:item.get('value')
                };
                array.push(i);
            });
        }
        var obj = {
            ID:undefined,
            _ID:query['_ID'], // случайный не настоящий ID
            queryTypeID:query['queryTypeID'],
            sqlText:query['sqlText'],
            queryInParams:array
        };
        this.queries.push(obj);
    },
    clear: function () {
         this.queries = [];
    }
});

//queries = {
//    ID,
//    queryTypeID,
//    sqlText,
//    queryInParameters
//};