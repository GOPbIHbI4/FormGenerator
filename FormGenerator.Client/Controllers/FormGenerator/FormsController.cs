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
                ResponseObjectPackage<Form> result = new FormActionLogic().BuildForm(formID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [JsonRequestBehavior]
        public JsonResult GetDictionaryObjectByID(int dictionaryID, int pkValue)
        {
            try
            {
                ResponseObjectPackage<Dictionary<int, object>> result = new FormActionLogic().GetDictionaryObjectByID(dictionaryID, pkValue);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
