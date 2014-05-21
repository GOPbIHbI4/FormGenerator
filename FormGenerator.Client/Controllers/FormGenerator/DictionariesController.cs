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
    public class DictionariesController : FormGeneratorController
    {
        [JsonRequestBehavior]
        public JsonResult GetAllDictionaries()
        {
            try
            {
                ResponseObjectPackage<List<DictionaryModel>> result = new DictionariesLogic().GetAllDictionaries();
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [JsonRequestBehavior]
        public JsonResult GetDictionaryFieldsByDictionaryID(int dictionaryID)
        {
            try
            {
                ResponseObjectPackage<List<DictionaryFieldModel>> result = new DictionariesLogic().GetDictionaryFieldsByDictionaryID(dictionaryID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }



    }
}
