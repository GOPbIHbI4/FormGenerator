using FormGenerator.Models;
using FormGenerator.ServerDataAccess;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerBusinessLogic
{
    public class DictionariesDataLogic
    {
        public ResponseObjectPackage<List<Dictionary<string, object>>> GetDictionaryData(int dictionaryID)
        {
            DictionaryModel dictionary = new DictionariesLogic().GetDictionaryByID(dictionaryID).GetDataOrExceptionIfError();
            List<DictionaryFieldModel> fields = new DictionaryFieldsLogic().GetDictionaryFieldsByDictionaryID(dictionaryID).GetDataOrExceptionIfError();
            string sql = string.Format(
                "select {0} " +
                "from {1};",
                    string.Join(", ", fields.Select(e => e.columnName)),
                    dictionary.tableName
            );

            RequestPackage request = new RequestPackage() { requestString = sql };

            ResponseObjectPackage<List<Dictionary<string, object>>> response = new DBUtils().RunSqlAction(new DynamicCRUD().GetDictionaryData, request);
            return response;
        }

        public ResponsePackage SaveDictionaryData(Dictionary<int, string> row, int dictionaryID)
        {
            DictionaryValue dictVal = this.FillDictionaryValue(row, dictionaryID);
            return this.SaveDictionaryData(dictVal, dictionaryID);
        }

        public ResponsePackage DeleteDictionaryData(Dictionary<int, string> row, int dictionaryID)
        {
            DictionaryValue dictVal = this.FillDictionaryValue(row, dictionaryID);
            return this.DeleteDictionaryData(dictVal, dictionaryID);
        }

        private DictionaryValue FillDictionaryValue(Dictionary<int, string> row, int dictionaryID)
        {
            Dictionary dictionary = new DictionariesLogic().GetDictionaryViewModel(dictionaryID).GetDataOrExceptionIfError();
            DictionaryValue dictVal = new DictionaryValue(dictionary, row);
            return dictVal;
        }

        public ResponsePackage SaveDictionaryData(DictionaryValue row, int dictionaryID)
        {
            string sql = null;
            DictionaryFieldValue pk = row.GetPrimaryKey();
            bool isEdit = pk.value.IsNotDefault();
            List<DictionaryFieldValue> notPkValues = row.fields.Where(i => !i.dictionaryField.primaryKey).ToList();

            //изменение
            if (isEdit)
            {

                var query = notPkValues.Where(e => e.value.isInitialized).Select(e => e.dictionaryField.columnName + " = " + e.value.ToSQL());
                sql = string.Format(
                    "update {0} " + Environment.NewLine +
                    "set {1} " + Environment.NewLine +
                    "where {2} = {3};",
                    row.dictionary.tableName,
                    string.Join(", ", query.ToArray()),
                    pk.dictionaryField.columnName,
                    pk.value.ToSQL()
                );
            }
            //вставка
            else
            {
                string columnsString = string.Join(", ", notPkValues.Select(e => e.dictionaryField.columnName).ToArray());
                string valuesString = string.Join(", ", notPkValues.Select(e => e.value.ToSQL()).ToArray());
                sql = string.Format(
                    "insert into {0} " + Environment.NewLine +
                    "({1}) " +Environment.NewLine +
                    "values ({2}) " + 
                    "returning {3};",
                    row.dictionary.tableName,
                    columnsString,
                    valuesString,
                    pk.dictionaryField.columnName
                );
            }

            RequestPackage request = new RequestPackage() { requestString = sql, requestID = isEdit ? 0 : 1 };
            ResponsePackage response = new DBUtils().RunSqlAction(new DynamicCRUD().UpdateDictionaryData, request);
            if (isEdit)
            {
                response.resultID = (int)pk.value.value;
            }
            return response;
        }

        public ResponsePackage DeleteDictionaryData(DictionaryValue row, int dictionaryID)
        {
            string sql = null;
            DictionaryFieldValue pk = row.GetPrimaryKey();

            if (pk.value.IsNotDefault())
            {
                sql = string.Format(
                    "delete from {0} " + Environment.NewLine +
                    "where {1} = {2};",
                    row.dictionary.tableName,
                    pk.dictionaryField.columnName,
                    pk.value.ToSQL()
                );
            }

            RequestPackage request = new RequestPackage() { requestString = sql };
            ResponsePackage response = new DBUtils().RunSqlAction(new DynamicCRUD().UpdateDictionaryData, request);
            return response;
        }
    }
}
