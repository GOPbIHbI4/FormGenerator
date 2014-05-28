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
    public static class QueryQueryInParametersRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"queryID","QUERY_ID"},
            {"queryInParameterID","QUERY_IN_PARAMETER_ID"},
            {"controlID","CONTROL_ID"},
        };

        public static ResponseObjectPackage<List<QueryQueryInParameterModel>> GetBySearchTemplate(RequestObjectPackage<QueryQueryInParameterSearchTemplate> package, IDbConnection connectionID)
        {
            QueryQueryInParameterSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, QUERY_ID, QUERY_IN_PARAMETER_ID, CONTROL_ID " + Environment.NewLine +
                "from QUERY_QUERY_IN_PARAMETER " + Environment.NewLine + 
                "where {0}",
                QueryQueryInParametersRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<QueryQueryInParameterModel> list = DBOrmUtils.OpenSqlList<QueryQueryInParameterModel>(sql, QueryQueryInParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<QueryQueryInParameterModel>>() { resultData = list };
        }
        
        public static string ToSqlWhere(QueryQueryInParameterSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryID, "QUERY_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryInParameterID, "QUERY_IN_PARAMETER_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.controlID, "CONTROL_ID");
            return where;
        }
    }
}
