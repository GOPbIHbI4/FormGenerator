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
    public static class DictionariesRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"tableName","TABLE_NAME"},
            {"name","NAME"},
            {"dictionaryGroupID","DICTIONARY_GROUP_ID"},
        };

        public static ResponseObjectPackage<List<DictionaryModel>> GetBySearchTemplate(RequestObjectPackage<DictionarySearchTemplate> package, IDbConnection connectionID)
        {
            DictionarySearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, TABLE_NAME, NAME, DICTIONARY_GROUP_ID " + Environment.NewLine +
                "from dictionaries " + Environment.NewLine + 
                "where {0}",
                DictionariesRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<DictionaryModel> list = DBOrmUtils.OpenSqlList<DictionaryModel>(sql, DictionariesRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DictionaryModel>>() { resultData = list };
        }

        public static string ToSqlWhere(DictionarySearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.tableName, "TABLE_NAME");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryGroupID, "DICTIONARY_GROUP_ID");
            return where;
        }
    }
}
