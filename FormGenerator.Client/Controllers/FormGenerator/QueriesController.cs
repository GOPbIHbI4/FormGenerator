using FormGenerator.Models;
using FormGenerator.ServerBusinessLogic;
using FormGenerator.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FormGenerator.Client
{
    public class QueriesController : FormGeneratorController
    {
        /// <summary> Выполняем запрос с заданными параметрами
        /// </summary>
        /// <param name="queryID"></param>
        /// <param name="parameters">словарь ключ входного параметра - его значение</param>
        /// <returns></returns>
        [JsonRequestBehavior]
        public JsonResult ExecuteQuery(int queryID, string parameters)
        {
            try
            {
                Dictionary<int, object> dictionary = string.IsNullOrEmpty(parameters) ? new Dictionary<int, object>()
                    : JsonConvert.DeserializeObject<Dictionary<int, object>>(parameters);
                ResponseObjectPackage<List<List<QueryOutParameter>>> result = new QueriesLogic().ExecuteQuery(queryID, dictionary);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }     
        
        [JsonRequestBehavior]
        public JsonResult ExecuteComboboxQuery(int queryID, string parameters, int queryOutParameterKeyID, int queryOutParameterValueID)
        {
            try
            {
                Dictionary<int, object> dictionary = string.IsNullOrEmpty(parameters) ? new Dictionary<int, object>() 
                    : JsonConvert.DeserializeObject<Dictionary<int, object>>(parameters);
                ResponseObjectPackage<List<ComboboxModel>> result = new QueriesLogic().ExecuteComboboxQuery(queryID, dictionary, queryOutParameterKeyID, queryOutParameterValueID);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [JsonRequestBehavior]
        public JsonResult ExecuteGridpanelQuery(int queryID, string parameters)
        {
            try
            {
                Dictionary<int, object> dictionary = string.IsNullOrEmpty(parameters) ? new Dictionary<int, object>()
                    : JsonConvert.DeserializeObject<Dictionary<int, object>>(parameters);
                ResponseObjectPackage<List<Dictionary<string, object>>> result = new QueriesLogic().ExecuteGridpanelQuery(queryID, dictionary);
                return Json(result);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }     
    }
}
