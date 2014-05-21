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
    public static class DictionaryFieldsRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","id"},
            {"dictionaryID","dictionary_id"},
            {"relationFieldName","rdb$relation_field_name"},
            {"name","name"},
            {"dataTypeID","data_type_id"},
        };
        public static ResponseObjectPackage<List<DictionaryFieldModel>> GetBySearchTemplate(RequestObjectPackage<DictionaryFieldSearchTemplate> package, IDbConnection connectionID)
        {
            DictionaryFieldSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select id, dictionary_id, rdb$relation_field_name, name, data_type_id " + Environment.NewLine +
                "from dictionary_fields " + Environment.NewLine +
                "where {0}",
                DictionaryFieldsRepository.ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<DictionaryFieldModel> list = DBOrmUtils.OpenSqlList<DictionaryFieldModel>(sql, DictionaryFieldsRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DictionaryFieldModel>>() { resultData = list };
        }

        public static string ToSqlWhere(DictionaryFieldSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "id");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryID, "dictionary_id");
            where += DBOrmUtils.GetSqlWhereFromString(obj.relationFieldName, "rdb$relation_field_name");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "name");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dataTypeID, "data_type_id");
            return where;
        }
    }
}
