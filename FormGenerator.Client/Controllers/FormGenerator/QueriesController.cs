using FormGenerator.Models;
using FormGenerator.ServerBusinessLogic;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormGenerator.Client
{
    public class QueriesController : FormGeneratorController
    {
        [JsonRequestBehavior]
        public JsonResult ExecuteQuery(int queryID, List<QueryInParameter> parameters)
        {
            try
            {
                ResponseObjectPackage<List<List<QueryOutParameter>>> result = new QueriesLogic().ExecuteQuery(queryID, parameters);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
