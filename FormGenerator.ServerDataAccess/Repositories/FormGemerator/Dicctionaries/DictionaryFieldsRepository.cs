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
            {"ID","ID"},
            {"name","NAME"},
            {"columnName","COLUMN_NAME"},
            {"dictionaryID","DICTIONARY_ID"},
            {"domainValueTypeID","DOMAIN_VALUE_TYPE_ID"},
        };
        public static ResponseObjectPackage<List<DictionaryFieldModel>> GetBySearchTemplate(RequestObjectPackage<DictionaryFieldSearchTemplate> package, IDbConnection connectionID)
        {
            DictionaryFieldSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, NAME, COLUMN_NAME, DICTIONARY_ID, DOMAIN_VALUE_TYPE_ID " + Environment.NewLine +
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
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromString(obj.columnName, "COLUMN_NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryID, "DICTIONARY_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.domainValueTypeID, "DOMAIN_VALUE_TYPE_ID");
            return where;
        }
    }
}
