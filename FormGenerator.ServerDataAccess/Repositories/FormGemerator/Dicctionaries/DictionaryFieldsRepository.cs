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


        public static ResponsePackage SaveDictionaryField(RequestObjectPackage<DictionaryFieldModel> request, IDbConnection connectionID)
        {
            return SaveDictionaryField(request, connectionID, null);
        }
        public static ResponsePackage SaveDictionaryField(RequestObjectPackage<DictionaryFieldModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            DictionaryFieldModel obj = request.requestData;
            bool isEdit = obj.ID > 0;

            string sql = null;
            if (isEdit)
            {
                sql = string.Format(
                    "update DICTIONARY_FIELDS " + Environment.NewLine +
                    "set ID = {0}, NAME = {1}, COLUMN_NAME = {2}, DICTIONARY_ID = {3}, DOMAIN_VALUE_TYPE_ID = {4} " + Environment.NewLine +
                    "where ID = {0} ",
                        SQL.FromNumber(obj.ID),
                        SQL.FromString(obj.name),
                        SQL.FromString(obj.columnName),
                        SQL.FromNumber(obj.dictionaryID),
                        SQL.FromNumber(obj.domainValueTypeID)
                );
            }
            else
            {
                sql = string.Format(
                   "insert into DICTIONARY_FIELDS " + Environment.NewLine +
                   "(NAME, COLUMN_NAME, DICTIONARY_ID, DOMAIN_VALUE_TYPE_ID) " + Environment.NewLine +
                   "values ({0}, {1}, {2}, {3}) returning ID",
                        SQL.FromString(obj.name),
                        SQL.FromString(obj.columnName),
                        SQL.FromNumber(obj.dictionaryID),
                        SQL.FromNumber(obj.domainValueTypeID)
                );
            }

            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, !isEdit, transactionID);
            res.ThrowExceptionIfError();

            return new ResponsePackage() { resultID = isEdit ? obj.ID : res.resultID };
        }
        public static ResponsePackage DeleteDictionaryField(RequestPackage request, IDbConnection connectionID)
        {
            return DeleteDictionaryField(request, connectionID, null);
        }
        public static ResponsePackage DeleteDictionaryField(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int id = request.requestID;
            string sql = string.Format(
                "select * " +
                "from CONTROL_DICTIONARY_MAPPING " + Environment.NewLine +
                "where DICTIONARY_FIELD_ID = {0} ",
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
                    "Существуют контролы форм, ссылающиеся на выбранное поле словаря!"
                };
            }

            sql = string.Format(
                "select * " +
                "from DICTIONARY_FOREIGN_KEYS " + Environment.NewLine +
                "where DICTIONARY_FIELD_ID_SOURCE = {0} or DICTIONARY_FIELD_ID_DESTINATION = {0} ",
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
                    "Существуют внешние ключи, ссылающиеся на выбранное поле словаря!"
                };
            }

            sql = string.Format(
                "select * " +
                "from DICTIONARY_PRIMARY_KEYS " + Environment.NewLine +
                "where DICTIONARY_FIELD_ID = {0}",
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
                    "Существуют первичные ключи, ссылающиеся на выбранное поле словаря!"
                };
            }

            sql = string.Format(
                "delete from DICTIONARY_FIELDS " + Environment.NewLine +
                "where ID = {0} ",
                id
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
