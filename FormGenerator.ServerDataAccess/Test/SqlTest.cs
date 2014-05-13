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
            public int ID { get; set; }
            public string NAME { get; set; }
        }
        public ResponsePackage DoSomeSql(RequestPackage request, IDbConnection connectionID)
        {
            string sql =
                "select * from Test";

            List<test> list = DBOrmUtils.OpenSqlList<test>(sql, connectionID);
            return new ResponseObjectPackage<List<test>>() { resultData = list };
        }
    }
}
