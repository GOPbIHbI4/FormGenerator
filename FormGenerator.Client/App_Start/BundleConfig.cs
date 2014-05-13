using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace FormGenerator.Client.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/extjs").Include("~/Scripts/extjs/ext-all.js"));
            bundles.Add(new ScriptBundle("~/bundles/viewport").Include("~/Scripts/app/app.js", "~/Scripts/app/utils/*.js"));
            bundles.Add(new StyleBundle("~/content/extjs").Include("~/Scripts/extjs/resources/css/ext-all.css"));
        }
    }
}