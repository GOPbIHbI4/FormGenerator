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
    public static class DictionaryPrimaryKeysRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"dictionaryFieldID","DICTIONARY_FIELD_ID"},
            {"dictionaryID","DICTIONARY_ID"},
        };

        public static ResponseObjectPackage<List<DictionaryPrimaryKeyModel>> GetBySearchTemplate(RequestObjectPackage<DictionaryPrimaryKeySearchTemplate> package, IDbConnection connectionID)
        {
            DictionaryPrimaryKeySearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, DICTIONARY_FIELD_ID, DICTIONARY_ID " + Environment.NewLine +
                "from DICTIONARY_PRIMARY_KEYS " + Environment.NewLine + 
                "where {0}",
                DictionaryPrimaryKeysRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<DictionaryPrimaryKeyModel> list = DBOrmUtils.OpenSqlList<DictionaryPrimaryKeyModel>(sql, DictionaryPrimaryKeysRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DictionaryPrimaryKeyModel>>() { resultData = list };
        }

        public static string ToSqlWhere(DictionaryPrimaryKeySearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryFieldID, "DICTIONARY_FIELD_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryID, "DICTIONARY_ID");
            return where;
        }
    }
}
