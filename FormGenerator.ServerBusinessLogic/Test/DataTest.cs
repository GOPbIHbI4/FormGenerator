using FormGenerator.ServerDataAccess;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Server.Test
{
    public class BLL_DataTest
    {
        public ResponsePackage DoSome(RequestPackage package)
        {
            return new DBUtils().RunSqlAction(new SqlTest().DoSomeSql, package);
        }
    }
}
