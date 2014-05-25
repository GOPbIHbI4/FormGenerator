using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace FormGenerator.Client
{
    /// <summary> Переопределенный базовый контроллер для нашей системы
    /// </summary>
    public class FormGeneratorController : Controller
    {
        /// <summary> На всяк случай - обрабатывает необработанные в коде ошибки
        /// </summary>
        /// <param name="filterContext"></param>
        protected override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled)
            {
                return;
            }

            filterContext.Result = this.HandleException(filterContext.Exception);
            filterContext.ExceptionHandled = true;
        }

        /// <summary> Возвращает стандартный ответ при ошибке, логирует ошибки
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="ex"></param>
        /// <returns></returns>
        [JsonRequestBehavior]
        public JsonResult HandleException(Exception ex)
        {
            //Этим можно было бы логировать ошибки

            //RouteData routeData = this.RouteData;
            //string actionName = routeData.Values["action"].ToString();
            //Type controllerType = this.GetType();
            //MethodInfo method = controllerType.GetMethod(actionName);
            //Type returnType = method.ReturnType;

            ResponsePackage response = new ResponsePackage() 
            {
                resultCode = -1,
                resultMessage = ex.Message
            };
            return Json(response);
        }

        protected new JsonResult Json(Object obj)
        {
            JsonNetResult jsonNetResult = new JsonNetResult();
            jsonNetResult.Formatting = Newtonsoft.Json.Formatting.Indented;
            jsonNetResult.Data = obj;
            return jsonNetResult;
        }
    }
}