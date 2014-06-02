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
    public class EventEditorController : FormGeneratorController
    {

        /// <summary>
        /// Получить список типов обработчика
        /// </summary>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список типов обработчика</returns>
        [JsonRequestBehavior]
        public JsonResult GetHandlerTypeList()
        {
            try
            {
                RequestObjectPackage<ActionTypeSearchTemplate> request = new RequestObjectPackage<ActionTypeSearchTemplate>() { requestData = new ActionTypeSearchTemplate() };
                ResponseObjectPackage<List<ActionTypeModel>> response = new EventEditorLogic().GetHandlerTypeList(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        public JsonResult GetParamTypeList(int ID)
        {
            try
            {
                RequestObjectPackage<ActionParameterTypeSearchTemplate> request = new RequestObjectPackage<ActionParameterTypeSearchTemplate>()
                {
                    requestData = new ActionParameterTypeSearchTemplate()
                    {
                        actionTypeID = ID
                    }
                };
                ResponseObjectPackage<List<ActionParameterTypeModel>> response = new EventEditorLogic().GetParamTypeList(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

    }
}
