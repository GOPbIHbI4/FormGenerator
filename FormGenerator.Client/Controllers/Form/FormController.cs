using FormGenerator.Models;
using FormGenerator.Server;
using FormGenerator.ServerBusinessLogic;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormGenerator.Client.Controllers
{
    public class FormController : FormGeneratorController
    {
        /// <summary>
        /// Функция получения списка форм, зарегистрированных в системе
        /// </summary>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список форм</returns>
        [JsonRequestBehavior]
        public JsonResult GetFormsList()
        {
            try
            {
                RequestPackage request = new RequestPackage();
                List<FormListEntity> response = new FormsLogic().GetFormList(request).GetDataOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Функция получения формы по ее ID
        /// </summary>
        /// <param name="id">ID формы</param>
        /// <returns>Объект-оболочка RequestPackage ResponseObjectPackagе, содержащая в поле resultData объект формы типа FormListEntity</returns>
        [JsonRequestBehavior]
        public JsonResult GetFormByID(int id)
        {
            try
            {
                RequestPackage request = new RequestPackage() { requestID = id };
                FormListEntity response = new FormsLogic().GetFormByID(request).GetDataOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
