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
    public class DictionaryDataCRUD
    {
        public ResponseObjectPackage<List<Dictionary<string, object>>> GetDictionaryData(RequestPackage package, IDbConnection connectionID)
        {
            string sql = package.requestString;
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<Dictionary<string, object>> list = res.GetDataOrExceptionIfError().ToListOfDictionaries();
            return new ResponseObjectPackage<List<Dictionary<string, object>>>() { resultData = list };
        }
    }
}
