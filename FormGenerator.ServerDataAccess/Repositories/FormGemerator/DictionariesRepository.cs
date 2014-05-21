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
            {"ID","id"},
            {"relationName","rdb$relation_name"},
            {"name","name"},
        };

        public static ResponseObjectPackage<List<DictionaryModel>> GetBySearchModel(RequestObjectPackage<DictionarySearchTemplate> package, IDbConnection connectionID)
        {
            DictionarySearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select id, rdb$relation_name, name " + Environment.NewLine +
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
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "id");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "name");
            where += DBOrmUtils.GetSqlWhereFromString(obj.relationName, "rdb$relation_name");
            return where;
        }

        //public static DictionaryModel ToDictionaryModel(DataRow row)
        //{
        //    DictionaryModel obj = new DictionaryModel();
        //    obj.ID = DBOrmUtils.FieldValue<int>(row, "id", 0);
        //    obj.relationName = DBOrmUtils.FieldValue<string>(row, "rdb$relation_name", "").TrimIfNotNull();
        //    obj.name = DBOrmUtils.FieldValue<string>(row, "name", "").TrimIfNotNull();

        //    return obj;
        //}
    }
}
