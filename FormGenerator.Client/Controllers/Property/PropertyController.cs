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
    public class PropertyController : FormGeneratorController
    {
        /// <summary>
        /// Функция получения списка свойств компонентов формы по ее ID
        /// </summary>
        /// <param name="id">ID формы</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе в формате JSON, содержащая в поле resultData список свойств компонентов формы</returns>
        [JsonRequestBehavior]
        public JsonResult GetPropertiesByFormID(int id)
        {
            try
            {
                RequestPackage request = new RequestPackage() { requestID = id };
                List<ControlPropertyViewModel> response = new PropertyLogic().GetPropertiesByFormID(request).GetDataOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Функция получения списка свойств компонента по его ID
        /// </summary>
        /// <param name="id">ID компонента</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе в формате JSON, содержащая в поле resultData список свойств компонента</returns>
        [JsonRequestBehavior]
        public JsonResult GetPropertiesByControlID(int id)
        {
            try
            {
                RequestPackage request = new RequestPackage() { requestID = id };
                List<ControlPropertyViewModel> response = new PropertyLogic().GetPropertiesByControlID(request).GetDataOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
