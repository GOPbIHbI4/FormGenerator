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
    public static class ControlQueryMappingRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"controlID","CONTROL_ID"},
            {"queryOutParameterID","QUERY_OUT_PARAMETER_ID"},
            {"queryID","QUERY_ID"},
            {"queryMappingRoleID","QUERY_MAPPING_ROLE_ID"},
        };

        /// <summary>
        /// Сохранить маппинг
        /// </summary>
        /// <param name="package"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public static ResponsePackage SaveControlQueryMapping(RequestObjectPackage<ControlQueryMappingModel> package, IDbConnection connectionID)
        {
            ControlQueryMappingModel obj = package.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                // изменение
                sql = string.Format(
                    " update CONTROL_QUERY_MAPPING set CONTROL_ID = {0), QUERY_OUT_PARAMETER_ID = {1}, QUERY_ID = {2} " + Environment.NewLine +
                    " where ID = {3} returning ID",
                    obj.controlID,
                    obj.queryOutParameterID,
                    obj.queryID,
                    obj.ID
                );
            }
            else
            {
                // сохранение
                sql = string.Format(
                    " insert into CONTROL_QUERY_MAPPING (CONTROL_ID, QUERY_OUT_PARAMETER_ID, QUERY_ID) " + Environment.NewLine +
                    " values ({0}, {1}, {2}) returning ID",
                    obj.controlID,
                    obj.queryOutParameterID,
                    obj.queryID
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        public static ResponseObjectPackage<List<ControlQueryMappingModel>> GetBySearchTemplate(RequestObjectPackage<ControlQueryMappingSearchTemplate> package, IDbConnection connectionID)
        {
            ControlQueryMappingSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select m.ID, m.CONTROL_ID, m.QUERY_OUT_PARAMETER_ID, m.QUERY_ID, m.QUERY_MAPPING_ROLE_ID " + Environment.NewLine +
                "from CONTROL_QUERY_MAPPING m " + Environment.NewLine + 
                "where {0}",
                ControlQueryMappingRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<ControlQueryMappingModel> list = DBOrmUtils.OpenSqlList<ControlQueryMappingModel>(sql, ControlQueryMappingRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ControlQueryMappingModel>>() { resultData = list };
        }

        public static ResponseObjectPackage<List<ControlQueryMappingModel>> GetByFormID(RequestPackage package, IDbConnection connectionID)
        {
            int formID = package.requestID;
            string sql = string.Format(
                "select m.ID, m.CONTROL_ID, m.QUERY_OUT_PARAMETER_ID, m.QUERY_ID, m.QUERY_MAPPING_ROLE_ID " + Environment.NewLine +
                "from CONTROL_QUERY_MAPPING m " + Environment.NewLine +
                "inner join CONTROLS c on c.ID = m.CONTROL_ID " +
                "where c.FORM_ID = {0} ",
                formID
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<ControlQueryMappingModel> list = DBOrmUtils.OpenSqlList<ControlQueryMappingModel>(sql, ControlQueryMappingRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ControlQueryMappingModel>>() { resultData = list };
        }

        public static string ToSqlWhere(ControlQueryMappingSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "m.ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.controlID, "m.CONTROL_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryOutParameterID, "m.QUERY_OUT_PARAMETER_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryID, "m.QUERY_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryMappingRoleID, "m.QUERY_MAPPING_ROLE_ID");
            return where;
        }
    }
}
