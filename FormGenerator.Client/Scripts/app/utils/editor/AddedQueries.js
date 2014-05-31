Ext.define('FormGenerator.editor.Queries', {
    singleton: true,
    queries: undefined,
    init:function(){
        this.queries = [];
    },
    get: function () {
        return this.queries;
    },
    getFreeID:function(){
        var IDs = [];
        this.queries.forEach(function(item){
            IDs.push(item['ID']);
        });
        var num;
        while(true){
            num = getRandomInt();
            if (!Ext.Array.contains(num)){
                break;
            }
        }
        return num;
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
        if (query.queryInParams){
            var array = [];
            query.queryInParams.forEach(function(item){
                var i = {
                    ID:undefined,
                    queryInParameterID:item.get('ID'),
                    queryInParameterName:item.get('name'),
                    queryTypeID:item.get('queryTypeID'),
                    queryID:undefined,
                    query_ID:query['_ID'], // случайный не настоящий ID
                    controlName:item.get('value'),
                    controlString:item.get('rawValue')
                };
                array.push(i);
            });
            var obj = {
                ID:undefined,
                _ID:query['_ID'], // случайный не настоящий ID
                queryTypeID:query['queryTypeID'],
                sqlText:query['queryType'],
                queryInParams:array
            };
        }
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