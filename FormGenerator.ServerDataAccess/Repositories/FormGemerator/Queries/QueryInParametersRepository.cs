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
    public static class QueryInParametersRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"queryTypeID","QUERY_TYPE_ID"},
            {"domainValueTypeID","DOMAIN_VALUE_TYPE_ID"}
        };

        public static ResponseObjectPackage<List<QueryInParameterModel>> GetBySearchTemplate(RequestObjectPackage<QueryInParameterSearchTemplate> package, IDbConnection connectionID)
        {
            QueryInParameterSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, NAME, QUERY_TYPE_ID, DOMAIN_VALUE_TYPE_ID " + Environment.NewLine +
                "from QUERY_IN_PARAMETERS " + Environment.NewLine + 
                "where {0}",
                QueryInParametersRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<QueryInParameterModel> list = DBOrmUtils.OpenSqlList<QueryInParameterModel>(sql, QueryInParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<QueryInParameterModel>>() { resultData = list };
        }

        /// <summary>
        /// Сохранение входных параметров запроса
        /// </summary>
        /// <param name="package"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public static ResponsePackage SaveQueryInParameter(RequestObjectPackage<QueryInParameterModel> package, IDbConnection connectionID)
        {
            QueryInParameterModel obj = package.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update QUERY_IN_PARAMETERS set NAME = '{0}', QUERY_TYPE_ID = {1}, DOMAIN_VALUE_TYPE_ID = {2) " + Environment.NewLine +
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
                    " insert into QUERY_IN_PARAMETERS (NAME, QUERY_TYPE_ID, DOMAIN_VALUE_TYPE_ID) " + Environment.NewLine +
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

        public static string ToSqlWhere(QueryInParameterSearchTemplate obj)
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
