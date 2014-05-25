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
    public static class DictionaryGroupsRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"dictionaryGroupID_Parent","DICTIONARY_GROUP_ID_PARENT"},
            {"dictionaryGroupID_Root","DICTIONARY_GROUP_ID_ROOT"}
        };
        public static ResponseObjectPackage<List<DictionaryGruopModel>> GetBySearchTemplate(RequestObjectPackage<DictionaryGroupSearchTemplate> package, IDbConnection connectionID)
        {
            DictionaryGroupSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, NAME, DICTIONARY_GROUP_ID_PARENT, DICTIONARY_GROUP_ID_ROOT " + Environment.NewLine +
                "from dictionary_groups " + Environment.NewLine +
                "where {0}",
                DictionaryGroupsRepository.ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<DictionaryGruopModel> list = DBOrmUtils.OpenSqlList<DictionaryGruopModel>(sql, DictionaryGroupsRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DictionaryGruopModel>>() { resultData = list };
        }

        public static string ToSqlWhere(DictionaryGroupSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryGroupID_Parent, "DICTIONARY_GROUP_ID_PARENT");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryGroupID_Root, "DICTIONARY_GROUP_ID_ROOT");
            return where;
        }
    }
}
