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
    public class QueriesLogic
    {
        public ResponseObjectPackage<QueryModel> GetQueryByID(int queryID)
        {
            RequestObjectPackage<QuerySearchTemplate> request = new RequestObjectPackage<QuerySearchTemplate>()
            {
                requestData = new QuerySearchTemplate()
                {
                    ID = queryID
                }
            };
            ResponseObjectPackage<List<QueryModel>> response = new DBUtils().RunSqlAction(QueriesRepository.GetBySearchTemplate, request);
            QueryModel model = response.GetDataOrExceptionIfError().First();
            return new ResponseObjectPackage<QueryModel>() { resultData = model };
        }

        public ResponseObjectPackage<List<List<QueryOutParameter>>> ExecuteQuery(int queryID, Dictionary<int, object> dictionary)
        {
            Query query = this.GetQueryViewModel(queryID).GetDataOrExceptionIfError();
            string sql = query.sqlText;
            foreach (QueryInParameter inParam in query.inParameters)
            {
                object value = dictionary[inParam.ID];
                if (value == null)
                {
                    throw new Exception("Для запроса заданы не все параметры! Проверьте мета-описания формы!");
                }
                inParam.value = ValueTypesConverter.Initialize(value.ToString(), inParam.domainValueTypeID, true);
                sql = sql.Replace("{" + inParam.name + "}", inParam.value.ToSQL());
            }
            RequestPackage request = new RequestPackage() { requestString = sql };
            List<Dictionary<string, object>> result = new DBUtils().RunSqlAction(new DynamicCRUD().GetDictionaryData, request).GetDataOrExceptionIfError();

            List<List<QueryOutParameter>> resultOut = new List<List<QueryOutParameter>>();
            foreach (Dictionary<string, object> row in result)
            {
                List<QueryOutParameter> rowOut = new List<QueryOutParameter>();
                foreach (QueryOutParameter param in query.outParameters)
                {
                    param.name = param.name.ToUpper();
                    if (!row.ContainsKey(param.name))
                    {
                        throw new Exception("Для запроса заданы не все параметры! Проверьте мета-описания формы!");
                    }
                    string value = row[param.name] == null ? null : row[param.name].ToString();
                    rowOut.Add(new QueryOutParameter(param, ValueTypesConverter.Initialize(value, param.domainValueTypeID, true)));
                }
                resultOut.Add(rowOut);
            }
            return new ResponseObjectPackage<List<List<QueryOutParameter>>>() { resultData = resultOut };
        }

        public ResponseObjectPackage<List<ComboboxModel>> ExecuteComboboxQuery(int queryID, Dictionary<int, object> dictionary, int queryMappingKeyID, int queryMappingValueID)
        {
            List<List<QueryOutParameter>> preResult = this.ExecuteQuery(queryID, dictionary).GetDataOrExceptionIfError();
            List<ComboboxModel> list = new List<ComboboxModel>();
            foreach (List<QueryOutParameter> row in preResult)
            {
                int? key = (int?)row.Where(e => e.ID == queryMappingKeyID).Select(e => ValueTypesConverter.Convert(e.value, 3).value).FirstOrDefault();
                string value = (string)row.Where(e => e.ID == queryMappingValueID).Select(e => ValueTypesConverter.Convert(e.value, 1).value).FirstOrDefault();
                if (key == null) 
                {
                    throw new Exception("Некорректно задан запрос, ключ не имеет значения! QueryID = " + queryID);
                }
                ComboboxModel model = new ComboboxModel() { key = key.Value, value = value };
                list.Add(model);
            }
            return new ResponseObjectPackage<List<ComboboxModel>>() { resultData = list };
        }

        public ResponseObjectPackage<List<Dictionary<string, object>>> ExecuteGridpanelQuery(int queryID, Dictionary<int, object> dictionary)
        {
            List<List<QueryOutParameter>> preResult = this.ExecuteQuery(queryID, dictionary).GetDataOrExceptionIfError();
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            foreach (List<QueryOutParameter> row in preResult)
            {
                list.Add(row.ToDictionary(e => e.ID.ToString(), e => e.value.value));
            }
            return new ResponseObjectPackage<List<Dictionary<string, object>>>() { resultData = list };
        }

        public ResponseObjectPackage<Query> GetQueryViewModel(int queryID)
        {
            QueryModel query = this.GetQueryByID(queryID).GetDataOrExceptionIfError();
            QueryTypeModel queryType = new QueryTypesLogic().GetQueryTypeByID(query.queryTypeID).GetDataOrExceptionIfError();
            List<QueryInParameter> inParameters = new QueryInParametersLogic().GetQueryInParametersByQueryTypeID(query.queryTypeID)
                .GetDataOrExceptionIfError().Select(e => new QueryInParameter(e, null)).ToList();
            List<QueryOutParameter> outParameters = new QueryOutParametersLogic().GetQueryOutParametersByQueryTypeID(query.queryTypeID)
                .GetDataOrExceptionIfError().Select(e => new QueryOutParameter(e, null)).ToList();
            Query result = new Query(query, queryType, inParameters, outParameters);
            return new ResponseObjectPackage<Query>() { resultData = result };
        }
    }
}
