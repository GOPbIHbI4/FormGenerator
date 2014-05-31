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

        public static ResponsePackage SavePrimaryKey(RequestObjectPackage<DictionaryPrimaryKeyModel> request, IDbConnection connectionID)
        {
            return SavePrimaryKey(request, connectionID, null);
        }
        public static ResponsePackage SavePrimaryKey(RequestObjectPackage<DictionaryPrimaryKeyModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            DictionaryPrimaryKeyModel obj = request.requestData;
            bool isEdit = obj.ID > 0;

            string sql = null;
            if (isEdit)
            {
                sql = string.Format(
                    "update DICTIONARY_PRIMARY_KEYS " + Environment.NewLine +
                    "set ID = {0}, DICTIONARY_FIELD_ID = {1}, DICTIONARY_ID = {2} " + Environment.NewLine +
                    "where ID = {0} ",
                        SQL.FromNumber(obj.ID),
                        SQL.FromNumber(obj.dictionaryFieldID),
                        SQL.FromNumber(obj.dictionaryID)
                );
            }
            else
            {
                sql = string.Format(
                   "insert into DICTIONARY_PRIMARY_KEYS " + Environment.NewLine +
                   "(DICTIONARY_FIELD_ID, DICTIONARY_ID) " + Environment.NewLine +
                   "values ({0}, {1}) returning ID",
                        SQL.FromNumber(obj.dictionaryFieldID),
                        SQL.FromNumber(obj.dictionaryID)
                );
            }

            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, !isEdit, transactionID);
            res.ThrowExceptionIfError();

            return new ResponsePackage() { resultID = isEdit ? obj.ID : res.resultID };
        }
        public static ResponsePackage DeletePrimaryKey(RequestPackage request, IDbConnection connectionID)
        {
            return DeletePrimaryKey(request, connectionID, null);
        }
        public static ResponsePackage DeletePrimaryKey(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int id = request.requestID;
            string sql = string.Format(
                "delete from DICTIONARY_PRIMARY_KEYS " + Environment.NewLine +
                "where ID = {0} ",
                id
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
