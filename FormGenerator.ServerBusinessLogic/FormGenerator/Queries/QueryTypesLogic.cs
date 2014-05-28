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
    public class QueryTypesLogic
    {
        public ResponseObjectPackage<QueryTypeModel> GetQueryTypeByID(int queryTypeID)
        {
            RequestObjectPackage<QueryTypeSearchTemplate> request = new RequestObjectPackage<QueryTypeSearchTemplate>()
            {
                requestData = new QueryTypeSearchTemplate()
                {
                    ID = queryTypeID
                }
            };
            ResponseObjectPackage<List<QueryTypeModel>> response = new DBUtils().RunSqlAction(QueryTypesRepository.GetBySearchTemplate, request);
            QueryTypeModel model = response.GetDataOrExceptionIfError().First();
            return new ResponseObjectPackage<QueryTypeModel>() { resultData = model };
        }

    }
}
