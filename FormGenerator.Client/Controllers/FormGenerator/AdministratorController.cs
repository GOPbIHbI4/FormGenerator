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
    public class AdministratorController : FormGeneratorController
    {
        [JsonRequestBehavior]
        public JsonResult GetDictionaryTypesAdministratorData(int dictionaryID)
        {
            try
            {
                ResponseObjectPackage<List<DictionaryFieldAdminModel>> result = new DictionaryTypeAdministratorLogic().GetDictionaryTypesAdministratorData(dictionaryID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
        [JsonRequestBehavior]
        public JsonResult GetDomainValueTypes()
        {
            try
            {
                ResponseObjectPackage<List<DomainValueTypeModel>> result = new DictionaryTypeAdministratorLogic().GetDomainValueTypes();
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
        [JsonRequestBehavior]
        public JsonResult GetDictionaryFieldByID(int dictionaryFieldID)
        {
            try
            {
                ResponseObjectPackage<DictionaryFieldModel> result = new DictionaryTypeAdministratorLogic().GetDictionaryFieldByID(dictionaryFieldID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [HttpPost]
        public JsonResult SaveDictionaryGroup(DictionaryGruopModel group)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().SaveDictionaryGroup(group);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
        [HttpPost]
        public JsonResult DeleteDictionaryGroup(int dictionaryGroupID)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().DeleteDictionaryGroup(dictionaryGroupID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [HttpPost]
        public JsonResult SaveDictionary(DictionaryModel dictionary)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().SaveDictionary(dictionary);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
        [HttpPost]
        public JsonResult DeleteDictionary(int dictionaryID)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().DeleteDictionary(dictionaryID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [HttpPost]
        public JsonResult SaveDictionaryField(DictionaryFieldModel field)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().SaveDictionaryField(field);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
        [HttpPost]
        public JsonResult DeleteDictionaryField(int dictionaryFieldID)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().DeleteDictionaryField(dictionaryFieldID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [HttpPost]
        public JsonResult SaveForeignKey(int dictionaryID, int dictionaryFieldIDSource)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().SaveForeignKey(dictionaryID, dictionaryFieldIDSource);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
        [HttpPost]
        public JsonResult DeleteForeignKey(int foreignKeyID)
        {
            try
            {
                ResponsePackage result = new DictionaryTypeAdministratorLogic().DeleteForeignKey(foreignKeyID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

    }
}
