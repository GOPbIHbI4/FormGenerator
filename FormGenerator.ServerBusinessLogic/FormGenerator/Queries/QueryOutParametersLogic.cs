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
    public class QueryOutParametersLogic
    {
        public ResponseObjectPackage<List<QueryOutParameterModel>> GetQueryOutParametersByQueryTypeID(int queryTypeID)
        {
            RequestObjectPackage<QueryOutParameterSearchTemplate> request = new RequestObjectPackage<QueryOutParameterSearchTemplate>()
            {
                requestData = new QueryOutParameterSearchTemplate()
                {
                    queryTypeID = queryTypeID
                }
            };
            ResponseObjectPackage<List<QueryOutParameterModel>> response = new DBUtils().RunSqlAction(QueryOutParametersRepository.GetBySearchTemplate, request);
            return response;
        }

    }
}
