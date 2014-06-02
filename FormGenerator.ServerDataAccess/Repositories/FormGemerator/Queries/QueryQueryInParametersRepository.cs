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

        /// <summary>
        /// Функция сохранения
        /// </summary>
        /// <param name="package"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public static ResponsePackage SaveQueryQueryInParameter(RequestObjectPackage<QueryQueryInParameterModel> package, IDbConnection connectionID, IDbTransaction transactionID)
        {
            QueryQueryInParameterModel obj = package.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                // изменение
                sql = string.Format(
                    " update QUERY_QUERY_IN_PARAMETER set QUERY_ID = {0), QUERY_IN_PARAMETER_ID = {1}, CONTROL_ID = {2} " + Environment.NewLine +
                    " where ID = {3} returning ID",
                    obj.queryID,
                    obj.queryInParameterID,
                    obj.controlID,
                    obj.ID
                );
            }
            else
            {
                // сохранение
                sql = string.Format(
                    " insert into QUERY_QUERY_IN_PARAMETER (QUERY_ID, QUERY_IN_PARAMETER_ID, CONTROL_ID) " + Environment.NewLine +
                    " values ({0}, {1}, {2}) returning ID",
                    obj.queryID,
                    obj.queryInParameterID,
                    obj.controlID
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true, transactionID);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }
        public static ResponsePackage SaveQueryQueryInParameter(RequestObjectPackage<QueryQueryInParameterModel> package, IDbConnection connectionID)
        {
            return SaveQueryQueryInParameter(package, connectionID, null);
        }

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
