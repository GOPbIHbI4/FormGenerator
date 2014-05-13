using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;

namespace FormGenerator.Client
{
    /// <summary> Аттрибут, навешивающий AllowGet на результат действия
    /// </summary>
    public class JsonRequestBehaviorAttribute : System.Web.Mvc.ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            var result = filterContext.Result as JsonResult;
            if (result != null)
            {
                result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            }
        }
    }
}