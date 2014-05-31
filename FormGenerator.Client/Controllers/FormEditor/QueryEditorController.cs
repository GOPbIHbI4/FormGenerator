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
    public class QueryEditorController : FormGeneratorController
    {
        #region Привязка к данным

        /// <summary>
        /// Получить список полей словаря
        /// </summary>
        /// <param name="dictionaryID">ID словаря</param>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список полей словаря</returns>
        [JsonRequestBehavior]
        public JsonResult GetDictionaryFields(int dictionaryID)
        {
            try
            {
                ResponseObjectPackage<List<DictionaryField>> response = new DictionaryFieldsLogic().GetDictionaryFieldsViewModel(dictionaryID).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        [JsonRequestBehavior]
        public JsonResult GetAllDictionaries()
        {
            try
            {
                ResponseObjectPackage<List<DictionaryModel>> response = new DictionariesLogic().GetAllDictionaries().GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        #endregion

        #region Выборки

        /// <summary>
        /// Получить список типов запросов
        /// </summary>
        /// <returns></returns>
        public JsonResult GetQueryTypeList()
        {
            try
            {
                RequestPackage req = new RequestPackage();
                ResponseObjectPackage<List<QueryTypeModel>> response = new QueryEditorLogic().GetQueryTypeList(req).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Получить тип запроса
        /// </summary>
        /// <returns></returns>
        public JsonResult GetQueryType(int ID)
        {
            try
            {
                RequestPackage req = new RequestPackage() { requestID = ID };
                ResponseObjectPackage<QueryTypeModel> response = new QueryEditorLogic().GetQueryType(req).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Получить тип запроса с параметрами
        /// </summary>
        /// <returns></returns>
        public JsonResult GetFullQueryType(int ID)
        {
            try
            {
                RequestPackage req = new RequestPackage() { requestID = ID };
                ResponseObjectPackage<FullQueryType> response = new QueryEditorLogic().GetFullQueryType(req).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Получить список входных параметров типов запросов
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public JsonResult GetQueryInParamsList(int ID)
        {
            try
            {
                RequestPackage req = new RequestPackage() { requestID = ID };
                ResponseObjectPackage<List<QueryInParameterModel>> response = new QueryEditorLogic().GetQueryInParamsList(req).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Получить список выходных параметров типов запросов
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        public JsonResult GetQueryOutParamsList(int ID)
        {
            try
            {
                RequestPackage req = new RequestPackage() { requestID = ID };
                ResponseObjectPackage<List<QueryOutParameterModel>> response = new QueryEditorLogic().GetQueryOutParamsList(req).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        #endregion

        #region Сохранение

        /// <summary>
        /// Функция сохранения типа запроса
        /// </summary>
        /// <returns></returns>
        [JsonRequestBehavior]
        public JsonResult SaveQueryType(QueryTypeModel queryType, List<QueryInParameterModel> queryInParameters, List<QueryOutParameterModel> queryOutParameters)
        {
            try
            {
                RequestObjectPackage<QueryTypeModel> reqType = new RequestObjectPackage<QueryTypeModel>() { requestData = queryType };
                ResponsePackage responseType = new QueryEditorLogic().SaveQueryType(reqType).GetSelfOrExceptionIfError();
                int typeID = responseType.GetIdOrExceptionIfError();
                if (queryInParameters != null && queryInParameters.Count > 0)
                {
                    foreach (QueryInParameterModel param in queryInParameters)
                    {
                        param.queryTypeID = typeID;
                        RequestObjectPackage<QueryInParameterModel> reqIn = new RequestObjectPackage<QueryInParameterModel>() { requestData = param };
                        ResponsePackage responseIn = new QueryEditorLogic().SaveQueryInParameter(reqIn).GetSelfOrExceptionIfError();
                    }
                }
                if (queryOutParameters != null && queryOutParameters.Count > 0)
                {
                    foreach (QueryOutParameterModel param in queryOutParameters)
                    {
                        param.queryTypeID = typeID;
                        RequestObjectPackage<QueryOutParameterModel> reqOut = new RequestObjectPackage<QueryOutParameterModel>() { requestData = param };
                        ResponsePackage responseOut = new QueryEditorLogic().SaveQueryOutParameter(reqOut).GetSelfOrExceptionIfError();
                    }
                }
                return Json(responseType);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        #endregion
    }
}
