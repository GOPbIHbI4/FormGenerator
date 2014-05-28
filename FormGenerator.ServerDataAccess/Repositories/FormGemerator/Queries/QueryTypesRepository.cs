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
    public static class QueryTypesRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"sqlText","SQL_TEXT"},
        };

        public static ResponseObjectPackage<List<QueryTypeModel>> GetBySearchTemplate(RequestObjectPackage<QueryTypeSearchTemplate> package, IDbConnection connectionID)
        {
            QueryTypeSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, SQL_TEXT " + Environment.NewLine +
                "from QUERY_TYPES " + Environment.NewLine + 
                "where {0}",
                QueryTypesRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<QueryTypeModel> list = DBOrmUtils.OpenSqlList<QueryTypeModel>(sql, QueryTypesRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<QueryTypeModel>>() { resultData = list };
        }

        public static string ToSqlWhere(QueryTypeSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.sqlText, "SQL_TEXT");
            return where;
        }
    }
}
