﻿using FormGenerator.Models;
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
        public JsonResult GetDictionariesTree()
        {
            try
            {
                ResponseObjectPackage<List<DictionaryTreeItem>> result = new DictionaryGroupsLogic().GetDictionariesTree();
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [JsonRequestBehavior]
        public JsonResult GetDictionaryFieldsViewModel(int dictionaryID)
        {
            try
            {
                ResponseObjectPackage<List<DictionaryField>> result = new DictionariesLogic().GetDictionaryFieldsViewModel(dictionaryID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [JsonRequestBehavior]
        public JsonResult GetDictionaryData(int dictionaryID)
        {
            try
            {
                ResponseObjectPackage<List<Dictionary<string, object>>> result = new DictionariesDataLogic().GetDictionaryData(dictionaryID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [HttpPost]
        public JsonResult SaveDictionaryData(Dictionary<string, object> row, int dictionaryID)
        {
            try
            {


                ResponsePackage result = new ResponsePackage();
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
