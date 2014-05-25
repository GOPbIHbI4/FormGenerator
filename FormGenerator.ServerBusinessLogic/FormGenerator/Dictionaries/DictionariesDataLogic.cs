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
            List<DictionaryFieldModel> fields = new DictionariesLogic().GetDictionaryFieldsByDictionaryID(dictionaryID).GetDataOrExceptionIfError();
            string sql = string.Format(
                "select {0} " +
                "from {1};",
                    string.Join(", ", fields.Select(e => e.columnName)),
                    dictionary.tableName
            );

            RequestPackage request = new RequestPackage() { requestString = sql };

            ResponseObjectPackage<List<Dictionary<string, object>>> response = new DBUtils().RunSqlAction(new DictionaryDataCRUD().GetDictionaryData, request);
            return response;
        }

        public ResponsePackage SaveDictionaryData(Dictionary<string, object> row, int dictionaryID)
        {
            List<DictionaryField> fields = new DictionariesLogic().GetDictionaryFieldsViewModel(dictionaryID).GetDataOrExceptionIfError();
            DictionaryField pk = fields.Where(e => e.primaryKey).First();
            string sql = null;
            //if (dictionaryID[pk.columnName] > 0)
            //{
            //    string.Format(
            //         "select {0} " +
            //         "from {1};",
            //             string.Join(", ", fields.Select(e => e.columnName)),
            //             dictionary.tableName
            //     );
            //}
            //else 
            //{
            //    string.Format(
            //         "select {0} " +
            //         "from {1};",
            //             string.Join(", ", fields.Select(e => e.columnName)),
            //             dictionary.tableName
            //     );
            //}

            RequestPackage request = new RequestPackage() { requestString = sql };

            ResponseObjectPackage<List<Dictionary<string, object>>> response = new DBUtils().RunSqlAction(new DictionaryDataCRUD().GetDictionaryData, request);
            return response;
        }
    }
}
