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

        public ResponseObjectPackage<List<List<QueryOutParameter>>> ExecuteQuery(int queryID, List<QueryInParameter> parameters)
        {
            Query query = this.GetQueryViewModel(queryID).GetDataOrExceptionIfError();
            string sql = query.sqlText;
            foreach (QueryInParameter inParam in query.inParameters)
            {
                QueryInParameter withValue = parameters.Find(e => e.ID == inParam.ID);
                if (withValue == null || withValue.value == null)
                {
                    throw new Exception("Для запроса заданы не все параметры! Проверьте мета-описания формы!");
                }
                inParam.value = ValueTypesConverter.Convert(withValue.value, inParam.domainValueTypeID);
                sql = sql.Replace("{" + inParam.name + "}", inParam.value.ToSQL());
            }
            RequestPackage request = new RequestPackage() {requestString = sql };
            List<Dictionary<string, object>> result = new DBUtils().RunSqlAction(new DynamicCRUD().GetDictionaryData, request).GetDataOrExceptionIfError();

            List<List<QueryOutParameter>> resultOut = new List<List<QueryOutParameter>>();
            foreach (Dictionary<string, object> row in result)
            {
                List<QueryOutParameter> rowOut = new List<QueryOutParameter>();
                foreach (QueryOutParameter param in query.outParameters)
                {
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
