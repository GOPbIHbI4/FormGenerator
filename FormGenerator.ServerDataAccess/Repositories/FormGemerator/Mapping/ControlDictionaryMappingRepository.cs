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
    public static class ControlDictionaryMappingRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"controlID","CONTROL_ID"},
            {"dictionaryFieldID","DICTIONARY_FIELD_ID"},
        };

        public static ResponseObjectPackage<List<ControlDictionaryMappingModel>> GetBySearchTemplate(RequestObjectPackage<ControlDictionaryMappingSearchTemplate> package, IDbConnection connectionID)
        {
            ControlDictionaryMappingSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select m.ID, m.CONTROL_ID, m.DICTIONARY_FIELD_ID " + Environment.NewLine +
                "from CONTROL_DICTIONARY_MAPPING m " + Environment.NewLine + 
                "where {0}",
                ControlDictionaryMappingRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<ControlDictionaryMappingModel> list = DBOrmUtils.OpenSqlList<ControlDictionaryMappingModel>(sql, ControlDictionaryMappingRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ControlDictionaryMappingModel>>() { resultData = list };
        }

        public static ResponseObjectPackage<List<ControlDictionaryMappingModel>> GetByFormID(RequestPackage package, IDbConnection connectionID)
        {
            int formID = package.requestID;
            string sql = string.Format(
                "select m.ID, m.CONTROL_ID, m.DICTIONARY_FIELD_ID " + Environment.NewLine +
                "from CONTROL_DICTIONARY_MAPPING m " + Environment.NewLine +
                "inner join CONTROLS c on c.ID = m.CONTROL_ID " +
                "where c.FORM_ID = {0} ",
                formID
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<ControlDictionaryMappingModel> list = DBOrmUtils.OpenSqlList<ControlDictionaryMappingModel>(sql, ControlDictionaryMappingRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ControlDictionaryMappingModel>>() { resultData = list };
        }

        public static string ToSqlWhere(ControlDictionaryMappingSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "m.ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.controlID, "m.CONTROL_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryFieldID, "m.DICTIONARY_FIELD_ID");
            return where;
        }
    }
}
