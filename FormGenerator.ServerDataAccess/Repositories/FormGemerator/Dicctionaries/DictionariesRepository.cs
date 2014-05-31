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
        public static ResponsePackage SaveDictionary(RequestObjectPackage<DictionaryModel> request, IDbConnection connectionID)
        {
            return SaveDictionary(request, connectionID, null);
        }
        public static ResponsePackage SaveDictionary(RequestObjectPackage<DictionaryModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            DictionaryModel obj = request.requestData;
            bool isEdit = obj.ID > 0;

            string sql = null;
            if (isEdit)
            {
                sql = string.Format(
                    "update DICTIONARIES " + Environment.NewLine +
                    "set ID = {0}, NAME = {1}, TABLE_NAME = {2}, DICTIONARY_GROUP_ID = {3} " + Environment.NewLine +
                    "where ID = {0} ",
                        SQL.FromNumber(obj.ID),
                        SQL.FromString(obj.name),
                        SQL.FromString(obj.tableName),
                        SQL.FromNumber(obj.dictionaryGroupID)
                );
            }
            else
            {
                sql = string.Format(
                   "insert into DICTIONARIES " + Environment.NewLine +
                   "(NAME, TABLE_NAME, DICTIONARY_GROUP_ID) " + Environment.NewLine +
                   "values ({0}, {1}, {2}) returning ID" ,
                        SQL.FromString(obj.name),
                        SQL.FromString(obj.tableName),
                        SQL.FromNumber(obj.dictionaryGroupID)
                );
            }

            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, !isEdit, transactionID);
            res.ThrowExceptionIfError();

            return new ResponsePackage() { resultID = isEdit ? obj.ID : res.resultID };
        }
        public static ResponsePackage DeleteDictionary(RequestPackage request, IDbConnection connectionID)
        {
            return DeleteDictionary(request, connectionID, null);
        }
        public static ResponsePackage DeleteDictionary(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int id = request.requestID;
            string sql = string.Format(
                "select * " +
                "from FORMS " + Environment.NewLine +
                "where DICTIONARY_ID = {0} ",
                id
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID, transactionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count > 0)
            {
                return new ResponsePackage()
                {
                    resultCode = -1,
                    resultMessage = "Удаление невозможно! " +
                    "Существуют формы, ссылающиеся на выбранный словарь!"
                };
            }

            sql = string.Format(
                "select * " +
                "from DICTIONARY_FIELDS " + Environment.NewLine +
                "where DICTIONARY_ID = {0} ",
                id
            );
            res = DBUtils.OpenSQL(sql, connectionID, transactionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count > 0)
            {
                return new ResponsePackage()
                {
                    resultCode = -1,
                    resultMessage = "Удаление невозможно! " +
                    "Существуют поля словарей, ссылающиеся на выбранный словарь!"
                };
            }

            sql = string.Format(
                "select * " +
                "from DICTIONARY_PRIMARY_KEYS " + Environment.NewLine +
                "where DICTIONARY_ID = {0} ",
                id
            );
            res = DBUtils.OpenSQL(sql, connectionID, transactionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count > 0)
            {
                return new ResponsePackage()
                {
                    resultCode = -1,
                    resultMessage = "Удаление невозможно! " +
                    "Существуют первичные ключи, ссылающиеся на выбранный словарь!"
                };
            }


            sql = string.Format(
                "delete from DICTIONARIES " + Environment.NewLine +
                "where ID = {0} ",
                id
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
