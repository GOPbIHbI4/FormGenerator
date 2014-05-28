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
    public class FormsController : FormGeneratorController
    {
        [JsonRequestBehavior]
        public JsonResult BuildForm(int formID)
        {
            try
            {
                ResponseObjectPackage<Form> result = new ControlPropertiesLogic().BuildForm(formID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
