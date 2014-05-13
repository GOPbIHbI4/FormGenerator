using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Mvc;

namespace FormGenerator.Client
{
    public class JsonRequestBehaviorAttribute : System.Web.Mvc.ActionFilterAttribute
    {
        private JsonRequestBehavior _behavior { get; set; }

        public JsonRequestBehaviorAttribute()
        {
            this._behavior = JsonRequestBehavior.AllowGet;
        }

        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            var result = filterContext.Result as JsonResult;
            if (result != null)
            {
                result.JsonRequestBehavior = this._behavior;
            }
        }
    }
}