using FormGenerator.Server.Test;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormGenerator.Client.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Index()
        {
            return View();
        }

        [JsonRequestBehavior]
        public ActionResult Test()
        {
            RequestPackage package = new RequestPackage();
            ResponsePackage result = new BLL_DataTest().DoSome(package);
            return Json(result);
        }

    }
}
