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
    public static class QueryOutParametersRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"queryTypeID","QUERY_TYPE_ID"},
            {"domainValueTypeID","DOMAIN_VALUE_TYPE_ID"}
        };

        public static ResponseObjectPackage<List<QueryOutParameterModel>> GetBySearchTemplate(RequestObjectPackage<QueryOutParameterSearchTemplate> package, IDbConnection connectionID)
        {
            QueryOutParameterSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, NAME, QUERY_TYPE_ID, DOMAIN_VALUE_TYPE_ID " + Environment.NewLine +
                "from QUERY_OUT_PARAMETERS " + Environment.NewLine + 
                "where {0}",
                QueryOutParametersRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<QueryOutParameterModel> list = DBOrmUtils.OpenSqlList<QueryOutParameterModel>(sql, QueryOutParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<QueryOutParameterModel>>() { resultData = list };
        }

        /// <summary>
        /// Сохранение выходных параметров запроса
        /// </summary>
        /// <param name="package"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public static ResponsePackage SaveQueryOutParameter(RequestObjectPackage<QueryOutParameterModel> package, IDbConnection connectionID)
        {
            QueryOutParameterModel obj = package.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update QUERY_OUT_PARAMETERS set NAME = '{0}', QUERY_TYPE_ID = {1}, DOMAIN_VALUE_TYPE_ID = {2) " + Environment.NewLine +
                    " where ID = {3} returning ID",
                    obj.name.TrimIfNotNull() ?? "",
                    obj.queryTypeID,
                    obj.domainValueTypeID,
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into QUERY_OUT_PARAMETERS (NAME, QUERY_TYPE_ID, DOMAIN_VALUE_TYPE_ID) " + Environment.NewLine +
                    " values ('{0}', {1}, {2}) returning ID",
                    obj.name.TrimIfNotNull() ?? "",
                    obj.queryTypeID,
                    obj.domainValueTypeID
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        public static string ToSqlWhere(QueryOutParameterSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryTypeID, "QUERY_TYPE_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.domainValueTypeID, "DOMAIN_VALUE_TYPE_ID");
            return where;
        }
    }
}
