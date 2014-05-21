using FormGenerator.Server.Test;
using FormGenerator.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
