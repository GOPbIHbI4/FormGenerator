using FirebirdSql.Data.FirebirdClient;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public class SqlTest
    {
        class test
        {
            public int id_ { get; set; }
            public string Name { get; set; }
        }
        public ResponsePackage DoSomeSql(RequestPackage request, IDbConnection connectionID)
        {
            string sql =
                "select * from Test";

            Dictionary<string, string> mapper = new Dictionary<string, string>() 
            {
                { "id_", "ID" },
                { "Name", "NAME" }
            };
            List<test> list = DBOrmUtils.OpenSqlList<test>(sql, mapper, connectionID);
            return new ResponseObjectPackage<List<test>>() { resultData = list };
        }
    }
}
