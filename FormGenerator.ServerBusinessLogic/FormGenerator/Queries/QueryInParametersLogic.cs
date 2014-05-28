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
    public class QueryInParametersLogic
    {
        public ResponseObjectPackage<List<QueryInParameterModel>> GetQueryInParametersByQueryTypeID(int queryTypeID)
        {
            RequestObjectPackage<QueryInParameterSearchTemplate> request = new RequestObjectPackage<QueryInParameterSearchTemplate>()
            {
                requestData = new QueryInParameterSearchTemplate()
                {
                    queryTypeID = queryTypeID
                }
            };
            ResponseObjectPackage<List<QueryInParameterModel>> response = new DBUtils().RunSqlAction(QueryInParametersRepository.GetBySearchTemplate, request);
            return response;
        }

        public ResponseObjectPackage<List<QueryQueryInParameterModel>> GetQueryQueryInParametersByQueryID(int queryID)
        {
            RequestObjectPackage<QueryQueryInParameterSearchTemplate> request = new RequestObjectPackage<QueryQueryInParameterSearchTemplate>()
            {
                requestData = new QueryQueryInParameterSearchTemplate()
                {
                    queryID = queryID
                }
            };
            ResponseObjectPackage<List<QueryQueryInParameterModel>> response = new DBUtils().RunSqlAction(QueryQueryInParametersRepository.GetBySearchTemplate, request);
            return response;
        }
    }
}
