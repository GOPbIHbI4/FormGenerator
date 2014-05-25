using FormGenerator.Server.Test;
using FormGenerator.Utilities;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormGenerator.Client.Controllers
{
    /// <summary> Главная страничка (и по сути, едмнственная)
    /// </summary>
    public class HomeController : FormGeneratorController
    {
        /// <summary> точка входа в приложение
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        [JsonRequestBehavior]
        public JsonResult Test()
        {
            try
            {
                RequestPackage package = new RequestPackage();
                ResponsePackage result = new BLL_DataTest().DoSome(package);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [JsonRequestBehavior]
        public JsonResult TestGet()
        {
            try
            {
                ResponseObjectPackage<List<object>> response = new ResponseObjectPackage<List<object>>()
                {
                    resultData = new List<object>() 
                    {
                        new {prop1 = DateTime.Now, prop2 = 1},
                        new {prop1 = DateTime.Now.AddMonths(1), prop2 = 2}
                    }
                };
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [HttpPost]
        public JsonResult TestPost(RequestPackage model)
        {
            try
            {
                object obj = JsonConvert.DeserializeObject(model.ToString());

                RequestPackage package = new RequestPackage();
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
