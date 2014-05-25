using FormGenerator.Server;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormGenerator.Client.Controllers
{
    public class FormEditorController : FormGeneratorController
    {
        /// <summary>
        /// Функция получения JSON представление формы по ее id
        /// </summary>
        /// <param name="id">id формы</param>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData JSON представление формы</returns>
        [JsonRequestBehavior]
        public JsonResult GetFormByID(int id)
        {
            try
            {
                RequestPackage request = new RequestPackage()
                {
                    requestID = id
                };
                ResponseObjectPackage<object> response = new FormEditorBuisnessLogic().GetFormByID(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Функция получения списка созданных форм
        /// </summary>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список форм</returns>
        [JsonRequestBehavior]
        public JsonResult GetFormsList()
        {
            try
            {
                ResponseObjectPackage<List<object>> obj = new ResponseObjectPackage<List<object>>()
                {
                    resultData = new List<object>() {
                        new {
                            id = 1,
                            form = "Первая форма",
                            dictionary_id = 1,
                            dictionary = "Словарь первой формы"
                        },
                        new {
                            id = 2,
                            form = "Вторая форма",
                            dictionary_id = 2,
                            dictionary = "Словарь второй формы"
                        },
                        new {
                            id = 3,
                            form = "Третья форма",
                            dictionary_id = "",
                            dictionary = ""
                        }
                    }
                };
                return Json(obj);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
    }
}
