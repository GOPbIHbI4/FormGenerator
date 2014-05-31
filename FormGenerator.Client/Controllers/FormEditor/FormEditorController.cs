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
    public class FormEditorController : FormGeneratorController
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

        /// <summary>
        /// Получить список полей выборки
        /// </summary>
        /// <param name="queryID">ID выборки</param>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список полей выборки</returns>
        [JsonRequestBehavior]
        public JsonResult GetQueryFields(int queryID)
        {
            try
            {
                RequestPackage request = new RequestPackage()
                {
                    requestID = queryID
                };
                ResponseObjectPackage<OpenFormModel> response = new FormEditorLogic().GetFormByID(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Получить список выборок
        /// </summary>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список выборок</returns>
        [JsonRequestBehavior]
        public JsonResult GetQueryList()
        {
            try
            {
                RequestPackage request = new RequestPackage();
                ResponseObjectPackage<OpenFormModel> response = new FormEditorLogic().GetFormByID(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        #endregion

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
                ResponseObjectPackage<OpenFormModel> response = new FormEditorLogic().GetFormByID(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        #region Сохранение

        /// <summary>
        /// Функция сохранения компонентов формы и их свойств.
        /// </summary>
        /// <param name="form"></param>
        /// <returns>Объект-оболочку ResponsePackage в формате JSON, хранящего в поле resultData объект типа SaveControlModel, 
        /// содержащий в себе исходный объект формы, но с информацией об ID вставленных компонентов</returns>
        [JsonRequestBehavior]
        public JsonResult SaveAllForm(SaveControlModel form, int formID)
        {
            try
            {
                RequestObjectPackage<SaveControlModel> request = new RequestObjectPackage<SaveControlModel>()
                {
                    requestData = form,
                    requestID = formID
                };
                // удалить старые контролы
                ResponsePackage responseDelete = new FormEditorLogic().DeleteOldControls(request).GetSelfOrExceptionIfError();
                // сохранить запросы
                RequestObjectPackage<List<QueryViewModel>> req = new RequestObjectPackage<List<QueryViewModel>>() { requestData = form.queries };
                ResponsePackage responseQuery = new FormEditorLogic().SaveQueries(req).GetSelfOrExceptionIfError();
                // сохранить всю форму
                ResponsePackage response = new FormEditorLogic().SaveAllForm(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Функция сохранения формы для редактора форм
        /// </summary>
        /// <param name="form">Объект типа FormModel для вставки/изменения в БД</param>
        /// <returns>Объект-оболочку ResponsePackage в формате JSON, хранящего в поле resultID ID измененной или вставленной записи</returns>
        [JsonRequestBehavior]
        public JsonResult SaveForm(FormModel form)
        {
            try
            {
                RequestObjectPackage<FormModel> request = new RequestObjectPackage<FormModel>()
                {
                    requestData = form
                };
                ResponsePackage response = new FormEditorLogic().SaveForm(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Функция сохранения контрола формы для редактора форм.
        /// </summary>
        /// <param name="control">Объект типа ControlModel для вставки/изменения в БД</param>
        /// <returns>Объект-оболочку ResponsePackage в формате JSON, хранящего в поле resultID ID измененной или вставленной записи</returns>
        [JsonRequestBehavior]
        public JsonResult SaveControl(ControlModel control)
        {
            try
            {
                RequestObjectPackage<ControlModel> request = new RequestObjectPackage<ControlModel>()
                {
                    requestData = control
                };
                ResponsePackage response = new ControlsLogic().SaveControl(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        /// <summary>
        /// Функция сохранения свойства контрола формы для редактора форм. 
        /// </summary>
        /// <param name="property">Объект типа ControlPropertyModel для вставки/изменения в БД</param>
        /// <returns>Объект-оболочку ResponsePackage в формате JSON, хранящего в поле resultID ID измененной или вставленной записи</returns>
        [JsonRequestBehavior]
        public JsonResult SaveProperty(ControlPropertyViewModel property)
        {
            try
            {
                RequestObjectPackage<ControlPropertyViewModel> request = new RequestObjectPackage<ControlPropertyViewModel>()
                {
                    requestData = property
                };
                ResponsePackage response = new FormEditorLogic().SaveProperty(request).GetSelfOrExceptionIfError();
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
        /// Получить список групп типов контролов
        /// </summary>
        /// <param name="control"></param>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список групп типов контролов</returns>
        [JsonRequestBehavior]
        public JsonResult GetControlTypeGroupList()
        {
            try
            {
                RequestPackage request = new RequestPackage();
                ResponseObjectPackage<List<ControlTypeGroup>> response = new FormEditorLogic().GetControlTypeGroupList(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }
        
        /// <summary>
        /// Функция получения списка типов контролов
        /// </summary>
        /// <returns>Объект-оболочку ResponseObjectPackage в формате JSON, хранящего в поле resultData список типов контролов</returns>
        [JsonRequestBehavior]
        public JsonResult GetControlTypeList()
        {
            try
            {
                RequestPackage request = new RequestPackage();
                ResponseObjectPackage<List<ControlTypeListEntity>> response = new FormEditorLogic().GetControlTypeList(request).GetSelfOrExceptionIfError();
                return Json(response);
            }
            catch (Exception ex)
            {
                return this.HandleException(ex);
            }
        }

        #endregion

    }
}
