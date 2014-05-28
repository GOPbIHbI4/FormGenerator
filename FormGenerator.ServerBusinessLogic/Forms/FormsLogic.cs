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
        /// <returns>Объект-оболочка RequestPackage ResponseObjectPackagе, содержащая в поле resultData список объектов типа FormListEntity</returns>
        public ResponseObjectPackage<List<FormListEntity>> GetFormList(RequestPackage request)
        {
            ResponseObjectPackage<List<FormListEntity>> response = new DBUtils().RunSqlAction(new FormsRepository().GetFormsList, request);
            return response;
        }

        /// <summary>
        /// Функция получения формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id формы</param>
        /// <returns>Объект-оболочка RequestPackage ResponseObjectPackagе, содержащая в поле resultData объект формы типа FormListEntity</returns>
        public ResponseObjectPackage<FormListEntity> GetFormByID(RequestPackage request)
        {
            ResponseObjectPackage<FormListEntity> response = new DBUtils().RunSqlAction(new FormsRepository().GetFormByID, request);
            return response;
        }
    }
}
