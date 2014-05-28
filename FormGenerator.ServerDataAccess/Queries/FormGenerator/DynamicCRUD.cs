using FormGenerator.Models;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public class DynamicCRUD
    {
        public ResponseObjectPackage<List<Dictionary<string, object>>> GetDictionaryData(RequestPackage package, IDbConnection connectionID)
        {
            string sql = package.requestString;
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();
            List<Dictionary<string, object>> list = res.GetDataOrExceptionIfError().ToListOfDictionaries();
            return new ResponseObjectPackage<List<Dictionary<string, object>>>() { resultData = list };
        }       
        
        public ResponsePackage UpdateDictionaryData(RequestPackage package, IDbConnection connectionID)
        {
            string sql = package.requestString;
            bool returningID = package.requestID == 1;
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, returningID);
            res.ThrowExceptionIfError();
            return res;
        }
    }
}
