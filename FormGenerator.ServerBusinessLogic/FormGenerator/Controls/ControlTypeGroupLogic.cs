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
    public class ControlTypeGroupLogic
    {
        /// <summary>
        /// Функция получения группы типов контролов формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID группы типов контрола</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData группу типов контролов формы</returns>
        public ResponseObjectPackage<ControlTypeGroup> GetControlTypeGroupByID(RequestPackage request)
        {
            ResponseObjectPackage<ControlTypeGroup> response = new DBUtils().RunSqlAction(new ControlTypeGroupRepository().GetControlTypeGroupByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция сохранения группы типов контролов
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage, содержащая в поле requestData нруппу типов контролов</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage SaveControlTypeGroup(RequestObjectPackage<ControlTypeGroupModel> package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlTypeGroupRepository().SaveControlTypeGroup, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция удаления группы типов контролов
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID группы типов контролов</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlTypeGroupByID(RequestPackage request)
        {
            ResponsePackage response = new DBUtils().RunSqlAction(new ControlTypeGroupRepository().DeleteControlTypeGroupByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

    }
}
