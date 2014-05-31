using FormGenerator.Models;
using FormGenerator.ServerDataAccess;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerBusinessLogic
{
    public class FormsLogic
    {
        /// <summary>
        /// Функция получения списка форм, зарегистрированных в системе
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список объектов типа FormListEntity</returns>
        public ResponseObjectPackage<List<FormListEntity>> GetFormList(RequestPackage request)
        {
            ResponseObjectPackage<List<FormListEntity>> response = new DBUtils().RunSqlAction(new FormsRepository().GetFormsList, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция получения формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id формы</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData объект формы типа FormListEntity</returns>
        public ResponseObjectPackage<FormListEntity> GetFormByID(RequestPackage request)
        {
            ResponseObjectPackage<FormListEntity> response = new DBUtils().RunSqlAction(new FormsRepository().GetFormByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция сохранения формы
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestData форму</param>
        /// <returns>Объект-оболочка ResponsePackage</returns>
        public ResponsePackage SaveForm(RequestObjectPackage<FormModel> request)
        {
            ResponsePackage response = new DBUtils().RunSqlAction(new FormsRepository().SaveForm, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция удаления формы
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage c ID формы в requestID</param>
        /// <returns>Объект-оболочка ResponsePackage</returns>
        public ResponsePackage DeleteFormByID(RequestPackage request)
        {
            ResponsePackage response = new DBUtils().RunSqlAction(new FormsRepository().DeleteFormByID, request);
            response.ThrowExceptionIfError();
            return response;
        }
    }
}
