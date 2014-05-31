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
    public class FormActionLogic
    {
        public ResponseObjectPackage<List<FormInParameterModel>> GetFormInParametersByFormID(int formID)
        {
            RequestPackage request = new RequestPackage()
            {
                requestID = formID
            };
            ResponseObjectPackage<List<FormInParameterModel>> response = new DBUtils().RunSqlAction(FormInParametersRepository.GetByFormID, request);
            return response;
        }
        public ResponseObjectPackage<List<FormOutParameterModel>> GetFormOutParametersByFormID(int formID)
        {
            RequestPackage request = new RequestPackage()
            {
                requestID = formID
            };
            ResponseObjectPackage<List<FormOutParameterModel>> response = new DBUtils().RunSqlAction(FormOutParametersRepository.GetByFormID, request);
            return response;
        }


        public ResponseObjectPackage<Form> BuildForm(int formID)
        {
            FormModel formModel = new ControlPropertiesLogic().GetFormByID(formID).GetDataOrExceptionIfError();
            Dictionary dictionary = null;
            if (formModel.dictionaryID.HasValue)
            {
                dictionary = new DictionariesLogic().GetDictionaryViewModel(formModel.dictionaryID.Value).GetDataOrExceptionIfError();
            }
            List<int> queryIDs = new ControlPropertiesLogic().GetControlQueryMappingByFormID(formID).GetDataOrExceptionIfError()
                .Select(e => e.queryID).Distinct().ToList();
            Control window = new ControlPropertiesLogic().BuildWindow(formID).GetDataOrExceptionIfError();
            List<QueryType> queries = new List<QueryType>();
            foreach (int queryID in queryIDs)
            {
                List<QueryQueryInParameterModel> mapping = new QueryInParametersLogic().GetQueryQueryInParametersByQueryID(queryID).GetDataOrExceptionIfError();
                queries.Add(new QueryType() { queryID = queryID, inParametersMapping = mapping });
            }
            List<FormInParameterModel> inParameters = this.GetFormInParametersByFormID(formID).GetDataOrExceptionIfError();
            List<FormOutParameterModel> outParameters = this.GetFormOutParametersByFormID(formID).GetDataOrExceptionIfError();
            Form form = new Form() 
            {
                ID = formID,
                dictionary = dictionary,
                queries = queries,
                window = window,
                inParameters = inParameters,
                outParameters = outParameters
            };
            return new ResponseObjectPackage<Form>() { resultData = form };
        }

        public ResponseObjectPackage<Dictionary<int, object>> GetDictionaryObjectByID(int dictionaryID, int pkValue)
        {
            Dictionary dictionary = new DictionariesLogic().GetDictionaryViewModel(dictionaryID).GetDataOrExceptionIfError();
            string sql = string.Format(
                "select {0} " + Environment.NewLine +
                "from {1} " + Environment.NewLine +
                "where {2} = {3}",
                    string.Join(", ", dictionary.fields.Select(e => e.columnName)),
                    dictionary.tableName,
                    dictionary.GetPrimaryKey().columnName,
                    pkValue
            );

            RequestPackage request = new RequestPackage() { requestString = sql };

            List<Dictionary<string, object>> response = new DBUtils().RunSqlAction(new DynamicCRUD().GetDictionaryData, request).GetDataOrExceptionIfError();
            if (response.Count > 1 || response.Count == 0)
            {
                throw new Exception("Запрос данных полей из словаря возвратил не одну строку! dictionaryID = " + dictionaryID + " pkValue = " + pkValue);
            }
            Dictionary<int, object> result = new Dictionary<int, object>();
            foreach (DictionaryField field in dictionary.fields)
            {
                result.Add(field.ID, response[0][field.columnName]);
            }

            return new ResponseObjectPackage<Dictionary<int, object>>() { resultData = result };
        }
    }
}
