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
    public class ControlController : FormGeneratorController
    {
        /// <summary>
        /// Функция получения списка контролов формы по ее ID
        /// </summary>
        /// <param name="id">ID формы</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе в формате JSON, содержащая в поле resultData список контролов формы</returns>
        [JsonRequestBehavior]
        public JsonResult GetFormsList(int id)
        {
            try
            {
                RequestPackage request = new RequestPackage() { requestID = id };
                List<FormListEntity> response = new FormsLogic().GetFormList(request).GetDataOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
